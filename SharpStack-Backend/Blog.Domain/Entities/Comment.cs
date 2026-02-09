using Blog.Domain.Common;

namespace Blog.Domain.Entities
{
    public class Comment : BaseEntity
    {
        public string Content { get; set; } = null!;
        public string UserDisplayName { get; set; } = null!;
        
        public Guid PostId { get; set; }
        public Post Post { get; set; } = null!;
        
        public string UserId { get; set; } = null!;
    }
}
