using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chat;
    public ChatController(IChatService chat) { _chat = chat; }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ChatRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Message))
            return BadRequest(new { error = "Mensagem vazia" });
        var answer = await _chat.AskAsync(req.Message);
        return Ok(new { answer });
    }
}

public record ChatRequest(string Message);