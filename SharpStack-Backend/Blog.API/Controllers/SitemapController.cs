using Blog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Blog.API.Controllers;

[ApiController]
public class SitemapController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SitemapController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("/sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap()
    {
        var posts = await _context.Posts
            .AsNoTracking()
            .Where(p => p.IsPublished)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Slug,
                p.UpdatedAt,
                p.CreatedAt
            })
            .ToListAsync();

        var baseUrl = "https://sharpstackbd.onrender.com";

        var xml = new StringBuilder();

        xml.AppendLine("""<?xml version="1.0" encoding="UTF-8"?>""");
        xml.AppendLine("""<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">""");

        // Homepage
        xml.AppendLine("""
            <url>
                <loc>https://sharpstackbd.onrender.com/</loc>
            </url>
            """);

        // Blog posts
        foreach (var post in posts)
        {
            var lastModified = post.UpdatedAt ?? post.CreatedAt;

            xml.AppendLine($"""
                    <url>
                        <loc>{baseUrl}/post/{Uri.EscapeDataString(post.Slug)}</loc>
                        <lastmod>{lastModified:yyyy-MM-dd}</lastmod>
                    </url>
                    """);
        }

        xml.AppendLine("</urlset>");

        return Content(
            xml.ToString(),
            "application/xml",
            Encoding.UTF8
        );
    }
}