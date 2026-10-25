const menuButton = document.querySelector('.menu-button');
const nav = document.getElementById('primary-nav');
function closeMenu() {
  if (!menuButton || !nav) return;
  nav.classList.remove('open');
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
