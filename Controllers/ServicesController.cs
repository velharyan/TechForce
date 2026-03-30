using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class ServicesController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Servicos - TechForce";
        ViewData["Description"] = "Desenvolvimento de software, web apps, aplicativos e automacoes para empresas.";
        return View();
    }

    public IActionResult Software() => View();
    public IActionResult FoodService() => View();
    public IActionResult WebApps() => View();
    public IActionResult MobileApps() => View();
    public IActionResult Automations() => View();
}
