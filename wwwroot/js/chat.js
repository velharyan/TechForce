(function () {
    "use strict";

    const widget = document.getElementById("chatWidget");
    const panel = document.getElementById("chatPanel");
    const closeBtn = document.getElementById("chatClose");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const pageForm = document.getElementById("chatFormPage");
    const pageInput = document.getElementById("chatInputPage");
    const pageMessages = document.getElementById("chatMessagesPage");

    const quickReplies = [
        "Quero vender mais pelo site",
        "Meu processo e muito manual",
        "Preciso integrar sistemas",
        "Quero um plano para empresa de grande porte"
    ];

    const normalize = (value) =>
        (value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const localAnswer = (text) => {
        const message = normalize(text);

        const score = (regex) => (message.match(regex) || []).length;
        const scoreSite = score(/site|landing|pagina|institucional|e-?commerce|conversao/g);
        const scoreSoftware = score(/software|sistema|plataforma|erp|crm|operacao|gestao/g);
        const scoreApp = score(/app|aplicativo|mobile|celular/g);
        const scoreApi = score(/api|integracao|integrar|dados|sincronizar/g);
        const scoreAutomation = score(/automacao|automatizar|workflow|bot|whatsapp|manual|retrabalho/g);
        const scoreDashboard = score(/dashboard|kpi|painel|relatorio|indicador/g);

        const askedBudget = /preco|valor|orcamento|investimento|custo/.test(message);
        const askedDeadline = /prazo|entrega|quando|tempo/.test(message);
        const smallBusiness = /pequeno|micro|local|iniciante/.test(message);
        const enterprise = /grande|corporativo|industria|empresa grande|escala/.test(message);
        const salesPain = /nao vendo|vender mais|sem cliente|poucos leads|baixa conversao/.test(message);
        const opsPain = /manual|planilha|retrabalho|erro|atraso|bagunca/.test(message);
        const visibilityPain = /nao enxergo|sem controle|sem indicador|sem painel/.test(message);

        const offerings = [
            { score: scoreSite, text: "site profissional com foco em conversao e performance mobile" },
            { score: scoreSoftware, text: "software sob medida para organizar processo e reduzir retrabalho" },
            { score: scoreApp, text: "app para operacao e atendimento em campo" },
            { score: scoreApi, text: "APIs e integracoes entre ERP, CRM e financeiro" },
            { score: scoreAutomation, text: "automacoes para atendimento e backoffice" },
            { score: scoreDashboard, text: "dashboard com indicadores em tempo real" }
        ]
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((x) => x.text);

        if (offerings.length === 0) {
            if (salesPain) offerings.push("site de alta conversao", "automacao comercial");
            else if (opsPain) offerings.push("software operacional", "automacao de rotinas");
            else if (visibilityPain) offerings.push("dashboard executivo", "integracao de dados");
            else offerings.push("sites, softwares, apps, APIs, automacoes e dashboards");
        }

        const parts = [];
        parts.push("Entendi. Conseguimos montar uma solucao profissional e objetiva para seu cenario.");

        if (smallBusiness && !enterprise) {
            parts.push("Para pequenos negocios, normalmente iniciamos com site de alta conversao, automacao comercial e painel simples.");
        } else if (enterprise) {
            parts.push("Para operacoes maiores, recomendamos arquitetura escalavel com APIs, governanca e roadmap continuo.");
        } else {
            parts.push("Podemos iniciar por um pacote enxuto e evoluir por sprint sem travar sua operacao.");
        }

        parts.push("Recomendacao inicial: " + offerings.join("; ") + ".");

        if (salesPain) parts.push("Pelo que voce descreveu, o ganho mais rapido esta em captacao e conversao de leads.");
        if (opsPain) parts.push("Tambem vejo ganho direto em reduzir tarefas manuais e padronizar o fluxo.");
        if (visibilityPain) parts.push("Com KPI em tempo real, fica muito mais facil decidir com seguranca.");
        if (askedBudget) parts.push("Sobre investimento: montamos proposta por fases para gerar retorno desde as primeiras entregas.");
        if (askedDeadline) parts.push("Sobre prazo: a primeira entrega costuma sair entre 2 e 6 semanas, conforme escopo.");

        parts.push("Se quiser, me diga seu objetivo em uma frase e eu te devolvo um plano inicial.");
        parts.push("Tambem posso te direcionar para /Company/Contact.");
        return parts.join(" ");
    };

    const requestAnswer = async (text) => {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            if (!response.ok) throw new Error("api_error");
            const data = await response.json();
            if (data && typeof data.answer === "string" && data.answer.trim().length > 0) {
                return data.answer.trim();
            }
            throw new Error("empty_answer");
        } catch (_error) {
            return localAnswer(text);
        }
    };

    const addMessage = (container, role, text) => {
        if (!container) return;

        const wrapper = document.createElement("div");
        wrapper.className = `msg ${role}`;

        const sender = document.createElement("span");
        sender.className = "sender";
        sender.textContent = role === "bot" ? "Assistente" : "Voce";

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        wrapper.appendChild(sender);
        wrapper.appendChild(paragraph);
        container.appendChild(wrapper);
        container.scrollTop = container.scrollHeight;
    };

    const addTyping = (container) => {
        const typing = document.createElement("div");
        typing.className = "msg bot";
        const sender = document.createElement("span");
        sender.className = "sender";
        sender.textContent = "Assistente";
        const paragraph = document.createElement("p");
        paragraph.textContent = "Digitando...";
        typing.appendChild(sender);
        typing.appendChild(paragraph);
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
        return typing;
    };

    const appendQuickReplies = (container, onSelect) => {
        if (!container) return;
        const options = document.createElement("div");
        options.className = "chat-options";
        quickReplies.forEach((label) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.addEventListener("click", () => onSelect(label));
            options.appendChild(button);
        });
        container.appendChild(options);
    };

    const runDialog = async (container, text) => {
        addMessage(container, "user", text);
        const typing = addTyping(container);
        const answer = await requestAnswer(text);
        typing.remove();
        addMessage(container, "bot", answer);
    };

    if (widget && panel && closeBtn && form && input && messages) {
        widget.addEventListener("click", () => {
            panel.classList.add("open");
            if (!messages.hasChildNodes()) {
                addMessage(messages, "bot", "Ola. Descreva seu objetivo e eu te mostro como podemos ajudar seu negocio.");
                appendQuickReplies(messages, (label) => {
                    runDialog(messages, label);
                });
            }
            input.focus();
        });

        closeBtn.addEventListener("click", () => panel.classList.remove("open"));

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            input.value = "";
            await runDialog(messages, text);
            input.focus();
        });
    }

    if (pageForm && pageInput && pageMessages) {
        if (!pageMessages.hasChildNodes()) {
            addMessage(pageMessages, "bot", "Ola. Me conte seu objetivo e eu te sugiro o melhor caminho de tecnologia.");
            appendQuickReplies(pageMessages, (label) => {
                runDialog(pageMessages, label);
            });
        }

        pageForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const text = pageInput.value.trim();
            if (!text) return;
            pageInput.value = "";
            await runDialog(pageMessages, text);
            pageInput.focus();
        });
    }
})();
