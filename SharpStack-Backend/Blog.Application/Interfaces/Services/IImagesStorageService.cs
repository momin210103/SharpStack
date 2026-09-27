using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blog.Application.DTOs.Images;

namespace Blog.Application.Interfaces.Services
{
    public interface IImagesStorageService
    {
        Task<ImageUploadResult> UploadAsync(Microsoft.AspNetCore.Http.IFormFile file, string folder);
        Task DeleteAsync (string publicId);
    }
}