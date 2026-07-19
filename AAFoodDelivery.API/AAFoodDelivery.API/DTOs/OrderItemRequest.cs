namespace AAFoodDelivery.API.DTOs
{
    public class OrderItemRequest
    {
        public int FoodId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }
    }
}