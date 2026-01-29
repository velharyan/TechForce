(function(){
  const widget = document.getElementById('chatWidget');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');

  function add(role,text){
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  widget?.addEventListener('click',()=>{ panel.classList.toggle('open'); });
  closeBtn?.addEventListener('click',()=> panel.classList.remove('open'));

  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = input.value.trim(); if(!msg) return;
    add('user', msg); input.value = '';
    try{
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      add('bot', data.answer || 'Sem resposta');
    }catch(err){ add('bot', 'Falha ao consultar a IA. Tente novamente.'); }
  });

  // Page dedicated form
  if(window.NEX_CHAT_PAGE){
    const f = document.getElementById('chatFormPage');
    const i = document.getElementById('chatInputPage');
    const m = document.getElementById('chatMessagesPage');
    function addp(role,text){ const d=document.createElement('div'); d.className='msg '+role; d.textContent=text; m.appendChild(d); }
    f.addEventListener('submit', async (e)=>{
      e.preventDefault(); const msg = i.value.trim(); if(!msg) return; addp('user', msg); i.value='';
      try{ const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})}); const d=await r.json(); addp('bot', d.answer || 'Sem resposta'); }
      catch{ addp('bot','Falha ao consultar a IA.'); }
    });
  }
})();