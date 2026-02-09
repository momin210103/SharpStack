using Blog.Domain.Common;

namespace Blog.Domain.Entities;

public class PostImage : BaseEntity
{
    public Guid PostId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }

    // Navigation property
    public Post Post { get; set; } = null!;
}
