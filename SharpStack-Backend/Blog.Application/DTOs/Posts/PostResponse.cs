using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Blog.Application.DTOs.Images;

namespace Blog.Application.DTOs.Posts
{
    public class PostResponse
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<PostImageResponse>? Images { get; set; }
    }
}