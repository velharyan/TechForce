using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace TechForce.Web.Controllers;

public class CompanyController : Controller
{
    private readonly IOptions<AppOptions> _app;

    public CompanyController(IOptions<AppOptions> app)
    {
        _app = app;
    }

    public IActionResult About()
    {
        ViewData["Title"] = "Sobre a TechForce";
        ViewData["Description"] = "Conheca nossa abordagem de engenharia e entrega orientada a resultado.";
        return View();
    }

    public IActionResult Contact()
    {
        ViewData["Title"] = "Contato e Proposta";
        ViewData["Description"] = "Fale com nosso time para receber escopo tecnico e proposta de implementacao.";
        return View(new ContactForm());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Contact(ContactForm model)
    {
        if (!ModelState.IsValid)
        {
            ViewData["Title"] = "Contato e Proposta";
            ViewData["Description"] = "Fale com nosso time para receber escopo tecnico e proposta de implementacao.";
            return View(model);
        }

        TempData["Success"] = $"Obrigado. Recebemos sua mensagem e responderemos em ate {_app.Value.SlaHours} horas.";
        return RedirectToAction(nameof(Contact));
    }

    public IActionResult Chat()
    {
        ViewData["Title"] = "Assistente Virtual";
        ViewData["Description"] = "Converse com nosso assistente para acelerar seu briefing inicial.";
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
