using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace NexCore.Web.Controllers;

public class HomeController : Controller
{
    private readonly IOptions<SeoOptions> _seo;
    private readonly IOptions<AppOptions> _app;

    public HomeController(IOptions<SeoOptions> seo, IOptions<AppOptions> app)
    {
        _seo = seo; _app = app;
    }

    public IActionResult Index()
    {
        ViewData["Title"] = _seo.Value.DefaultTitle;
        ViewData["Description"] = _seo.Value.DefaultDescription;
        return View();
    }

    public IActionResult Numbers()
    {
        ViewData["Title"] = "Nossos Números — NexCore";
        ViewData["Description"] = "KPIs e indicadores da NexCore com dados de exemplo.";
        return View();
    }

    public IActionResult Accessibility()
    {
        ViewData["Title"] = "Acessibilidade — NexCore";
        return View();
    }

    public IActionResult Sitemap()
    {
        ViewData["Title"] = "Mapa do site — NexCore";
        return View();
    }

    [HttpGet("sitemap.xml")]
    public IActionResult SitemapXml()
    {
        var urls = new []{
            Url.Action("Index","Home",null, Request.Scheme)!,
            Url.Action("Index","Services",null, Request.Scheme)!,
            Url.Action("Index","Products",null, Request.Scheme)!,
            Url.Action("Index","Cases",null, Request.Scheme)!,
            Url.Action("Index","Testimonials",null, Request.Scheme)!,
            Url.Action("About","Company",null, Request.Scheme)!,
            Url.Action("Contact","Company",null, Request.Scheme)!,
            Url.Action("Chat","Company",null, Request.Scheme)!,
            Url.Action("Privacy","Legal",null, Request.Scheme)!,
            Url.Action("Terms","Legal",null, Request.Scheme)!,
            Url.Action("Numbers","Home",null, Request.Scheme)!,
            Url.Action("Accessibility","Home",null, Request.Scheme)!,
        };
        var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
                  "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"+
                  string.Join("", urls.Select(u => $"<url><loc>{u}</loc></url>"))+
                  "</urlset>";
        return Content(xml, "application/xml");
    }
}