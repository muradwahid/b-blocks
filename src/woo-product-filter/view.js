/**
 * Woo Product Filter — frontend progressive enhancement.
 *
 * The block is fully functional without JavaScript: it is a native
 * `<form method="get">` that navigates to the current URL with WooCommerce
 * query params appended, and a plain `<a href>` Clear All link. This script
 * only enhances that baseline:
 *
 *   1. Live price label & range constraints. The two `<input type="range">`
 *      sliders keep the live `<output>` updated (formatted with the currency
 *      symbol from `data-currency-symbol`), stay in order (min never exceeds
 *      max), and stay in sync with the paired number inputs.
 *   2. Auto-submit. When `data-auto-submit="1"` (Apply button hidden), any
 *      change to a field debounced-submits the form (300 ms).
 *   3. Clear All. The reset link first clears every field instantly, then
 *      follows its href.
 *   4. Busy state. On submit the Apply button gets `aria-busy="true"` and a
 *      loading class to prevent double submission.
 *
 * Per-instance init is guarded so a pattern inserting the block twice never
 * double-binds. No external libraries.
 */
import './style.scss';

( function () {
	const SELECTOR = '.bb-wpf[data-bb-wpf="true"]';

	const formatPrice = ( symbol, value ) => symbol + value;

	const init = () => {
		const panels = Array.prototype.slice
			.call( document.querySelectorAll( SELECTOR ) )
			.filter( ( panel ) => panel.dataset.bbWpfInit !== '1' );

		if ( ! panels.length ) {
			return;
		}

		panels.forEach( ( panel ) => {
			panel.dataset.bbWpfInit = '1';

			const form = panel.querySelector( '.bb-wpf-form' );
			if ( ! form ) {
				return;
			}

			const autoSubmit = panel.dataset.autoSubmit === '1';
			const symbol = panel.dataset.currencySymbol || '';

			const minSlider = form.querySelector( '.bb-wpf-slider--min' );
			const maxSlider = form.querySelector( '.bb-wpf-slider--max' );
			const minNum = form.querySelector( '.bb-wpf-num--min' );
			const maxNum = form.querySelector( '.bb-wpf-num--max' );
			const priceLabel = form.querySelector( '.bb-wpf-price-label' );
			const applyBtn = form.querySelector( '.bb-wpf-apply' );
			const clearLink = form.querySelector( '.bb-wpf-clear' );

			let submitTimer = null;
			const queueSubmit = () => {
				if ( ! autoSubmit ) {
					return;
				}
				window.clearTimeout( submitTimer );
				submitTimer = window.setTimeout( () => {
					if ( typeof form.requestSubmit === 'function' ) {
						form.requestSubmit();
					} else {
						form.submit();
					}
				}, 300 );
			};

			const updatePriceLabel = () => {
				if ( ! priceLabel || ! minSlider || ! maxSlider ) {
					return;
				}
				const lo = minSlider.value;
				const hi = maxSlider.value;
				priceLabel.textContent =
					formatPrice( symbol, lo ) + ' – ' + formatPrice( symbol, hi );

				minSlider.setAttribute(
					'aria-valuetext',
					formatPrice( symbol, lo )
				);
				maxSlider.setAttribute(
					'aria-valuetext',
					formatPrice( symbol, hi )
				);
			};

			// Keep sliders ordered and number inputs in sync.
			if ( minSlider && maxSlider ) {
				minSlider.addEventListener( 'input', () => {
					if ( Number( minSlider.value ) > Number( maxSlider.value ) ) {
						minSlider.value = maxSlider.value;
					}
					if ( minNum ) {
						minNum.value = minSlider.value;
					}
					updatePriceLabel();
				} );

				maxSlider.addEventListener( 'input', () => {
					if ( Number( maxSlider.value ) < Number( minSlider.value ) ) {
						maxSlider.value = minSlider.value;
					}
					if ( maxNum ) {
						maxNum.value = maxSlider.value;
					}
					updatePriceLabel();
				} );

				updatePriceLabel();
			}

			// Number inputs drive the sliders.
			if ( minNum && minSlider ) {
				minNum.addEventListener( 'input', () => {
					if ( minNum.value !== '' ) {
						minSlider.value = minNum.value;
						if (
							Number( minSlider.value ) > Number( maxSlider.value )
						) {
							maxSlider.value = minSlider.value;
							if ( maxNum ) {
								maxNum.value = maxSlider.value;
							}
						}
						updatePriceLabel();
					}
				} );
			}
			if ( maxNum && maxSlider ) {
				maxNum.addEventListener( 'input', () => {
					if ( maxNum.value !== '' ) {
						maxSlider.value = maxNum.value;
						if (
							Number( maxSlider.value ) < Number( minSlider.value )
						) {
							minSlider.value = maxSlider.value;
							if ( minNum ) {
								minNum.value = minSlider.value;
							}
						}
						updatePriceLabel();
					}
				} );
			}

			// Auto-submit on any field change.
			if ( autoSubmit ) {
				form.addEventListener( 'change', queueSubmit );
			}

			// Busy state on submit.
			form.addEventListener( 'submit', () => {
				if ( applyBtn ) {
					applyBtn.setAttribute( 'aria-busy', 'true' );
					applyBtn.classList.add( 'is-loading' );
				}
			} );

			// Clear All: reset fields instantly, then navigate.
			if ( clearLink ) {
				clearLink.addEventListener( 'click', () => {
					form
						.querySelectorAll(
							'input[type="radio"], input[type="checkbox"]'
						)
						.forEach( ( el ) => {
							el.checked = el.value === '';
						} );
					form
						.querySelectorAll( '.bb-wpf-num' )
						.forEach( ( el ) => {
							el.value = '';
						} );
					const sel = form.querySelector( '.bb-wpf-select' );
					if ( sel ) {
						sel.selectedIndex = 0;
					}
				} );
			}
		} );
	};

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
