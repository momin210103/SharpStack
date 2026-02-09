namespace Blog.Application.DTOs.Images;

public class PostImagesResponse
{
    public Guid PostId { get; set; }
    public List<PostImageResponse> Images { get; set; } = new();
    public int TotalCount { get; set; }
}
