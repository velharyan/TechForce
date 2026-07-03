(function () {
    "use strict";

    const createMessageNode = (kind, content, isTyping) => {
        const message = document.createElement("div");
        message.className = `chat-message ${kind}`;
        if (isTyping) message.classList.add("chat-typing");

        const bubble = document.createElement("p");
        bubble.textContent = isTyping ? "" : content;
        message.appendChild(bubble);
        if (isTyping) {
            const typing = document.createElement("span");
            typing.className = "typing-dots";
            typing.setAttribute("aria-hidden", "true");
            typing.innerHTML = "<span></span><span></span><span></span>";
            const text = document.createElement("span");
            text.textContent = "Digitando";
            message.insertBefore(typing, bubble);
            message.insertBefore(text, bubble.nextSibling);
            const tiny = document.createElement("small");
            tiny.textContent = "assistente";
            message.appendChild(tiny);
        } else {
            const tiny = document.createElement("small");
            tiny.textContent = kind === "bot" ? "assistente" : "voce";
            message.appendChild(tiny);
        }

        return message;
    };

    const createEngine = (config) => {
        const context = {
            panelId: config.panelId,
            messages: config.messages,
            suggestions: config.suggestions,
            form: config.form,
            input: config.input,
            openButtons: config.openButtons,
            closeButton: config.closeButton,
            panel: config.panel,
            chatOpenClass: config.chatOpenClass || "open",
            isInline: Boolean(config.inline),
            leadChips: config.leadChips || [],
            lead: {
                name: "",
                sector: "",
                phone: "",
                goal: ""
            },
            step: 0,
            running: false,
            typingNode: null
        };

        const getLeadSelectors = () => {
            return context.leadChips.map((item) => ({
                key: item.key,
                selectors: Array.isArray(item.selectors) ? item.selectors : [item.selectors]
            }));
        };

        const setLeadChip = (key, value) => {
            const fallback = value || "pendente";
            getLeadSelectors().forEach((entry) => {
                if (entry.key !== key) return;
                entry.selectors.forEach((selector) => {
                    const nodes = context.panel ? context.panel.querySelectorAll(selector) : [];
                    Array.from(nodes).forEach((node) => {
                        node.textContent = node.textContent.includes(":") ? node.textContent.replace(/:.*/, `: ${fallback}`) : `${entry.key}: ${fallback}`;
                    });
                });
            });
        };

        const applyChips = () => {
            setLeadChip("name", context.lead.name || "pendente");
            setLeadChip("sector", context.lead.sector || "pendente");
            setLeadChip("phone", context.lead.phone || "pendente");
            setLeadChip("project", context.lead.goal || "pendente");
            setLeadChip("goal", context.lead.goal || "pendente");
        };

        const setPanelVisibility = (isOpen) => {
            if (!context.panel) return;

            if (context.isInline) {
                context.panel.removeAttribute("aria-hidden");
                context.panel.classList.remove(context.chatOpenClass);
                return;
            }

            if (isOpen) {
                context.panel.setAttribute("aria-hidden", "false");
                context.panel.classList.add(context.chatOpenClass);
                return;
            }

            context.panel.setAttribute("aria-hidden", "true");
            context.panel.classList.remove(context.chatOpenClass);
        };

        const ensureScroll = () => {
            if (!context.messages) return;
            context.messages.scrollTop = context.messages.scrollHeight;
        };

        const addMessage = (kind, text) => {
            if (!context.messages) return null;
            const node = createMessageNode(kind, text, false);
            context.messages.appendChild(node);
            ensureScroll();
            return node;
        };

        const startTyping = () => {
            if (!context.messages) return;
            if (context.typingNode) {
                context.typingNode.remove();
                context.typingNode = null;
            }
            context.typingNode = createMessageNode("bot", "", true);
            context.messages.appendChild(context.typingNode);
            ensureScroll();
        };

        const stopTyping = () => {
            if (!context.typingNode) return;
            context.typingNode.remove();
            context.typingNode = null;
        };

        const clearSuggestions = () => {
            if (context.suggestions) context.suggestions.innerHTML = "";
        };

        const addSuggestion = (label, action) => {
            if (!context.suggestions) return;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "chat-suggestion";
            button.textContent = label;
            button.setAttribute("data-chat-action", action.type || "none");
            if (action.value) button.setAttribute("data-chat-value", action.value);
            context.suggestions.appendChild(button);
        };

        const mapSectorToDemo = (sector) => {
            const value = (sector || "").toLowerCase();
            if (/(site|comercial|marketing|seo|campanha|landing)/.test(value)) return "/Products/Example/site";
            if (/(assistente|atendimento|suporte|ia|chat)/.test(value)) return "/Products/Example/ia";
            if (/(dashboard|dados|kpi|financeiro|metrica)/.test(value)) return "/Products/Example/dashboard";
            if (/(automacao|workflow|processo|rota)/.test(value)) return "/Products/Example/automation";
            if (/(app|mobile|operacao|campo)/.test(value)) return "/Products/Example/app";
            return "/Products/Example/erp-lite";
        };

        const openDemo = (url, label) => {
            window.dispatchEvent(new CustomEvent("techforce:open-demo", {
                detail: {
                    url,
                    title: label || "Demo",
                    kicker: "Demo premium",
                    device: "web"
                }
            }));
        };

        const pushFinalSuggestions = () => {
            clearSuggestions();
            addSuggestion("Quero ver uma demo agora", { type: "demo", value: mapSectorToDemo(context.lead.sector) });
            addSuggestion("Quero um diagnostico executivo", { type: "diagnostic" });
            addSuggestion("Quero falar com especialista", { type: "contact" });
            addSuggestion("Refazer conversa", { type: "restart" });
        };

        const askQuestion = (text, delay = 350) => {
            clearSuggestions();
            startTyping();
            setTimeout(() => {
                stopTyping();
                addMessage("bot", text);
                ensureScroll();
            }, delay);
        };

        const reset = () => {
            context.step = 0;
            context.running = false;
            context.lead = { name: "", sector: "", phone: "", goal: "" };
            if (context.messages) context.messages.innerHTML = "";
            if (context.suggestions) context.suggestions.innerHTML = "";
            start();
        };

        const processAction = (actionType, actionValue) => {
            if (actionType === "demo") {
                const url = actionValue || mapSectorToDemo(context.lead.sector || "");
                openDemo(url, `Demo de ${context.lead.sector || "setor"} no TechForce`);
                addMessage("user", "Quero ver a demo");
                askQuestion("Perfeito. A experiencia abriu em modal com visual real da plataforma.");
                return;
            }
            if (actionType === "diagnostic") {
                addMessage("user", "Quero um diagnostico executivo");
                startTyping();
                setTimeout(() => {
                    stopTyping();
                    addMessage("bot", "Excelente escolha. Em 24h retornamos com um plano de execucao, riscos e metas de impacto.");
                }, 900);
                return;
            }
            if (actionType === "contact") {
                addMessage("user", "Quero falar com especialista");
                addMessage("bot", "Acesso rapido: selecione o botao abaixo para abrir contato formal.");
                clearSuggestions();
                addSuggestion("Abrir contato", { type: "goto", value: "/Company/Contact" });
                return;
            }
            if (actionType === "goto") {
                if (actionValue) {
                    window.location.href = actionValue;
                }
                return;
            }
            if (actionType === "restart") {
                reset();
                return;
            }
        };

        const onSuggestionClick = (event) => {
            const actionNode = event.target.closest("[data-chat-action]");
            if (!actionNode) return;
            const actionType = actionNode.getAttribute("data-chat-action") || "";
            const actionValue = actionNode.getAttribute("data-chat-value") || "";
            processAction(actionType, actionValue);
        };

        const afterSector = () => {
            context.step = 2;
            context.running = true;
            setLeadChip("sector", context.lead.sector || "pendente");
            applyChips();
            addMessage("bot", `Perfeito, ${context.lead.name || "amigo"}. Vou montar uma rota para o setor ${context.lead.sector || "informado"}.`);
            startTyping();
            setTimeout(() => {
                stopTyping();
                addMessage("bot", "Aguarde alguns segundos enquanto valido a melhor experiência para você.");
                setTimeout(() => {
                    askQuestion("Agora me diga qual resultado você quer acelerar primeiro:");
                    setTimeout(() => {
                        pushFinalSuggestions();
                    }, 400);
                }, 300);
            }, 1000);
        };

        const onTextSubmit = (event) => {
            event.preventDefault();
            const value = (context.input?.value || "").trim();
            if (!value) return;

            context.input.value = "";
            addMessage("user", value);
            const normalized = value.toLowerCase();

            if (context.step === 0) {
                context.lead.name = value;
                setLeadChip("name", context.lead.name);
                context.step = 1;
                applyChips();
                askQuestion(`Prazer, ${context.lead.name}. Agora me diz em qual setor sua empresa esta focada hoje?`);
                return;
            }

            if (context.step === 1) {
                context.lead.sector = value;
                context.step = 2;
                applyChips();
                afterSector();
                return;
            }

            if (context.step >= 2 && context.running) {
                askQuestion("Toque em uma das opções abaixo para seguirmos:");
                setTimeout(pushFinalSuggestions, 280);
                return;
            }

            if (normalized.indexOf("demo") >= 0) {
                processAction("demo", mapSectorToDemo(context.lead.sector || "software"));
                return;
            }

            if (context.running) {
                askQuestion("Posso seguir te ajudando com qualquer uma dessas opcoes. Toque em uma escolha abaixo:");
                setTimeout(pushFinalSuggestions, 300);
                return;
            }
        };

        const start = () => {
            if (!context.panel) return;
            setPanelVisibility(false);
            if (!context.messages || !context.form || !context.input) return;
            context.messages.innerHTML = "";
            context.suggestions.innerHTML = "";
            context.step = 0;
            context.running = false;

            addMessage("bot", "Oi, sou o assistente premium da TechForce. Vou te guiar para um caminho de tecnologia com retorno real.");
            setTimeout(() => {
                askQuestion("Qual o seu nome, para começarmos?");
            }, 500);
        };

        const openPanel = () => {
            if (!context.panel) return;
            setPanelVisibility(true);
            if (!context.isInline) {
                document.body.classList.add("chat-open");
            }
            if (!context.messages.querySelector(".chat-message")) {
                start();
            }
            context.input?.focus();
        };

        const closePanel = () => {
            if (!context.panel) return;
            setPanelVisibility(false);
            if (!context.isInline) {
                document.body.classList.remove("chat-open");
            }
            clearSuggestions();
        };

        const bind = () => {
            if (context.suggestions) {
                context.suggestions.addEventListener("click", onSuggestionClick);
            }
        if (context.form && context.input) {
                context.form.addEventListener("submit", onTextSubmit);
            }
            if (context.openButtons && context.openButtons.length > 0) {
                context.openButtons.forEach((button) => {
                    button.addEventListener("click", openPanel);
                });
            }
            if (context.closeButton) {
                context.closeButton.addEventListener("click", closePanel);
            }
        };

        bind();
        return { openPanel, closePanel, start, processAction };
    };

    const floatingChat = createEngine({
        panelId: "chatPanel",
        panel: document.getElementById("chatPanel"),
        messages: document.getElementById("chatMessages"),
        suggestions: document.getElementById("chatSuggestions"),
        form: document.getElementById("chatForm"),
        input: document.getElementById("chatInput"),
        openButtons: Array.from(document.querySelectorAll("[data-open-chat], #chatWidget")),
        closeButton: document.getElementById("chatClose"),
        leadChips: [
            { key: "name", selectors: ["[data-lead-chip='name']"] },
            { key: "sector", selectors: ["[data-lead-chip='sector']"] },
            { key: "phone", selectors: ["[data-lead-chip='phone']"] },
            { key: "project", selectors: ["[data-lead-chip='project']"] },
            { key: "goal", selectors: ["[data-lead-chip='goal']"] }
        ]
    });

    const pageChatMessages = document.getElementById("chatMessagesPage");
    const pageChatSuggestions = document.getElementById("chatSuggestionsPage");
    const pageChatForm = document.getElementById("chatFormPage");
    const pageChatInput = document.getElementById("chatInputPage");
    const pageChatInstance = createEngine({
        panelId: "chatFormPage",
        panel: document.querySelector(".chat-page-card"),
        messages: pageChatMessages,
        suggestions: pageChatSuggestions,
        form: pageChatForm,
        input: pageChatInput,
        inline: true,
        openButtons: [],
        closeButton: null,
        leadChips: [
            { key: "name", selectors: ["[data-lead-chip-page='name']"] },
            { key: "sector", selectors: ["[data-lead-chip-page='sector']"] },
            { key: "project", selectors: ["[data-lead-chip-page='project']"] },
            { key: "goal", selectors: ["[data-lead-chip-page='goal']"] }
        ]
    });

    if (pageChatInstance) {
        pageChatInstance.start();
    }

    const bubble = document.getElementById("chatEntryBubble");
    const closeBubble = document.getElementById("chatEntryClose");
    if (closeBubble) {
        closeBubble.addEventListener("click", () => {
            if (bubble instanceof HTMLElement) {
                bubble.style.display = "none";
            }
        });
    }

    const entryText = localStorage.getItem("nxc_chat_entry");
    if (entryText === "hidden") {
        if (bubble instanceof HTMLElement) bubble.style.display = "none";
    }

    if (closeBubble) {
        closeBubble.addEventListener("click", () => {
            try {
                localStorage.setItem("nxc_chat_entry", "hidden");
            } catch (_error) { }
        });
    }

    window.TechForceChat = window.TechForceChat || {};
    window.TechForceChat.open = () => {
        if (floatingChat) floatingChat.openPanel();
    };
})();
