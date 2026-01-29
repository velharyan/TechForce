using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class CasesController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Cases & Projetos — NexCore";
        return View();
    }
}