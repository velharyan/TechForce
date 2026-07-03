(function () {
    "use strict";

    const modal = document.getElementById("demoModal");
    const overlay = modal?.querySelector(".demo-overlay");
    const panel = modal?.querySelector(".demo-window");
    const title = document.getElementById("demoModalTitle");
    const kicker = document.getElementById("demoModalKicker");
    const address = document.getElementById("demoModalAddress");
    const frame = document.getElementById("demoModalFrame");
    const loader = document.getElementById("demoModalLoader");
    let lastTrigger = null;
    const demoCatalog = {
        site: { title: "Site institucional de alta conversão", kicker: "Comercial", device: "web" },
        landing: { title: "Landing page premium", kicker: "Conversão", device: "web" },
        ecommerce: { title: "Loja digital escalável", kicker: "Comercial", device: "web" },
        app: { title: "Aplicativo operacional", kicker: "Mobile", device: "mobile" },
        crm: { title: "CRM comercial", kicker: "Pipeline", device: "web" },
        api: { title: "Hub de integração e observabilidade", kicker: "Arquitetura", device: "web" },
        automation: { title: "Centro de automações", kicker: "Operação", device: "web" },
        ia: { title: "Assistente inteligente consultivo", kicker: "Atendimento", device: "web" },
        dashboard: { title: "Dashboard executivo", kicker: "Dados", device: "web" },
        portal: { title: "Portal de cliente e suporte", kicker: "Experiência", device: "web" },
        "erp-lite": { title: "ERP lite operacional", kicker: "Operação", device: "web" }
    };

    const close = () => {
        if (!modal) return;
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        modal.hidden = true;
        if (frame instanceof HTMLIFrameElement) frame.src = "about:blank";
        if (loader instanceof HTMLElement) loader.classList.remove("is-active");
        bodyUnlock();
        if (lastTrigger instanceof HTMLElement) {
            lastTrigger.focus();
        }
        lastTrigger = null;
    };

    const bodyLock = () => {
        document.body.classList.add("modal-open");
    };

    const bodyUnlock = () => {
        document.body.classList.remove("modal-open");
    };

    const parseDemoData = (element) => {
        if (!(element instanceof HTMLElement)) return null;
        const url = element.getAttribute("data-demo-url") || "";
        if (!url) return null;
        return {
            url,
            title: element.getAttribute("data-demo-title") || "Demo TechForce",
            kicker: element.getAttribute("data-demo-kicker") || "Demo premium",
            device: element.getAttribute("data-demo-device") || "web"
        };
    };

    const resolveFromExampleUrl = (href) => {
        if (typeof href !== "string") return null;
        const normalized = href.trim();
        const match = normalized.match(/\/Products\/Example\/([^/?#]+)/i);
        if (!match) return null;

        const slug = decodeURIComponent(match[1] || "").toLowerCase();
        const data = demoCatalog[slug] || null;
        const title = data?.title || `Demo ${slug}`;

        return {
            url: href,
            title: title || `Demo ${slug}`,
            kicker: data?.kicker || "Demo premium",
            device: data?.device || "web"
        };
    };

    const isDemoTextualTrigger = (element) => {
        const text = (element?.textContent || "").toLowerCase();
        return /ver\s+demo|abrir\s+demo/i.test(text);
    };

    const setPanel = (demo) => {
        if (!modal || !panel || !title || !kicker || !address || !frame || !loader) return;
        if (!(frame instanceof HTMLIFrameElement)) return;

        const cleanUrl = demo.url.startsWith("http") ? demo.url : location.origin + demo.url;
        title.textContent = demo.title;
        kicker.textContent = `${demo.kicker} | Demo funcional`;
        address.textContent = cleanUrl;
        panel.setAttribute("data-device", demo.device || "web");
        loader.classList.add("is-active");
        frame.src = demo.url;
        frame.addEventListener("load", () => {
            loader.classList.remove("is-active");
        }, { once: true });
    };

    const open = (demo) => {
        if (!modal || !demo) return;
        setPanel(demo);
        modal.hidden = false;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        bodyLock();
        setTimeout(() => panel?.focus(), 80);
        panel?.setAttribute("tabindex", "-1");
    };

    const canOpen = (url) => {
        return /^https?:\/\//i.test(url) || url.startsWith("/");
    };

    document.addEventListener("click", (event) => {
        const trigger = event.target instanceof Element
            ? event.target.closest("[data-demo-open], a[href*='/Products/Example/'], a[href*='Products/Example/']")
            : null;
        if (!trigger) return;

        if (trigger.tagName.toLowerCase() === "a" && !trigger.hasAttribute("data-demo-open") && !isDemoTextualTrigger(trigger)) {
            return;
        }

        event.preventDefault();
        const data = parseDemoData(trigger) || resolveFromExampleUrl(trigger.getAttribute("href") || "");
        if (!data || !canOpen(data.url)) return;
        lastTrigger = trigger;
        open(data);
    });

    document.addEventListener("click", (event) => {
        const closer = event.target instanceof Element ? event.target.closest("[data-demo-close]") : null;
        if (!closer) return;
        close();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && modal.classList.contains("is-open")) {
            close();
        }
    });

    window.addEventListener("message", (event) => {
        if (!event.data || event.data.__techforceDemoClose) {
            close();
        }
    });

    window.TechForceDemo = window.TechForceDemo || {};
    window.TechForceDemo.open = (payload) => {
        if (!payload || !payload.url) return;
        const triggerData = {
            url: payload.url,
            title: payload.title || "Demo TechForce",
            kicker: payload.kicker || "Demo premium",
            device: payload.device || "web"
        };
        open(triggerData);
    };

    window.addEventListener("techforce:open-demo", (event) => {
        const payload = event.detail || {};
        if (!payload.url) return;
        window.TechForceDemo.open(payload);
    });
})();
