using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class ProductsController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Produtos — NexCore";
        return View();
    }
}