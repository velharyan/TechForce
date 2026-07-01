(function () {
    "use strict";

    const data = window.TechForceDemoData || {};
    const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const escapeHtml = (value) => String(value || "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

    const modal = document.getElementById("demoModal");
    const panel = modal?.querySelector(".demo-modal-panel");
    const modalTitle = document.getElementById("demoModalTitle");
    const modalKicker = document.getElementById("demoModalKicker");
    const modalBody = document.getElementById("demoModalBody");
    const search = document.getElementById("demoSearch");
    const empty = document.getElementById("demoEmpty");
    const cards = Array.from(document.querySelectorAll("[data-demo-card]"));
    const filters = Array.from(document.querySelectorAll("[data-demo-filter]"));
    let activeFilter = "all";
    let lastTrigger = null;

    const focusableSelector = "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";

    const setModal = (title, kicker, html, afterRender) => {
        if (!modal || !panel || !modalTitle || !modalKicker || !modalBody) return;
        modalTitle.textContent = title;
        modalKicker.textContent = kicker;
        modalBody.innerHTML = html;
        modal.hidden = false;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        afterRender?.();
        requestAnimationFrame(() => {
            const close = modal.querySelector("[data-close-demo]");
            if (close instanceof HTMLElement) close.focus();
            else panel.focus();
        });
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        window.setTimeout(() => {
            if (!modal.classList.contains("is-open")) modal.hidden = true;
        }, 180);
        if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
    };

    const applyFilters = () => {
        const query = (search?.value || "").trim().toLowerCase();
        let visibleCount = 0;
        cards.forEach((card) => {
            const category = card.getAttribute("data-category") || "";
            const keywords = card.getAttribute("data-keywords") || "";
            const title = card.textContent || "";
            const matchesCategory = activeFilter === "all" || activeFilter === category;
            const matchesQuery = !query || `${keywords} ${title}`.toLowerCase().includes(query);
            const visible = matchesCategory && matchesQuery;
            card.hidden = !visible;
            if (visible) visibleCount++;
        });
        if (empty) empty.hidden = visibleCount > 0;
    };

    search?.addEventListener("input", applyFilters);
    filters.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.getAttribute("data-demo-filter") || "all";
            filters.forEach((item) => item.classList.toggle("is-active", item === button));
            applyFilters();
        });
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const openButton = target.closest("[data-open-demo]");
        if (openButton instanceof HTMLElement) {
            lastTrigger = openButton;
            openDemo(openButton.getAttribute("data-open-demo") || "");
            return;
        }
        if (target.closest("[data-close-demo]")) closeModal();
    });

    document.addEventListener("keydown", (event) => {
        if (!modal || modal.hidden) return;
        if (event.key === "Escape") { closeModal(); return; }
        if (event.key !== "Tab" || !panel) return;
        const focusables = Array.from(panel.querySelectorAll(focusableSelector)).filter((item) => item instanceof HTMLElement);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    /* ============ CASHFLOW DEMO ============ */
    const cashState = {
        type: "all", month: "all",
        transactions: (data.cashflow?.transactions || []).map((item) => ({ ...item }))
    };
    const cashMonths = () => Array.from(new Set(cashState.transactions.map((item) => item.date.slice(0, 7)))).sort();
    const visibleCash = () => cashState.transactions
        .filter((item) => cashState.type === "all" || item.type === cashState.type)
        .filter((item) => cashState.month === "all" || item.date.startsWith(cashState.month))
        .sort((a, b) => b.date.localeCompare(a.date));

    const summarizeCash = (items) => {
        const income = items.filter((i) => i.type === "entrada").reduce((s, i) => s + i.amount, 0);
        const outcome = items.filter((i) => i.type === "saida").reduce((s, i) => s + i.amount, 0);
        return { income, outcome, balance: income - outcome, margin: income > 0 ? Math.round(((income - outcome) / income) * 100) : 0 };
    };

    const renderCashEvolution = (items) => {
        const months = cashMonths();
        const grouped = months.map((month) => {
            const monthItems = cashState.transactions.filter((t) => t.date.startsWith(month));
            return { month, ...summarizeCash(monthItems) };
        });
        const max = Math.max(...grouped.flatMap((g) => [g.income, g.outcome]), 1);
        if (grouped.length === 0) return "<p class='empty-state'>Nenhum dado disponível para o período.</p>";

        return `<section class="cash-chart cash-chart-split" aria-label="Evolução mensal">
            ${grouped.map((g) => `<div class="cash-chart-month" style="height:260px">
                <span>${g.month.slice(5)}</span>
                <i class="entrada" style="height:${Math.max(12, Math.round((g.income / max) * 100))}%"></i>
                <i class="saida" style="height:${Math.max(12, Math.round((g.outcome / max) * 100))}%"></i>
            </div>`).join("")}
        </section>`;
    };

    const renderCategoryChart = (items) => {
        const totals = new Map();
        items.forEach((item) => totals.set(item.category, (totals.get(item.category) || 0) + item.amount));
        const rows = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
        const max = Math.max(...rows.map((r) => r[1]), 1);
        if (rows.length === 0) return "<p class='empty-state'>Nenhuma categoria com movimento.</p>";

        return `<section class="category-chart"><h3>Movimento por categoria</h3>
            ${rows.map(([cat, total]) => `<div class="category-row">
                <span>${escapeHtml(cat)}</span>
                <div><i style="width:${Math.max(8, Math.round((total / max) * 100))}%"></i></div>
                <strong>${money(total)}</strong>
            </div>`).join("")}
        </section>`;
    };

    const renderCashflow = () => {
        const items = visibleCash();
        const summary = summarizeCash(items);
        const months = cashMonths();

        return `<div class="cash-app">
            <div class="cash-toolbar">
                <div>
                    <strong style="font-size:1.2rem">Pulse Finance</strong>
                    <span style="display:block;color:var(--muted)">Visão executiva com dados locais</span>
                </div>
                <div class="cash-filter-row">
                    <div class="segmented" aria-label="Filtrar por tipo">
                        ${["all","entrada","saida"].map((t) => `<button type="button" class="${cashState.type===t?"is-active":""}" data-cash-type="${t}">${t==="all"?"Todas":t}</button>`).join("")}
                    </div>
                    <label class="sr-only" for="cashMonth">Filtrar por mês</label>
                    <select id="cashMonth" data-cash-month>
                        <option value="all">Todos os meses</option>
                        ${months.map((m) => `<option value="${m}" ${cashState.month===m?"selected":""}>${m.split("-").reverse().join("/")}</option>`).join("")}
                    </select>
                </div>
            </div>

            <div class="cash-kpis">
                <article><span>Saldo atual</span><strong class="${summary.balance<0?"is-danger":""}">${money(summary.balance)}</strong></article>
                <article><span>Entradas</span><strong>${money(summary.income)}</strong></article>
                <article><span>Saídas</span><strong>${money(summary.outcome)}</strong></article>
                <article><span>Margem</span><strong class="${summary.margin<0?"is-danger":""}">${summary.margin}%</strong></article>
            </div>

            <div class="cash-layout">
                <div class="cash-analytics">
                    ${renderCashEvolution(items)}
                    ${renderCategoryChart(items)}
                </div>
                <form class="cash-form" id="cashForm">
                    <h3>Nova transação</h3>
                    <label>Descrição<input name="name" placeholder="Ex: Novo contrato" maxlength="42" required /></label>
                    <label>Valor (R$)<input name="amount" type="number" min="1" step="100" placeholder="12000" required /></label>
                    <label>Data<input name="date" type="date" value="2026-06-25" required /></label>
                    <label>Tipo<select name="type"><option value="entrada">Entrada</option><option value="saida">Saída</option></select></label>
                    <label>Categoria<select name="category">${(data.cashflow?.categories||[]).map((c)=>`<option>${escapeHtml(c)}</option>`).join("")}</select></label>
                    <button class="btn btn-primary" type="submit">Adicionar</button>
                    <p class="form-feedback" data-cash-feedback aria-live="polite"></p>
                </form>
            </div>

            <div class="table-scroll">
                <table class="module-table">
                    <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th></tr></thead>
                    <tbody>${items.length ? items.map((i)=>`<tr><td>${i.date}</td><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.category)}</td><td><span class="pill ${i.type}">${i.type==="entrada"?"Entrada":"Saída"}</span></td><td>${money(i.amount)}</td></tr>`).join("") : `<tr><td colspan="5"><span class="empty-state">Nenhuma transação encontrada.</span></td></tr>`}</tbody>
                </table>
            </div>
        </div>`;
    };

    const bindCashflow = () => {
        const refresh = () => setModal("Fluxo de Caixa", "SaaS financeiro", renderCashflow(), bindCashflow);
        modalBody?.querySelectorAll("[data-cash-type]").forEach((btn) => {
            btn.addEventListener("click", () => { cashState.type = btn.getAttribute("data-cash-type")||"all"; refresh(); });
        });
        modalBody?.querySelector("[data-cash-month]")?.addEventListener("change", (e) => {
            const el = e.target;
            if (el instanceof HTMLSelectElement) { cashState.month = el.value; refresh(); }
        });
        document.getElementById("cashForm")?.addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (!(form instanceof HTMLFormElement)) return;
            const fd = new FormData(form);
            const amount = Number(fd.get("amount")||0);
            if (!amount) return;
            cashState.transactions.unshift({
                id: Date.now(), date: String(fd.get("date")||"2026-06-25"),
                name: String(fd.get("name")||"Nova transação"),
                type: String(fd.get("type")||"entrada"),
                category: String(fd.get("category")||"Operação"), amount
            });
            cashState.month = "all";
            refresh();
        });
    };

    /* ============ INSTITUTIONAL DEMO ============ */
    const renderInstitutional = () => `<div class="mini-site">
        <nav class="mini-nav" aria-label="Navegação">
            <a href="#mini-services">Serviços</a>
            <a href="#mini-about">Sobre</a>
            <a href="#mini-proof">Resultados</a>
            <a href="#mini-cta">Contato</a>
        </nav>
        <section class="mini-hero">
            <div>
                <span style="color:var(--brand);font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.06em">NovaHaus Consulting</span>
                <h3>Consultoria operacional para empresas que precisam crescer com controle.</h3>
                <p>Processos, dados e tecnologia para lideranças que buscam previsibilidade sem perder velocidade comercial.</p>
                <button class="btn btn-primary" type="button">Agendar conversa</button>
            </div>
        </section>
        <section id="mini-services" class="mini-services">
            <article><strong>Estratégia</strong><p>Diagnóstico, priorização e plano executivo por impacto real.</p></article>
            <article><strong>Operação</strong><p>Rotinas, SLAs, indicadores e governança de processos.</p></article>
            <article><strong>Tecnologia</strong><p>Automação, BI e integrações conectando áreas críticas.</p></article>
        </section>
        <section id="mini-about" class="mini-about"><h3>Sobre a NovaHaus</h3><p>Uma marca fictícia com posicionamento premium, prova de autoridade, leitura escaneável e CTAs claros para conversão B2B.</p></section>
        <section id="mini-proof" class="proof-row">
            <span><strong>42%</strong> menos retrabalho</span>
            <span><strong>18 dias</strong> até primeiro ganho</span>
            <span><strong>96%</strong> SLA no prazo</span>
        </section>
        <section class="mini-testimonials"><blockquote style="margin:0;font-style:italic">"O projeto trouxe clareza para decidir e velocidade para executar."</blockquote><span style="display:block;margin-top:8px;color:var(--muted)">Marina Costa, COO</span></section>
        <section id="mini-cta" class="mini-cta"><strong>Pronto para organizar sua operação?</strong><button class="btn btn-outline" type="button">Solicitar proposta</button></section>
    </div>`;

    /* ============ LANDING DEMO ============ */
    const renderLanding = () => `<div class="landing-demo">
        <section class="landing-hero">
            <span style="color:var(--brand);font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.06em">LeadOps Sprint</span>
            <h3>Transforme tráfego pago em leads qualificados em 14 dias.</h3>
            <p>Página, formulário, CRM e automação conectados para campanhas que precisam de resposta rápida e mensurável.</p>
            <button class="btn btn-primary" type="button">Quero captar leads</button>
        </section>
        <section class="proof-row">
            <span><strong>+2.4k</strong> leads gerados</span>
            <span><strong>4.8/5</strong> satisfação</span>
            <span><strong>7 dias</strong> para setup</span>
        </section>
        <section class="pain-solution">
            <article><strong>Dor</strong><p>Campanhas levam usuários para páginas lentas, genéricas e sem rastreio confiável.</p></article>
            <article><strong>Solução</strong><p>Landing com oferta clara, prova social, CRM e automação de follow-up.</p></article>
            <article><strong>Benefício</strong><p>Leads chegam qualificados, com origem, prioridade e próximo passo definidos.</p></article>
        </section>
        <section class="benefit-grid">
            <article>Hero com promessa objetiva</article>
            <article>Prova social acima da dobra</article>
            <article>Formulário curto e validado</article>
            <article>FAQ para reduzir objeções</article>
        </section>
        <form class="demo-form" id="landingForm" novalidate>
            <h3>Receber diagnóstico gratuito</h3>
            <label>Nome<input name="name" required placeholder="Seu nome" /></label>
            <label>E-mail profissional<input name="email" type="email" required placeholder="voce@empresa.com" /></label>
            <label>Objetivo<select name="goal" required><option value="">Selecione</option><option>Vender mais</option><option>Lançar campanha</option><option>Qualificar leads</option></select></label>
            <button class="btn btn-primary" type="submit">Enviar briefing</button>
            <p class="form-feedback" data-form-output aria-live="polite"></p>
        </form>
        <details><summary>Quanto tempo leva?</summary><p>Uma primeira versão pode ser estruturada em poucos dias, dependendo de conteúdo e integrações.</p></details>
        <details><summary>Funciona para qualquer setor?</summary><p>Sim, desde que promessa, prova social e funil sejam ajustados ao público certo.</p></details>
    </div>`;

    /* ============ SALES DEMO ============ */
    const renderSales = () => `<div class="sales-demo">
        <section class="sales-hero">
            <span style="color:var(--brand);font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.06em">ScaleKit Pro</span>
            <h3>O kit de crescimento para times comerciais que vivem em planilhas.</h3>
            <p>Templates, automações e painel de acompanhamento para organizar vendas em uma semana.</p>
            <strong class="price">R$ 497</strong>
            <button class="btn btn-primary" type="button" data-sales-cta>Comprar agora</button>
            <p class="form-feedback" data-sales-output aria-live="polite"></p>
        </section>
        <section class="benefit-grid">
            <article>Pipeline pronto</article>
            <article>Scripts de abordagem</article>
            <article>Dashboard de metas</article>
            <article>Follow-up automático</article>
        </section>
        <section class="pain-solution">
            <article><strong>Para quem é</strong><p>Times que já vendem, mas perdem oportunidades por falta de rotina e previsibilidade.</p></article>
            <article><strong>Comparação</strong><p>Planilha entrega registro. O ScaleKit entrega cadência, prioridade e leitura de performance.</p></article>
            <article><strong>Resultado</strong><p>Menos esquecimento, mais follow-up e pipeline mais claro para liderança.</p></article>
        </section>
        <section class="bonus-box"><h3>Bônus inclusos</h3><p>Checklist de implantação, biblioteca de mensagens, treinamento gravado e painel de acompanhamento.</p></section>
        <section class="guarantee-box"><strong>Garantia de 7 dias</strong><p>Se não fizer sentido para sua operação, você pode cancelar dentro do prazo.</p></section>
        <blockquote>"A equipe saiu de um fluxo confuso para uma rotina clara de venda." <span>Rafael, Diretor Comercial</span></blockquote>
        <details><summary>Preciso de equipe técnica?</summary><p>Não. A proposta fictícia simula uma oferta pronta para implantação assistida.</p></details>
    </div>`;

    const bindSales = () => {
        modalBody?.querySelector("[data-sales-cta]")?.addEventListener("click", () => {
            const output = modalBody.querySelector("[data-sales-output]");
            if (output) output.textContent = "Checkout simulado iniciado. Em produção, este CTA abriria pagamento ou contato comercial.";
        });
    };

    /* ============ CATALOG DEMO ============ */
    const catalogState = { category: "all", query: "", interested: "" };
    const renderCatalog = () => {
        const products = data.catalog?.products || [];
        const categories = data.catalog?.categories || [];
        const filtered = products.filter((p) =>
            (catalogState.category === "all" || p.category === catalogState.category) &&
            (!catalogState.query || p.name.toLowerCase().includes(catalogState.query.toLowerCase()))
        );

        return `<div class="catalog-demo">
            <div class="catalog-controls">
                <label class="sr-only" for="catalogSearch">Buscar no catálogo</label>
                <input id="catalogSearch" placeholder="Buscar produto..." value="${escapeHtml(catalogState.query)}" />
                <div class="segmented" aria-label="Categorias">
                    ${categories.map((c) => `<button type="button" class="${catalogState.category===c.id?"is-active":""}" data-catalog-category="${c.id}">${c.label}</button>`).join("")}
                </div>
            </div>
            <div class="product-grid-demo">
                ${filtered.length ? filtered.map((p) => `<article>
                    <div class="product-art" style="background:${p.color}" role="img" aria-label="${escapeHtml(p.name)}"></div>
                    <span class="catalog-badge">${escapeHtml(p.tag)}</span>
                    <h3>${escapeHtml(p.name)}</h3>
                    <p>${escapeHtml(p.description)}</p>
                    <strong>${money(p.price)}</strong>
                    <button class="btn btn-outline" type="button" data-catalog-interest="${p.id}">Tenho interesse</button>
                </article>`).join("") : "<p class='empty-state'>Nenhum produto encontrado.</p>"}
            </div>
            <p class="form-feedback" aria-live="polite">${catalogState.interested ? escapeHtml(catalogState.interested) : ""}</p>
        </div>`;
    };

    const bindCatalog = () => {
        const refresh = () => setModal("Catálogo Digital", "Vitrine de produtos", renderCatalog(), bindCatalog);
        document.getElementById("catalogSearch")?.addEventListener("input", (e) => {
            const el = e.target;
            if (el instanceof HTMLInputElement) { catalogState.query = el.value; refresh(); }
        });
        modalBody?.querySelectorAll("[data-catalog-category]").forEach((btn) => {
            btn.addEventListener("click", () => { catalogState.category = btn.getAttribute("data-catalog-category")||"all"; refresh(); });
        });
        modalBody?.querySelectorAll("[data-catalog-interest]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-catalog-interest");
                const product = (data.catalog?.products||[]).find((p) => p.id === id);
                catalogState.interested = product ? `Interesse registrado em ${product.name}.` : "";
                refresh();
            });
        });
    };

    /* ============ MENU DEMO ============ */
    const menuState = { category: "all", query: "", cart: [] };
    const cartItem = (id) => menuState.cart.find((c) => c.id === id);
    const menuItemById = (id) => (data.menu?.items||[]).find((i) => i.id === id);
    const cartTotal = () => menuState.cart.reduce((s, c) => { const p = menuItemById(c.id); return s + (p ? p.price * c.qty : 0); }, 0);

    const renderMenu = () => {
        const items = data.menu?.items || [];
        const categories = data.menu?.categories || [];
        const filtered = items.filter((i) =>
            (menuState.category === "all" || i.category === menuState.category) &&
            (!menuState.query || `${i.name} ${i.description}`.toLowerCase().includes(menuState.query.toLowerCase()))
        );

        return `<div class="menu-demo">
            <aside class="menu-sidebar">
                <strong style="font-size:1.15rem">Bistro Aurora</strong>
                <p style="color:var(--muted)">Cardápio digital mobile-first para restaurantes.</p>
                <label class="sr-only" for="menuSearch">Buscar no cardápio</label>
                <input id="menuSearch" placeholder="Buscar prato..." value="${escapeHtml(menuState.query)}" />
                <div class="segmented vertical" aria-label="Categorias">
                    ${categories.map((c) => `<button type="button" class="${menuState.category===c.id?"is-active":""}" data-menu-category="${c.id}">${c.label}</button>`).join("")}
                </div>
            </aside>
            <section class="menu-list">
                ${filtered.length ? filtered.map((i) => `<article>
                    <div class="food-art" style="background:${i.color}" role="img" aria-label="${escapeHtml(i.name)}"></div>
                    <div><h3>${escapeHtml(i.name)}</h3><p>${escapeHtml(i.description)}</p><strong>${money(i.price)}</strong></div>
                    <button class="btn btn-outline" type="button" data-add-menu="${i.id}">Adicionar</button>
                </article>`).join("") : "<p class='empty-state'>Nenhum item encontrado.</p>"}
            </section>
            <aside class="cart-box">
                <h3>Pedido</h3>
                <div class="cart-items">${menuState.cart.length ? menuState.cart.map((c) => {
                    const item = menuItemById(c.id);
                    if (!item) return "";
                    return `<div class="cart-line">
                        <div><strong>${escapeHtml(item.name)}</strong><span>${money(item.price)} un.</span></div>
                        <div class="cart-actions">
                            <button type="button" data-cart-dec="${item.id}" aria-label="Diminuir ${escapeHtml(item.name)}">-</button>
                            <span>${c.qty}</span>
                            <button type="button" data-cart-inc="${item.id}" aria-label="Aumentar ${escapeHtml(item.name)}">+</button>
                            <button type="button" data-cart-remove="${item.id}" aria-label="Remover ${escapeHtml(item.name)}">&times;</button>
                        </div>
                    </div>`;
                }).join("") : "<span class='empty-state'>Carrinho vazio.</span>"}</div>
                <div class="cart-total"><span>Total</span><strong>${money(cartTotal())}</strong></div>
                <button class="btn btn-primary btn-block" type="button" ${menuState.cart.length?"":"disabled"}>Enviar pedido</button>
            </aside>
        </div>`;
    };

    const bindMenu = () => {
        const refresh = () => setModal("Cardápio Digital", "Restaurante", renderMenu(), bindMenu);
        document.getElementById("menuSearch")?.addEventListener("input", (e) => {
            const el = e.target;
            if (el instanceof HTMLInputElement) { menuState.query = el.value; refresh(); }
        });
        modalBody?.querySelectorAll("[data-menu-category]").forEach((btn) => {
            btn.addEventListener("click", () => { menuState.category = btn.getAttribute("data-menu-category")||"all"; refresh(); });
        });
        modalBody?.querySelectorAll("[data-add-menu]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-add-menu")||"";
                const cur = cartItem(id);
                if (cur) cur.qty += 1; else menuState.cart.push({ id, qty: 1 });
                refresh();
            });
        });
        modalBody?.querySelectorAll("[data-cart-inc]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const cur = cartItem(btn.getAttribute("data-cart-inc")||"");
                if (cur) cur.qty += 1;
                refresh();
            });
        });
        modalBody?.querySelectorAll("[data-cart-dec]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-cart-dec")||"";
                const cur = cartItem(id);
                if (cur) cur.qty -= 1;
                menuState.cart = menuState.cart.filter((c) => c.qty > 0);
                refresh();
            });
        });
        modalBody?.querySelectorAll("[data-cart-remove]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-cart-remove")||"";
                menuState.cart = menuState.cart.filter((c) => c.id !== id);
                refresh();
            });
        });
    };

    /* ============ FORM HELPERS ============ */
    const bindFormSuccess = (formId, message) => {
        const form = document.getElementById(formId);
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!(form instanceof HTMLFormElement)) return;
            const output = form.querySelector("[data-form-output]");
            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                if (output) output.textContent = "Revise os campos destacados para continuar.";
                return;
            }
            form.classList.remove("was-validated");
            if (output) output.textContent = message;
            form.reset();
        });
    };

    /* ============ DEMO DISPATCHER ============ */
    function openDemo(key) {
        const demos = {
            cashflow: () => setModal("Fluxo de Caixa", "SaaS financeiro", renderCashflow(), bindCashflow),
            institutional: () => setModal("Site Institucional", "Website premium", renderInstitutional()),
            landing: () => setModal("Landing Page", "Alta conversão", renderLanding(), () => bindFormSuccess("landingForm", "Lead recebido! Em produção, isso iria para CRM e automação.")),
            sales: () => setModal("Site de Vendas", "Oferta comercial", renderSales(), bindSales),
            catalog: () => setModal("Catálogo Digital", "Vitrine de produtos", renderCatalog(), bindCatalog),
            menu: () => setModal("Cardápio Digital", "Restaurante", renderMenu(), bindMenu)
        };
        demos[key]?.();
    }
})();