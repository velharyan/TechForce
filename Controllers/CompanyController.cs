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
        ViewData["Description"] = "Conheca a metodologia da TechForce: descoberta objetiva, engenharia de produto e execucao com foco em resultado mensuravel.";
        return View();
    }

    public IActionResult Contact()
    {
        ViewData["Title"] = "Contato e proposta";
        ViewData["Description"] = "Fale com nosso time para receber uma proposta tecnica, cronograma e recomendacao de evolucao para o seu contexto.";
        return View(new ContactForm());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Contact(ContactForm model)
    {
        if (!ModelState.IsValid)
        {
            ViewData["Title"] = "Contato e proposta";
            ViewData["Description"] = "Fale com nosso time para receber uma proposta tecnica, cronograma e recomendacao de evolucao para o seu contexto.";
            return View(model);
        }

        TempData["Success"] = $"Perfeito, {model.Name}. Recebemos sua mensagem e retornaremos em ate {_app.Value.SlaHours} horas uteis com uma resposta de prioridade tecnica.";
        return RedirectToAction(nameof(Contact));
    }

    public IActionResult Chat()
    {
        ViewData["Title"] = "Assistente virtual";
        ViewData["Description"] = "Converse com nosso consultor tecnico para acelerar o briefing inicial e direcionar o proximo passo.";
        return View();
    }
}

public class ContactForm
{
    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Informe seu nome.")]
    public string Name { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Informe o nome da empresa.")]
    public string Company { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Informe um e-mail.")]
    [System.ComponentModel.DataAnnotations.EmailAddress]
    public string Email { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Informe seu telefone ou WhatsApp.")]
    public string Phone { get; set; } = string.Empty;

    [System.ComponentModel.DataAnnotations.Required(ErrorMessage = "Descreva sua necessidade.")]
    [System.ComponentModel.DataAnnotations.MinLength(10)]
    public string Need { get; set; } = string.Empty;
}
