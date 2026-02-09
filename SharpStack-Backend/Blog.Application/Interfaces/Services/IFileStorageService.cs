using Microsoft.AspNetCore.Http;

namespace Blog.Application.Interfaces.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, Guid postId, string uploadPath);
    Task DeleteFileAsync(string filePath);
    string GetFileUrl(string filePath);
    bool IsValidImageFile(IFormFile file);
    bool IsFileSizeValid(IFormFile file, long maxSizeInBytes);
}
