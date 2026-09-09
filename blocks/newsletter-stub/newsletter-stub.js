// newsletter-stub: static, non-submitting newsletter call-to-action.
// The source newsletter is a full subscriber/account service (newsletter/v1, mailguide.cz);
// it is intentionally NOT wired here. This renders a visual stub only for the pilot.
export default function decorate(block) {
  block.querySelectorAll('form').forEach((form) => form.removeAttribute('action'));
  const cta = block.querySelector('a');
  if (cta) {
    cta.setAttribute('aria-disabled', 'true');
    cta.addEventListener('click', (e) => e.preventDefault());
  }
}
