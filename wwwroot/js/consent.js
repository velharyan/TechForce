(function () {
    "use strict";

    const banner = document.getElementById("cookieBanner");
    const acceptAll = document.getElementById("btnAcceptAll");
    const savePrefs = document.getElementById("btnSavePrefs");
    const analyticsInput = document.getElementById("ckAnalytics");
    const marketingInput = document.getElementById("ckMarketing");

    if (!banner || !acceptAll || !savePrefs || !analyticsInput || !marketingInput) return;

    const stored = localStorage.getItem("nxc_cookies");
    const prefs = stored ? JSON.parse(stored) : null;

    if (!prefs || prefs.version !== 1) {
        banner.hidden = false;
    } else {
        analyticsInput.checked = !!prefs.analytics;
        marketingInput.checked = !!prefs.marketing;
    }

    const persist = (value) => {
        localStorage.setItem("nxc_cookies", JSON.stringify(value));
        banner.hidden = true;
    };

    acceptAll.addEventListener("click", () => {
        persist({ version: 1, necessary: true, analytics: true, marketing: true });
        window.location.reload();
    });

    savePrefs.addEventListener("click", () => {
        persist({
            version: 1,
            necessary: true,
            analytics: analyticsInput.checked,
            marketing: marketingInput.checked
        });
        window.location.reload();
    });
})();
