(function () {
    const chatConfig = {
        botName: "NexBot AI",
        welcomeMsg: "Olá! Sou o assistente da NexCore. Como posso acelerar seu negócio hoje?",
        knowledgeBase: [
            { patterns: [/preço/, /valor/, /quanto custa/], response: "Nossos projetos são sob medida. Para um orçamento preciso, recomendo solicitar um 'Diagnóstico Técnico'. Posso te guiar até lá?" },
            { patterns: [/prazo/, /demora/, /tempo/], response: "Projetos web levam em média 15-30 dias. Sistemas complexos dependem do escopo. Quer ver nossa metodologia?" },
            { patterns: [/serviço/, /fazem/, /portfólio/], response: "Somos especialistas em Software Sob Medida, Web Apps e Automações Inteligentes. Qual dessas áreas te interessa?" },
            { patterns: [/oi/, /olá/, /bom dia/], response: "Olá! Tudo bem? Como a NexCore pode ajudar você hoje?" }
        ],
        quickReplies: ["Ver Serviços", "Solicitar Orçamento", "Falar com Humano"]
    };

    const widget = document.getElementById('chatWidget');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');

    function addMessage(role, text, isOption = false) {
        const div = document.createElement('div');
        div.className = `msg ${role} animate-in`;
        div.innerHTML = `<span class="sender">${role === 'bot' ? chatConfig.botName : 'Você'}</span><p>${text}</p>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;

        if (role === 'bot' && !isOption) renderOptions();
    }

    function renderOptions() {
        const container = document.createElement('div');
        container.className = 'chat-options';
        chatConfig.quickReplies.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.onclick = () => handleInput(opt);
            container.appendChild(btn);
        });
        messages.appendChild(container);
    }

    async function handleInput(text) {
        addMessage('user', text, true);
        const typing = document.createElement('div');
        typing.className = 'msg bot typing';
        typing.textContent = 'Digitando...';
        messages.appendChild(typing);

        setTimeout(() => {
            typing.remove();
            let found = chatConfig.knowledgeBase.find(k => k.patterns.some(p => p.test(text.toLowerCase())));
            const reply = found ? found.response : "Interessante! Para detalhes técnicos mais profundos, um de nossos arquitetos de software pode te ligar. Quer deixar seu contato?";
            addMessage('bot', reply);
        }, 1000);
    }

    widget?.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (messages.children.length === 0) addMessage('bot', chatConfig.welcomeMsg);
    });

    closeBtn?.addEventListener('click', () => panel.classList.remove('open'));

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = input.value.trim();
        if (!msg) return;
        handleInput(msg);
        input.value = '';
    });
})();