using AAFoodDelivery.API.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order? Order { get; set; }

    public int FoodId { get; set; }

    public FoodItem? Food { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }
}