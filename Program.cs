using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Strongly typed configuration
builder.Services.Configure<AppOptions>(builder.Configuration.GetSection("App"));
builder.Services.Configure<SeoOptions>(builder.Configuration.GetSection("Seo"));
builder.Services.Configure<AnalyticsOptions>(builder.Configuration.GetSection("Analytics"));

// Simple Chat service (simulated if no API key)
builder.Services.AddSingleton<IChatService, ChatService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error/ServerError");
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

// Status code pages -> re-execute to custom error pages
app.UseStatusCodePagesWithReExecute("/Error/Http{0}");

// PWA service worker
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

// Options classes
public record AppOptions
{
    public string CompanyName { get; init; } = "NexCore";
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

// Simple chat service with optional external provider via env vars
public interface IChatService
{
    Task<string> AskAsync(string message, CancellationToken ct = default);
}

public class ChatService : IChatService
{
    private readonly string? _apiKey = Environment.GetEnvironmentVariable("NEXCORE_AI_API_KEY");
    private readonly string? _provider = Environment.GetEnvironmentVariable("NEXCORE_AI_PROVIDER");

    public async Task<string> AskAsync(string message, CancellationToken ct = default)
    {
        // If you have a real provider key, you could integrate here.
        if (!string.IsNullOrWhiteSpace(_apiKey) && !string.IsNullOrWhiteSpace(_provider))
        {
            // Placeholder for real integration. To keep this template offline-friendly we simulate latency.
            await Task.Delay(350, ct);
            return $"[IA {_provider}] (demo) — Recebi sua pergunta: '{message}'. Em produção, eu consultaria o provedor configurado e retornaria a resposta. Que serviço você precisa?";
        }
        // Fallback simulated answer with disclaimer
        await Task.Delay(250, ct);
        return "[Simulação] Eu sou a assistente virtual da NexCore. Posso explicar nossos serviços, prazos e como iniciar seu projeto. Deseja falar com um especialista humano?";
    }
}