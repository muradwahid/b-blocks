/**
 * Pricing Toggle — frontend behavior.
 *
 * - Reads the initial period from `data-bb-pt-default` and sets the
 *   `<button role="switch">` state + `aria-checked` accordingly.
 * - On click (Space/Enter handled natively by the button) flips the period,
 *   updates `aria-checked` and `aria-label`, swaps the active-label class, and
 *   animates the knob via the `--bb-pt-knob-x` custom property.
 * - Swaps the text of every price element carrying `data-bb-pt-monthly` /
 *   `data-bb-pt-annual` that lives inside a container sharing the same
 *   `data-bb-pt-group` value (defaults to "default").
 * - `prefers-reduced-motion` is honored via CSS (the transition is gated in
 *   style.scss); no JS animation logic to disable.
 * - A `data-bb-pt-init` guard prevents double-binding when the block is
 *   inserted twice (e.g. via a pattern).
 */
import './style.scss';

const collectPriceEls = ( group ) => {
	const all = document.querySelectorAll( '[data-bb-pt-monthly][data-bb-pt-annual]' );
	const matched = [];

	all.forEach( ( el ) => {
		// An element belongs to the toggle group if it (or an ancestor) declares
		// a matching data-bb-pt-group. When no group is declared anywhere we fall
		// back to the default group so a single toggle works out of the box.
		const scoped = el.closest( '[data-bb-pt-group]' );
		const elGroup = scoped ? scoped.getAttribute( 'data-bb-pt-group' ) : 'default';

		if ( elGroup === group ) {
			matched.push( el );
		}
	} );

	return matched;
};

const swapPrices = ( priceEls, period ) => {
	const attr = period === 'annual' ? 'data-bb-pt-annual' : 'data-bb-pt-monthly';

	priceEls.forEach( ( el ) => {
		const value = el.getAttribute( attr );
		if ( null !== value ) {
			el.textContent = value;
		}
	} );
};

const labelFor = ( wrapper, period ) => {
	const btn = wrapper.querySelector( '.bb-pt-switch' );
	if ( ! btn ) return '';

	return period === 'annual'
		? ( btn.getAttribute( 'data-bb-pt-annual-label' ) || 'Annually' )
		: ( btn.getAttribute( 'data-bb-pt-monthly-label' ) || 'Monthly' );
};

const applyState = ( wrapper, period, priceEls ) => {
	const isAnnual = period === 'annual';
	const btn = wrapper.querySelector( '.bb-pt-switch' );
	const monthlyLabel = wrapper.querySelector( '.bb-pt-label-monthly' );
	const annualLabel = wrapper.querySelector( '.bb-pt-label-annual' );

	if ( btn ) {
		btn.setAttribute( 'aria-checked', isAnnual ? 'true' : 'false' );
		const periodLabel = labelFor( wrapper, period );
		// translators: %s is the current billing period label (e.g. Monthly).
		btn.setAttribute( 'aria-label', `Billing period: ${ periodLabel }` );
	}

	if ( monthlyLabel ) monthlyLabel.classList.toggle( 'is-active', ! isAnnual );
	if ( annualLabel ) annualLabel.classList.toggle( 'is-active', isAnnual );

	wrapper.classList.toggle( 'is-annual', isAnnual );

	swapPrices( priceEls, period );
};

const initToggle = ( wrapper ) => {
	if ( wrapper.getAttribute( 'data-bb-pt-init' ) === '1' ) return;
	wrapper.setAttribute( 'data-bb-pt-init', '1' );

	const btn = wrapper.querySelector( '.bb-pt-switch' );
	if ( ! btn ) return;

	const group = wrapper.getAttribute( 'data-bb-pt-group' ) || 'default';
	const priceEls = collectPriceEls( group );

	let period = wrapper.getAttribute( 'data-bb-pt-default' ) === 'annual' ? 'annual' : 'monthly';

	// Apply the initial state (sync aria + labels + prices with the markup).
	applyState( wrapper, period, priceEls );

	btn.addEventListener( 'click', () => {
		period = period === 'annual' ? 'monthly' : 'annual';
		applyState( wrapper, period, priceEls );
	} );
};

document.addEventListener( 'DOMContentLoaded', () => {
	const toggles = document.querySelectorAll( '[data-bb-pricing-toggle]' );
	toggles.forEach( ( toggle ) => initToggle( toggle ) );
} );
