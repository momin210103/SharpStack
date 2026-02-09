using Blog.Domain.Common;

namespace Blog.Domain.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public bool IsActive { get; set; }

        public ICollection<Post> Posts { get; set; } = new List<Post>();
        
    }
}