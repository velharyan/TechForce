using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class ServicesController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Servicos - TechForce";
        ViewData["Description"] = "Software sob medida, web apps, aplicativos mobile, automacao e arquitetura para crescimento com previsibilidade.";
        return View();
    }

    public IActionResult Software() => View();
    public IActionResult FoodService() => View();
    public IActionResult WebApps() => View();
    public IActionResult MobileApps() => View();
    public IActionResult Automations() => View();
}
