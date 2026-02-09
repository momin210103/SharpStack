using Blog.Application.Interfaces.File;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;


namespace Blog.Infrastructure.FileStorage
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;
        public LocalFileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task<string> SaveFileAsync(IFormFile file)
        {
           if(file == null || file.Length == 0)
            {
                throw new ArgumentException("File is null or empty.");
            }
            //2 size validation (max 2MB)
            const long maxFileSize = 2 * 1024 * 1024; // 2MB
            if(file.Length > maxFileSize)            {
                throw new ArgumentException("File size exceeds the 2MB limit.");
            }
            
            // 3 extension validation
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            if(!allowedExtensions.Contains(extension))
            {
                throw new ArgumentException("Invalid file type. Only .jpg, .jpeg, .png, .gif are allowed.");
            }
            // 4 ensure uploads directory exists
            var uploadFolder = Path.Combine(_env.WebRootPath, "uploads");
            if(!Directory.Exists(uploadFolder))            {
                Directory.CreateDirectory(uploadFolder);
            }
            // 5 generate unique file name
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadFolder, uniqueFileName);
            // 6 save file
            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            // 7 return relative path
            return $"/uploads/posts/{uniqueFileName}";
        }
    }


}