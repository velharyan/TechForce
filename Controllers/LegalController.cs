using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class LegalController : Controller
{
    public IActionResult Privacy()
    {
        ViewData["Title"] = "Politica de Privacidade - TechForce";
        return View();
    }

    public IActionResult Terms()
    {
        ViewData["Title"] = "Termos de Uso - TechForce";
        return View();
    }
}
