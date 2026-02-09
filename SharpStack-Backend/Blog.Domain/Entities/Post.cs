

using Blog.Domain.Common;

namespace Blog.Domain.Entities 
{
    public class Post: BaseEntity
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public bool IsPublished { get; set; }
        

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        // Navigation properties
        public ICollection<PostImage> Images { get; set; } = new List<PostImage>();

        
    }
}