// hero-image: image variant of the hero block.
// Background image with an overlaid heading (LCP-friendly). CSS-only decoration.
export default function decorate(block) {
  block.classList.add('hero-image');
  const img = block.querySelector('img');
  if (img) img.setAttribute('fetchpriority', 'high');
}
