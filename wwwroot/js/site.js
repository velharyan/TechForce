(function () {
    "use strict";

    document.documentElement.classList.remove("no-js");

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const header = document.getElementById("mainHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const progress = document.getElementById("scrollProgress");
    const glows = Array.from(document.querySelectorAll(".bg-glow"));

    const setHeaderState = () => {
        if (!header) return;
        if (window.scrollY > 8) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    const setScrollProgress = () => {
        if (!progress) return;
        const doc = document.documentElement;
        const total = Math.max(1, doc.scrollHeight - window.innerHeight);
        const ratio = Math.max(0, Math.min(1, window.scrollY / total));
        progress.style.width = `${(ratio * 100).toFixed(2)}%`;
    };

    const closeMenu = () => {
        if (!menuToggle || !mobileNav) return;
        mobileNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    };

    const openMenu = () => {
        if (!menuToggle || !mobileNav) return;
        mobileNav.hidden = false;
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    };

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            if (expanded) closeMenu();
            else openMenu();
        });

        mobileNav.addEventListener("click", (event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.closest("a")) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1060) closeMenu();
        });
    }

    const revealElements = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.16, rootMargin: "0px 0px -44px 0px" });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    const countElements = document.querySelectorAll("[data-count-to]");
    const setCountValue = (element, value) => {
        const suffix = element.getAttribute("data-count-suffix") || "";
        element.textContent = `${value.toLocaleString("pt-BR")}${suffix}`;
    };

    const animateCount = (element) => {
        const target = Number(element.getAttribute("data-count-to") || "0");
        const duration = 1200;
        let start = null;

        const step = (time) => {
            if (start === null) start = time;
            const progressRatio = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progressRatio, 3);
            setCountValue(element, Math.round(target * eased));
            if (progressRatio < 1) requestAnimationFrame(step);
            else setCountValue(element, target);
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
            }, { threshold: 0.55 });

            countElements.forEach((element) => countObserver.observe(element));
        } else {
            countElements.forEach((element) => {
                const target = Number(element.getAttribute("data-count-to") || "0");
                setCountValue(element, target);
            });
        }
    }

    if (!prefersReducedMotion && glows.length > 0) {
        window.addEventListener("pointermove", (event) => {
            const relX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
            const relY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;

            glows.forEach((glow, index) => {
                const depth = index === 0 ? 26 : 18;
                const x = relX * depth;
                const y = relY * depth;
                glow.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
            });
        }, { passive: true });
    }

    if (!prefersReducedMotion) {
        const tiltCards = document.querySelectorAll(".card[data-hover-tilt]");
        tiltCards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const relX = (event.clientX - rect.left) / Math.max(rect.width, 1);
                const relY = (event.clientY - rect.top) / Math.max(rect.height, 1);
                const rotateY = (relX - 0.5) * 5;
                const rotateX = (0.5 - relY) * 4;
                card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

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

    const onScroll = () => {
        setHeaderState();
        setScrollProgress();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
})();
