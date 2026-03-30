using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class BlogController : Controller
{
    private static readonly List<Post> Posts =
    [
        new("como-escolher-sistema-para-restaurante", "Como escolher um sistema para restaurante", "Checklist pratico para decidir com seguranca e evitar retrabalho."),
        new("automacao-whatsapp-que-converte", "Automacao de WhatsApp que converte", "Boas praticas para estruturar fluxo, reduzir tempo de resposta e aumentar conversao.")
    ];

    public IActionResult Index()
    {
        ViewData["Title"] = "Blog - TechForce";
        ViewData["Description"] = "Artigos praticos sobre software, automacao e eficiencia operacional.";
        return View(Posts);
    }

    [Route("Blog/{slug}")]
    public IActionResult Post(string slug)
    {
        var post = Posts.FirstOrDefault(p => p.Slug == slug);
        if (post == null) return RedirectToAction(nameof(Index));

        ViewData["Title"] = $"{post.Title} - Blog TechForce";
        ViewData["Description"] = post.Excerpt;
        return View(post);
    }
}

public record Post(string Slug, string Title, string Excerpt);
