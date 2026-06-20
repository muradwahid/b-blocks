/**
 * Business Hours — frontend entry.
 *
 * The schedule itself is server-rendered HTML; this script only:
 *   1) Re-computes "today" relative to the visitor's clock so the correct
 *      row gets `.is-today` even when render.php's day-of-week disagrees
 *      (the server can pre-render any day; we just need the badge and
 *      highlight to match the live timezone "now").
 *   2) Hydrates the live Open Now / Closed badge and refreshes it every
 *      60 seconds while the page is open.
 *
 * No external dependencies — uses the platform Intl.DateTimeFormat API
 * to read the current hour/minute in the configured IANA timezone.
 */
import './style.scss';

const DAY_LABELS = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

const safeJsonParse = ( raw, fallback ) => {
	try {
		const value = JSON.parse( raw );
		return value || fallback;
	} catch ( e ) {
		return fallback;
	}
};

// Convert a JS-style day-of-week (0=Sunday … 6=Saturday) into the index
// in our Mon..Sun ordered schedule array (Mon=0 … Sun=6).
const dowToArrayIndex = ( jsDow ) => ( 0 === jsDow ? 6 : jsDow - 1 );

// Read the current weekday + time in the configured IANA timezone.
const getNowInTimezone = ( timezone ) => {
	try {
		const parts = new Intl.DateTimeFormat( 'en-US', {
			timeZone: timezone || 'UTC',
			weekday: 'short',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		} ).formatToParts( new Date() );

		let weekday = '';
		let hour = 0;
		let minute = 0;
		parts.forEach( ( p ) => {
			if ( 'weekday' === p.type ) {
				weekday = p.value;
			} else if ( 'hour' === p.type ) {
				// Intl can return "24" in some locales for midnight; clamp.
				const h = parseInt( p.value, 10 );
				hour = Number.isFinite( h ) ? h % 24 : 0;
			} else if ( 'minute' === p.type ) {
				const m = parseInt( p.value, 10 );
				minute = Number.isFinite( m ) ? m : 0;
			}
		} );

		const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
		const dow = map[ weekday ] !== undefined ? map[ weekday ] : new Date().getDay();
		return { dow, minutes: hour * 60 + minute };
	} catch ( e ) {
		const d = new Date();
		return { dow: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
	}
};

// Convert "HH:MM" → minutes-since-midnight, or null if invalid.
const parseHhmm = ( hhmm ) => {
	if ( 'string' !== typeof hhmm ) {
		return null;
	}
	const m = hhmm.match( /^(\d{1,2}):(\d{2})$/ );
	if ( ! m ) {
		return null;
	}
	const h = parseInt( m[ 1 ], 10 );
	const mi = parseInt( m[ 2 ], 10 );
	if ( h < 0 || h > 23 || mi < 0 || mi > 59 ) {
		return null;
	}
	return h * 60 + mi;
};

const computeIsOpen = ( schedule, dow, nowMinutes ) => {
	const idx = dowToArrayIndex( dow );
	const entry = schedule[ idx ];
	if ( ! entry || ! entry.open ) {
		return false;
	}
	const from = parseHhmm( entry.timeFrom );
	const to = parseHhmm( entry.timeTo );
	if ( null === from || null === to ) {
		return false;
	}
	if ( to > from ) {
		return nowMinutes >= from && nowMinutes < to;
	}
	if ( to < from ) {
		// Overnight window (e.g. 22:00 – 02:00).
		return nowMinutes >= from || nowMinutes < to;
	}
	return false;
};

const applyTodayHighlight = ( blockEl, dow ) => {
	if ( 'true' !== blockEl.dataset.highlightToday ) {
		return;
	}
	const rows = blockEl.querySelectorAll( '.bb-bh-row' );
	rows.forEach( ( row ) => {
		const rowDow = parseInt( row.dataset.dayIndex, 10 );
		if ( Number.isFinite( rowDow ) && rowDow === dow ) {
			row.classList.add( 'is-today' );
			row.setAttribute( 'data-today', '1' );
			row.setAttribute( 'aria-current', 'true' );
		} else {
			row.classList.remove( 'is-today' );
			row.removeAttribute( 'data-today' );
			row.removeAttribute( 'aria-current' );
		}
	} );
};

const updateBadge = ( blockEl, schedule ) => {
	if ( 'true' !== blockEl.dataset.showBadge ) {
		return;
	}
	const timezone = blockEl.dataset.timezone || 'UTC';
	const { dow, minutes } = getNowInTimezone( timezone );
	const isOpen = computeIsOpen( schedule, dow, minutes );

	const openBadge = blockEl.querySelector( '.bb-bh-badge[data-badge="open"]' );
	const closedBadge = blockEl.querySelector( '.bb-bh-badge[data-badge="closed"]' );

	if ( openBadge ) {
		if ( isOpen ) {
			openBadge.removeAttribute( 'hidden' );
			openBadge.removeAttribute( 'aria-hidden' );
		} else {
			openBadge.setAttribute( 'hidden', '' );
			openBadge.setAttribute( 'aria-hidden', 'true' );
		}
	}
	if ( closedBadge ) {
		if ( ! isOpen ) {
			closedBadge.removeAttribute( 'hidden' );
			closedBadge.removeAttribute( 'aria-hidden' );
		} else {
			closedBadge.setAttribute( 'hidden', '' );
			closedBadge.setAttribute( 'aria-hidden', 'true' );
		}
	}

	// Update today's row highlight whenever we tick. Day-of-week can roll
	// over while the page is left open across midnight.
	applyTodayHighlight( blockEl, dow );
};

const init = () => {
	const blocks = document.querySelectorAll( '.wp-block-b-blocks-business-hours' );
	blocks.forEach( ( blockEl ) => {
		const schedule = safeJsonParse( blockEl.getAttribute( 'data-schedule' ), [] );
		if ( ! Array.isArray( schedule ) || 7 !== schedule.length ) {
			return;
		}

		// Initial hydration to correct render.php's server-time
		// approximation against the configured IANA timezone.
		updateBadge( blockEl, schedule );

		// Re-check every 60 seconds. Quietly stop ticking if the element
		// disappears from the DOM.
		const intervalId = window.setInterval( () => {
			if ( ! document.body.contains( blockEl ) ) {
				window.clearInterval( intervalId );
				return;
			}
			updateBadge( blockEl, schedule );
		}, 60000 );
	} );
};

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}

// Re-render is exported only for tests/extensions; keep DAY_LABELS in
// scope so it isn't tree-shaken out (used by future i18n hooks).
export { DAY_LABELS };
