const menuButton = document.querySelector('.menu-button');
const navigation = document.getElementById('primary-nav');
function closeMenu() {
  if (!menuButton || !navigation) return;
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', closeMenu);
}

const pathTabs = [...document.querySelectorAll('[data-path]')];
const pathPanels = [...document.querySelectorAll('[data-panel]')];
function activatePath(tab, focus = false) {
  const selected = tab.dataset.path;
  pathTabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  pathPanels.forEach(panel => {
    const active = panel.dataset.panel === selected;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
  if (focus) tab.focus();
}
pathTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activatePath(tab));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowDown' || event.key === 'ArrowRight';
    const previous = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
    if (!next && !previous) return;
    event.preventDefault();
    activatePath(pathTabs[(index + (next ? 1 : -1) + pathTabs.length) % pathTabs.length], true);
  });
});

const filters = [...document.querySelectorAll('[data-filter]')];
const services = [...document.querySelectorAll('[data-category]')];
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
  services.forEach(service => {
    service.hidden = selected !== 'all' && !categories[selected].includes(service.dataset.category);
  });
}));
