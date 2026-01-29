// Microinterações e carrossel simples
(function(){
  // Animated counters
  const counters = document.querySelectorAll('.kpi');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target; const target = parseFloat(el.dataset.target || '0');
        const start = performance.now(); const dur = 1200;
        function step(t){
          const p = Math.min(1,(t-start)/dur); const val = target * p;
          el.innerHTML = el.textContent.split('')[0].replace(/.*/, el.textContent.split('')[0]);
          el.firstChild && (el.firstChild.nodeValue = el.firstChild.nodeValue);
          el.textContent = el.textContent.replace(/\d+.*/, '');
          el.innerHTML = `${el.innerHTML.split('<')[0]}${''}`;
          el.innerText = el.innerText.replace(/.*/, el.innerText);
          el.textContent = el.textContent;
          el.querySelector && (el.querySelector('strong'));
          el.innerHTML = `${el.getAttribute('data-label')||el.innerHTML.split('<')[0]}<div class="num">${val.toLocaleString(undefined,{maximumFractionDigits:2})}</div>`;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      }
    });
  },{threshold:.3});
  counters.forEach(c=>io.observe(c));

  // Testimonials carousel
  const track = document.querySelector('#testimonialCarousel .carousel-track');
  if(track){
    document.querySelector('#testimonialCarousel .carousel-next').addEventListener('click',()=>{ track.scrollBy({left:300,behavior:'smooth'}); });
    document.querySelector('#testimonialCarousel .carousel-prev').addEventListener('click',()=>{ track.scrollBy({left:-300,behavior:'smooth'}); });
  }
})();


// ===== MENU MOBILE (Dropdown) – robusto e acessível =====
(function () {
    const toggle = document.getElementById('menuToggle');
    const mobile = document.getElementById('mobileNav');
    if (!toggle || !mobile) return;

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    function openMenu() {
        mobile.hidden = false;                  // mostra
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        // foco no primeiro link para acessibilidade
        const firstLink = mobile.querySelector('a');
        firstLink && firstLink.focus();
    }

    function closeMenu() {
        mobile.hidden = true;                   // esconde
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        toggle.focus();
    }

    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        isOpen() ? closeMenu() : openMenu();
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!isOpen()) return;
        const withinMenu = mobile.contains(e.target);
        const withinButton = toggle.contains(e.target);
        if (!withinMenu && !withinButton) { closeMenu(); }
    }, { capture: true });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) { e.preventDefault(); closeMenu(); }
    });

    // Fechar ao navegar
    mobile.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) { closeMenu(); }
    });

    // Sombreamento do header ao rolar (leve)
    const header = document.querySelector('.header');
    if (header) {
        const onScroll = () => header.style.boxShadow = (window.scrollY > 4) ? '0 2px 24px rgba(0,0,0,.25)' : 'none';
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
})();
