using Blog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/posts")]
    [AllowAnonymous]
    public class PublicPostsController : ControllerBase
    {
        private readonly IPostService _postService;
        public PublicPostsController(IPostService postService)
        {
            _postService = postService;
        }
        [HttpGet]
        // GET: api/posts?page=1&pageSize=10&CategoryId={categoryId}
        public async Task<IActionResult> GetAll(int page = 1,int pageSize = 10,Guid? categoryId = null)
        {
            var posts = await _postService.GetPublicPostAsync(page, pageSize, categoryId);
            return Ok(posts);
        }
        // GET: api/posts/by-slug/{slug}
        [HttpGet("by-slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var post = await _postService.GetBySlugAsync(slug);
            return Ok(post);
        }
            // GET: api/posts/{postId}
        [HttpGet("{postId}")]
        public async Task<IActionResult> GetById(Guid postId)
        {
            var post = await _postService.GetByIdAsync(postId);
            return Ok(post);
        }
        
    }
}