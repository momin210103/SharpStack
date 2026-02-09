
using System.Linq;
using AutoMapper.Configuration.Annotations;
using Blog.Application.DTOs.BusinessLogic;
using Blog.Application.DTOs.Images;
using Blog.Application.DTOs.Posts;
using Blog.Application.Interfaces.Repositories;
using Blog.Application.Interfaces.Services;
using Blog.Domain.Entities;
using Blog.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Blog.Application.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IConfiguration _configuration;
        
        
        public PostService(
            IPostRepository postRepository, 
            IFileStorageService fileStorageService,
            IConfiguration configuration)
        {
            _postRepository = postRepository;
            _fileStorageService = fileStorageService;
            _configuration = configuration;
            
        }
        public async Task<Guid> CreatePostAsync(CreatePostRequest request)
        {
            var post = new Post
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Content = request.Content,
                Slug = request.Title.ToLower().Replace(" ", "-"),
                CategoryId = request.CategoryId,
                Images = new List<PostImage>()
            };

            // Process images if provided
            if (request.Images != null && request.Images.Any())
            {
                var maxImagesPerPost = _configuration.GetValue<int>("FileUpload:MaxImagesPerPost");
                var maxFileSize = _configuration.GetValue<long>("FileUpload:MaxFileSizeInBytes");
                var uploadPath = _configuration.GetValue<string>("FileUpload:UploadPath") ?? "wwwroot/uploads";

                if (request.Images.Count > maxImagesPerPost)
                    throw new BadRequestException($"Cannot upload {request.Images.Count} images. Maximum {maxImagesPerPost} images per post allowed.");

                int displayOrder = 0;
                foreach (var file in request.Images)
                {
                    if (!_fileStorageService.IsValidImageFile(file))
                        throw new BadRequestException($"Invalid file format: {file.FileName}. Only JPG, JPEG, and PNG are allowed.");

                    if (!_fileStorageService.IsFileSizeValid(file, maxFileSize))
                        throw new BadRequestException($"File {file.FileName} exceeds maximum size of {maxFileSize / (1024 * 1024)} MB.");

                    var filePath = await _fileStorageService.SaveFileAsync(file, post.Id, uploadPath);

                    var postImage = new PostImage
                    {
                        PostId = post.Id,
                        FileName = file.FileName,
                        FilePath = filePath,
                        FileSize = file.Length,
                        ContentType = file.ContentType,
                        DisplayOrder = displayOrder,
                        IsFeatured = (displayOrder == 0),
                        CreatedAt = DateTime.UtcNow
                    };

                    post.Images.Add(postImage);
                    displayOrder++;
                }
            }

            await _postRepository.AddAsync(post);
            return post.Id;
        }

        public async Task DeleteAsync(Guid postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);
            
            await _postRepository.DeleteAsync(post);
        }

        public async Task<IEnumerable<PostResponse>> GetAllPostsAsync()
        {
            var posts = await _postRepository.GetAllAsync();
            return posts.Select(p => new PostResponse
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Content = p.Content,
                CategoryName = p.Category.Name,
                IsPublished = p.IsPublished,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(img => new PostImageResponse
                {
                    Id = img.Id,
                    PostId = img.PostId,
                    FileName = img.FileName,
                    Url = _fileStorageService.GetFileUrl(img.FilePath),
                    FileSize = img.FileSize,
                    ContentType = img.ContentType,
                    IsFeatured = img.IsFeatured,
                    DisplayOrder = img.DisplayOrder,
                    CreatedAt = img.CreatedAt
                }).ToList()
            });
            
            
        }

        public async Task<PostResponse> GetBySlugAsync(string slug)
        {
            var post = await _postRepository.GetBySlugAsync(slug);
            if (post == null || !post.IsPublished)
                throw new NotFoundException($"Published post with slug '{slug}' was not found.");
            
            return new PostResponse
            {
                Id = post.Id,
                Title = post.Title,
                Slug = post.Slug,
                Content = post.Content,
                CategoryName = post.Category.Name,
                IsPublished = post.IsPublished,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                Images = post.Images.OrderBy(i => i.DisplayOrder).Select(img => new PostImageResponse
                {
                    Id = img.Id,
                    PostId = img.PostId,
                    FileName = img.FileName,
                    Url = _fileStorageService.GetFileUrl(img.FilePath),
                    FileSize = img.FileSize,
                    ContentType = img.ContentType,
                    IsFeatured = img.IsFeatured,
                    DisplayOrder = img.DisplayOrder,
                    CreatedAt = img.CreatedAt
                }).ToList()
            };
        }

        public async Task<IEnumerable<PostResponse>> GetPublicPostAsync(int page = 1, int pageSize = 10, Guid? CategoryId = null)
        {
            var posts = await _postRepository.GetAllAsync();
            var query = posts.Where(p => p.IsPublished);
            if (CategoryId.HasValue)
            query = query.Where(page => page.CategoryId == CategoryId.Value);
            return query
                .Skip((page -1) * pageSize)
                .Take(pageSize)
                .Select(p => new PostResponse
                {
                    Id = p.Id,
                    Title = p.Title,
                    Slug = p.Slug,
                    Content = p.Content,
                    CategoryName = p.Category.Name,
                    IsPublished = p.IsPublished,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    Images = p.Images.OrderBy(i => i.DisplayOrder).Select(img => new PostImageResponse
                    {
                        Id = img.Id,
                        PostId = img.PostId,
                        FileName = img.FileName,
                        Url = _fileStorageService.GetFileUrl(img.FilePath),
                        FileSize = img.FileSize,
                        ContentType = img.ContentType,
                        IsFeatured = img.IsFeatured,
                        DisplayOrder = img.DisplayOrder,
                        CreatedAt = img.CreatedAt
                    }).ToList()
                });
        }

        public async Task UpdateAsync(Guid postId, UpdatePostRequest request)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);
        
            post.Title = request.Title;
            post.Content = request.Content;
            post.CategoryId = request.CategoryId;  
            post.UpdatedAt = DateTime.UtcNow;
            await _postRepository.UpdateAsync(post); 
        }
        public async Task PublishAsync(Guid postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);
            
            if (post.IsPublished)
                throw new BadRequestException("Post is already published");
            
            post.IsPublished = true;
            post.UpdatedAt = DateTime.UtcNow;
            await _postRepository.UpdateAsync(post);
        }

        public async Task<IEnumerable<PostResponse>> GetUnpublishedPostsAsync()
        {
            var posts = await _postRepository.GetAllAsync();
            var unpublishedPosts = posts.Where(p => !p.IsPublished);
            return unpublishedPosts.Select(p => new PostResponse
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Content = p.Content,
                CategoryName = p.Category.Name,
                IsPublished = p.IsPublished,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            });
        }

        public async Task<UploadImagesResponse> UploadImagesAsync(Guid postId, List<IFormFile> files, string userId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);

            var maxImagesPerPost = _configuration.GetValue<int>("FileUpload:MaxImagesPerPost");
            var maxFileSize = _configuration.GetValue<long>("FileUpload:MaxFileSizeInBytes");
            var uploadPath = _configuration.GetValue<string>("FileUpload:UploadPath") ?? "wwwroot/uploads";

            var currentImageCount = post.Images.Count;
            var availableSlots = maxImagesPerPost - currentImageCount;

            if (files.Count > availableSlots)
                throw new BadRequestException($"Cannot upload {files.Count} images. Maximum {maxImagesPerPost} images per post. Currently {currentImageCount} images exist.");

            var uploadedImages = new List<PostImageResponse>();
            var newPostImages = new List<PostImage>();

            foreach (var file in files)
            {
                if (!_fileStorageService.IsValidImageFile(file))
                    throw new BadRequestException($"Invalid file format: {file.FileName}. Only JPG, JPEG, and PNG are allowed.");

                if (!_fileStorageService.IsFileSizeValid(file, maxFileSize))
                    throw new BadRequestException($"File {file.FileName} exceeds maximum size of {maxFileSize / (1024 * 1024)} MB.");

                var filePath = await _fileStorageService.SaveFileAsync(file, postId, uploadPath);
                var displayOrder = currentImageCount + newPostImages.Count;
                var isFeatured = displayOrder == 0;

                var postImage = new PostImage
                {
                    // Let EF Core assign ID automatically
                    PostId = postId,
                    FileName = file.FileName,
                    FilePath = filePath,
                    FileSize = file.Length,
                    ContentType = file.ContentType,
                    DisplayOrder = displayOrder,
                    IsFeatured = isFeatured,
                    CreatedAt = DateTime.UtcNow
                };

                newPostImages.Add(postImage);

                uploadedImages.Add(new PostImageResponse
                {
                    Id = postImage.Id,
                    PostId = postImage.PostId,
                    FileName = postImage.FileName,
                    Url = _fileStorageService.GetFileUrl(filePath),
                    FileSize = postImage.FileSize,
                    ContentType = postImage.ContentType,
                    IsFeatured = postImage.IsFeatured,
                    DisplayOrder = postImage.DisplayOrder,
                    CreatedAt = postImage.CreatedAt
                });
            }

            // Add images to the post's collection
            foreach (var img in newPostImages)
            {
                post.Images.Add(img);
            }

            // Save changes - EF Core will only insert the new images
            await _postRepository.SaveChangesAsync();

            return new UploadImagesResponse
            {
                PostId = postId,
                UploadedImages = uploadedImages,
                TotalImagesCount = post.Images.Count
            };
        }

        public async Task<PostImagesResponse> GetPostImagesAsync(Guid postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);

            var images = post.Images.OrderBy(i => i.DisplayOrder).Select(img => new PostImageResponse
            {
                Id = img.Id,
                PostId = img.PostId,
                FileName = img.FileName,
                Url = _fileStorageService.GetFileUrl(img.FilePath),
                FileSize = img.FileSize,
                ContentType = img.ContentType,
                IsFeatured = img.IsFeatured,
                DisplayOrder = img.DisplayOrder,
                CreatedAt = img.CreatedAt
            }).ToList();

            return new PostImagesResponse
            {
                PostId = postId,
                Images = images,
                TotalCount = images.Count
            };
        }

        public async Task DeleteImageAsync(Guid postId, Guid imageId, string userId, bool isAdmin)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);

            var image = post.Images.FirstOrDefault(i => i.Id == imageId);
            if (image == null)
                throw new NotFoundException("Image", imageId);

            // Delete physical file
            await _fileStorageService.DeleteFileAsync(image.FilePath);

            // Remove from database
            post.Images.Remove(image);

            // Recalculate display order and featured status
            var remainingImages = post.Images.OrderBy(i => i.DisplayOrder).ToList();
            for (int i = 0; i < remainingImages.Count; i++)
            {
                remainingImages[i].DisplayOrder = i;
                remainingImages[i].IsFeatured = (i == 0);
            }

            await _postRepository.SaveChangesAsync();
        }

        public async Task<SinglePostResponse> GetByIdAsync(Guid postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new NotFoundException("Post", postId);

            return new SinglePostResponse
            {
                Title = post.Title,
                Content = post.Content,
                Id = post.Id
            };
        }

        public async Task<PostStatDto> GetPostStatisticsAsync()
        {
            var statistics = await _postRepository.GetPostStatisticsAsync();
            return statistics;
        }
    }
}