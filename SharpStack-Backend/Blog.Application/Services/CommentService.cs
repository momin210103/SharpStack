using Blog.Application.DTOs.Comments;
using Blog.Application.Interfaces.Repositories;
using Blog.Application.Interfaces.Services;
using Blog.Domain.Entities;
using Blog.Domain.Exceptions;

namespace Blog.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IPostRepository _postRepository;

        public CommentService(ICommentRepository commentRepository, IPostRepository postRepository)
        {
            _commentRepository = commentRepository;
            _postRepository = postRepository;
        }

        public async Task<Guid> CreateCommentAsync(Guid postId, CreateCommentRequest request, string userId, string userDisplayName)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);
            
            if (!post.IsPublished)
                throw new BadRequestException("Cannot comment on unpublished posts");

            if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Length > 1000)
                throw new BadRequestException("Comment content must be between 1 and 1000 characters");

            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                Content = request.Content,
                PostId = postId,
                UserId = userId,
                UserDisplayName = userDisplayName
            };

            await _commentRepository.AddAsync(comment);
            return comment.Id;
        }

        public async Task<IEnumerable<CommentResponse>> GetCommentsByPostIdAsync(Guid postId, int page, int pageSize)
        {
            var comments = await _commentRepository.GetByPostIdAsync(postId, page, pageSize);
            
            return comments.Select(c => new CommentResponse
            {
                Id = c.Id,
                Content = c.Content,
                UserDisplayName = c.UserDisplayName,
                UserId = c.UserId,
                PostId = c.PostId,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            });
        }

        public async Task UpdateCommentAsync(Guid commentId, UpdateCommentRequest request, string userId)
        {
            var comment = await _commentRepository.GetByIdAsync(commentId);
            if (comment == null)
                throw new NotFoundException("Comment", commentId);

            if (comment.UserId != userId)
                throw new ForbiddenException("You can only edit your own comments");

            if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Length > 1000)
                throw new BadRequestException("Comment content must be between 1 and 1000 characters");

            comment.Content = request.Content;
            comment.UpdatedAt = DateTime.UtcNow;

            await _commentRepository.UpdateAsync(comment);
        }

        public async Task DeleteCommentAsync(Guid commentId, string userId, bool isAdmin)
        {
            var comment = await _commentRepository.GetByIdAsync(commentId);
            if (comment == null)
                throw new NotFoundException("Comment", commentId);

            if (comment.UserId != userId && !isAdmin)
                throw new ForbiddenException("You can only delete your own comments or you must be an admin");

            await _commentRepository.DeleteAsync(comment);
        }
    }
}
