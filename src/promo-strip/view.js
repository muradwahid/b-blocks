/**
 * Promo Strip — frontend behavior.
 *
 * - Finds every `.bb-ps-timer[data-bb-ps-dest]` element (one per block instance).
 * - Parses the ISO 8601 destination date and ticks the countdown once a second.
 * - Writes zero-padded digit strings to `.bb-ps-digit` spans via `textContent`.
 * - Updates `aria-valuenow` on the timer wrapper for polling assistive tech.
 * - On expiry: either hides the whole strip or swaps in an expired message,
 *   depending on `data-bb-ps-on-expire`.
 * - Hover color swap for the CTA is CSS-only (custom properties) — no JS here.
 * - Per-instance init guard prevents double-binding (patterns / reusable blocks).
 */
import './style.scss';

const pad = ( n ) => String( n ).padStart( 2, '0' );

const closestStrip = ( el ) => ( el.closest ? el.closest( '.bb-ps' ) : null );

const renderTick = ( timer, diffMs ) => {
	const totalSeconds = Math.max( 0, Math.floor( diffMs / 1000 ) );

	const days = Math.floor( totalSeconds / 86400 );
	const hours = Math.floor( ( totalSeconds % 86400 ) / 3600 );
	const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
	const seconds = totalSeconds % 60;

	const values = { days, hours, minutes, seconds };

	timer.querySelectorAll( '.bb-ps-digit' ).forEach( ( digit ) => {
		const unit = digit.getAttribute( 'data-bb-ps-unit' );
		if ( unit in values ) {
			digit.textContent = pad( values[ unit ] );
		}
	} );

	timer.setAttribute( 'aria-valuenow', String( totalSeconds ) );
};

const handleExpire = ( timer ) => {
	const mode = timer.getAttribute( 'data-bb-ps-on-expire' ) || 'hide';
	const strip = closestStrip( timer );

	if ( 'message' === mode ) {
		const msg = timer.getAttribute( 'data-bb-ps-expired-msg' ) || '';
		// Message was escaped server-side via esc_attr( wp_strip_all_tags() ),
		// so it is plain text — assign it as textContent, not innerHTML.
		timer.textContent = '';
		timer.setAttribute( 'role', 'status' );
		timer.classList.add( 'bb-ps-timer--expired' );
		timer.textContent = msg;
		timer.setAttribute( 'aria-valuenow', '0' );
	} else if ( strip ) {
		strip.classList.add( 'bb-ps--expired' );
	}
};

const initTimer = ( timer ) => {
	if ( '1' === timer.getAttribute( 'data-bb-ps-init' ) ) {
		return;
	}
	timer.setAttribute( 'data-bb-ps-init', '1' );

	const destRaw = ( timer.getAttribute( 'data-bb-ps-dest' ) || '' ).trim();
	if ( ! destRaw ) {
		// No target date — leave digits at 00 and never start ticking.
		return;
	}

	const destDate = new Date( destRaw );
	if ( isNaN( destDate.getTime() ) ) {
		return;
	}

	const destTime = destDate.getTime();
	let intervalId = null;

	const tick = () => {
		const diff = destTime - Date.now();

		// Batch the DOM write into the next paint frame.
		const draw = () => {
			renderTick( timer, diff );
			if ( diff <= 0 ) {
				if ( intervalId !== null ) {
					window.clearInterval( intervalId );
					intervalId = null;
				}
				handleExpire( timer );
			}
		};

		if ( typeof window.requestAnimationFrame === 'function' ) {
			window.requestAnimationFrame( draw );
		} else {
			draw();
		}
	};

	// Immediate first render so the strip never flashes 00.
	tick();

	if ( destTime - Date.now() > 0 ) {
		intervalId = window.setInterval( tick, 1000 );
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	const timers = document.querySelectorAll( '.bb-ps-timer[data-bb-ps-dest]' );
	timers.forEach( ( timer ) => initTimer( timer ) );
} );
