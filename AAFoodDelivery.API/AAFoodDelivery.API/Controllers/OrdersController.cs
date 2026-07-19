using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AAFoodDelivery.API.Data;
using AAFoodDelivery.API.Models;
using AAFoodDelivery.API.DTOs;

namespace AAFoodDelivery.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder(OrderRequest request)
        {
            var order = new Order
            {
                UserId = request.UserId,
                Address = request.Address,
                TotalAmount = request.TotalAmount,
                Status = "Pending",
                OrderDate = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            foreach (var item in request.Items)
            {
                Console.WriteLine($"FoodId = {item.FoodId}");

                _context.OrderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    FoodId = item.FoodId,
                    Quantity = item.Quantity,
                    Price = item.Price
                });
            }

            foreach (var item in request.Items)
            {
                _context.OrderItems.Add(new OrderItem
                {
                    OrderId = order.Id,
                    FoodId = item.FoodId,
                    Quantity = item.Quantity,
                    Price = item.Price
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Order placed successfully",
                orderId = order.Id
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ToListAsync();

            return Ok(orders);
        }
    }
}