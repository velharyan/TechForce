(function () {
    "use strict";

    document.documentElement.classList.remove("no-js");

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const body = document.body;
    const header = document.getElementById("mainHeader");
    const progress = document.getElementById("scrollProgress");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
    const themeToggle = document.getElementById("themeToggle");
    const themeToggleMobile = document.getElementById("themeToggleMobile");
    const revealElements = document.querySelectorAll("[data-reveal]");
    const counterElements = document.querySelectorAll("[data-count-to]");
    const ambientCanvas = document.getElementById("ambientCanvas");

    const applyTheme = (theme) => {
        const selected = theme === "light" ? "light" : "dark";
        root.setAttribute("data-theme", selected);
        try {
            localStorage.setItem("nxc_theme", selected);
        } catch (_error) { }
        [themeToggle, themeToggleMobile].forEach((button) => {
            if (!(button instanceof HTMLButtonElement)) return;
            button.setAttribute("aria-label", selected === "light" ? "Ativar tema escuro" : "Ativar tema claro");
            button.title = selected === "light" ? "Ativar tema escuro" : "Ativar tema claro";
        });
    };

    const toggleTheme = () => {
        const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(current);
    };

    const openMenu = () => {
        if (!menuToggle || !mobileNav) return;
        menuToggle.setAttribute("aria-expanded", "true");
        mobileNav.hidden = false;
        if (mobileNavBackdrop) mobileNavBackdrop.hidden = false;
        body.classList.add("menu-open");
        const first = mobileNav.querySelector("a, button");
        if (first instanceof HTMLElement) first.focus();
    };

    const closeMenu = () => {
        if (!menuToggle || !mobileNav) return;
        menuToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
        if (mobileNavBackdrop) mobileNavBackdrop.hidden = true;
        body.classList.remove("menu-open");
    };

    const updateHeader = () => {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 10);
    };

    const updateProgress = () => {
        if (!progress) return;
        const doc = document.documentElement;
        const total = Math.max(1, doc.scrollHeight - window.innerHeight);
        const ratio = Math.min(1, window.scrollY / total);
        progress.style.width = `${(ratio * 100).toFixed(2)}%`;
    };

    const animateCounter = (element) => {
        const target = Number(element.getAttribute("data-count-to") || "0");
        if (!Number.isFinite(target) || target <= 0) return;
        const suffix = element.getAttribute("data-count-suffix") || "";
        const value = Number(element.textContent || "0");
        const duration = 1300;
        const start = performance.now();

        const step = (timestamp) => {
            const progress = Math.min(1, (timestamp - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(value + (target - value) * eased);
            element.textContent = `${current.toLocaleString("pt-BR")}${suffix}`;
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const setupReveal = () => {
        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const node = entry.target;
                const delay = Number(node.getAttribute("data-delay") || "0") || 0;
                node.style.setProperty("--reveal-delay", `${Math.min(delay, 5)}`);
                node.classList.add("is-visible");
                revealObserver.unobserve(node);
                const counterTargets = node.querySelectorAll("[data-count-to]");
                counterTargets.forEach(animateCounter);
            });
        }, { threshold: 0.13 });

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

        counterElements.forEach((element) => {
            if (!element.closest("[data-reveal]")) {
                animateCounter(element);
            }
        });
    };

    const setupMagnetic = () => {
        if (prefersReducedMotion) return;
        const buttons = document.querySelectorAll("[data-magnetic]");
        buttons.forEach((button) => {
            if (!(button instanceof HTMLElement)) return;
            const maxOffset = 8;
            const onMove = (event) => {
                const bounds = button.getBoundingClientRect();
                const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
                const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
                button.style.transform = `translate(${(-relX * maxOffset).toFixed(2)}px, ${(-relY * maxOffset).toFixed(2)}px)`;
            };
            const reset = () => {
                button.style.transform = "";
            };
            button.addEventListener("pointermove", onMove);
            button.addEventListener("pointerleave", reset);
            button.addEventListener("pointerdown", reset);
        });
    };

    const setupAmbient = () => {
        if (prefersReducedMotion || !ambientCanvas || !ambientCanvas.getContext) return;
        const context = ambientCanvas.getContext("2d");
        if (!context) return;

        const state = { width: 0, height: 0, nodes: [] };
        const getDensity = () => window.innerWidth < 768 ? 0.000045 : 0.00007;
        const total = () => Math.max(36, Math.floor(state.width * state.height * getDensity()));

        const resize = () => {
            const rect = ambientCanvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            ambientCanvas.width = Math.floor(rect.width * ratio);
            ambientCanvas.height = Math.floor(rect.height * ratio);
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            state.width = rect.width;
            state.height = rect.height;
            state.nodes = new Array(total()).fill(0).map(() => ({
                x: Math.random() * state.width,
                y: Math.random() * state.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                size: Math.random() * 1.6 + 0.5
            }));
        };

        const draw = () => {
            context.clearRect(0, 0, state.width, state.height);
            context.strokeStyle = "rgba(160, 202, 255, 0.18)";
            context.fillStyle = "rgba(145, 220, 255, 0.85)";
            const maxDist = Math.min(state.width, state.height) * 0.11;
            const maxDistSq = maxDist * maxDist;

            for (let i = 0; i < state.nodes.length; i++) {
                const a = state.nodes[i];
                a.x += a.vx;
                a.y += a.vy;
                if (a.x < 0 || a.x > state.width) a.vx *= -1;
                if (a.y < 0 || a.y > state.height) a.vy *= -1;

                context.beginPath();
                context.arc(a.x, a.y, a.size, 0, Math.PI * 2);
                context.fill();

                for (let j = i + 1; j < state.nodes.length; j++) {
                    const b = state.nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq > maxDistSq) continue;
                    const alpha = 1 - (distSq / maxDistSq);
                    context.globalAlpha = alpha * 0.35;
                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.stroke();
                    context.globalAlpha = 1;
                }
            }

            requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener("resize", resize);
    };

    const init = () => {
        const savedTheme = (() => {
            try {
                return localStorage.getItem("nxc_theme");
            } catch (_error) {
                return null;
            }
        })();
        applyTheme(savedTheme === "light" ? "light" : "dark");

        if (themeToggle) {
            themeToggle.addEventListener("click", toggleTheme);
        }
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener("click", toggleTheme);
        }

        if (menuToggle) {
            menuToggle.addEventListener("click", () => {
                const opened = menuToggle.getAttribute("aria-expanded") === "true";
                if (opened) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
        }

        if (mobileNavBackdrop) {
            mobileNavBackdrop.addEventListener("click", closeMenu);
        }

        if (mobileNav) {
            mobileNav.addEventListener("click", (event) => {
                const target = event.target;
                if (!(target instanceof Element)) return;
                if (target.closest("a")) {
                    closeMenu();
                }
            });
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1060) closeMenu();
            updateHeader();
            updateProgress();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape" || !document.body.classList.contains("menu-open")) return;
            closeMenu();
        });

        setupReveal();
        setupMagnetic();
        setupAmbient();
        updateHeader();
        updateProgress();
        window.addEventListener("scroll", () => {
            updateHeader();
            updateProgress();
        }, { passive: true });
    };

    init();
})();
