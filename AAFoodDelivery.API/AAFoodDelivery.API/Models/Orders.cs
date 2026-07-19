using AAFoodDelivery.API.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;

    public decimal TotalAmount { get; set; }

    public string? Address { get; set; }

    public string Status { get; set; } = "Pending";

    public List<OrderItem> OrderItems { get; set; } = new();
}