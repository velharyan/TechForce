using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class TestimonialsController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Depoimentos — NexCore";
        return View();
    }
}