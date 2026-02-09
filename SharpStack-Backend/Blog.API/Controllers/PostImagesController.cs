using Blog.Application.DTOs.Images;
using Blog.Application.Interfaces.Services;
using Blog.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Blog.API.Controllers;

[ApiController]
[Route("api/posts/{postId}/images")]
public class PostImagesController : ControllerBase
{
    private readonly IPostService _postService;

    public PostImagesController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<UploadImagesResponse>> UploadImages(Guid postId, [FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            throw new BadRequestException("No files provided");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _postService.UploadImagesAsync(postId, files, userId);
        
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<PostImagesResponse>> GetImages(Guid postId)
    {
        var result = await _postService.GetPostImagesAsync(postId);
        return Ok(result);
    }

    [HttpDelete("{imageId}")]
    [Authorize]
    public async Task<IActionResult> DeleteImage(Guid postId, Guid imageId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isAdmin = User.IsInRole("Admin");
        
        await _postService.DeleteImageAsync(postId, imageId, userId, isAdmin);
        
        return NoContent();
    }
}
