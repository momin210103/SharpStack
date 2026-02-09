
using Blog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles ="Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IPostService _postService;
        
        public AdminController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet("dashboard")]
        public IActionResult GetDashboard()
        {
            return Ok("Welcome to the Admin Dashboard");
        }
        [HttpGet("stats")]
        public async Task<IActionResult> GetStatistics()
        {
            var stats = await _postService.GetPostStatisticsAsync();
            return Ok(stats);
        }
    }
}