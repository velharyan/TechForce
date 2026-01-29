using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class ServicesController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Serviços — NexCore";
        ViewData["Description"] = "Desenvolvimento de software, web, aplicativos e automações (incluindo WhatsApp).";
        return View();
    }

    public IActionResult Software() => View();
    public IActionResult FoodService() => View();
    public IActionResult WebApps() => View();
    public IActionResult MobileApps() => View();
    public IActionResult Automations() => View();
}