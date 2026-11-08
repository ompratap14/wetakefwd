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
  const visible = serviceRows.filter(row => !row.hidden).length;
  const heading = document.querySelector('[data-filter-heading]');
  const count = document.querySelector('[data-filter-count]');
  const headings = { all: 'Explore every capability', visibility: 'Make your business easier to find', conversion: 'Turn interest into conversations', systems: 'Connect the work behind growth' };
  if (heading) heading.textContent = headings[selected];
  if (count) count.textContent = `${visible} service${visible === 1 ? '' : 's'}`;
}));

const exampleTabs = [...document.querySelectorAll('[data-example-tab]')];
const examplePanels = [...document.querySelectorAll('[data-example-panel]')];
function selectExample(tab, focus = false) {
  exampleTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  examplePanels.forEach(panel => { panel.hidden = panel.dataset.examplePanel !== tab.dataset.exampleTab; });
  if (focus) tab.focus();
}
exampleTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectExample(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    selectExample(exampleTabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + exampleTabs.length) % exampleTabs.length], true);
  });
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const motionItems = document.querySelectorAll('.friction-grid article,.solution-card,.process-grid article,.about-grid>div,.directory-row,.scope-list>div,.related-grid a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  motionItems.forEach((item, index) => {
    item.classList.add('reveal-motion');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(item);
  });
}
