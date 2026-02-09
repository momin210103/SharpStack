using Blog.Application.Interfaces.Services;
using Blog.Domain.Exceptions;
using Microsoft.AspNetCore.Http;

namespace Blog.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png" };
    private readonly string[] _allowedContentTypes = { "image/jpeg", "image/png" };

    public async Task<string> SaveFileAsync(IFormFile file, Guid postId, string uploadPath)
    {
        if (!IsValidImageFile(file))
            throw new BadRequestException("Invalid image file. Only JPG, JPEG, and PNG formats are allowed.");

        var postDirectory = Path.Combine(uploadPath, "posts", postId.ToString());
        
        // Create directory if it doesn't exist
        if (!Directory.Exists(postDirectory))
            Directory.CreateDirectory(postDirectory);

        // Generate unique filename
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(postDirectory, uniqueFileName);

        try
        {
            await using var fileStream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(fileStream);
            
            return filePath;
        }
        catch (Exception ex)
        {
            throw new BadRequestException($"Failed to save file: {ex.Message}");
        }
    }

    public Task DeleteFileAsync(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            return Task.CompletedTask;
        }
        catch (Exception ex)
        {
            throw new BadRequestException($"Failed to delete file: {ex.Message}");
        }
    }

    public string GetFileUrl(string filePath)
    {
        // Convert physical path to URL path
        // Example: /var/www/uploads/posts/guid/file.jpg -> /uploads/posts/guid/file.jpg
        var uploadsIndex = filePath.IndexOf("uploads", StringComparison.OrdinalIgnoreCase);
        if (uploadsIndex >= 0)
        {
            return "/" + filePath.Substring(uploadsIndex).Replace("\\", "/");
        }
        
        return filePath.Replace("\\", "/");
    }

    public bool IsValidImageFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return false;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        return _allowedExtensions.Contains(extension) && 
               _allowedContentTypes.Contains(file.ContentType.ToLowerInvariant());
    }

    public bool IsFileSizeValid(IFormFile file, long maxSizeInBytes)
    {
        return file.Length <= maxSizeInBytes;
    }
}
