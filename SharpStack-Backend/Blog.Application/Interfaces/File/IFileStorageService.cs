

using Microsoft.AspNetCore.Http;

namespace Blog.Application.Interfaces.File
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file);
    }
}