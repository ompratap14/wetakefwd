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

// Purposeful motion: reveal the story in sequence and add restrained depth on capable devices.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const home=document.querySelector('.neo-home');
if(home&&!reduceMotion){
  document.documentElement.classList.add('premium-motion');
  const revealSections=[...home.querySelectorAll(':scope > section:not(.neo-hero)')];
  revealSections.forEach(section=>section.classList.add('motion-section'));
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('is-inview');
        revealObserver.unobserve(entry.target);
      });
    },{threshold:.08,rootMargin:'0px 0px -8%'});
    revealSections.forEach(section=>revealObserver.observe(section));
  }else revealSections.forEach(section=>section.classList.add('is-inview'));

  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(finePointer){
    home.addEventListener('pointermove',event=>{
      home.style.setProperty('--pointer-x',`${event.clientX}px`);
      home.style.setProperty('--pointer-y',`${event.clientY}px`);
    },{passive:true});
    home.querySelectorAll('.neo-card,.neo-story,.neo-authority-grid a,.neo-audit-grid').forEach(card=>{
      card.classList.add('motion-depth');
      card.addEventListener('pointermove',event=>{
        const rect=card.getBoundingClientRect();
        const rotateY=((event.clientX-rect.left)/rect.width-.5)*5;
        const rotateX=((event.clientY-rect.top)/rect.height-.5)*-5;
        card.style.setProperty('--tilt-x',`${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y',`${rotateY.toFixed(2)}deg`);
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--tilt-x','0deg');
        card.style.setProperty('--tilt-y','0deg');
      });
    });
  }
}
