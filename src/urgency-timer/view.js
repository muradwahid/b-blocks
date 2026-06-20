/**
 * Urgency Timer — frontend behavior.
 *
 * 100% client-side. Two modes:
 *
 *  - "evergreen": the deadline is computed on first visit (now + duration) and
 *    persisted in localStorage under `storageKey`. A returning visitor within
 *    the window sees the real remaining time; one who returns after expiry gets
 *    the expired state (funnel integrity), never a fresh timer.
 *  - "recurring": the deadline is the next occurrence of resetDay@resetHour
 *    (ISO weekday 1=Mon..7=Sun, local time) minus the window duration, so it
 *    resets automatically without storage.
 *
 * Each tick writes zero-padded digits with textContent (never innerHTML),
 * updates a visually-hidden screen-reader label per unit, and keeps
 * `aria-valuenow` current. Respects prefers-reduced-motion and guards against
 * double-binding. No external dependencies.
 */
import './style.scss';

const pad = ( n ) => String( n ).padStart( 2, '0' );

/**
 * Build a map of unit key → visible label text by reading the server-rendered
 * `.bb-ut-unit-label` elements from the given timer container. Falling back to
 * the raw unit key keeps the screen-reader text meaningful even if the DOM is
 * unexpectedly empty.
 *
 * @param {Element} timerEl The `.bb-ut-timer` element.
 * @return {Object} e.g. { days: 'Days', hours: 'Hours', … }
 */
const buildUnitLabels = ( timerEl ) => {
	const map = {};
	timerEl.querySelectorAll( '.bb-ut-unit' ).forEach( ( unitEl ) => {
		const digit = unitEl.querySelector( '.bb-ut-digit' );
		const labelEl = unitEl.querySelector( '.bb-ut-unit-label' );
		if ( digit && labelEl ) {
			const key = digit.getAttribute( 'data-bb-ut-unit' );
			if ( key ) {
				map[ key ] = ( labelEl.textContent || key ).trim();
			}
		}
	} );
	return map;
};

const reduceMotion = () =>
	window.matchMedia &&
	window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

const parseConfig = ( timer ) => {
	const raw = timer.getAttribute( 'data-bb-ut-config' );
	if ( ! raw ) {
		return null;
	}
	try {
		return JSON.parse( raw );
	} catch ( e ) {
		return null;
	}
};

const durationMs = ( d ) => {
	const days = Math.max( 0, parseInt( d.days, 10 ) || 0 );
	const hours = Math.max( 0, parseInt( d.hours, 10 ) || 0 );
	const minutes = Math.max( 0, parseInt( d.minutes, 10 ) || 0 );
	const seconds = Math.max( 0, parseInt( d.seconds, 10 ) || 0 );
	return ( ( days * 86400 ) + ( hours * 3600 ) + ( minutes * 60 ) + seconds ) * 1000;
};

/**
 * Most-recent past occurrence (epoch ms) of an ISO weekday (1=Mon..7=Sun) at a
 * given hour in the browser's local time. Returns a timestamp <= now.
 */
const prevResetTime = ( isoDay, hour ) => {
	const now = new Date();
	// JS getDay(): 0=Sun..6=Sat → convert to ISO 1=Mon..7=Sun.
	const currentIso = now.getDay() === 0 ? 7 : now.getDay();
	// How many days ago was the target weekday?
	let dayDelta = ( currentIso - isoDay + 7 ) % 7;

	const candidate = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() - dayDelta,
		hour, 0, 0, 0
	);

	// If the candidate is in the future (same weekday but hour hasn't occurred
	// yet today), step back one full week.
	if ( candidate.getTime() > now.getTime() ) {
		candidate.setDate( candidate.getDate() - 7 );
	}
	return candidate.getTime();
};

/**
 * Next occurrence (epoch ms) of an ISO weekday (1=Mon..7=Sun) at a given hour
 * in the browser's local time, strictly in the future.
 */
const nextResetTime = ( isoDay, hour ) => {
	const now = new Date();
	// JS getDay(): 0=Sun..6=Sat → convert to ISO 1=Mon..7=Sun.
	const currentIso = now.getDay() === 0 ? 7 : now.getDay();
	let dayDelta = ( isoDay - currentIso + 7 ) % 7;

	const candidate = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + dayDelta,
		hour, 0, 0, 0
	);

	// If the computed instant is in the past (e.g. today but hour already
	// passed), roll forward a full week.
	if ( candidate.getTime() <= now.getTime() ) {
		candidate.setDate( candidate.getDate() + 7 );
	}
	return candidate.getTime();
};

