(function () {
    "use strict";

    window.TechForceDemoData = {
        cashflow: {
            categories: ["Assinaturas", "Projetos", "Marketing", "Infraestrutura", "Equipe", "Operacao"],
            transactions: [
                { id: 1, date: "2026-01-08", name: "Contrato SaaS Pro", type: "entrada", category: "Assinaturas", amount: 18200 },
                { id: 2, date: "2026-01-16", name: "Infraestrutura cloud", type: "saida", category: "Infraestrutura", amount: 3200 },
                { id: 3, date: "2026-02-03", name: "Landing enterprise", type: "entrada", category: "Projetos", amount: 14700 },
                { id: 4, date: "2026-02-18", name: "Campanha de aquisicao", type: "saida", category: "Marketing", amount: 5200 },
                { id: 5, date: "2026-03-07", name: "Automacao comercial", type: "entrada", category: "Projetos", amount: 12600 },
                { id: 6, date: "2026-03-21", name: "Suporte terceirizado", type: "saida", category: "Operacao", amount: 2800 },
                { id: 7, date: "2026-04-10", name: "Plano recorrente Growth", type: "entrada", category: "Assinaturas", amount: 21800 },
                { id: 8, date: "2026-04-22", name: "Folha squad produto", type: "saida", category: "Equipe", amount: 16400 },
                { id: 9, date: "2026-05-06", name: "Dashboard financeiro", type: "entrada", category: "Projetos", amount: 9800 },
                { id: 10, date: "2026-05-19", name: "Midia paga B2B", type: "saida", category: "Marketing", amount: 4600 },
                { id: 11, date: "2026-06-04", name: "Portal de clientes", type: "entrada", category: "Projetos", amount: 24100 },
                { id: 12, date: "2026-06-14", name: "Ambiente homologacao", type: "saida", category: "Infraestrutura", amount: 3900 }
            ]
        },
        catalog: {
            categories: [
                { id: "all", label: "Todos" },
                { id: "tech", label: "Tecnologia" },
                { id: "office", label: "Escritorio" },
                { id: "home", label: "Casa" }
            ],
            products: [
                { id: "p1", name: "Notebook Orion Pro", category: "tech", description: "Estacao compacta para times de produto, design e vendas.", price: 7490, tag: "Mais pedido", color: "linear-gradient(135deg,#77d9ff,#1c4f86)" },
                { id: "p2", name: "Mesa Executive Dock", category: "office", description: "Mesa modular com calha tecnica para setup corporativo.", price: 1290, tag: "B2B", color: "linear-gradient(135deg,#d7c29a,#5f6f7b)" },
                { id: "p3", name: "Headset Focus Air", category: "tech", description: "Audio limpo e cancelamento ativo para operacao comercial.", price: 690, tag: "Novo", color: "linear-gradient(135deg,#9df0c8,#156f55)" },
                { id: "p4", name: "Cadeira Grid One", category: "office", description: "Ergonomia premium para jornadas longas de atendimento.", price: 1890, tag: "Premium", color: "linear-gradient(135deg,#f2f5ff,#66758d)" },
                { id: "p5", name: "Kit Energia Solar", category: "home", description: "Pacote residencial com monitoramento de consumo.", price: 3490, tag: "Eco", color: "linear-gradient(135deg,#f8d36b,#d05e3d)" },
                { id: "p6", name: "Luminaria Halo", category: "home", description: "Iluminacao decorativa com controle de intensidade.", price: 340, tag: "Design", color: "linear-gradient(135deg,#f8fbff,#62b6d8)" }
            ]
        },
        menu: {
            categories: [
                { id: "all", label: "Tudo" },
                { id: "principais", label: "Principais" },
                { id: "sobremesas", label: "Sobremesas" },
                { id: "bebidas", label: "Bebidas" }
            ],
            items: [
                { id: "m1", name: "Risoto de limao siciliano", category: "principais", price: 54.9, description: "Arroz arboreo, parmesao, azeite verde e zestes frescos.", color: "linear-gradient(135deg,#f7d488,#6f9c70)" },
                { id: "m2", name: "Burger brisket premium", category: "principais", price: 48.5, description: "Blend da casa, cheddar ingles, cebola caramelizada e molho defumado.", color: "linear-gradient(135deg,#d88457,#472820)" },
                { id: "m3", name: "Gnocchi ao pesto", category: "principais", price: 46.9, description: "Massa artesanal, pesto de manjericao e castanhas tostadas.", color: "linear-gradient(135deg,#a9d884,#2f6b48)" },
                { id: "m4", name: "Tiramisu espresso", category: "sobremesas", price: 27.9, description: "Creme mascarpone, cafe intenso e cacau belga.", color: "linear-gradient(135deg,#c7a17a,#4e3428)" },
                { id: "m5", name: "Cheesecake frutas vermelhas", category: "sobremesas", price: 29.9, description: "Base crocante, creme leve e calda artesanal.", color: "linear-gradient(135deg,#f2a2be,#7d2445)" },
                { id: "m6", name: "Spritz tropical", category: "bebidas", price: 31.5, description: "Drink refrescante com citricos, maracuja e espuma leve.", color: "linear-gradient(135deg,#f8c85f,#37b4e6)" },
                { id: "m7", name: "Cha gelado da casa", category: "bebidas", price: 16.9, description: "Infusao de frutas, hortela e limao siciliano.", color: "linear-gradient(135deg,#b7e8c5,#3d8050)" }
            ]
        }
    };
})();
