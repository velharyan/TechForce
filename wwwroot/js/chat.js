(function () {
    "use strict";

    const panel = document.getElementById("chatPanel");
    const closeBtn = document.getElementById("chatClose");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");
    const openButtons = Array.from(document.querySelectorAll("[data-open-chat], #chatWidget"));

    const pageForm = document.getElementById("chatFormPage");
    const pageInput = document.getElementById("chatInputPage");
    const pageMessages = document.getElementById("chatMessagesPage");

    const lead = {
        name: "",
        phone: "",
        project: "",
        budget: "",
        urgency: ""
    };

    const quickReplies = [
        "Quero vender mais pelo site",
        "Preciso de um sistema sob medida",
        "Quero automatizar atendimento",
        "Tenho restaurante e quero cardapio digital"
    ];

    const normalize = (value) =>
        (value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const detectLeadFields = (text) => {
        const clean = text.trim();
        const normalized = normalize(clean);
        const phone = clean.match(/(\+?\d[\d\s().-]{8,}\d)/);
        if (phone) lead.phone = phone[1].trim();

        const nameMatch = clean.match(/(?:me chamo|meu nome e|sou o|sou a|aqui e)\s+([a-zA-ZÀ-ÿ\s]{2,40})/i);
        if (nameMatch) lead.name = nameMatch[1].trim();

        if (/site|landing|catalogo|cardapio|sistema|software|app|automacao|chatbot|dashboard/.test(normalized)) {
            lead.project = clean;
        }

        const budgetMatch = normalized.match(/(?:r\$|budget|orcamento|investimento|ate|entre)\s*([\d.,k mil]+)/);
        if (budgetMatch) lead.budget = budgetMatch[0];

        if (/urgente|essa semana|imediato|rapido|30 dias|mes que vem|sem pressa/.test(normalized)) {
            lead.urgency = clean;
        }
    };

    const missingLeadQuestion = () => {
        if (!lead.name) return "Para eu qualificar melhor: qual e seu nome?";
        if (!lead.phone) return "Qual telefone ou WhatsApp o time pode usar para continuar o atendimento?";
        if (!lead.project) return "Que tipo de projeto voce quer: site, sistema, automacao, catalogo, cardapio, chatbot ou algo sob medida?";
        if (!lead.budget) return "Voce ja tem uma faixa de investimento estimada? Pode ser aproximada.";
        if (!lead.urgency) return "E qual a urgencia: imediato, este mes ou sem pressa?";
        return "";
    };

    const localAnswer = (text) => {
        detectLeadFields(text);
        const message = normalize(text);
        const signals = [];

        if (/site|institucional|pagina|seo|autoridade/.test(message)) {
            signals.push("site institucional premium com narrativa comercial, SEO tecnico, performance mobile e CTA de proposta");
        }
        if (/landing|campanha|lead|conversao|trafego|anuncio/.test(message)) {
            signals.push("landing page de alta conversao conectada a CRM, analytics e automacao de follow-up");
        }
        if (/sistema|software|saas|erp|crm|gestao|dashboard|financeiro/.test(message)) {
            signals.push("sistema sob medida com dashboard, regras de negocio, permissoes e indicadores executivos");
        }
        if (/automacao|automatizar|manual|planilha|retrabalho|whatsapp|atendimento/.test(message)) {
            signals.push("automacao de atendimento e backoffice para reduzir tarefas manuais e acelerar resposta");
        }
        if (/catalogo|produto|vitrine/.test(message)) {
            signals.push("catalogo digital com busca, filtros, produtos, precos e chamada direta para venda");
        }
        if (/cardapio|restaurante|pedido|delivery|mesa/.test(message)) {
            signals.push("cardapio digital responsivo com categorias, carrinho simples e fluxo pronto para WhatsApp");
        }
        if (/chatbot|bot|ia|assistente/.test(message)) {
            signals.push("chatbot comercial com base de conhecimento, coleta de lead e preparo para integracao futura com IA");
        }

        if (signals.length === 0) {
            signals.push("diagnostico rapido para escolher entre site, sistema, automacao, chatbot ou produto digital sob medida");
        }

        const parts = [
            "Entendi. Minha recomendacao inicial e " + signals.slice(0, 2).join(" + ") + "."
        ];

        if (/preco|valor|custo|orcamento|investimento/.test(message)) {
            parts.push("Para investimento, o ideal e separar em fases: primeira entrega com impacto comercial e evolucao por sprint.");
        }

        if (/prazo|tempo|quando|entrega|urgente/.test(message)) {
            parts.push("Para prazo, uma primeira versao costuma ficar entre 2 e 6 semanas, variando por integracoes e conteudo.");
        }

        const question = missingLeadQuestion();
        if (question) {
            parts.push(question);
        } else {
            parts.push(`Resumo do lead: ${lead.name}, ${lead.phone}, projeto informado, faixa ${lead.budget}, urgencia registrada. O proximo passo e transformar isso em proposta tecnica.`);
        }

        return parts.join(" ");
    };

    const requestAnswer = async (text) => {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            if (!response.ok) throw new Error("chat_api_error");
            const data = await response.json();
            if (data && typeof data.answer === "string" && data.answer.trim()) {
                detectLeadFields(text);
                const question = missingLeadQuestion();
                return question ? `${data.answer.trim()} ${question}` : data.answer.trim();
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
        sender.textContent = role === "bot" ? "Assistente comercial" : "Voce";

        const paragraph = document.createElement("p");
        paragraph.textContent = text;

        wrapper.append(sender, paragraph);
        container.appendChild(wrapper);
        container.scrollTop = container.scrollHeight;
    };

    const addTyping = (container) => {
        const typing = document.createElement("div");
        typing.className = "msg bot is-typing";
        const sender = document.createElement("span");
        sender.className = "sender";
        sender.textContent = "Assistente comercial";
        const paragraph = document.createElement("p");
        paragraph.textContent = "Analisando contexto...";
        typing.append(sender, paragraph);
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
        return typing;
    };

    const appendQuickReplies = (container, onSelect) => {
        if (!container || container.querySelector(".chat-options")) return;
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

    const seed = (container) => {
        if (!container || container.hasChildNodes()) return;
        addMessage(container, "bot", "Ola. Sou o assistente comercial da TechForce. Posso explicar servicos, sugerir uma solucao e coletar os dados essenciais para uma proposta.");
        appendQuickReplies(container, (label) => runDialog(container, label));
    };

    const openPanel = () => {
        if (!panel || !input || !messages) return;
        panel.classList.add("open");
        panel.setAttribute("aria-hidden", "false");
        seed(messages);
        window.setTimeout(() => input.focus(), 80);
    };

    const closePanel = () => {
        if (!panel) return;
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
    };

    openButtons.forEach((button) => button.addEventListener("click", openPanel));
    closeBtn?.addEventListener("click", closePanel);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closePanel();
    });

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!(input instanceof HTMLInputElement) || !messages) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = "";
        await runDialog(messages, text);
        input.focus();
    });

    if (pageForm && pageInput && pageMessages) {
        seed(pageMessages);
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
