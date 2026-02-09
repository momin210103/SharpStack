namespace Blog.Application.DTOs.Images;

public class UploadImagesResponse
{
    public Guid PostId { get; set; }
    public List<PostImageResponse> UploadedImages { get; set; } = new();
    public int TotalImagesCount { get; set; }
}
