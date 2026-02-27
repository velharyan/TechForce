// Background particle animation + interactive ripple on buttons
// Lightweight, no external deps — suitable for modern browsers
(function(){
    'use strict';

    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0; let height = 0; let dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize(){
        width = window.innerWidth; height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    window.addEventListener('resize', resize);
    resize();

    // particles
    const count = Math.round(Math.max(20, Math.min(100, (width*height)/80000)));
    const particles = [];

    function rand(min, max){ return Math.random()*(max-min)+min }

    function createParticles(){
        particles.length = 0;
        for(let i=0;i<count;i++){
            particles.push({
                x: rand(0,width),
                y: rand(0,height),
                vx: rand(-0.2,0.6),
                vy: rand(-0.2,0.2),
                r: rand(0.5,2.6),
                hue: rand(180,300),
                alpha: rand(0.05,0.25)
            });
        }
    }

    createParticles();

    // mouse interactive
    const mouse = {x: -9999, y: -9999, down: false};
    window.addEventListener('pointermove', (e)=>{ mouse.x = e.clientX; mouse.y = e.clientY });
    window.addEventListener('pointerdown', ()=> mouse.down = true);
    window.addEventListener('pointerup', ()=> mouse.down = false);

    function step(){
        ctx.clearRect(0,0,width,height);

        // gradient overlay
        const g = ctx.createLinearGradient(0,0,width,height);
        g.addColorStop(0, 'rgba(6,182,212,.06)');
        g.addColorStop(0.5, 'rgba(124,58,237,.05)');
        g.addColorStop(1, 'rgba(7,89,121,.03)');
        ctx.fillStyle = g;
        ctx.fillRect(0,0,width,height);

        // draw particles
        for(const p of particles){
            // attraction to mouse
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            if(dist < 120){
                const f = (120 - dist)/120;
                p.vx += (dx/dist) * 0.02 * f;
                p.vy += (dy/dist) * 0.02 * f;
            }

            p.x += p.vx;
            p.y += p.vy;

            // wrap
            if(p.x < -10) p.x = width + 10;
            if(p.x > width + 10) p.x = -10;
            if(p.y < -10) p.y = height + 10;
            if(p.y > height + 10) p.y = -10;

            // draw halo
            ctx.beginPath();
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(8, p.r*6));
            grad.addColorStop(0, `hsla(${p.hue},80%,65%,${p.alpha})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(p.x - p.r*6, p.y - p.r*6, p.r*12, p.r*12);
        }

        // connect nearby
        for(let i=0;i<particles.length;i++){
            for(let j=i+1;j<particles.length;j++){
                const a = particles[i], b = particles[j];
                const dx = a.x-b.x, dy = a.y-b.y; const dd=dx*dx+dy*dy;
                if(dd < 16000){
                    const alpha = 0.06*(1 - (dd/16000));
                    ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
                }
            }
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    // simple ripple for buttons
    function onPointerDown(e){
        const btn = e.target.closest('.btn');
        if(!btn) return;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        const size = Math.max(rect.width, rect.height)*1.4;
        ripple.style.width = ripple.style.height = size + 'px';
        btn.appendChild(ripple);
        setTimeout(()=>{ ripple.remove() }, 700);
    }

    document.addEventListener('pointerdown', onPointerDown);

    // initialize header scroll class
    const header = document.getElementById('mainHeader');
    function checkScroll(){ if(!header) return; if(window.scrollY>50) header.classList.add('scrolled'); else header.classList.remove('scrolled'); }
    window.addEventListener('scroll', checkScroll);
    checkScroll();

})();
