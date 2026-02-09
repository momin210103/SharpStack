
using Blog.API.Helpers;
using Blog.Application.DTOs.Auth;
using Blog.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public AuthController(UserManager<ApplicationUser> userManager,SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
                return BadRequest("User already exists!");
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email
            };
            
            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
                
            }
            var createdUser = await _userManager.FindByEmailAsync(request.Email);
            if(createdUser == null)
                return BadRequest("User creation failed!");
            await _userManager.AddToRoleAsync(createdUser, "User");
            return Ok("User registered successfully!");
        }
            
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request,[FromServices] IConfiguration configuration)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if(user ==null)
                return Unauthorized("Invalid Email or Password");
            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if(!result.Succeeded)
                return Unauthorized("Invalid Email or Password");
            var token = await JwtTokenGenerator.GenerateToken(user,_userManager,configuration);
            return Ok(new { Token =  token });
            
        }
          
    }
}