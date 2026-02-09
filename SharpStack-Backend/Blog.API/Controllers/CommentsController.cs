using System.Security.Claims;
using Blog.Application.DTOs.Comments;
using Blog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/posts/{postId}/comments")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        // GET: api/posts/{postId}/comments?page=1&pageSize=10
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetComments(Guid postId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var comments = await _commentService.GetCommentsByPostIdAsync(postId, page, pageSize);
            return Ok(comments);
        }

        // POST: api/posts/{postId}/comments
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateComment(Guid postId, [FromBody] CreateCommentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userEmail))
                throw new Blog.Domain.Exceptions.UnauthorizedAccessException("User information not found");

            var commentId = await _commentService.CreateCommentAsync(postId, request, userId, userEmail);
            return Ok(new { CommentId = commentId, Message = "Comment created successfully" });
        }

        // PUT: api/posts/{postId}/comments/{commentId}
        [HttpPut("{commentId}")]
        [Authorize]
        public async Task<IActionResult> UpdateComment(Guid postId, Guid commentId, [FromBody] UpdateCommentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
                throw new Blog.Domain.Exceptions.UnauthorizedAccessException("User information not found");

            await _commentService.UpdateCommentAsync(commentId, request, userId);
            return Ok("Comment updated successfully");
        }

        // DELETE: api/posts/{postId}/comments/{commentId}
        [HttpDelete("{commentId}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid postId, Guid commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (string.IsNullOrEmpty(userId))
                throw new Blog.Domain.Exceptions.UnauthorizedAccessException("User information not found");

            await _commentService.DeleteCommentAsync(commentId, userId, isAdmin);
            return Ok("Comment deleted successfully");
        }
    }
}
