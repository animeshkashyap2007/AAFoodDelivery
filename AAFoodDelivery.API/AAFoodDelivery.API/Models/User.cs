using System.ComponentModel.DataAnnotations;

namespace AAFoodDelivery.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";

        public string Role { get; set; } = "User";
    }
}