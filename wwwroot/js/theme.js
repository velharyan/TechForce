(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('nxc_theme');
  if(saved) root.setAttribute('data-theme', saved);
  document.getElementById('themeToggle').addEventListener('click',()=>{
    const current = root.getAttribute('data-theme')==='light'?'dark':'light';
    root.setAttribute('data-theme', current); localStorage.setItem('nxc_theme', current);
  });
})();