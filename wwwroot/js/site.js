(function () {
    "use strict";

    document.documentElement.classList.remove("no-js");

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsFinePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

    const header = document.getElementById("mainHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
    const progress = document.getElementById("scrollProgress");
    const glows = Array.from(document.querySelectorAll(".bg-glow"));

    let menuLastFocus = null;

    const updateHeaderOffset = () => {
        if (!header) return;
        document.documentElement.style.setProperty("--header-offset", `${header.offsetHeight}px`);
    };

    const setHeaderState = () => {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 12);
    };

    const setScrollProgress = () => {
        if (!progress) return;
        const doc = document.documentElement;
        const total = Math.max(1, doc.scrollHeight - window.innerHeight);
        const ratio = total > 0 ? Math.min(1, window.scrollY / total) : 0;
        progress.style.width = `${(ratio * 100).toFixed(2)}%`;
    };

    const closeMenu = () => {
        if (!menuToggle || !mobileNav) return;
        mobileNav.hidden = true;
        if (mobileNavBackdrop) mobileNavBackdrop.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        document.body.classList.remove("menu-open");
        if (menuLastFocus instanceof HTMLElement) menuLastFocus.focus();
    };

    const openMenu = () => {
        if (!menuToggle || !mobileNav) return;
        menuLastFocus = document.activeElement;
        mobileNav.hidden = false;
        if (mobileNavBackdrop) mobileNavBackdrop.hidden = false;
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");
        document.body.classList.add("menu-open");
        const firstLink = mobileNav.querySelector("a, button");
        if (firstLink instanceof HTMLElement) {
            window.requestAnimationFrame(() => firstLink.focus());
        }
    };

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            expanded ? closeMenu() : openMenu();
        });

        mobileNav.addEventListener("click", (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.closest("a")) closeMenu();
        });

        if (mobileNavBackdrop) mobileNavBackdrop.addEventListener("click", closeMenu);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1060) closeMenu();
            updateHeaderOffset();
        });
    }

    const ensureResponsiveTables = () => {
        const tables = Array.from(document.querySelectorAll(".module-table"));
        tables.forEach((table) => {
            if (!(table instanceof HTMLTableElement)) return;
            const parent = table.parentElement;
            if (parent && parent.classList.contains("table-scroll")) return;
            const wrapper = document.createElement("div");
            wrapper.className = "table-scroll";
            table.parentNode?.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    };
    ensureResponsiveTables();

    const revealElements = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    /* ---------- Counter Animation ---------- */
    const countElements = document.querySelectorAll("[data-count-to]");
    const animateCount = (element) => {
        const target = Number(element.getAttribute("data-count-to") || "0");
        const suffix = element.getAttribute("data-count-suffix") || "";
        const duration = 1400;
        let start = null;

        const setCount = (value) => {
            element.textContent = `${value.toLocaleString("pt-BR")}${suffix}`;
        };

        const step = (time) => {
            if (start === null) start = time;
            const ratio = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - ratio, 3);
            setCount(Math.round(target * eased));
            if (ratio < 1) requestAnimationFrame(step);
            else setCount(target);
        };

        requestAnimationFrame(step);
    };

    if (countElements.length > 0) {
        if ("IntersectionObserver" in window && !prefersReducedMotion) {
            const countObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.5 });
            countElements.forEach((element) => countObserver.observe(element));
        } else {
            countElements.forEach((element) => {
                const target = Number(element.getAttribute("data-count-to") || "0");
                const suffix = element.getAttribute("data-count-suffix") || "";
                element.textContent = `${target.toLocaleString("pt-BR")}${suffix}`;
            });
        }
    }

    /* ---------- Parallax Glow Effect ---------- */
    if (!prefersReducedMotion && supportsFinePointer && glows.length > 0) {
        let glowRaf = null;
        window.addEventListener("pointermove", (event) => {
            if (glowRaf) cancelAnimationFrame(glowRaf);
            glowRaf = requestAnimationFrame(() => {
                const relX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
                const relY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
                glows.forEach((glow, index) => {
                    const depth = index === 0 ? 26 : 18;
                    glow.style.transform = `translate3d(${(relX * depth).toFixed(1)}px, ${(relY * depth).toFixed(1)}px, 0)`;
                });
            });
        }, { passive: true });
    }

    /* ---------- Card Tilt Effect ---------- */
    if (!prefersReducedMotion && supportsFinePointer) {
        const tiltCards = document.querySelectorAll("[data-hover-tilt]");
        tiltCards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const relX = (event.clientX - rect.left) / Math.max(rect.width, 1);
                const relY = (event.clientY - rect.top) / Math.max(rect.height, 1);
                const rotateY = (relX - 0.5) * 6;
                const rotateX = (0.5 - relY) * 5;
                card.style.transform = `rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateY(-3px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    /* ---------- Services Estimator ---------- */
    const estimator = document.getElementById("servicesEstimator");
    if (estimator instanceof HTMLFormElement) {
        const complexityInput = estimator.querySelector("[name='complexity']");
        const integrationInput = estimator.querySelector("[name='integrations']");
        const channelsInput = estimator.querySelector("[name='channels']");
        const estimateWeeks = document.getElementById("estimateWeeks");
        const estimateRange = document.getElementById("estimateRange");

        const computeEstimate = () => {
            const complexity = Number((complexityInput instanceof HTMLSelectElement ? complexityInput.value : "2")) || 2;
            const integrations = Number((integrationInput instanceof HTMLInputElement ? integrationInput.value : "1")) || 1;
            const channels = Number((channelsInput instanceof HTMLInputElement ? channelsInput.value : "1")) || 1;

            const baseWeeks = 2 + complexity * 1.4 + integrations * 0.8 + channels * 0.5;
            const rounded = Math.max(2, Math.round(baseWeeks));
            const min = Math.max(2, rounded - 1);
            const max = rounded + 2;

            if (estimateWeeks) estimateWeeks.textContent = `${rounded} semanas`;
            if (estimateRange) estimateRange.textContent = `${min} a ${max} semanas (estimativa inicial)`;
        };

        estimator.addEventListener("input", computeEstimate);
        computeEstimate();
    }

    /* ---------- Scroll Handler ---------- */
    const onScroll = () => {
        setHeaderState();
        setScrollProgress();
    };

    updateHeaderOffset();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHeaderOffset);
})();