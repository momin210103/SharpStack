using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Blog.Application.Interfaces.Services;
using Blog.Application.DTOs.Posts;
namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/posts")]
    // [Authorize(Roles ="Admin,User")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatePostRequest request)
        {
            await _postService.CreatePostAsync(request);
            return Ok("Post created");
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdatePostRequest request)
        {
            await _postService.UpdateAsync(id, request);
            return Ok("Post updated");
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _postService.DeleteAsync(id);
            return Ok("Post deleted");
        }
        
        [HttpGet("allposts")]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }
        
        [HttpPut("{id}/publish")]
        public async Task<IActionResult> Publish(Guid id)
        {
            await _postService.PublishAsync(id);
            return Ok("Post published");
        }
        
        [HttpGet("unpublished")]
        public async Task<IActionResult> GetUnpublishedPosts()
        {
            var posts = await _postService.GetUnpublishedPostsAsync();
            return Ok(posts);
        }

        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetById(Guid id)
        // {
        //     var post = await _postService.GetByIdAsync(id);
        //     return Ok(post);
        // }
    }
}