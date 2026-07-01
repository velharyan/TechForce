(function () {
  "use strict";

  var knowledge = window.TechForceChatbotKnowledge || { intents: [], quickReplies: [], qualification: [] };
  var panel = document.getElementById("chatPanel");
  var closeBtn = document.getElementById("chatClose");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var messages = document.getElementById("chatMessages");
  var suggestions = document.getElementById("chatSuggestions");
  var openButtons = Array.from(document.querySelectorAll("[data-open-chat], #chatWidget"));
  var entryBubble = document.getElementById("chatEntryBubble");
  var entryClose = document.getElementById("chatEntryClose");
  var pageForm = document.getElementById("chatFormPage");
  var pageInput = document.getElementById("chatInputPage");
  var pageMessages = document.getElementById("chatMessagesPage");
  var pageSuggestions = document.getElementById("chatSuggestionsPage");
  var endpoint = (panel ? panel.getAttribute("data-chat-endpoint") : null) || "/api/chat";

  var lead = { name: "", phone: "", project: "", budget: "", urgency: "" };

  // Context window: keep last N exchanges
  var context = [];
  var MAX_CONTEXT = 6;

  var n = function (v) {
    return String(v || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };

  // Detect route/intent answers for clickable buttons
  var ROUTE_MAP = {
    "site": { path: "/Services/WebApps", label: "Ver serviços Web" },
    "software": { path: "/Services/Software", label: "Ver serviços de Software" },
    "automation": { path: "/Services/Automations", label: "Ver automações" },
    "mobile": { path: "/Services/MobileApps", label: "Ver serviços Mobile" },
    "menu": { path: "/Services/FoodService", label: "Ver Food Service" },
    "cases": { path: "/Cases", label: "Ver Cases" },
    "contato": { path: "/Company/Contact", label: "Falar com equipe" },
    "preco": { path: "/Company/Contact", label: "Solicitar proposta" },
    "prazo": { path: "/Company/Contact", label: "Pedir estimativa" }
  };

  var DEMO_MAP = {
    cashflow: { label: "Ver demo Financeiro" },
    institutional: { label: "Ver demo Site" },
    landing: { label: "Ver demo Landing" },
    sales: { label: "Ver demo Vendas" },
    catalog: { label: "Ver demo Catálogo" },
    menu: { label: "Ver demo Cardápio" }
  };

  /* ---------- Normalization ---------- */
  var detectLeadFields = function (text) {
    var clean = String(text || "").trim();
    var normalized = n(clean);
    var phone = clean.match(/(\+?\d[\d\s().-]{8,}\d)/);
    if (phone) lead.phone = phone[1].trim();

    var nameMatch = clean.match(/(?:me chamo|meu nome e|meu nome é|sou o|sou a|aqui e|aqui é)\s+([a-zA-ZÀ-ÿ\s]{2,46})/i);
    if (nameMatch) lead.name = nameMatch[1].trim().replace(/[.,;!?].*$/, "");
    else if (!lead.name && clean.split(/\s+/).length <= 3 && /^[a-zA-ZÀ-ÿ\s]{3,46}$/.test(clean) && !/(site|sistema|landing|cardapio|catalogo|automacao|chatbot)/i.test(clean)) {
      lead.name = clean;
    }

    if (/site|landing|catalogo|cardapio|sistema|software|app|automacao|chatbot|dashboard|portal|loja|vendas/.test(normalized)) {
      lead.project = clean;
    }

    var budgetMatch = clean.match(/(?:r\$|\$)?\s?(?:ate|até|entre|investimento|orcamento|orçamento|budget)?\s?(\d[\d.\s]*(?:,\d{2})?\s?(?:k|mil)?)/i);
    if (budgetMatch && /(r\$|\$|ate|até|entre|investimento|orcamento|orçamento|budget|mil|k)/i.test(clean)) {
      lead.budget = budgetMatch[0].trim();
    }

    if (/urgente|imediato|essa semana|esta semana|30 dias|60 dias|este mes|este mês|mes que vem|mês que vem|sem pressa|trimestre/.test(normalized)) {
      lead.urgency = clean;
    }
  };

  var detectIntent = function (text) {
    var normalized = n(text);
    var scored = (knowledge.intents || []).map(function (intent) {
      var score = (intent.keywords || []).reduce(function (sum, keyword) {
        return normalized.includes(n(keyword)) ? sum + 1 : sum;
      }, 0);
      return { intent: intent, score: score };
    }).filter(function (item) { return item.score > 0; }).sort(function (a, b) { return b.score - a.score; });

    // Check for demo/page name mention
    var demoMatch = /(?:quero ver|mostra|abre|demo de? )(.+)/i.exec(normalized);
    if (demoMatch) {
      var demoName = demoMatch[1].trim();
      for (var key in DEMO_MAP) {
        if (demoName.includes(key)) return { intent: { id: "demo_" + key, suggestDemo: { path: "/Products", label: DEMO_MAP[key].label } }, score: 999 };
      }
    }

    return scored.length > 0 ? scored[0] : null;
  };

  var nextQuestion = function () {
    var item = (knowledge.qualification || []).find(function (field) { return !lead[field.key]; });
    if (item && item.key !== "name" && !lead.name) return null; // Wait for name first
    return item ? item.question : "";
  };

  var leadSummary = function () {
    var complete = (knowledge.qualification || []).filter(function (field) { return lead[field.key]; }).length;
    var total = Math.max(1, (knowledge.qualification || []).length);
    return complete + "/" + total + " dados coletados";
  };

  var updateLeadChips = function () {
    document.querySelectorAll("[data-lead-chip]").forEach(function (chip) {
      var key = chip.getAttribute("data-lead-chip");
      var value = key ? lead[key] : "";
      var label = (knowledge.qualification || []).find(function (f) { return f.key === key; });
      chip.textContent = value ? (label ? label.label + ": " : "") + value : (label ? label.label : key) + " pendente";
      chip.classList.toggle("is-complete", Boolean(value));
    });
  };

  /* ---------- Generate answer with context ---------- */
  var generateAnswer = function (text) {
    detectLeadFields(text);
    var detected = detectIntent(text);
    var parts = [];

    // Add context awareness
    var prevIntents = [];
    context.forEach(function (c) {
      if (c.intent && prevIntents.indexOf(c.intent) === -1) prevIntents.push(c.intent);
    });

    if (detected && detected.intent) {
      var intent = detected.intent;
      parts.push(intent.answer);
      prevIntents.push(intent.id);

      // Route suggestion
      if (intent.suggestRoute) {
        parts.push("route:" + JSON.stringify(intent.suggestRoute));
      }
      if (intent.suggestDemo) {
        parts.push("demo:" + JSON.stringify(intent.suggestDemo));
      }
      if (intent.isContact) {
        parts.push("contact:true");
      }
    } else {
      // No intent matched - use fallback but mention context
      if (prevIntents.length > 0) {
        parts.push(knowledge.fallback || "Entendi. Posso te orientar sobre sites, sistemas, automações, landing pages, catálogos, cardápios e chatbots. Me conte mais sobre o que você precisa.");
      } else {
        parts.push(knowledge.fallback || "Entendi. Posso te orientar sobre sites, sistemas, automações, landing pages, catálogos, cardápios e chatbots. Me conte mais sobre o que você precisa.");
      }
    }

    // Price/prazo quick add-ons
    var normalized = n(text);
    if (/preco|valor|custo|investimento/.test(normalized) && parts.join(" ").indexOf("investimento") === -1) {
      parts.push("Sobre investimento: o caminho mais seguro é dividir em fases, validando uma primeira entrega antes de expandir escopo. Cada projeto é único, mas começamos com um diagnóstico sem compromisso.");
    }
    if (/prazo|tempo|quando|entrega|urgente/.test(normalized) && parts.join(" ").indexOf("prazo") === -1) {
      parts.push("Sobre prazo: uma primeira versão costuma variar entre 2 e 6 semanas conforme conteúdo, integrações e nível de automação.");
    }

    // Qualification flow
    var question = nextQuestion();
    if (question) {
      parts.push(question);
    } else if (lead.name && lead.phone) {
      // All qualified - wrap up
      var summary = ["✅ Briefing completo (" + leadSummary() + ")"];
      if (lead.name) summary.push("Nome: " + lead.name);
      if (lead.phone) summary.push("Tel: " + lead.phone);
      if (lead.project) summary.push("Projeto: " + lead.project);
      if (lead.budget) summary.push("Investimento: " + lead.budget);
      if (lead.urgency) summary.push("Urgência: " + lead.urgency);
      summary.push("O próximo passo é falar com nosso time para uma proposta personalizada.");
      var hasSummary = parts.some(function (p) { return p.indexOf("Briefing") !== -1; });
      if (!hasSummary) {
        parts.push(summary.join(" · "));
        parts.push("contact:true");
        parts.push("route:" + JSON.stringify({ path: "/Company/Contact", label: "Solicitar proposta agora →" }));
      }
    }

    // Store in context
    context.push({ text: text, intent: detected ? detected.intent.id : null });
    if (context.length > MAX_CONTEXT) context.shift();

    return parts;
  };

  /* ---------- API interaction ---------- */
  var requestAnswer = async function (text) {
    var local = generateAnswer(text);
    try {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      if (!response.ok) return local;
      var payload = await response.json();
      if (!payload || typeof payload.answer !== "string" || !payload.answer.trim()) return local;

      // Merge remote answer with local actions
      var remoteAnswer = payload.answer.trim();
      var localActions = local.filter(function (p) { return p.indexOf("route:") === 0 || p.indexOf("demo:") === 0 || p.indexOf("contact:") === 0; });
      localActions.unshift("remote:" + remoteAnswer);
      return localActions;
    } catch (_error) {
      return local;
    }
  };

  /* ---------- Rendering ---------- */
  var addMessage = function (container, role, content, buttons) {
    if (!container) return;
    var wrapper = document.createElement("div");
    wrapper.className = "msg " + role;

    var sender = document.createElement("div");
    sender.className = "msg-sender";
    sender.textContent = role === "bot" ? "Assistente TechForce" : "Você";

    var bubble = document.createElement("div");
    bubble.className = "msg-bubble";

    var p = document.createElement("p");
    p.innerHTML = content;
    bubble.appendChild(p);

    wrapper.append(sender, bubble);

    if (buttons && buttons.length > 0) {
      var btnGroup = document.createElement("div");
      btnGroup.className = "msg-buttons";
      buttons.forEach(function (btn) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = btn.className || "msg-btn";
        b.innerHTML = btn.label;
        b.addEventListener("click", function () { btn.action(); });
        btnGroup.appendChild(b);
      });
      wrapper.appendChild(btnGroup);
    }

    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
  };

  var addTyping = function (container) {
    if (!container) return null;
    var typing = document.createElement("div");
    typing.className = "msg bot is-typing";
    typing.innerHTML = "<div class='msg-sender'>Assistente TechForce</div><div class='msg-bubble'><span></span><span></span><span></span></div>";
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
    return typing;
  };

  var renderSuggestions = function (container, onSelect) {
    if (!container) return;
    container.innerHTML = "";
    (knowledge.quickReplies || []).forEach(function (label) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "chat-suggestion";
      button.textContent = label;
      button.addEventListener("click", function () { onSelect(label); });
      container.appendChild(button);
    });
  };

  /* ---------- Parse answer parts into message + buttons ---------- */
  var processAnswerParts = function (parts) {
    var messageParts = [];
    var buttons = [];

    (parts || []).forEach(function (part) {
      if (typeof part !== "string") return;

      // Route button
      var routeMatch = part.match(/^route:(.+)$/);
      if (routeMatch) {
        try {
          var route = JSON.parse(routeMatch[1]);
          buttons.push({
            label: route.label,
            className: "msg-btn",
            action: function () { window.location.href = route.path; }
          });
        } catch (e) { /* skip */ }
        return;
      }

      // Demo button
      var demoMatch = part.match(/^demo:(.+)$/);
      if (demoMatch) {
        try {
          var demo = JSON.parse(demoMatch[1]);
          buttons.push({
            label: demo.label,
            className: "msg-btn primary-msg-btn",
            action: function () { window.location.href = demo.path; }
          });
        } catch (e) { /* skip */ }
        return;
      }

      // Contact/WhatsApp button
      if (part === "contact:true") {
        buttons.push({
          label: "Falar no WhatsApp →",
          className: "msg-btn primary-msg-btn",
          action: function () {
            var whatsappLink = document.querySelector(".float-whatsapp");
            if (whatsappLink) window.open(whatsappLink.getAttribute("href"), "_blank");
            else window.location.href = "/Company/Contact";
          }
        });
        return;
      }

      // Remote answer prefix
      if (part.indexOf("remote:") === 0) {
        messageParts.push(part.substring(7));
        return;
      }

      messageParts.push(part);
    });

    return { text: messageParts.join(" "), buttons: buttons };
  };

  var runDialog = async function (container, text) {
    addMessage(container, "user", text);
    var typing = addTyping(container);
    var parts = await requestAnswer(text);

    window.setTimeout(function () {
      if (typing && typing.parentNode) typing.remove();
      var result = processAnswerParts(parts);
      addMessage(container, "bot", result.text, result.buttons);
      updateLeadChips();
    }, 400 + Math.random() * 300);
  };

  /* ---------- Entry bubble ---------- */
  var dismissEntryBubble = function () {
    if (entryBubble) {
      entryBubble.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      entryBubble.style.opacity = "0";
      entryBubble.style.transform = "translateY(10px)";
      setTimeout(function () { if (entryBubble) entryBubble.style.display = "none"; }, 300);
    }
  };

  if (entryBubble) {
    setTimeout(function () {
      if (entryBubble) entryBubble.style.display = "block";
    }, 1500);
    if (entryClose) entryClose.addEventListener("click", dismissEntryBubble);
  }

  /* ---------- Panel open/close ---------- */
  var openPanel = function () {
    if (!panel || !input || !messages) return;
    dismissEntryBubble();
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    seed(messages, suggestions);
    setTimeout(function () { input.focus(); }, 150);
  };

  var closePanel = function () {
    if (!panel) return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  };

  /* ---------- Seed first messages ---------- */
  var seed = function (container, suggestionContainer) {
    if (!container || container.hasChildNodes()) return;
    addMessage(container, "bot",
      "Olá! 👋 Eu sou o <strong>Assistente TechForce</strong>.<br><br>" +
      "Posso te ajudar com:<br>" +
      "• Escolher o melhor serviço para seu negócio<br>" +
      "• Mostrar demonstrações de produtos<br>" +
      "• Fazer um briefing rápido para proposta<br>" +
      "• Te direcionar para o time comercial"
    );
    addMessage(container, "bot", "Para começar, escolha uma opção abaixo ou me conte seu objetivo:");
    renderSuggestions(suggestionContainer, function (label) { runDialog(container, label); });
    updateLeadChips();
  };

  /* ---------- Event wiring ---------- */
  openButtons.forEach(function (button) {
    button.addEventListener("click", openPanel);
  });
  if (closeBtn) closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePanel();
  });

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!(input instanceof HTMLInputElement) || !messages) return;
      var text = input.value.trim();
      if (!text) return;
      input.value = "";
      try {
        await runDialog(messages, text);
        input.focus();
      } catch (e) {
        console.error("Chat submit error:", e);
      }
    });
  }

  if (pageForm && pageInput instanceof HTMLInputElement && pageMessages) {
    seed(pageMessages, pageSuggestions);
    pageForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      var text = pageInput.value.trim();
      if (!text) return;
      pageInput.value = "";
      try {
        await runDialog(pageMessages, text);
        pageInput.focus();
      } catch (e) {
        console.error("Page chat submit error:", e);
      }
    });
  }

  // Listen for route changes (SPA-style) to reset context on fresh load
  // For now, seed only if page chat
  if (pageMessages && !pageMessages.hasChildNodes()) {
    seed(pageMessages, pageSuggestions);
  }
})();