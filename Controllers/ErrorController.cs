using Microsoft.AspNetCore.Mvc;

namespace NexCore.Web.Controllers;

public class ErrorController : Controller
{
    [Route("/Error/Http404")]
    public IActionResult NotFoundPage() => View("404");

    [Route("/Error/Http500")]
    public IActionResult ServerError() => View("500");
}