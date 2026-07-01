window.TechForceChatbotKnowledge = {
  quickReplies: [
    "Quero vender mais pelo site",
    "Preciso de um sistema sob medida",
    "Quero automatizar atendimento no WhatsApp",
    "Quero um cardápio digital",
    "Quero uma landing page para campanha"
  ],
  qualification: [
    { key: "name", label: "Nome", question: "Para eu qualificar melhor: qual é o seu nome?" },
    { key: "phone", label: "Telefone", question: "Qual telefone ou WhatsApp o time pode usar para continuar o atendimento?" },
    { key: "project", label: "Projeto", question: "Que tipo de projeto você quer priorizar: site, sistema, automação, catálogo, cardápio, chatbot ou algo sob medida?" },
    { key: "budget", label: "Investimento", question: "Você já tem uma faixa de investimento estimada? Pode ser aproximada." },
    { key: "urgency", label: "Urgência", question: "E qual a urgência: imediato, este mês, próximos 60 dias ou sem pressa?" }
  ],
  intents: [
    {
      id: "site",
      label: "Site institucional premium",
      keywords: ["site", "institucional", "pagina", "seo", "autoridade", "empresa", "presenca"],
      answer: "Para site institucional premium, trabalhamos com narrativa comercial forte, SEO técnico, performance mobile e CTAs conectados ao funil de vendas.",
      suggestRoute: { path: "/Services/WebApps", label: "Ver serviços Web →" },
      suggestDemo: { path: "/Products", label: "Ver demo de site →" }
    },
    {
      id: "landing",
      label: "Landing page de conversão",
      keywords: ["landing", "campanha", "lead", "conversao", "trafego", "anuncio", "captar", "midia"],
      answer: "Para landing page, o foco é promessa clara, dor e solução bem posicionadas, formulário curto, prova social e eventos de conversão para medir ROI.",
      suggestRoute: { path: "/Services/WebApps", label: "Ver landing como serviço →" },
      suggestDemo: { path: "/Products", label: "Ver demo de landing →" }
    },
    {
      id: "software",
      label: "Sistema sob medida",
      keywords: ["sistema", "software", "saas", "erp", "crm", "gestao", "dashboard", "plataforma", "app"],
      answer: "Para sistema sob medida, o melhor caminho é mapear regra de negócio, perfis, dados, integrações e indicadores antes do MVP. Trabalhamos com entregas modulares.",
      suggestRoute: { path: "/Services/Software", label: "Ver serviços de software →" },
      suggestDemo: { path: "/Products", label: "Ver demo de sistema →" }
    },
    {
      id: "automation",
      label: "Automação comercial e operacional",
      keywords: ["automacao", "automatizar", "manual", "planilha", "retrabalho", "whatsapp", "atendimento", "workflow", "bot", "ia"],
      answer: "Para automação, eu priorizaria o fluxo que mais consome tempo: triagem, follow-up, cadastro, notificação, conciliação ou repasse para CRM. Podemos desenhar isso em 2 dias.",
      suggestRoute: { path: "/Services/Automations", label: "Ver serviços de automação →" },
      suggestDemo: { path: "/Products", label: "Ver demo de automação →" }
    },
    {
      id: "catalog",
      label: "Catálogo digital",
      keywords: ["catalogo", "produto", "vitrine", "preco", "orcamento", "vender"],
      answer: "Para catálogo digital, recomendo busca rápida, categorias claras, cards comerciais, CTA direto e estrutura pronta para evoluir para pedido ou WhatsApp.",
      suggestDemo: { path: "/Products", label: "Ver demo de catálogo →" }
    },
    {
      id: "menu",
      label: "Cardápio digital",
      keywords: ["cardapio", "restaurante", "pedido", "delivery", "mesa", "comida", "lanche", "food"],
      answer: "Para cardápio digital, o ideal é experiência mobile-first com categorias, busca, carrinho, observações e fechamento por WhatsApp ou painel.",
      suggestDemo: { path: "/Products", label: "Ver demo de cardápio →" },
      suggestRoute: { path: "/Services/FoodService", label: "Ver Food Service →" }
    },
    {
      id: "chatbot",
      label: "Chatbot comercial",
      keywords: ["chatbot", "assistente", "qualificar"],
      answer: "Para chatbot comercial, o fluxo precisa entender intenção, coletar dados essenciais, sugerir próximo passo e entregar histórico limpo para o time humano. Igual eu faço aqui!",
      suggestRoute: { path: "/Services/Automations", label: "Ver automações com chatbot →" }
    },
    {
      id: "mobile",
      label: "Aplicativo mobile",
      keywords: ["app", "aplicativo", "mobile", "android", "ios", "celular"],
      answer: "Para aplicativos mobile, desenvolvemos apps para equipe em campo, atendimento, rotina operacional e experiência do cliente com usabilidade clara.",
      suggestRoute: { path: "/Services/MobileApps", label: "Ver serviços Mobile →" },
      suggestDemo: { path: "/Products", label: "Ver demo de app →" }
    },
    {
      id: "preco",
      label: "Preço e investimento",
      keywords: ["quanto", "custa", "preco", "valor", "investimento", "orcamento", "orçamento", "barato", "caro"],
      answer: "Cada projeto é único, mas gosto de pensar em fases: uma primeira entrega comercial (site ou landing) pode sair em 2-4 semanas. Sistemas e apps começam com um MVP. O ideal é batermos um papo para alinhar escopo.",
      suggestRoute: { path: "/Company/Contact", label: "Solicitar proposta →" }
    },
    {
      id: "prazo",
      label: "Prazo de entrega",
      keywords: ["prazo", "tempo", "quando", "entrega", "urgente", "demora", "rapido", "depressa"],
      answer: "Prazos típicos: landing page 1-2 semanas, site institucional 2-4 semanas, sistema/MVP 4-8 semanas. Tudo depende do escopo e integrações. Posso te dar uma estimativa mais precisa se entendermos juntos o projeto.",
      suggestRoute: { path: "/Company/Contact", label: "Pedir estimativa →" }
    },
    {
      id: "cases",
      label: "Cases de sucesso",
      keywords: ["case", "cliente", "portfolio", "trabalho", "exemplo", "fez", "projeto", "resultado"],
      answer: "Temos cases em diversos segmentos: varejo, serviços, alimentação, indústria e tecnologia. Cada case documenta o desafio, a solução e os resultados reais entregues.",
      suggestRoute: { path: "/Cases", label: "Ver cases →" }
    },
    {
      id: "contato",
      label: "Falar com equipe",
      keywords: ["falar", "humano", "pessoa", "time", "equipe", "ligar", "telefone", "whatsapp", "zap", "contato"],
      answer: "Você pode falar com nosso time diretamente pelo WhatsApp ou preenchendo o formulário de contato. Vou preparar um resumo do que conversamos para agilizar.",
      suggestRoute: { path: "/Company/Contact", label: "Ir para contato →" },
      isContact: true
    }
  ],
  fallback: "Entendi! Pelo que você disse, posso te ajudar com: site institucional, landing page, sistema sob medida, automação, catálogo digital, cardápio digital ou aplicativo. Me conta mais sobre o seu objetivo.",
  entryMessage: "Olá! 👋 Eu sou o assistente virtual da <strong>TechForce</strong>. Posso te ajudar a escolher o melhor serviço, mostrar demonstrações ou já ir preparando sua proposta. Como posso te ajudar hoje?"
};
