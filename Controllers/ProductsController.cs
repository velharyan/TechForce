using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class ProductsController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Produtos - TechForce";
        ViewData["Description"] = "Portifolio de produtos com exemplos funcionais para sites, apps, APIs, automacoes e sistemas.";
        return View(ProductCatalog.All);
    }

    [Route("Products/Example/{slug}")]
    public IActionResult Example(string slug)
    {
        var product = ProductCatalog.All.FirstOrDefault(item =>
            item.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        if (product is null) return RedirectToAction(nameof(Index));

        ViewData["Title"] = $"Exemplo {product.Name} - TechForce";
        ViewData["Description"] = product.Summary;
        return View(product);
    }
}

public static class ProductCatalog
{
    public static readonly IReadOnlyList<ProductItem> All =
    [
        new(
            Slug: "site",
            Name: "Site institucional premium",
            Summary: "Site profissional para gerar autoridade, leads e oportunidades comerciais.",
            Category: "Web",
            Audience: "Pequeno, medio e grande negocio",
            StartingWeeks: 2,
            Tags: ["SEO", "Mobile first", "Conversao"],
            Highlights: ["Pagina rapida", "CTA estrategico", "Conteudo orientado a venda"]
        ),
        new(
            Slug: "ecommerce",
            Name: "E-commerce com checkout otimizado",
            Summary: "Loja virtual com fluxo de compra simples, analytics e crescimento de conversao.",
            Category: "Comercial",
            Audience: "Varejo e distribuicao",
            StartingWeeks: 4,
            Tags: ["Catalogo", "Checkout", "Pagamento"],
            Highlights: ["Carrinho inteligente", "Cupom e frete", "Painel de pedidos"]
        ),
        new(
            Slug: "app",
            Name: "Aplicativo de operacao",
            Summary: "App para equipe em campo, atendimento e rotina operacional com usabilidade clara.",
            Category: "Mobile",
            Audience: "Operacoes com equipe distribuida",
            StartingWeeks: 5,
            Tags: ["Android", "iOS", "Produtividade"],
            Highlights: ["Tarefas em tempo real", "Push de alerta", "Baixa curva de aprendizado"]
        ),
        new(
            Slug: "api",
            Name: "Hub de APIs e integracoes",
            Summary: "Camada de integracao para sincronizar sistemas de venda, estoque, financeiro e atendimento.",
            Category: "Arquitetura",
            Audience: "Empresas com sistemas variados",
            StartingWeeks: 3,
            Tags: ["API", "Logs", "Seguranca"],
            Highlights: ["Dados consistentes", "Auditoria de eventos", "Escala com governanca"]
        ),
        new(
            Slug: "automation",
            Name: "Automacao de processos",
            Summary: "Fluxos automatizados para reduzir atividades manuais e acelerar resposta comercial.",
            Category: "Automacao",
            Audience: "Empresas com alto volume operacional",
            StartingWeeks: 2,
            Tags: ["Workflow", "WhatsApp", "SLA"],
            Highlights: ["Triagem automatica", "Menos retrabalho", "Produtividade do time"]
        ),
        new(
            Slug: "dashboard",
            Name: "Dashboard executivo",
            Summary: "Painel de indicadores para decisao rapida e acompanhamento de metas em tempo real.",
            Category: "Dados",
            Audience: "Gestao comercial e diretoria",
            StartingWeeks: 2,
            Tags: ["KPI", "Tempo real", "Insights"],
            Highlights: ["Visual claro", "Alertas de meta", "Leitura por periodo"]
        ),
        new(
            Slug: "crm",
            Name: "CRM comercial sob medida",
            Summary: "Pipeline de vendas com regras de negocio, follow-up e visao de conversao por etapa.",
            Category: "Comercial",
            Audience: "Times de vendas B2B e B2C",
            StartingWeeks: 4,
            Tags: ["Pipeline", "Follow-up", "Forecast"],
            Highlights: ["Funil customizado", "Historico de contato", "Prioridade de leads"]
        ),
        new(
            Slug: "portal",
            Name: "Portal de cliente e suporte",
            Summary: "Area segura para chamados, documentos, SLA e comunicacao com rastreabilidade.",
            Category: "Atendimento",
            Audience: "Empresas com suporte recorrente",
            StartingWeeks: 3,
            Tags: ["Chamados", "SLA", "Documentos"],
            Highlights: ["Autosservico", "Controle de status", "Historico centralizado"]
        ),
        new(
            Slug: "landing",
            Name: "Landing page de campanha",
            Summary: "Pagina de campanha para captar leads com oferta, prova social e formulario otimizado.",
            Category: "Marketing",
            Audience: "Times de aquisicao e lancamentos",
            StartingWeeks: 1,
            Tags: ["Leads", "Midia", "Conversao"],
            Highlights: ["Rapida implantacao", "A/B test facil", "Alto foco em conversao"]
        ),
        new(
            Slug: "erp-lite",
            Name: "ERP Lite para operacao",
            Summary: "Modulo leve para controle de pedidos, estoque, financeiro e rotina administrativa.",
            Category: "Gestao",
            Audience: "Pequenos e medios negocios",
            StartingWeeks: 6,
            Tags: ["Estoque", "Financeiro", "Pedidos"],
            Highlights: ["Visao unica da operacao", "Processo padronizado", "Escala gradual"]
        )
    ];
}

public record ProductItem(
    string Slug,
    string Name,
    string Summary,
    string Category,
    string Audience,
    int StartingWeeks,
    string[] Tags,
    string[] Highlights
);
