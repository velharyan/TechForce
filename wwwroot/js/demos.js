(function () {
    "use strict";

    const money = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const modal = document.getElementById("demoModal");
    const modalTitle = document.getElementById("demoModalTitle");
    const modalKicker = document.getElementById("demoModalKicker");
    const modalBody = document.getElementById("demoModalBody");
    const search = document.getElementById("demoSearch");
    const cards = Array.from(document.querySelectorAll("[data-demo-card]"));
    const filters = Array.from(document.querySelectorAll("[data-demo-filter]"));
    let activeFilter = "all";

    const escapeHtml = (value) => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const setModal = (title, kicker, html, afterRender) => {
        if (!modal || !modalTitle || !modalKicker || !modalBody) return;
        modalTitle.textContent = title;
        modalKicker.textContent = kicker;
        modalBody.innerHTML = html;
        modal.hidden = false;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        afterRender?.();
        modal.querySelector("[data-close-demo]")?.focus?.();
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        window.setTimeout(() => {
            if (!modal.classList.contains("is-open")) modal.hidden = true;
        }, 180);
    };

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const openButton = target.closest("[data-open-demo]");
        if (openButton) {
            openDemo(openButton.getAttribute("data-open-demo") || "");
            return;
        }
        if (target.closest("[data-close-demo]")) closeModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeModal();
    });

    const applyFilters = () => {
        const query = (search?.value || "").trim().toLowerCase();
        cards.forEach((card) => {
            const category = card.getAttribute("data-category") || "";
            const keywords = card.getAttribute("data-keywords") || "";
            const title = card.textContent || "";
            const matchesCategory = activeFilter === "all" || activeFilter === category;
            const matchesQuery = !query || `${keywords} ${title}`.toLowerCase().includes(query);
            card.hidden = !(matchesCategory && matchesQuery);
        });
    };

    search?.addEventListener("input", applyFilters);
    filters.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.getAttribute("data-demo-filter") || "all";
            filters.forEach((item) => item.classList.toggle("is-active", item === button));
            applyFilters();
        });
    });

    const cashState = {
        filter: "all",
        transactions: [
            { id: 1, date: "2026-06-02", name: "Contrato SaaS Pro", type: "entrada", amount: 18500 },
            { id: 2, date: "2026-06-05", name: "Campanha midia paga", type: "saida", amount: 4200 },
            { id: 3, date: "2026-06-09", name: "Landing enterprise", type: "entrada", amount: 9800 },
            { id: 4, date: "2026-06-14", name: "Infraestrutura cloud", type: "saida", amount: 2100 },
            { id: 5, date: "2026-06-18", name: "Automacao comercial", type: "entrada", amount: 12600 }
        ]
    };

    const renderCashflow = () => {
        const visible = cashState.transactions.filter((item) => cashState.filter === "all" || item.type === cashState.filter);
        const income = visible.filter((item) => item.type === "entrada").reduce((sum, item) => sum + item.amount, 0);
        const outcome = visible.filter((item) => item.type === "saida").reduce((sum, item) => sum + item.amount, 0);
        const balance = income - outcome;
        const profit = income ? Math.round((balance / income) * 100) : 0;
        const max = Math.max(...visible.map((item) => item.amount), 1);

        return `
            <div class="cash-app">
                <div class="cash-toolbar">
                    <div><strong>Pulse Finance</strong><span>Visao executiva do caixa</span></div>
                    <div class="segmented">
                        ${["all", "entrada", "saida"].map((type) => `<button type="button" class="${cashState.filter === type ? "is-active" : ""}" data-cash-filter="${type}">${type === "all" ? "Todos" : type}</button>`).join("")}
                    </div>
                </div>
                <div class="cash-kpis">
                    <article><span>Saldo</span><strong>${money(balance)}</strong></article>
                    <article><span>Entradas</span><strong>${money(income)}</strong></article>
                    <article><span>Saidas</span><strong>${money(outcome)}</strong></article>
                    <article><span>Lucro</span><strong>${profit}%</strong></article>
                </div>
                <div class="cash-layout">
                    <section class="cash-chart" aria-label="Grafico de transacoes">
                        ${visible.map((item) => `<div><i class="${item.type}" style="height:${Math.max(18, Math.round((item.amount / max) * 100))}%"></i><span>${item.date.slice(5)}</span></div>`).join("") || "<p class='empty-state'>Nenhuma transacao para este filtro.</p>"}
                    </section>
                    <form class="cash-form" id="cashForm">
                        <h3>Adicionar transacao</h3>
                        <input name="name" placeholder="Descricao" maxlength="42" required />
                        <input name="amount" type="number" min="1" step="100" placeholder="Valor" required />
                        <select name="type"><option value="entrada">Entrada</option><option value="saida">Saida</option></select>
                        <button class="btn btn-primary" type="submit">Adicionar</button>
                    </form>
                </div>
                <div class="table-scroll">
                    <table class="module-table">
                        <thead><tr><th>Data</th><th>Descricao</th><th>Tipo</th><th>Valor</th></tr></thead>
                        <tbody>
                            ${visible.map((item) => `<tr><td>${item.date}</td><td>${escapeHtml(item.name)}</td><td><span class="pill ${item.type}">${item.type}</span></td><td>${money(item.amount)}</td></tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            </div>`;
    };

    const bindCashflow = () => {
        const refresh = () => {
            setModal("Aplicativo de Fluxo de Caixa", "SaaS financeiro", renderCashflow(), bindCashflow);
        };
        modalBody?.querySelectorAll("[data-cash-filter]").forEach((button) => {
            button.addEventListener("click", () => {
                cashState.filter = button.getAttribute("data-cash-filter") || "all";
                refresh();
            });
        });
        const form = document.getElementById("cashForm");
        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = new FormData(form);
            cashState.transactions.unshift({
                id: Date.now(),
                date: new Date().toISOString().slice(0, 10),
                name: String(data.get("name") || "Nova transacao"),
                type: String(data.get("type") || "entrada"),
                amount: Number(data.get("amount") || 0)
            });
            refresh();
        });
    };

    const simpleFormSuccess = (selector, message) => {
        const form = document.querySelector(selector);
        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            const output = form.querySelector("[data-form-output]");
            if (output) output.textContent = message;
            form.reset();
        });
    };

    const demos = {
        institutional: {
            title: "Demo de Site Institucional",
            kicker: "Website premium",
            html: () => `
                <div class="mini-site">
                    <section class="mini-hero"><div><span>NovaHaus Consulting</span><h3>Consultoria operacional para empresas em expansao.</h3><p>Processos, dados e tecnologia para liderancas que precisam crescer com controle.</p><button class="btn btn-primary" type="button">Agendar conversa</button></div></section>
                    <div class="mini-services"><article><strong>Estrategia</strong><p>Diagnostico e plano por prioridade.</p></article><article><strong>Operacao</strong><p>Rotinas, SLAs e indicadores.</p></article><article><strong>Tecnologia</strong><p>Automacao, BI e integracoes.</p></article></div>
                    <section class="mini-about"><h3>Sobre a NovaHaus</h3><p>Uma consultoria ficticia com posicionamento premium, prova de autoridade e CTA claro para reuniao comercial.</p></section>
                    <div class="mini-testimonials"><blockquote>"O projeto trouxe clareza para decidir e velocidade para executar."</blockquote><span>Marina Costa, COO</span></div>
                    <div class="mini-cta"><strong>Pronto para organizar sua operacao?</strong><button class="btn btn-outline" type="button">Solicitar proposta</button></div>
                </div>`
        },
        landing: {
            title: "Demo de Landing Page",
            kicker: "Alta conversao",
            html: () => `
                <div class="landing-demo">
                    <section class="landing-hero"><span>LeadOps Sprint</span><h3>Transforme trafego pago em leads qualificados em 14 dias.</h3><p>Pagina, formulario, CRM e automacao conectados para campanhas que precisam de resposta rapida.</p><button class="btn btn-primary" type="button">Quero captar leads</button></section>
                    <div class="proof-row"><span>+2.4k leads gerados</span><span>4.8/5 satisfacao</span><span>Setup em 7 dias</span></div>
                    <section class="pain-solution"><article><strong>Dor</strong><p>Campanhas levam usuarios para paginas lentas, genericas e sem rastreio.</p></article><article><strong>Solucao</strong><p>Landing com oferta clara, prova social, CRM e automacao de follow-up.</p></article></section>
                    <form class="demo-form" id="landingForm"><h3>Receber diagnostico</h3><input placeholder="Nome" required /><input type="email" placeholder="Email profissional" required /><select><option>Quero vender mais</option><option>Quero lancar campanha</option></select><button class="btn btn-primary" type="submit">Enviar</button><p data-form-output></p></form>
                    <details><summary>Quanto tempo leva?</summary><p>Uma primeira versao pode ser estruturada em poucos dias, dependendo de conteudo e integracoes.</p></details>
                    <details><summary>Funciona para qualquer setor?</summary><p>Sim, ajustando promessa, prova social e funil ao publico certo.</p></details>
                </div>`,
            afterRender: () => simpleFormSuccess("#landingForm", "Lead recebido. Em producao, isso iria para CRM e automacao.")
        },
        sales: {
            title: "Demo de Site de Vendas",
            kicker: "Oferta comercial",
            html: () => `
                <div class="sales-demo">
                    <section class="sales-hero"><span>ScaleKit Pro</span><h3>O kit de crescimento para times comerciais que vivem em planilhas.</h3><p>Templates, automacoes e painel de acompanhamento para organizar vendas em uma semana.</p><strong class="price">R$ 497</strong><button class="btn btn-primary" type="button">Comprar agora</button></section>
                    <div class="benefit-grid"><article>Pipeline pronto</article><article>Scripts de abordagem</article><article>Dashboard de metas</article><article>Automacoes de follow-up</article></div>
                    <section class="bonus-box"><h3>Bonus inclusos</h3><p>Checklist de implantacao, biblioteca de mensagens e treinamento gravado.</p></section>
                    <section class="guarantee-box"><strong>Garantia de 7 dias</strong><p>Se nao fizer sentido para sua operacao, voce pode cancelar dentro do prazo.</p></section>
                    <blockquote>"A equipe saiu de um fluxo confuso para uma rotina clara de venda." <span>Rafael, Diretor Comercial</span></blockquote>
                </div>`
        }
    };

    const catalogProducts = [
        { name: "Notebook Orion Pro", category: "tech", price: 7490, color: "linear-gradient(135deg,#77d9ff,#1c9ed1)" },
        { name: "Mesa Executive Dock", category: "office", price: 1290, color: "linear-gradient(135deg,#d7c29a,#7f6241)" },
        { name: "Headset Focus Air", category: "tech", price: 690, color: "linear-gradient(135deg,#9df0c8,#22a876)" },
        { name: "Cadeira Grid One", category: "office", price: 1890, color: "linear-gradient(135deg,#f2f5ff,#9ca8bc)" },
        { name: "Kit Energia Solar", category: "home", price: 3490, color: "linear-gradient(135deg,#f8d36b,#ef7d4a)" },
        { name: "Luminaria Halo", category: "home", price: 340, color: "linear-gradient(135deg,#f8fbff,#78d8ff)" }
    ];

    const menuItems = [
        { name: "Risoto de limao siciliano", category: "principais", price: 54.9, desc: "Arroz arboreo, parmesao e azeite verde.", color: "linear-gradient(135deg,#f7d488,#8fbf8b)" },
        { name: "Burger brisket premium", category: "principais", price: 48.5, desc: "Blend da casa, cheddar e molho defumado.", color: "linear-gradient(135deg,#d88457,#5b2f24)" },
        { name: "Tiramisu espresso", category: "sobremesas", price: 27.9, desc: "Creme mascarpone, cafe e cacau.", color: "linear-gradient(135deg,#c7a17a,#5a3a2a)" },
        { name: "Cheesecake frutas vermelhas", category: "sobremesas", price: 29.9, desc: "Base crocante e calda artesanal.", color: "linear-gradient(135deg,#f2a2be,#7d2445)" },
        { name: "Spritz tropical", category: "bebidas", price: 31.5, desc: "Drink refrescante com toque citrico.", color: "linear-gradient(135deg,#f8c85f,#37b4e6)" },
        { name: "Cha gelado da casa", category: "bebidas", price: 16.9, desc: "Infusao de frutas, hortela e limao.", color: "linear-gradient(135deg,#b7e8c5,#5ba36f)" }
    ];

    const renderCatalog = (category = "all", query = "") => {
        const filtered = catalogProducts.filter((item) =>
            (category === "all" || item.category === category) &&
            (!query || item.name.toLowerCase().includes(query.toLowerCase()))
        );
        return `
            <div class="catalog-demo">
                <div class="catalog-controls"><input id="catalogSearch" placeholder="Buscar produto..." value="${escapeHtml(query)}" /><div class="segmented">${["all", "tech", "office", "home"].map((cat) => `<button type="button" class="${category === cat ? "is-active" : ""}" data-catalog-category="${cat}">${cat}</button>`).join("")}</div></div>
                <div class="product-grid-demo">${filtered.map((item) => `<article><div class="product-art" style="background:${item.color}"></div><h3>${item.name}</h3><span>${item.category}</span><strong>${money(item.price)}</strong><button class="btn btn-outline" type="button">Tenho interesse</button></article>`).join("") || "<p class='empty-state'>Nenhum produto encontrado.</p>"}</div>
            </div>`;
    };

    const bindCatalog = (category = "all", query = "") => {
        const refresh = (nextCategory = category, nextQuery = query) => setModal("Demo de Catalogo Digital", "Catalogo comercial", renderCatalog(nextCategory, nextQuery), () => bindCatalog(nextCategory, nextQuery));
        document.getElementById("catalogSearch")?.addEventListener("input", (event) => refresh(category, event.target.value));
        modalBody?.querySelectorAll("[data-catalog-category]").forEach((button) => button.addEventListener("click", () => refresh(button.getAttribute("data-catalog-category") || "all", query)));
    };

    const menuState = { category: "principais", cart: [] };
    const renderMenu = () => {
        const filtered = menuItems.filter((item) => item.category === menuState.category);
        const total = menuState.cart.reduce((sum, item) => sum + item.price, 0);
        return `
            <div class="menu-demo">
                <aside class="menu-sidebar"><strong>Bistro Aurora</strong><p>Cardapio digital elegante, rapido e pronto para mobile.</p><div class="segmented vertical">${["principais", "sobremesas", "bebidas"].map((cat) => `<button type="button" class="${menuState.category === cat ? "is-active" : ""}" data-menu-category="${cat}">${cat}</button>`).join("")}</div></aside>
                <section class="menu-list">${filtered.map((item, index) => `<article><div class="food-art" style="background:${item.color}"></div><div><h3>${item.name}</h3><p>${item.desc}</p><strong>${money(item.price)}</strong></div><button class="btn btn-outline" type="button" data-add-menu="${menuItems.indexOf(item)}">Adicionar</button></article>`).join("")}</section>
                <aside class="cart-box"><h3>Pedido</h3>${menuState.cart.map((item) => `<p>${item.name}<strong>${money(item.price)}</strong></p>`).join("") || "<span class='empty-state'>Carrinho vazio.</span>"}<div class="cart-total"><span>Total</span><strong>${money(total)}</strong></div></aside>
            </div>`;
    };

    const bindMenu = () => {
        const refresh = () => setModal("Demo de Cardapio Digital", "Restaurante", renderMenu(), bindMenu);
        modalBody?.querySelectorAll("[data-menu-category]").forEach((button) => button.addEventListener("click", () => {
            menuState.category = button.getAttribute("data-menu-category") || "principais";
            refresh();
        }));
        modalBody?.querySelectorAll("[data-add-menu]").forEach((button) => button.addEventListener("click", () => {
            const index = Number(button.getAttribute("data-add-menu") || 0);
            menuState.cart.push(menuItems[index]);
            refresh();
        }));
    };

    function openDemo(key) {
        if (key === "cashflow") {
            setModal("Aplicativo de Fluxo de Caixa", "SaaS financeiro", renderCashflow(), bindCashflow);
            return;
        }
        if (key === "catalog") {
            setModal("Demo de Catalogo Digital", "Catalogo comercial", renderCatalog(), () => bindCatalog());
            return;
        }
        if (key === "menu") {
            setModal("Demo de Cardapio Digital", "Restaurante", renderMenu(), bindMenu);
            return;
        }
        const demo = demos[key];
        if (!demo) return;
        setModal(demo.title, demo.kicker, demo.html(), demo.afterRender);
    }
})();
