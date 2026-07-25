using AAFoodDelivery.API.Models;
using AAFoodDelivery.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AAFoodDelivery.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly GroqService _groqService;

        public ChatController(GroqService groqService)
        {
            _groqService = groqService;
        }

        [HttpPost]
        public async Task<ActionResult<ChatResponse>> Chat(ChatRequest request)
        {
            var reply = await _groqService.AskAI(request.Message);

            return Ok(new ChatResponse
            {
                Reply = reply
            });
        }
    }
}