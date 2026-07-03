window.TechForceChatbotKnowledge = {
  tone: "consultivo",
  quickReplies: [
    "Quero estruturar meu comercial para gerar mais leads no mês",
    "Quero reduzir retrabalho da equipe com automações",
    "Preciso de um sistema para pipeline e forecast de vendas",
    "Tenho uma operação que depende de WhatsApp e precisa escalar",
    "Me explique a melhor arquitetura para IA em atendimento"
  ],
  qualification: [
    { key: "name", label: "Seu nome", question: "Perfeito. Posso te chamar como?" },
    { key: "project", label: "Objetivo", question: "Qual é o objetivo principal: site, landing, automação, IA, sistema ou dashboard?" },
    { key: "phone", label: "Contato", question: "Qual WhatsApp ou telefone eu uso para te responder com objetividade?" },
    { key: "company", label: "Empresa", question: "Qual é o nome da sua empresa?" },
    { key: "channel", label: "Canal", question: "Prefere continuar por WhatsApp, ligação ou e-mail?" },
    { key: "timeline", label: "Prazo", question: "Qual é o prazo inicial que te interessa: 2 semanas, 1 mês..." },
    { key: "budget", label: "Investimento", question: "Qual faixa de investimento você enxerga para começar?" }
  ],
  intents: [
    {
      id: "site",
      title: "Site institucional",
      aliases: ["site", "institucional", "website", "landing", "pagina", "página", "home"],
      match: ["site", "institucional", "pagina", "presenca", "autoridade", "seo", "conversao"],
      answer: "Para o time comercial, o site precisa ser uma máquina de captacao, não vitrine. A gente projeta homepage, prova social, trilha de mensagem e rota de follow-up em uma base real.",
      valueMessage: "Em 30 dias o ganho mais visível costuma ser aumento de leads qualificados e redução de leads frios.",
      demonstration: { slug: "site", path: "/Products/Example/site", label: "ver demo de site institucional" }
    },
    {
      id: "landing",
      title: "Landing de campanhas",
      aliases: ["landing", "campanha", "oferta", "tráfego", "ads", "anuncio", "anúncio", "página de conversao", "conversao"],
      match: ["landing", "campanha", "lead", "oferta", "cpv", "cpl", "roi", "formulario", "formulário"],
      answer: "Quando uma campanha cresce, a landing vira o ponto mais sensível. Definimos promessa, oferta e prova em menos de 3 blocos para reduzir atrito e medir resposta.",
      valueMessage: "A decisão certa aqui é reduzir custo por lead com dados consistentes de origem e taxa de qualificação.",
      demonstration: { slug: "landing", path: "/Products/Example/landing", label: "ver demo de landing de conversão" }
    },
    {
      id: "ecommerce",
      title: "E-commerce",
      aliases: ["ecommerce", "e-commerce", "loja", "catálogo", "catalogo", "checkout", "pagamento", "comercial"],
      match: ["ecommerce", "e-commerce", "loja", "checkout", "catalogo", "pagamento", "produto"],
      answer: "E-commerce corporativo precisa casar catálogo, checkout, política de pedido e acompanhamento de margem. A arquitetura define se vocês escalamos com segurança ou criamos ruído operacional.",
      valueMessage: "A métrica mais correta para decisão inicial é conversão por sessão + ticket e nível de ruptura.",
      demonstration: { slug: "ecommerce", path: "/Products/Example/ecommerce", label: "ver demo de loja digital" }
    },
    {
      id: "app",
      title: "App e operação móvel",
      aliases: ["app", "mobile", "aplicativo", "tarefa", "campo", "equipe", "operacao"],
      match: ["app", "mobile", "aplicativo", "kanban", "checklist", "campo", "atendente", "equipe"],
      answer: "No app interno, o valor vem de rotinas simples e rastreáveis: prioridade, status e conclusão com accountability por perfil e horário.",
      valueMessage: "Com isso, o ganho aparece em produtividade de rotina, menos reunião e mais previsibilidade no atendimento.",
      demonstration: { slug: "app", path: "/Products/Example/app", label: "ver demo de operação mobile" }
    },
    {
      id: "dashboard",
      title: "Dashboard executivo",
      aliases: ["dashboard", "kpi", "indicador", "metrica", "métrica", "relatorio", "relatório", "execucao", "execução"],
      match: ["dashboard", "kpi", "metrica", "relatorio", "relatório", "indicador", "meta", "resultado", "performance"],
      answer: "O principal diferencial do dashboard executivo é transformar dados em decisão. Menos número, mais contexto de risco, tendência e ação do gestor.",
      valueMessage: "Quando os indicadores estão ligados ao processo, o board ganha previsibilidade e reduz decisões por intuição.",
      demonstration: { slug: "dashboard", path: "/Products/Example/dashboard", label: "ver demo de painel executivo" }
    },
    {
      id: "automation",
      title: "Automações de processo",
      aliases: ["automacao", "automação", "workflow", "rota", "roteamento", "fluxo", "trabalho repetitivo", "fatura"],
      match: ["automacao", "automação", "workflow", "fila", "sla", "triagem", "bot", "rpa", "processo"],
      answer: "Automatização eficiente evita retrabalho e protege a operação. Definimos fila, regra de prioridade, trilha de exceção e responsabilidade por falha.",
      valueMessage: "O ganho costuma vir no primeiro ciclo com menos esforço manual e mais tempo de atenção em decisão.",
      demonstration: { slug: "automation", path: "/Products/Example/automation", label: "ver demo de automação operacional" }
    },
    {
      id: "ia",
      title: "IA aplicada ao atendimento",
      aliases: ["ia", "inteligencia artificial", "chatbot", "assistente", "suporte", "atendimento", "classificacao"],
      match: ["ia", "inteligencia", "assistente", "chatbot", "classificacao", "prioridade", "atendimento"],
      answer: "Com IA operacional, a pergunta não é 'qual modelo usar', mas 'qual política de decisão vai gerar valor'. Estruturamos contexto, escalonamento e segurança de resposta.",
      valueMessage: "A regra correta deixa o time mais rápido no atendimento sem perder controle de qualidade.",
      demonstration: { slug: "ia", path: "/Products/Example/ia", label: "ver demo de assistente inteligente" }
    },
    {
      id: "crm",
      title: "CRM comercial",
      aliases: ["crm", "pipeline", "follow-up", "lead", "oportunidades", "vendas", "comercial"],
      match: ["crm", "pipeline", "lead", "oportunidade", "follow-up", "followup", "comercial", "vendas"],
      answer: "No CRM, cada etapa precisa ter dono, saída e regra. Sem esse padrão, o time perde ritmo e o time to close cai por falta de clareza.",
      valueMessage: "Estruturamos cadência, score, previsibilidade e visão de carteira para decisões de gestão semanal.",
      demonstration: { slug: "crm", path: "/Products/Example/crm", label: "ver demo de CRM comercial" }
    },
    {
      id: "api",
      title: "Integrações via API",
      aliases: ["api", "integracao", "integração", "erp", "crm", "sistemas", "gateway", "webhook"],
      match: ["api", "integracao", "integração", "erp", "sincronizar", "sistema", "gateway", "webhook"],
      answer: "A maioria dos gargalos vem de troca manual de dados. Com integração robusta, você ganha rastreabilidade por evento e operação sem atrito entre sistemas.",
      valueMessage: "O desenho certo de governança e observabilidade reduz incidente crítico antes de crescer a operação.",
      demonstration: { slug: "api", path: "/Products/Example/api", label: "ver demo de arquitetura de integrações" }
    },
    {
      id: "portal",
      title: "Portal de suporte",
      aliases: ["portal", "atendimento", "cliente", "suporte", "sla", "chamado", "ticket", "base de conhecimento"],
      match: ["portal", "suporte", "cliente", "atendimento", "ticket", "sla", "chamado", "self-service"],
      answer: "Portal de cliente profissional reduz ruído no e-mail e mantém histórico único por interação, com SLA e auditoria por prioridade.",
      valueMessage: "Você ganha consistência de resposta e uma trilha de qualidade visível para gestão de sucesso do cliente.",
      demonstration: { slug: "portal", path: "/Products/Example/portal", label: "ver demo de portal de clientes" }
    },
    {
      id: "erp-lite",
      title: "ERP Lite",
      aliases: ["erp", "erp-lite", "ordem", "pedido", "estoque", "financeiro", "faturamento", "operacao", "operação"],
      match: ["erp", "pedido", "estoque", "financeiro", "faturamento", "produtos", "custo", "conferencia"],
      answer: "No ERP Lite, o ganho vem da padronização do fluxo base: pedido, estoque, financeiro e visibilidade diária com trilha de aprovação.",
      valueMessage: "A base fica pronta para crescer sem paralisar operação atual.",
      demonstration: { slug: "erp-lite", path: "/Products/Example/erp-lite", label: "ver demo de ERP operacional" }
    },
    {
      id: "preco",
      title: "Investimento",
      aliases: ["preco", "preço", "valor", "orcamento", "orçamento", "custo", "investimento", "patamar", "patamar"],
      match: ["preco", "preço", "valor", "orçamento", "investimento", "custo"],
      answer: "Trabalhamos por fase de valor: diagnóstico, piloto controlado e expansão conforme risco e retorno. Normalmente iniciamos com uma entrega com impacto visível em 15 a 30 dias.",
      valueMessage: "Se você me passar o escopo, já monto uma trilha de investimento com marcos e entregáveis."
    },
    {
      id: "prazo",
      title: "Prazo e execução",
      aliases: ["prazo", "quando", "agenda", "cronograma", "tempo", "deadline", "urgente", "inicio", "início"],
      match: ["prazo", "tempo", "quando", "cronograma", "deadline", "urgente", "inicio", "início"],
      answer: "Prazo correto depende de maturidade de dados e integrações atuais. Geralmente definimos 3 horizontes: diagnóstico, entrega funcional e consolidação.",
      valueMessage: "Se você me contar o cenário atual, te devolvo uma janela realista por etapa."
    },
    {
      id: "metodologia",
      title: "Metodologia",
      aliases: ["metodologia", "como funciona", "processo", "fluxo", "etapas", "descoberta", "discovery"],
      match: ["metodologia", "processo", "etapas", "descoberta", "discovery", "como funciona"],
      answer: "Nosso modo de trabalho é consultivo e incremental: descoberta de gargalo, hipótese validada, entrega por sprint e medição semanal de impacto.",
      valueMessage: "Isso evita retrabalho e reduz incerteza na primeira entrega."
    }
  ],
  pages: {
    home: "/",
    services: "/Services",
    demos: "/Products",
    contact: "/Company/Contact",
    chat: "/Company/Chat"
  },
  stack: ["ASP.NET Core", "Blazor", "React", "Node.js", "PostgreSQL", "Redis", "TypeScript", "Tailwind"],
  deliveryModel: [
    "Diagnóstico executivo (1 encontro ou 2 reuniões)",
    "Plano de sprint com 4 semanas de execução",
    "Métricas de comportamento e revisão semanal",
    "Escalonamento com documentação e handoff técnico"
  ],
  fallback: "Excelente ponto. Vou te ajudar de forma direta: me diz objetivo principal, setor atual e prazo alvo e te devolvo um plano de entrada com solução e rota de demonstração."
};
