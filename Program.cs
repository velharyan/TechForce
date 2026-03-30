using System.Globalization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.Configure<AppOptions>(builder.Configuration.GetSection("App"));
builder.Services.Configure<SeoOptions>(builder.Configuration.GetSection("Seo"));
builder.Services.Configure<AnalyticsOptions>(builder.Configuration.GetSection("Analytics"));

builder.Services.AddSingleton<IChatService, ChatService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error/Http500");
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.UseStatusCodePagesWithReExecute("/Error/Http{0}");

app.MapWhen(ctx => ctx.Request.Path == "/service-worker.js", swApp =>
{
    swApp.Run(async context =>
    {
        context.Response.ContentType = "application/javascript";
        await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "service-worker.js"));
    });
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

public record AppOptions
{
    public string CompanyName { get; init; } = "TechForce";
    public string Tagline { get; init; } = string.Empty;
    public string Subhead { get; init; } = string.Empty;
    public string WhatsAppNumber { get; init; } = string.Empty;
    public string ContactEmail { get; init; } = string.Empty;
    public int SlaHours { get; init; } = 24;
}

public record SeoOptions
{
    public string BaseUrl { get; init; } = string.Empty;
    public string DefaultTitle { get; init; } = string.Empty;
    public string DefaultDescription { get; init; } = string.Empty;
    public string OgImage { get; init; } = string.Empty;
}

public record AnalyticsOptions
{
    public string GA_MEASUREMENT_ID { get; init; } = string.Empty;
    public string GTM_ID { get; init; } = string.Empty;
}

public interface IChatService
{
    Task<string> AskAsync(string message, CancellationToken ct = default);
}

public class ChatService : IChatService
{
    private readonly string? _apiKey = Environment.GetEnvironmentVariable("TechForce_AI_API_KEY");
    private readonly string? _provider = Environment.GetEnvironmentVariable("TechForce_AI_PROVIDER");

    public async Task<string> AskAsync(string message, CancellationToken ct = default)
    {
        if (!string.IsNullOrWhiteSpace(_apiKey) && !string.IsNullOrWhiteSpace(_provider))
        {
            await Task.Delay(350, ct);
            return $"[IA {_provider}] Demo ativo. Recebi: '{message}'. Em producao, a resposta viria do provedor configurado.";
        }

        await Task.Delay(220, ct);

        var input = string.IsNullOrWhiteSpace(message) ? "Quero entender as opcoes." : message.Trim();
        var text = Normalize(input);
        var response = new List<string>();

        var scoreSite = Score(text, "site", "landing", "institucional", "pagina", "conversao", "venda online", "ecommerce", "loja");
        var scoreSoftware = Score(text, "software", "sistema", "plataforma", "erp", "crm", "gestao", "operacao");
        var scoreApp = Score(text, "app", "aplicativo", "mobile", "celular", "tablet");
        var scoreApi = Score(text, "api", "integracao", "integrar", "dados", "banco", "sincronizar");
        var scoreAutomation = Score(text, "automacao", "automatizar", "workflow", "bot", "whatsapp", "manual", "retrabalho");
        var scoreDashboard = Score(text, "dashboard", "kpi", "relatorio", "painel", "indicador", "meta");

        var asksBudget = HasAny(text, "preco", "valor", "orcamento", "investimento", "custo");
        var asksDeadline = HasAny(text, "prazo", "tempo", "quando", "entrega");

        var isSmall = HasAny(text, "pequeno", "micro", "local", "bairro", "iniciante");
        var isEnterprise = HasAny(text, "grande", "industria", "corporativo", "escala", "filial", "matriz");

        var hasSalesPain = HasAny(text, "nao vendo", "vender mais", "sem cliente", "poucos leads", "baixa conversao");
        var hasOpsPain = HasAny(text, "manual", "planilha", "retrabalho", "erro", "atraso", "bagunca");
        var hasVisibilityPain = HasAny(text, "nao enxergo", "sem controle", "sem indicador", "nao sei", "sem painel");

        response.Add("Entendi seu contexto. Conseguimos montar uma solucao clara e profissional para seu negocio.");

        if (isSmall && !isEnterprise)
        {
            response.Add("Para pequeno negocio, o melhor inicio costuma ser site de alta conversao + automacao comercial + painel simples.");
        }
        else if (isEnterprise)
        {
            response.Add("Para operacoes maiores, indicamos arquitetura escalavel com APIs, integracoes e governanca por indicadores.");
        }
        else
        {
            response.Add("Podemos iniciar por um pacote enxuto e evoluir por sprint sem travar sua operacao.");
        }

        var offerings = new List<(int Score, string Text)>
        {
            (scoreSite, "site profissional com foco em conversao, SEO tecnico e performance mobile"),
            (scoreSoftware, "software sob medida para organizar processos e reduzir retrabalho"),
            (scoreApp, "aplicativo mobile para operacao e atendimento"),
            (scoreApi, "APIs e integracoes entre ERP, CRM, financeiro e canais digitais"),
            (scoreAutomation, "automacoes de atendimento e backoffice para ganhar escala"),
            (scoreDashboard, "dashboard executivo com KPI em tempo real")
        };

        var selected = offerings
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .Take(3)
            .Select(x => x.Text)
            .ToList();

        if (selected.Count == 0)
        {
            if (hasSalesPain)
            {
                selected.Add("site de alta conversao com funil de leads");
                selected.Add("automacao comercial para acelerar atendimento");
            }
            else if (hasOpsPain)
            {
                selected.Add("software de operacao com regras claras");
                selected.Add("automacoes para reduzir tarefas manuais");
            }
            else if (hasVisibilityPain)
            {
                selected.Add("dashboard com leitura executiva por periodo");
                selected.Add("integracao de dados para unificar indicadores");
            }
            else
            {
                selected.Add("sites, softwares, apps, APIs, automacoes e dashboards");
            }
        }

        response.Add("Recomendacao inicial: " + string.Join("; ", selected) + ".");

        if (hasSalesPain) response.Add("Pelo que voce descreveu, o foco principal e aumentar captacao e conversao de oportunidades.");
        if (hasOpsPain) response.Add("Tambem identifico ganho rapido com padronizacao de processo e menos tarefas manuais.");
        if (hasVisibilityPain) response.Add("Indicadores em tempo real ajudam a decidir mais rapido e com menos risco.");

        if (asksBudget)
        {
            response.Add("Sobre investimento: montamos proposta por fases, com entregas de impacto rapido para gerar retorno desde o inicio.");
        }

        if (asksDeadline)
        {
            response.Add("Sobre prazo: normalmente liberamos a primeira entrega entre 2 e 6 semanas, conforme complexidade.");
        }

        response.Add("Se quiser, me diga seu objetivo em uma frase (ex: \"quero vender mais no site\" ou \"quero automatizar meu atendimento\") e eu te devolvo um plano inicial.");
        return string.Join(" ", response);
    }

    private static bool HasAny(string text, params string[] terms)
    {
        return terms.Any(term => text.Contains(term, StringComparison.Ordinal));
    }

    private static int Score(string text, params string[] terms)
    {
        var score = 0;
        foreach (var term in terms)
        {
            if (text.Contains(term, StringComparison.Ordinal)) score++;
        }
        return score;
    }

    private static string Normalize(string value)
    {
        var normalized = value.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(capacity: normalized.Length);
        foreach (var c in normalized)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
