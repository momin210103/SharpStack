namespace Blog.Application.DTOs.BusinessLogic
{
    public class PostStatDto
    {
        public int TotalPosts { get; set; }
        public int PublishedPosts { get; set; }
        public int UnpublishedPosts { get; set; }
    }
}