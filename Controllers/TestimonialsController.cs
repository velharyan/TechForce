using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class TestimonialsController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Depoimentos - TechForce";
        ViewData["Description"] = "Experiencias reais de clientes com foco em operacao, margem e maturidade digital.";
        return View();
    }
}
