

namespace Blog.Application.DTOs.Posts
{
    public class PublishRequest
    {
        public Guid Id { get; set; }
        public bool IsPublished { get; set; }
        
    }
}