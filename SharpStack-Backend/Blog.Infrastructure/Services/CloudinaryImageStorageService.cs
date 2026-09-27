using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blog.Application.DTOs.Images;
using Blog.Application.Interfaces.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ImageUploadResult = Blog.Application.DTOs.Images.ImageUploadResult;

namespace Blog.Infrastructure.Services
{
    public class CloudinaryImageStorageService : IImagesStorageService
    {
        private readonly Cloudinary _cloudinary;
        public CloudinaryImageStorageService(IConfiguration configuration)
        {
            var cloudName = configuration["CloudinarySettings:CloudName"];
            var apiKey = configuration["CloudinarySettings:ApiKey"];
            var apiSecret = configuration["CloudinarySettings:ApiSecret"];
            if (string.IsNullOrWhiteSpace(cloudName) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
            {
                throw new InvalidOperationException(
                 "Cloudinary configuration is missing.");
            }
            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }
        public async Task DeleteAsync(string publicId)
        {
            if (string.IsNullOrWhiteSpace(publicId))
                return;

            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image
            };

            var result = await _cloudinary.DestroyAsync(deleteParams);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    $"Cloudinary delete failed: {result.Error.Message}");
            }
        }

        public async Task<ImageUploadResult> UploadAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid image file.");

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(
                file.FileName,
                stream),

                Folder = folder,

                UseFilename = false,
                UniqueFilename = true,

                Transformation = new Transformation()
                .Quality("auto")
                .FetchFormat("auto")
            };
            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    $"Cloudinary upload failed: {result.Error.Message}");
            }

            return new ImageUploadResult
            {
                Url = result.SecureUrl?.ToString() ?? string.Empty,
                PublicId = result.PublicId
            };


        }
    }
}