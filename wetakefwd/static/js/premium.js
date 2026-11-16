const labTabs=[...document.querySelectorAll('[data-lab]')],labPanels=[...document.querySelectorAll('[data-lab-panel]')],labCode=document.querySelector('[data-lab-code]'),labCodes={lead:'LEAD / 001',document:'DOC / 002',support:'SUPPORT / 003'};
function selectLab(tab,focus=false){labTabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1});labPanels.forEach(panel=>{panel.hidden=panel.dataset.labPanel!==tab.dataset.lab});if(labCode)labCode.textContent=labCodes[tab.dataset.lab]||'';if(focus)tab.focus()}
labTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectLab(tab));tab.addEventListener('keydown',event=>{const step=event.key==='ArrowDown'||event.key==='ArrowRight'?1:event.key==='ArrowUp'||event.key==='ArrowLeft'?-1:0;if(!step)return;event.preventDefault();selectLab(labTabs[(index+step+labTabs.length)%labTabs.length],true)})});

const videoIntro=document.querySelector('[data-video-intro]'),introVideo=document.querySelector('[data-intro-video]'),introSkip=document.querySelector('[data-intro-skip]');
if(videoIntro){
  let seen=false;
  try{seen=sessionStorage.getItem('wetakefwd-intro-seen')==='1'}catch(error){}
  const closeIntro=()=>{if(videoIntro.classList.contains('is-closing'))return;videoIntro.classList.add('is-closing');document.body.classList.remove('intro-active');try{sessionStorage.setItem('wetakefwd-intro-seen','1')}catch(error){}window.dispatchEvent(new CustomEvent('wetakefwd:intro-complete'));setTimeout(()=>videoIntro.remove(),500)};
  if(seen||window.matchMedia('(prefers-reduced-motion: reduce)').matches){videoIntro.remove()}else{
    document.body.classList.add('intro-active');
    introSkip?.addEventListener('click',closeIntro);
    introVideo?.addEventListener('ended',closeIntro,{once:true});
    introVideo?.addEventListener('error',closeIntro,{once:true});
    const attempt=introVideo?.play();if(attempt?.catch)attempt.catch(closeIntro);
    setTimeout(closeIntro,6500);
  }
}

const setupFlyingText=()=>{
  const home=document.querySelector('.neo-home');
  if(!home||home.dataset.flyReady||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  home.dataset.flyReady='true';
  const directions=['left','right','up','down'];
  const items=[...home.querySelectorAll('section h1,section h2,section h3,section p,.neo-eyebrow,.neo-card-link,.neo-method-grid span,.neo-authority-grid span')].filter(item=>!item.closest('.neo-form'));
  items.forEach((item,index)=>{item.classList.add('fly-text');item.dataset.flyDir=directions[index%directions.length];item.style.setProperty('--fly-delay',`${Math.min((index%5)*55,220)}ms`)});
  const settle=item=>item.classList.add('is-settled');
  if(!('IntersectionObserver'in window)){items.forEach(settle);return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){settle(entry.target);observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -7%'});
  items.forEach(item=>observer.observe(item));
};
if(document.querySelector('[data-video-intro]')&&!document.querySelector('[data-video-intro]').classList.contains('is-closing'))window.addEventListener('wetakefwd:intro-complete',setupFlyingText,{once:true});else setupFlyingText();
