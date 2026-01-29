# NexCore — Site Corporativo (ASP.NET Core MVC / .NET 8)

Site institucional premium, moderno e orientado à conversão para a **NexCore**.

## Como abrir e rodar no Visual Studio (Windows)
1. Certifique-se de ter **Visual Studio 2022** atualizado e **.NET 8 SDK** instalado.
2. Baixe/extraia este projeto e abra o arquivo `NexCore.Web.csproj` no Visual Studio (ou `File > Open > Folder...`).
3. Defina o projeto como **Startup Project** e aperte **F5**.

### Variáveis de ambiente (opcional)
- `NEXCORE_AI_PROVIDER` e `NEXCORE_AI_API_KEY`: Integração real com IA (Azure OpenAI/OpenAI). Na ausência, o chat funciona em **modo simulado** com aviso.
- `ASPNETCORE_ENVIRONMENT=Development` para habilitar Developer Exception Page.

### Configurações (appsettings.json)
- **App**: WhatsApp, e-mail de contato, SLA.
- **Seo**: Título, descrição, `BaseUrl`, imagem OG.
- **Analytics**: `GA_MEASUREMENT_ID` e `GTM_ID` (carregados apenas se houver consentimento).

## Páginas/Seções entregues
- Home (Hero 5s, Benefícios, Serviços, KPIs com contadores, Depoimentos carrossel, Logos, CTA final)
- Serviços (com subpáginas)
- Produtos (visão SaaS)
- Cases/Projetos
- Depoimentos/Feedbacks
- Sobre
- Blog/Artigos
- Contato / Orçamento (form com validação)
- **Converse com nossa IA** (widget + página dedicada)
- Política de Privacidade (LGPD) e Termos de Uso
- 404/500 personalizadas
- Acessibilidade (WCAG info)
- Mapa do site (página) + `sitemap.xml` dinâmico
- PWA básico (manifest + service worker + offline)

## SEO Técnico
- Title/Meta/OG por página
- `robots.txt` e `sitemap.xml`
- Schema.org (inserir conforme necessário via _Layout ou views) — **sugestão**: Organization, LocalBusiness, SoftwareApplication, WebSite, BreadcrumbList
- Headings hierárquicos e conteúdo escaneável

## LGPD & Confiança
- Banner de cookies com consentimento granular (necessários, analytics, marketing)
- Carregamento de GA/GTM condicionado ao consentimento
- Contatos visíveis e SLA

## Performance
- Core Web Vitals: layout leve, imagens otimizáveis, JS mínimo, PWA com cache básico
- Animações sutis (transições CSS, contadores, carrossel simples)

## Observações
- Substitua `/wwwroot/img/logo.png` pela sua **logo real** (a sua marca). Também troque placeholders em `img/brands` e `img/mockups`.
- Ajuste os links de WhatsApp com o número real no `appsettings.json` ou diretamente nos hrefs (formato `https://wa.me/5599...`).
- Para dashboards, os dados são **mock** (exemplo). Integre com fontes reais conforme necessidade.

## Eventos de Analytics
- Atributo `data-evt` em CTAs principais (`cta_whatsapp`, `cta_diagnostico`, `cta_orcamento`, `cta_chat`).

---
**Assinatura:** © {ANO} — Desenvolvido por NexCore