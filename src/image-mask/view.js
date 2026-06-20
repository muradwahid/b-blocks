/**
 * Image Mask Block — frontend entry point.
 *
 * The block is almost entirely static: shapes are CSS clip-path / inline
 * SVG <clipPath> / CSS mask-image, and the optional hover zoom / tilt is
 * pure CSS. The only JavaScript responsibility is honoring
 * `prefers-reduced-motion: reduce`: when it matches we set the
 * `--bb-im-transition` custom property to 0ms on every block instance so
 * all hover transitions snap instantly (the CSS media query already covers
 * this, but the inline override guarantees it even if a theme overrides the
 * media query rule).
 *
 * Importing style.scss lets @wordpress/scripts extract it into view.css,
 * which block.json references via its "style" field.
 */
import './style.scss';

const applyReducedMotion = () => {
	if (typeof window === 'undefined' || !window.matchMedia) {
		return;
	}

	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (!prefersReduced.matches) {
		return;
	}

	const blocks = document.querySelectorAll('.bb-im-block');
	blocks.forEach((block) => {
		block.style.setProperty('--bb-im-transition', '0ms');
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', applyReducedMotion);
} else {
	applyReducedMotion();
}
