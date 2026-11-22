const labTabs=[...document.querySelectorAll('[data-lab]')],labPanels=[...document.querySelectorAll('[data-lab-panel]')],labCode=document.querySelector('[data-lab-code]'),labCodes={lead:'LEAD / 001',document:'DOC / 002',support:'SUPPORT / 003'};
function selectLab(tab,focus=false){labTabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1});labPanels.forEach(panel=>{panel.hidden=panel.dataset.labPanel!==tab.dataset.lab});if(labCode)labCode.textContent=labCodes[tab.dataset.lab]||'';if(focus)tab.focus()}
labTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectLab(tab));tab.addEventListener('keydown',event=>{const step=event.key==='ArrowDown'||event.key==='ArrowRight'?1:event.key==='ArrowUp'||event.key==='ArrowLeft'?-1:0;if(!step)return;event.preventDefault();selectLab(labTabs[(index+step+labTabs.length)%labTabs.length],true)})});

const videoIntro=document.querySelector('[data-video-intro]'),introVideo=document.querySelector('[data-intro-video]');
if(videoIntro){
  let seen=false;
  try{seen=sessionStorage.getItem('wetakefwd-intro-seen')==='1'}catch(error){}
  const closeIntro=()=>{if(videoIntro.classList.contains('is-closing'))return;videoIntro.classList.add('is-closing');document.body.classList.remove('intro-active');try{sessionStorage.setItem('wetakefwd-intro-seen','1')}catch(error){}setTimeout(()=>videoIntro.remove(),500)};
  if(seen||window.matchMedia('(prefers-reduced-motion: reduce)').matches){videoIntro.remove()}else{
    document.body.classList.add('intro-active');
    introVideo?.addEventListener('ended',closeIntro,{once:true});
    introVideo?.addEventListener('error',closeIntro,{once:true});
    const attempt=introVideo?.play();if(attempt?.catch)attempt.catch(closeIntro);
    setTimeout(closeIntro,6500);
  }
}

const brandStrip = document.querySelector('.brand-flight');
if (brandStrip && 'IntersectionObserver' in window) {
  brandStrip.classList.add('waiting');
  const arrivalObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    brandStrip.classList.replace('waiting', 'arrived');
    arrivalObserver.disconnect();
  }, { threshold: 0.15 });
  arrivalObserver.observe(brandStrip);
}
