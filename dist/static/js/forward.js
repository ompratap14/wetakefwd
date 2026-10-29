const menuButton = document.querySelector('.menu-button');
const intro = document.getElementById('brand-intro');
if (intro && document.documentElement.classList.contains('intro-pending')) {
  let closed = false;
  const pageParts = [document.querySelector('.site-header'), document.querySelector('.site-footer'), ...document.querySelectorAll('#main > :not(.brand-intro)')].filter(Boolean);
  pageParts.forEach(part => { part.inert = true; });
  const finishIntro = () => {
    if (closed) return;
    closed = true;
    document.documentElement.classList.add('intro-leaving');
    window.setTimeout(() => {
      document.documentElement.classList.remove('intro-pending', 'intro-leaving');
      pageParts.forEach(part => { part.inert = false; });
      if (intro.contains(document.activeElement)) document.querySelector('#main')?.focus({ preventScroll: true });
      try { sessionStorage.setItem('wtf-intro-seen', '1'); } catch (e) {}
    }, 450);
  };
  intro.querySelector('.intro-skip').addEventListener('click', finishIntro);
  intro.addEventListener('animationend', event => {
    if (event.target.classList.contains('intro-progress')) finishIntro();
  });
  window.setTimeout(finishIntro, 3500);
}
const nav = document.getElementById('primary-nav');
const servicesMenu = document.querySelector('.nav-services');
document.addEventListener('click', event => {
  if (servicesMenu && !servicesMenu.contains(event.target)) servicesMenu.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && servicesMenu?.open) {
    servicesMenu.open = false;
    servicesMenu.querySelector('summary').focus();
  }
});
function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('open');
  if (servicesMenu) servicesMenu.open = false;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', closeMenu);
}

const focusTabs = [...document.querySelectorAll('[data-focus]')];
const results = [...document.querySelectorAll('[data-result]')];
function selectFocus(tab, focus = false) {
  focusTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  results.forEach(result => {
    result.hidden = result.dataset.result !== tab.dataset.focus;
  });
  if (focus) tab.focus();
}
focusTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectFocus(tab));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const previous = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!next && !previous) return;
    event.preventDefault();
    selectFocus(focusTabs[(index + (next ? 1 : -1) + focusTabs.length) % focusTabs.length], true);
  });
});

const filters = [...document.querySelectorAll('[data-filter]')];
const serviceRows = [...document.querySelectorAll('[data-category]')];
const categories = {
  visibility: ['build', 'market', 'search'],
  conversion: ['growth', 'customer journey', 'market'],
  systems: ['automate', 'ai systems', 'customer journey', 'build', 'care']
};
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  serviceRows.forEach(row => {
    row.hidden = selected !== 'all' && !categories[selected].includes(row.dataset.category);
  });
}));
