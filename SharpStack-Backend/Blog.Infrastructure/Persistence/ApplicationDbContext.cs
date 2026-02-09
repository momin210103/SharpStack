using Blog.Domain.Entities;
using Blog.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<PostImage> PostImages => Set<PostImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Post configuration
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(p => p.Slug)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.HasIndex(p => p.Slug)
                  .IsUnique();

            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Posts)
                  .HasForeignKey(p => p.CategoryId);
            entity.HasMany(p => p.Images)
                  .WithOne(pi => pi.Post)
                  .HasForeignKey(pi => pi.PostId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(c => c.Slug)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.HasIndex(c => c.Slug)
                  .IsUnique();
        });

        // Comment configuration
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Content)
                  .IsRequired()
                  .HasMaxLength(1000);

            entity.Property(c => c.UserDisplayName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(c => c.UserId)
                  .IsRequired();

            entity.HasOne(c => c.Post)
                  .WithMany()
                  .HasForeignKey(c => c.PostId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PostImage configuration
        modelBuilder.Entity<PostImage>(entity =>
        {
            entity.HasKey(pi => pi.Id);

            entity.Property(pi => pi.FileName)
                  .IsRequired()
                  .HasMaxLength(255);

            entity.Property(pi => pi.FilePath)
                  .IsRequired()
                  .HasMaxLength(500);

            entity.Property(pi => pi.ContentType)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.HasOne(pi => pi.Post)
                  .WithMany(p => p.Images)
                  .HasForeignKey(pi => pi.PostId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(pi => pi.PostId);
        });
    }
}
