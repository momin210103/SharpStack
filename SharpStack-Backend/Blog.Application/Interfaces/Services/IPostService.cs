
using Blog.Application.DTOs.BusinessLogic;
using Blog.Application.DTOs.Images;
using Blog.Application.DTOs.Posts;
using Blog.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Blog.Application.Interfaces.Services
{
    public interface IPostService
    {
        Task<Guid> CreatePostAsync(CreatePostRequest request);
        Task UpdateAsync(Guid postId, UpdatePostRequest request);
        Task DeleteAsync(Guid postId);
        Task<IEnumerable<PostResponse>> GetAllPostsAsync();
        Task<IEnumerable<PostResponse>> GetPublicPostAsync(int page =1,int pageSize = 10, Guid? CategoryId = null);
        Task<PostResponse> GetBySlugAsync(string slug);
        Task<SinglePostResponse> GetByIdAsync(Guid postId);
        Task PublishAsync(Guid postId);
        Task <IEnumerable<PostResponse>> GetUnpublishedPostsAsync();

        // Image operations
        Task<UploadImagesResponse> UploadImagesAsync(Guid postId, List<IFormFile> files, string userId);
        Task<PostImagesResponse> GetPostImagesAsync(Guid postId);
        Task DeleteImageAsync(Guid postId, Guid imageId, string userId, bool isAdmin);

        Task<PostStatDto> GetPostStatisticsAsync();
        
        
    }
}