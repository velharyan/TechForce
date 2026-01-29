using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class BlogController : Controller
{
    private static readonly List<Post> Posts = new(){
        new Post("como-escolher-sistema-para-restaurante","Como escolher um sistema para restaurante","Dicas práticas para PMEs do food service."),
        new Post("automacao-whatsapp-que-converte","Automação de WhatsApp que converte","Boas práticas de bots e fluxos autorizados.")
    };

    public IActionResult Index() => View(Posts);

    [Route("Blog/{slug}")]
    public IActionResult Post(string slug)
    {
        var post = Posts.FirstOrDefault(p => p.Slug == slug);
        if (post == null) return RedirectToAction("Index");
        return View(post);
    }
}

public record Post(string Slug, string Title, string Excerpt);