(function () {
    "use strict";

    if (typeof window.Chart === "undefined") return;

    const get = (id) => document.getElementById(id);
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    const palette = {
        cyan: "#33b6e8",
        blue: "#4d95ff",
        green: "#2db68a",
        orange: "#f5a947",
        red: "#ef5f5f",
        violet: "#7d75ff",
        text: "#9db4cf"
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: palette.text, font: { weight: "600" } }
            }
        },
        scales: {
            x: { ticks: { color: palette.text }, grid: { color: "rgba(157,180,207,0.12)" } },
            y: { ticks: { color: palette.text }, grid: { color: "rgba(157,180,207,0.12)" } }
        }
    };

    const chartProjetos = get("chartProjetos");
    if (chartProjetos) {
        new Chart(chartProjetos, {
            type: "bar",
            data: {
                labels: months,
                datasets: [{ label: "Projetos entregues", data: [2, 3, 4, 5, 6, 7, 8, 8, 10, 9, 10, 12], backgroundColor: palette.cyan, borderRadius: 8 }]
            },
            options: commonOptions
        });
    }

    const chartServicosMes = get("chartServicosMes");
    if (chartServicosMes) {
        new Chart(chartServicosMes, {
            type: "line",
            data: {
                labels: months,
                datasets: [{ label: "Servicos por mes", data: [5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14], borderColor: palette.blue, tension: 0.34, fill: false }]
            },
            options: commonOptions
        });
    }

    const chartNps = get("chartNps");
    if (chartNps) {
        new Chart(chartNps, {
            type: "doughnut",
            data: {
                labels: ["Promotores", "Neutros", "Detratores"],
                datasets: [{ data: [72, 19, 9], backgroundColor: [palette.green, palette.orange, palette.red], borderWidth: 0 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: palette.text, font: { weight: "600" } } }
                }
            }
        });
    }

    const chartTempoEntrega = get("chartTempoEntrega");
    if (chartTempoEntrega) {
        new Chart(chartTempoEntrega, {
            type: "line",
            data: {
                labels: months,
                datasets: [{ label: "Tempo medio de entrega (dias)", data: [36, 35, 33, 32, 31, 30, 29, 28, 27, 27, 26, 25], borderColor: palette.green, tension: 0.3, fill: false }]
            },
            options: commonOptions
        });
    }

    const chartPedidos = get("chartPedidos");
    if (chartPedidos) {
        new Chart(chartPedidos, {
            type: "bar",
            data: {
                labels: months,
                datasets: [{ label: "Pedidos processados", data: [980, 1100, 1300, 1500, 1800, 2200, 2500, 2700, 3000, 3200, 3400, 3700], backgroundColor: palette.violet, borderRadius: 8 }]
            },
            options: commonOptions
        });
    }

    const chartAutomacoes = get("chartAutomacoes");
    if (chartAutomacoes) {
        new Chart(chartAutomacoes, {
            type: "bar",
            data: {
                labels: ["Atendimento", "Integracoes", "Backoffice"],
                datasets: [{ label: "Automacoes ativas", data: [12, 9, 6], backgroundColor: [palette.cyan, palette.green, palette.blue], borderRadius: 8 }]
            },
            options: commonOptions
        });
    }
})();