const computeDeadline = ( config ) => {
	const now = Date.now();

	if ( 'recurring' === config.mode ) {
		const r = config.recurring || {};
		const isoDay = Math.min( 7, Math.max( 1, parseInt( r.resetDay, 10 ) || 1 ) );
		const hour = Math.min( 23, Math.max( 0, parseInt( r.resetHour, 10 ) || 0 ) );
		const durMs = durationMs( r );

		// Check if we are currently inside an active window.
		// prevReset is the most-recent past reset instant.
		const prevReset = prevResetTime( isoDay, hour );
		const windowEnd = prevReset + durMs;

		if ( now < windowEnd ) {
			// Inside the active window — count down to when this window closes.
			return windowEnd;
		}

		// Outside any active window (offer has ended for this cycle).
		// Count down to the next reset so the visitor knows when the next
		// window opens. The timer will reach zero at reset and then immediately
		// recompute to enter the new active window on the next page load.
		return nextResetTime( isoDay, hour );
	}

	// Evergreen: persist a per-visitor deadline in localStorage.
	const ever = config.evergreen || {};
	const span = durationMs( ever );
	const key = config.storageKey;

	let stored = null;
	try {
		stored = window.localStorage ? window.localStorage.getItem( key ) : null;
	} catch ( e ) {
		stored = null;
	}

	if ( stored ) {
		const parsed = parseInt( stored, 10 );
		if ( ! isNaN( parsed ) && parsed > now ) {
			return parsed;
		}
		// Stored deadline already passed → keep it (expired state, not a reset).
		if ( ! isNaN( parsed ) ) {
			return parsed;
		}
	}

	const deadline = now + span;
	try {
		if ( window.localStorage ) {
			window.localStorage.setItem( key, String( deadline ) );
		}
	} catch ( e ) {
		// Storage unavailable (private mode / quota) — timer still runs this session.
	}
	return deadline;
};

const renderTick = ( timer, diffMs, unitLabels ) => {
	const totalSeconds = Math.max( 0, Math.floor( diffMs / 1000 ) );

	const days = Math.floor( totalSeconds / 86400 );
	const hours = Math.floor( ( totalSeconds % 86400 ) / 3600 );
	const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
	const seconds = totalSeconds % 60;

	const values = { days, hours, minutes, seconds };

	timer.querySelectorAll( '.bb-ut-digit' ).forEach( ( digit ) => {
		const unit = digit.getAttribute( 'data-bb-ut-unit' );
		if ( unit in values ) {
			digit.textContent = pad( values[ unit ] );
		}
	} );

	timer.querySelectorAll( '[data-bb-ut-sr]' ).forEach( ( sr ) => {
		const unit = sr.getAttribute( 'data-bb-ut-sr' );
		if ( unit in values ) {
			sr.textContent = `${ values[ unit ] } ${ ( unitLabels && unitLabels[ unit ] ) || unit }`;
		}
	} );

	timer.setAttribute( 'aria-valuenow', String( totalSeconds ) );
};

const handleExpire = ( wrapper, timer, config ) => {
	if ( 'hide' === config.onExpire ) {
		wrapper.hidden = true;
		wrapper.classList.add( 'bb-ut--expired-hidden' );
		return;
	}

	const expired = wrapper.querySelector( '.bb-ut-expired' );
	timer.hidden = true;
	if ( expired ) {
		expired.hidden = false;
	}
	wrapper.classList.add( 'bb-ut--expired' );
};

const initTimer = ( timer ) => {
	if ( '1' === timer.dataset.bbUtInit ) {
		return;
	}
	timer.dataset.bbUtInit = '1';

	const config = parseConfig( timer );
	if ( ! config ) {
		return;
	}

	const wrapper = timer.closest ? timer.closest( '.bb-ut' ) : null;
	if ( ! wrapper ) {
		return;
	}

	if ( reduceMotion() ) {
		wrapper.classList.add( 'bb-ut--reduced-motion' );
	}

	// Respond to mid-session OS motion-preference changes.
	if ( window.matchMedia ) {
		const mq = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		const onChange = ( e ) => {
			wrapper.classList.toggle( 'bb-ut--reduced-motion', e.matches );
		};
		if ( mq.addEventListener ) {
			mq.addEventListener( 'change', onChange );
		} else if ( mq.addListener ) {
			mq.addListener( onChange );
		}
	}

	// Build unit-label map from server-rendered DOM (i18n-aware, avoids
	// hardcoded English strings in the view script).
	const unitLabels = buildUnitLabels( timer );

	const deadline = computeDeadline( config );
	let intervalId = null;

	const tick = () => {
		const diff = deadline - Date.now();
		renderTick( timer, diff, unitLabels );

		if ( diff <= 0 ) {
			if ( intervalId !== null ) {
				window.clearInterval( intervalId );
				intervalId = null;
			}
			handleExpire( wrapper, timer, config );
		}
	};

	// Immediate first render so the timer never lingers at 00.
	tick();

	if ( deadline - Date.now() > 0 ) {
		intervalId = window.setInterval( tick, 1000 );
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	const timers = document.querySelectorAll( '.bb-ut-timer[data-bb-ut-config]' );
	timers.forEach( ( timer ) => initTimer( timer ) );
} );
