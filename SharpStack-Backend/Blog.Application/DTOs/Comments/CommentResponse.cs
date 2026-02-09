namespace Blog.Application.DTOs.Comments
{
    public class CommentResponse
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = null!;
        public string UserDisplayName { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public Guid PostId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
