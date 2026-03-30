using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class CasesController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Cases - TechForce";
        ViewData["Description"] = "Projetos com resultados mensuraveis em operacao, vendas e eficiencia.";
        return View();
    }
}
