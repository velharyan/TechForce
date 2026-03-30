using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class TestimonialsController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Depoimentos - TechForce";
        ViewData["Description"] = "Experiencias de clientes sobre resultados e evolucao operacional.";
        return View();
    }
}
