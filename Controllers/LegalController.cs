using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class LegalController : Controller
{
    public IActionResult Privacy()
    {
        ViewData["Title"] = "Política de Privacidade — LGPD";
        return View();
    }
    public IActionResult Terms()
    {
        ViewData["Title"] = "Termos de Uso";
        return View();
    }
}