using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class CasesController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Cases - TechForce";
        ViewData["Description"] = "Projetos com resultado medido em receita, eficiencia operacional e previsibilidade de crescimento.";
        return View();
    }
}
