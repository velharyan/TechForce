using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace NexCore.Web.Controllers;

public class CompanyController : Controller
{
    private readonly IOptions<AppOptions> _app;

    public CompanyController(IOptions<AppOptions> app) { _app = app; }

    public IActionResult About()
    {
        ViewData["Title"] = "Sobre a NexCore";
        return View();
    }

    public IActionResult Contact()
    {
        ViewData["Title"] = "Contato & Orçamento";
        return View(new ContactForm());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Contact(ContactForm model)
    {
        if (!ModelState.IsValid)
        {
            ViewData["Title"] = "Contato & Orçamento";
            return View(model);
        }
        TempData["Success"] = $"Obrigado! Recebemos sua mensagem. Nosso SLA de resposta é de {_app.Value.SlaHours}h.";
        return RedirectToAction(nameof(Contact));
    }

    public IActionResult Chat()
    {
        ViewData["Title"] = "Converse com nossa IA";
        return View();
    }
}

public class ContactForm
{
    [System.ComponentModel.DataAnnotations.Required]
    public string Name { get; set; } = string.Empty;
    [System.ComponentModel.DataAnnotations.Required]
    public string Company { get; set; } = string.Empty;
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.EmailAddress]
    public string Email { get; set; } = string.Empty;
    [System.ComponentModel.DataAnnotations.Required]
    public string Phone { get; set; } = string.Empty;
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.MinLength(10)]
    public string Need { get; set; } = string.Empty;
}