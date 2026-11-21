import { initAudioPreload } from './utils/audioPreloader';
import './index.css';

const container = document.getElementById('root');
const intro = document.querySelector('#portfolio-loader:not([hidden])');
const introFinished = intro
  ? new Promise((resolve) => document.addEventListener('portfolio-intro-finished', resolve, { once: true }))
  : Promise.resolve();

function preloadHomepageImages(theme) {
  const themedImages = theme === 'light'
    ? ['/images/orange_geometric_portrait.png', '/images/sunlit_studio.png']
    : ['/images/neon_thermal_portrait.webp', '/images/city_night_studio.png'];

  for (const src of [...themedImages, '/images/xray_portrait.webp', '/images/otakucircle_cover.jpg']) {
    const image = new Image();
    image.fetchPriority = 'low';
    image.src = src;
  }
}

initAudioPreload();
if (intro) preloadHomepageImages(intro.dataset.theme);

async function startPortfolio() {
  let mountPortfolio;
  try {
    ({ mountPortfolio } = await import('./mountPortfolio.jsx'));
  } finally {
    document.dispatchEvent(new Event('portfolio-bootstrap-ready'));
    await introFinished;
  }

  mountPortfolio(container);
}

startPortfolio().catch((error) => {
  console.error('Unable to start the portfolio', error);
  const message = document.createElement('p');
  message.className = 'portfolio-startup-message';
  message.setAttribute('role', 'alert');
  message.textContent = 'The portfolio couldn’t load. Refresh the page to try again.';
  container.replaceChildren(message);
});
