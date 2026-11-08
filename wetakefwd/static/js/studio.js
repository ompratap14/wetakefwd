const intro = document.getElementById('brand-intro');
if (intro && document.documentElement.classList.contains('intro-pending')) {
  let finished = false;
  const background = [document.querySelector('.site-header'), document.querySelector('.site-footer'), ...document.querySelectorAll('#main > :not(.brand-intro)')].filter(Boolean);
  background.forEach(node => { node.inert = true; });
  const finish = () => {
    if (finished) return;
    finished = true;
    document.documentElement.classList.add('intro-leaving');
    window.setTimeout(() => {
      document.documentElement.classList.remove('intro-pending', 'intro-leaving');
      background.forEach(node => { node.inert = false; });
      if (intro.contains(document.activeElement)) document.getElementById('main')?.focus({ preventScroll: true });
      try { sessionStorage.setItem('wtf-intro-seen', '1'); } catch (_) {}
    }, 400);
  };
  intro.querySelector('.intro-skip')?.addEventListener('click', finish);
  intro.querySelector('.intro-progress')?.addEventListener('animationend', finish);
  window.setTimeout(finish, 3400);
}

const menuButton = document.querySelector('.menu-button');
const nav = document.getElementById('primary-nav');
function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  nav?.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeMenu();
    menuButton?.focus();
  }
});
window.matchMedia('(min-width: 821px)').addEventListener('change', closeMenu);

const pathTabs = [...document.querySelectorAll('[data-path]')];
const pathPanels = [...document.querySelectorAll('[data-panel]')];
function selectPath(tab, focus = false) {
  pathTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  pathPanels.forEach(panel => { panel.hidden = panel.dataset.panel !== tab.dataset.path; });
  if (focus) tab.focus();
}
pathTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPath(tab));
  tab.addEventListener('keydown', event => {
    const step = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : (event.key === 'ArrowLeft' || event.key === 'ArrowUp') ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    selectPath(pathTabs[(index + step + pathTabs.length) % pathTabs.length], true);
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
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  serviceRows.forEach(row => { row.hidden = selected !== 'all' && !categories[selected].includes(row.dataset.category); });
}));
