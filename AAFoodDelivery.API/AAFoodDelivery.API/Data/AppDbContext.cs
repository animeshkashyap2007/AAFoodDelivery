using Microsoft.EntityFrameworkCore;
using AAFoodDelivery.API.Models;

namespace AAFoodDelivery.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<FoodItem> FoodItems { get; set; }

        public DbSet<User> Users { get; set; }
    }
}