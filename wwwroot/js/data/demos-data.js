// Fonte de dados para as demos de produto. Estrutura pronta para expansao sem alterar renderizadores.
(function () {
  "use strict";

  var now = new Date();
  var year = now.getFullYear();

  window.TechForceDemoData = {
    cashflow: {
      categories: [
        "Assinaturas",
        "Projetos",
        "Marketing",
        "Infraestrutura",
        "Equipe",
        "Operacao"
      ],
      transactions: [
        { id: 1, date: year + "-01-04", name: "Assinatura Enterprise", type: "entrada", category: "Assinaturas", amount: 18600, memo: "Recorrencia mensal de plataforma" },
        { id: 2, date: year + "-01-10", name: "Cloud base growth", type: "saida", category: "Infraestrutura", amount: 3200, memo: "RTO, backup e monitoramento" },
        { id: 3, date: year + "-02-02", name: "Implementacao landing", type: "entrada", category: "Projetos", amount: 14800, memo: "Kickoff + UX + homologacao inicial" },
        { id: 4, date: year + "-02-11", name: "Midia B2B ativa", type: "saida", category: "Marketing", amount: 5600, memo: "Testes por canal e otimização de criativos" },
        { id: 5, date: year + "-02-24", name: "Automacao comercial", type: "entrada", category: "Projetos", amount: 13200, memo: "Projeto de lead routing e follow-up" },
        { id: 6, date: year + "-03-03", name: "Folha Operacao", type: "saida", category: "Equipe", amount: 16600, memo: "Equipe de delivery e suporte assistido" },
        { id: 7, date: year + "-03-14", name: "Plano recorrente Growth", type: "entrada", category: "Assinaturas", amount: 22000, memo: "Pacote premium com 12 meses" },
        { id: 8, date: year + "-03-27", name: "Consultoria dados", type: "saida", category: "Equipe", amount: 4200, memo: "Apoio analitico de funil e forecast" },
        { id: 9, date: year + "-04-08", name: "Dashboard de performance", type: "entrada", category: "Projetos", amount: 9800, memo: "Painel executivo com alertas por risco" },
        { id: 10, date: year + "-04-18", name: "Midia paga", type: "saida", category: "Marketing", amount: 5000, memo: "Campanha de demanda de alta intencao" },
        { id: 11, date: year + "-05-07", name: "Portal de clientes", type: "entrada", category: "Projetos", amount: 24600, memo: "Implantacao de SLA e base de conhecimento" },
        { id: 12, date: year + "-05-19", name: "Infraestrutura homologacao", type: "saida", category: "Infraestrutura", amount: 4100, memo: "Ambiente de teste e observabilidade" },
        { id: 13, date: year + "-06-05", name: "Upgrade licencas", type: "entrada", category: "Assinaturas", amount: 11800, memo: "Aumento de volume de uso e usuarios" },
        { id: 14, date: year + "-06-17", name: "Operacoes de suporte", type: "saida", category: "Equipe", amount: 6800, memo: "Subcontratacao especializada de resposta" }
      ]
    },

    catalog: {
      categories: [
        { id: "all", label: "Todos" },
        { id: "workspace", label: "Workspace" },
        { id: "infra", label: "Infra e office" },
        { id: "retail", label: "Comercial" },
        { id: "monitoring", label: "Monitoramento" },
        { id: "support", label: "Suporte" }
      ],
      products: [
        { id: "p1", name: "Notebook Orion X", category: "workspace", description: "Estacao para squads comerciais e produto com processador i7, 32GB RAM.", price: 8390, tag: "Mais pedido", color: "linear-gradient(135deg,#77d9ff,#2b4f86)" },
        { id: "p2", name: "Mesa Focus Desk", category: "infra", description: "Setup profissional com controle de cabos e ergonomia para operacao longa.", price: 1190, tag: "B2B", color: "linear-gradient(135deg,#d7c29a,#5f6f7b)" },
        { id: "p3", name: "Headset Aura", category: "support", description: "Audio limpo para suporte comercial e atendimento com baixa latencia.", price: 690, tag: "Novo", color: "linear-gradient(135deg,#9df0c8,#156f55)" },
        { id: "p4", name: "Cadeira Grid One", category: "infra", description: "Ergonomia e foco para jornadas com chamadas e triagens intensas.", price: 1890, tag: "Premium", color: "linear-gradient(135deg,#f2f5ff,#66758d)" },
        { id: "p5", name: "Kit Home Monitoring", category: "monitoring", description: "Monitoramento de consumo e alertas com painel integrado.", price: 2990, tag: "Eco", color: "linear-gradient(135deg,#f8d36b,#d05e3d)" },
        { id: "p6", name: "Console de chamada", category: "support", description: "Central de voz e gravação integrada para operacao de suporte.", price: 540, tag: "Operacao", color: "linear-gradient(135deg,#7cd3ff,#2f4c8f)" },
        { id: "p7", name: "Rack modular", category: "infra", description: "Infra para testes de integracao, com ventilacao silenciosa.", price: 4200, tag: "Infra", color: "linear-gradient(135deg,#c4d7ff,#4b6d9a)" },
        { id: "p8", name: "Cabo de dados 5m", category: "monitoring", description: "Conectividade estruturada para setup rapido e testes locais.", price: 320, tag: "Rede", color: "linear-gradient(135deg,#f8faff,#62b6d8)" }
      ]
    },

    menu: {
      categories: [
        { id: "all", label: "Tudo" },
        { id: "pratos", label: "Pratos principais" },
        { id: "sobremesas", label: "Sobremesas" },
        { id: "bebidas", label: "Bebidas" },
        { id: "vinhos", label: "Vinhos" }
      ],
      items: [
        { id: "m1", name: "Risoto limao siciliano", category: "pratos", description: "Arroz arboreo, parmegiano, azeite verde e zestes frescos.", price: 54.9, color: "linear-gradient(135deg,#f7d488,#6f9c70)" },
        { id: "m2", name: "Brisket burger premium", category: "pratos", description: "Blend da casa, cheddar envelhecido, cebola caramelizada e molho defumado.", price: 48.5, color: "linear-gradient(135deg,#d88457,#472820)" },
        { id: "m3", name: "Gnocchi pesto", category: "pratos", description: "Massa artesanal, pesto natural e castanhas tostadas.", price: 46.9, color: "linear-gradient(135deg,#a9d884,#2f6b48)" },
        { id: "m4", name: "Tiramisu espresso", category: "sobremesas", description: "Creme mascarpone, cafe intenso e cacau belga.", price: 27.9, color: "linear-gradient(135deg,#c7a17a,#4e3428)" },
        { id: "m5", name: "Cheesecake vermelha", category: "sobremesas", description: "Base crocante e calda de frutas vermelhas artesanal.", price: 29.9, color: "linear-gradient(135deg,#f2a2be,#7d2445)" },
        { id: "m6", name: "Spritz tropical", category: "bebidas", description: "Drink leve com maracuja, citrus e espuma natural.", price: 31.5, color: "linear-gradient(135deg,#f8c85f,#37b4e6)" },
        { id: "m7", name: "Cha gelado", category: "bebidas", description: "Infusao de frutas e hortela com toque citrico leve.", price: 16.9, color: "linear-gradient(135deg,#b7e8c5,#3d8050)" },
        { id: "m8", name: "Chardonnay seco", category: "vinhos", description: "Vinho branco seco para menus com acidez moderada.", price: 89, color: "linear-gradient(135deg,#f9e2ad,#6a4f2e)" }
      ]
    }
  };
})();
