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
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

const filters = document.querySelectorAll('[data-filter]');
const serviceItems = document.querySelectorAll('[data-category]');
if (filters.length && serviceItems.length) {
  const groups = {
    build: ['build'],
    market: ['market', 'search'],
    automate: ['automate', 'ai systems', 'customer journey'],
    grow: ['growth', 'care']
  };
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    serviceItems.forEach(item => {
      item.hidden = selected !== 'all' && !groups[selected].includes(item.dataset.category);
    });
  }));
}
