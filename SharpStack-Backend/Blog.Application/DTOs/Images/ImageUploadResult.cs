using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Application.DTOs.Images
{
    public class ImageUploadResult
    {
        public string Url { get; set; } = string.Empty;

        public string PublicId { get; set; } = string.Empty;
    }
}