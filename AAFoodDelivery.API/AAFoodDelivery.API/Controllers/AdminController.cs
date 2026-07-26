using AAFoodDelivery.API.Data;
using AAFoodDelivery.API.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AAFoodDelivery.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AdminController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        #region JWT

        private object GenerateJwt(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(
                    Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])),
                signingCredentials: creds);

            return new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            };
        }

        #endregion

        //==========================================================
        // REGISTER
        //==========================================================

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
            {
                return BadRequest(new
                {
                    message = "Email already exists."
                });
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Password = request.Password,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Registration successful."
            });
        }

        //==========================================================
        // LOGIN
        //==========================================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest login)
        {
            Console.WriteLine("========== LOGIN ==========");
            Console.WriteLine($"Email Received    : {login.Email}");
            Console.WriteLine($"Password Received : {login.Password}");

            Console.WriteLine("========== USERS ==========");

            var allUsers = await _context.Users.ToListAsync();

            foreach (var u in allUsers)
            {
                Console.WriteLine($"{u.Id} | {u.Email} | {u.Password}");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Email == login.Email &&
                u.Password == login.Password);

            if (user == null)
            {
                Console.WriteLine("LOGIN FAILED");

                return Unauthorized(new
                {
                    message = "Invalid Email or Password"
                });
            }

            Console.WriteLine("LOGIN SUCCESS");

            return Ok(GenerateJwt(user));
        }

        //==========================================================
        // GOOGLE LOGIN
        //==========================================================

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginRequest request)
        {
            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
            }
            catch
            {
                return Unauthorized(new
                {
                    message = "Invalid Google Token."
                });
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == payload.Email);

            if (user == null)
            {
                user = new User
                {
                    Name = payload.Name,
                    Email = payload.Email,
                    Password = Guid.NewGuid().ToString(),
                    Phone = "",
                    Role = "User",
                    GoogleId = payload.Subject,
                    AuthProvider = "Google"
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                user.GoogleId = payload.Subject;
                user.AuthProvider = "Google";

                await _context.SaveChangesAsync();
            }

            return Ok(GenerateJwt(user));
        }
    }
}