using Microsoft.AspNetCore.Mvc;

namespace TechForce.Web.Controllers;

public class ProductsController : Controller
{
    public IActionResult Index()
    {
        ViewData["Title"] = "Produtos e demonstrações - TechForce";
        ViewData["Description"] = "Catálogo de demos funcionais de software, automações, apps e soluções de operação.";
        return View(ProductCatalog.All);
    }

    [Route("Products/Example/{slug}")]
    public IActionResult Example(string slug)
    {
        var product = ProductCatalog.All.FirstOrDefault(item =>
            item.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));
        if (product is null) return RedirectToAction(nameof(Index));

        ViewData["Title"] = $"{product.Name} - TechForce";
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
            Name: "Site institucional profissional",
            Summary: "Site com posicionamento comercial, navegação clara e captura de leads para processos de negócio.",
            Category: "Web",
            Audience: "Empresas de serviços, varejo e tecnologia",
            StartingWeeks: 2,
            Tags: ["SEO", "Mobile first", "Conversão"],
            Highlights: ["Página de alto desempenho", "Funis com CTA", "Conteúdo por etapa do funil"]
        ),
        new(
            Slug: "ecommerce",
            Name: "E-commerce com checkout otimizado",
            Summary: "Loja comercial com catálogo, carrinho e monitoramento de conversão para operação de vendas.",
            Category: "Comercial",
            Audience: "Varejo e distribuição",
            StartingWeeks: 4,
            Tags: ["Catálogo", "Checkout", "Pagamentos"],
            Highlights: ["Carrinho inteligente", "Cupons e frete", "Painel de pedidos"]
        ),
        new(
            Slug: "app",
            Name: "Aplicativo de operação",
            Summary: "Aplicativo para equipe interna e clientes com rotinas, status e controle por etapa.",
            Category: "Mobile",
            Audience: "Times de operação e atendimento",
            StartingWeeks: 5,
            Tags: ["Android", "iOS", "Produtividade"],
            Highlights: ["Tarefas em tempo real", "Notificações e alertas", "Baixa curva de aprendizado"]
        ),
        new(
            Slug: "api",
            Name: "Hub de APIs e integrações",
            Summary: "Camada de integração para sincronizar sistemas comerciais, financeiro, logística e atendimento.",
            Category: "Arquitetura",
            Audience: "Empresas com múltiplos sistemas",
            StartingWeeks: 3,
            Tags: ["API", "Logs", "Segurança"],
            Highlights: ["Dados consistentes", "Auditoria de eventos", "Governança e observabilidade"]
        ),
        new(
            Slug: "automation",
            Name: "Automação de processos",
            Summary: "Fluxos automatizados para reduzir tarefas manuais, padronizar operações e reduzir tempo de resposta.",
            Category: "Automação",
            Audience: "Empresas com alto volume operacional",
            StartingWeeks: 2,
            Tags: ["Workflow", "WhatsApp", "SLA"],
            Highlights: ["Triagem automática", "Menos retrabalho", "Produtividade do time"]
        ),
        new(
            Slug: "ia",
            Name: "Assistente inteligente com IA",
            Summary: "Atendimento escalável com roteamento inteligente, triagem e resposta de contexto para times de suporte e comercial.",
            Category: "IA",
            Audience: "Empresas com times de atendimento e vendas",
            StartingWeeks: 2,
            Tags: ["NLP", "Roteamento", "Produtividade"],
            Highlights: ["Respostas contextuais", "Regras de prioridade", "Transbordo para especialista"]
        ),
        new(
            Slug: "dashboard",
            Name: "Dashboard executivo",
            Summary: "Painel executivo com metas, risco e sinais de operação em atualização contínua.",
            Category: "Dados",
            Audience: "Gestão comercial e diretoria",
            StartingWeeks: 2,
            Tags: ["KPI", "Tempo real", "Insights"],
            Highlights: ["Visual limpo", "Alertas por risco", "Leitura por período"]
        ),
        new(
            Slug: "crm",
            Name: "CRM comercial sob medida",
            Summary: "Pipeline com regras de negócio, follow-up estruturado e visibilidade por etapa.",
            Category: "Comercial",
            Audience: "Times de vendas B2B e B2C",
            StartingWeeks: 4,
            Tags: ["Pipeline", "Follow-up", "Forecast"],
            Highlights: ["Funil customizado", "Histórico de contato", "Priorização de leads"]
        ),
        new(
            Slug: "portal",
            Name: "Portal de cliente e suporte",
            Summary: "Área segura para chamados, documentos, SLA e comunicação com histórico rastreável.",
            Category: "Atendimento",
            Audience: "Empresas com suporte recorrente",
            StartingWeeks: 3,
            Tags: ["Chamados", "SLA", "Documentos"],
            Highlights: ["Autoatendimento", "Controle de status", "Histórico centralizado"]
        ),
        new(
            Slug: "landing",
            Name: "Landing page de campanha",
            Summary: "Página de campanha para captação de leads com proposta objetiva e formulários de alta conversão.",
            Category: "Marketing",
            Audience: "Times de aquisição e lançamento",
            StartingWeeks: 1,
            Tags: ["Leads", "Oferta", "Conversão"],
            Highlights: ["Implantação rápida", "Testes de mensagem", "Foco em conversão"]
        ),
        new(
            Slug: "erp-lite",
            Name: "ERP Lite para operação",
            Summary: "Módulo leve para pedidos, estoque, financeiro e rotina administrativa da operação.",
            Category: "Gestão",
            Audience: "PMEs com operação centralizada",
            StartingWeeks: 6,
            Tags: ["Estoque", "Financeiro", "Pedidos"],
            Highlights: ["Visão única da operação", "Processo padronizado", "Escala progressiva"]
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
