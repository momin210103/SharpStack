using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Blog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace Blog.Application.DTOs.Posts
{
    public class CreatePostRequest
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public Guid CategoryId { get; set; }

        // public IFormFile? Images { get; set; }
        public List<IFormFile>? Images { get; set; }
        // public IFormFile? Image { get; set; }
        // public bool IsPublished { get; set; }
        
    
    }
}