using Microsoft.AspNetCore.Mvc;
using TravelServer.Data;
using TravelServer.Models;
using Microsoft.EntityFrameworkCore;

namespace TravelServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public AuthController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
                return BadRequest(new { message = "User already exists" });

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                PhoneNumber = request.PhoneNumber
                
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Password == request.Password);

            if (user == null)
                return BadRequest(new { message = "Invalid email or password" });

            var fakeToken = Guid.NewGuid().ToString();

            return Ok(new 
            { 
                message = "Login successful",
                token = fakeToken,
                user = new { user.Id, user.FullName, user.Email, user.PhoneNumber }
            }); 
    }


    }

    public class RegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
    }


    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    
}