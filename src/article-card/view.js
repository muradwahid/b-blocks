/**
 * Article Card — frontend behavior.
 *
 * The card is rendered server-side as static HTML + CSS. All CTA hover states
 * are driven by native CSS `:hover` against scoped custom properties, so no JS
 * is required for them. When the whole card is wrapped in a single link
 * (cardLinkMode), the `:hover` selector on the `<a>` element also works
 * natively — but to allow a smooth lift the script only toggles a class so the
 * transition can be skipped under prefers-reduced-motion via CSS. Importing the
 * stylesheet here is what causes the build to emit the view.css referenced by
 * block.json.
 */
import './style.scss';

const init = () => {
	const cards = document.querySelectorAll('.bb-ac-link[data-bb-ac-hover]');

	cards.forEach((card) => {
		if (card.dataset.bbAcInit === 'true') {
			return;
		}
		card.dataset.bbAcInit = 'true';

		card.addEventListener('mouseenter', () => {
			card.classList.add('is-hover');
		});
		card.addEventListener('mouseleave', () => {
			card.classList.remove('is-hover');
		});
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
