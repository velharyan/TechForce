(function(){
  const banner = document.getElementById('cookieBanner');
  const prefs = JSON.parse(localStorage.getItem('nxc_cookies')||'{}');
  if(!prefs.version){
    banner.hidden = false;
  }
  document.getElementById('btnAcceptAll').addEventListener('click',()=>{
    localStorage.setItem('nxc_cookies', JSON.stringify({version:1, necessary:true, analytics:true, marketing:true}));
    banner.hidden = true; location.reload();
  });
  document.getElementById('btnSavePrefs').addEventListener('click',()=>{
    const analytics = document.getElementById('ckAnalytics').checked;
    const marketing = document.getElementById('ckMarketing').checked;
    localStorage.setItem('nxc_cookies', JSON.stringify({version:1, necessary:true, analytics, marketing}));
    banner.hidden = true; location.reload();
  });
})();