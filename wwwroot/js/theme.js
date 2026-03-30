(function () {
    "use strict";

    const root = document.documentElement;
    const toggles = [document.getElementById("themeToggle"), document.getElementById("themeToggleMobile")].filter(Boolean);

    const applyLabel = () => {
        const theme = root.getAttribute("data-theme") || "dark";
        toggles.forEach((button) => {
            if (!(button instanceof HTMLElement)) return;
            button.textContent = theme === "light" ? "Dark" : "Light";
            button.setAttribute("aria-label", theme === "light" ? "Ativar tema escuro" : "Ativar tema claro");
        });
    };

    const savedTheme = localStorage.getItem("nxc_theme");
    if (savedTheme === "dark" || savedTheme === "light") {
        root.setAttribute("data-theme", savedTheme);
    }
    applyLabel();

    toggles.forEach((button) => {
        if (!(button instanceof HTMLElement)) return;
        button.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            root.setAttribute("data-theme", current);
            localStorage.setItem("nxc_theme", current);
            applyLabel();
        });
    });
})();
