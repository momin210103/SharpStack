using Blog.Application.DTOs.Search;
using Blog.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;

        public SearchController(ISearchService searchService)
        {
            _searchService = searchService;
        }

        /// <summary>
        /// Public search endpoint - searches published posts only
        /// </summary>
        /// <param name="q">Search query (minimum 3 characters)</param>
        /// <param name="categoryId">Optional category filter</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Results per page (default: 20, max: 100)</param>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Search(
            [FromQuery] string q,
            [FromQuery] Guid? categoryId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var results = await _searchService.SearchAsync(q, categoryId, page, pageSize, includeUnpublished: false);
            return Ok(results);
        }

        /// <summary>
        /// Search categories by name
        /// </summary>
        /// <param name="q">Search query (minimum 3 characters)</param>
        [HttpGet("categories")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchCategories([FromQuery] string q)
        {
            var results = await _searchService.SearchCategoriesAsync(q);
            return Ok(results);
        }

        /// <summary>
        /// Admin search endpoint - can include unpublished posts
        /// </summary>
        /// <param name="q">Search query (minimum 3 characters)</param>
        /// <param name="categoryId">Optional category filter</param>
        /// <param name="includeUnpublished">Include unpublished posts (default: false)</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Results per page (default: 20, max: 100)</param>
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminSearch(
            [FromQuery] string q,
            [FromQuery] Guid? categoryId = null,
            [FromQuery] bool includeUnpublished = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var results = await _searchService.SearchAsync(q, categoryId, page, pageSize, includeUnpublished);
            return Ok(results);
        }
    }
}
