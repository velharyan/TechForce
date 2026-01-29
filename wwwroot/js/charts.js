// Dados de exemplo (mock) para gráficos
(function(){
  const ctx = (id)=>document.getElementById(id)?.getContext('2d');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  if(ctx('chartProjetos')) new Chart(ctx('chartProjetos'), {
    type: 'bar', data: { labels: months, datasets: [{ label: 'Projetos entregues', data: [2,3,5,4,6,8,7,9,10,8,6,12], backgroundColor: '#06b6d4' }] },
    options: { responsive:true, plugins:{ legend:{labels:{color:'#9fb1c5'} }}, scales:{ x:{ticks:{color:'#9fb1c5'}}, y:{ticks:{color:'#9fb1c5'}} } }
  });

  if(ctx('chartServicosMes')) new Chart(ctx('chartServicosMes'), {
    type: 'line', data: { labels: months, datasets: [{ label: 'Serviços/mês (média móvel)', data: [5,6,7,7,8,9,10,12,13,11,12,14], borderColor: '#7c3aed' }] },
    options: { responsive:true, plugins:{ legend:{labels:{color:'#9fb1c5'}}}, scales:{ x:{ticks:{color:'#9fb1c5'}}, y:{ticks:{color:'#9fb1c5'}} } }
  });

  if(ctx('chartNps')) new Chart(ctx('chartNps'), {
    type: 'doughnut', data: { labels:['Promotores','Neutros','Detratores'], datasets:[{ data:[72,20,8], backgroundColor:['#22c55e','#eab308','#ef4444'] }] },
    options: { plugins:{ legend:{labels:{color:'#9fb1c5'}} } }
  });

  if(ctx('chartTempoEntrega')) new Chart(ctx('chartTempoEntrega'), {
    type: 'line', data: { labels: months, datasets: [{ label: 'Tempo médio (dias)', data: [35,33,31,32,30,29,28,27,26,28,29,30], borderColor:'#06b6d4'}] },
    options: { plugins:{ legend:{labels:{color:'#9fb1c5'}}}, scales:{ x:{ticks:{color:'#9fb1c5'}}, y:{ticks:{color:'#9fb1c5'}} } }
  });

  if(ctx('chartPedidos')) new Chart(ctx('chartPedidos'), {
    type: 'bar', data: { labels: months, datasets: [{ label: 'Pedidos processados', data: [1000,1200,1400,1600,2000,2400,2600,3000,3200,3400,3600,4000], backgroundColor:'#22c55e'}] },
    options: { plugins:{ legend:{labels:{color:'#9fb1c5'}}}, scales:{ x:{ticks:{color:'#9fb1c5'}}, y:{ticks:{color:'#9fb1c5'}} } }
  });

  if(ctx('chartAutomacoes')) new Chart(ctx('chartAutomacoes'), {
    type: 'bar', data: { labels:['WhatsApp','Integrações','Rotinas'], datasets:[{label:'Ativas', data:[12,8,5], backgroundColor:['#10b981','#7c3aed','#06b6d4']}] },
    options: { plugins:{ legend:{labels:{color:'#9fb1c5'}}}, scales:{ x:{ticks:{color:'#9fb1c5'}}, y:{ticks:{color:'#9fb1c5'}} } }
  });
})();