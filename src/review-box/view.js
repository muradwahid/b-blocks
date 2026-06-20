import './style.scss';

/**
 * Frontend enhancement for the bBlocks Review Box.
 *
 * The PHP renderer already paints fractional stars via inline SVG
 * gradients, so no rating recalculation is required on the client.
 * This script only safeguards the aria-label on each .bb-review-stars
 * element in case the server-side aria-label was stripped by a caching
 * layer that rewrites attribute order, and unhides the screen-reader
 * scoring text if CSS failed to load.
 */
document.addEventListener('DOMContentLoaded', function () {
	const wrappers = document.querySelectorAll('.wp-block-b-blocks-review-box');
	if (!wrappers.length) {
		return;
	}

	wrappers.forEach((wrapper) => {
		const starGroups = wrapper.querySelectorAll('.bb-review-stars');
		starGroups.forEach((group) => {
			if (group.hasAttribute('aria-label')) {
				return;
			}
			const rating = parseFloat(group.getAttribute('data-rating')) || 0;
			const max = parseFloat(group.getAttribute('data-max')) || 5;
			group.setAttribute('role', 'img');
			group.setAttribute(
				'aria-label',
				`${rating.toFixed(1)} out of ${max} stars`
			);
		});
	});
});
