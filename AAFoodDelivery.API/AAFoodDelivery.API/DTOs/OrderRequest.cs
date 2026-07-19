using System.Collections.Generic;
namespace AAFoodDelivery.API.DTOs

{
    public class OrderRequest
    {
        public int UserId { get; set; }

        public string Address { get; set; } = "";

        public decimal TotalAmount { get; set; }

        public List<OrderItemRequest> Items { get; set; } = new();
    }
}