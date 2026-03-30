(function () {
    "use strict";

    const rawPrefs = localStorage.getItem("nxc_cookies");
    const prefs = rawPrefs ? JSON.parse(rawPrefs) : null;
    if (!prefs || !prefs.analytics) return;

    document.querySelectorAll("[data-evt]").forEach((element) => {
        element.addEventListener("click", () => {
            const name = element.getAttribute("data-evt");
            if (!name) return;
            if (window.console && typeof window.console.info === "function") {
                window.console.info("[analytics:event]", name);
            }
        });
    });
})();
