/**
 * Interactive Checklist — frontend behavior.
 *
 * 100% client-side. The server renders fully functional native checkbox
 * inputs, so the checklist is readable and operable even if this script
 * never runs. This script adds:
 *
 *  - Persistence: each checklist instance has a stable `data-key` (the
 *    block's persistKey). The checked state of every item id is stored as a
 *    JSON map under `bb_checklist_<persistKey>` in localStorage and restored
 *    on load.
 *  - Live progress: a "N of M complete" string (textContent only, never
 *    innerHTML) inside a `aria-live="polite"` region present in the DOM at
 *    page load, plus a `--bb-cl-progress-pct` custom property driving the
 *    visual progress bar fill.
 *  - Reset: clears the stored state behind a window.confirm() guard.
 *  - Reduced-motion: a runtime class mirrors the OS preference so the
 *    checkmark pulse and bar transition can be disabled mid-session.
 *
 * All localStorage access is wrapped in try/catch so private mode / quota
 * errors never break the checklist. Double-binding is prevented by a
 * `data-bb-cl-init` flag.
 */
import './style.scss';

const storagePrefix = 'bb_checklist_';

const readState = ( key ) => {
	try {
		if ( ! window.localStorage ) {
			return {};
		}
		const raw = window.localStorage.getItem( storagePrefix + key );
		if ( ! raw ) {
			return {};
		}
		const parsed = JSON.parse( raw );
		return parsed && 'object' === typeof parsed ? parsed : {};
	} catch ( e ) {
		return {};
	}
};

const writeState = ( key, state ) => {
	try {
		if ( window.localStorage ) {
			window.localStorage.setItem( storagePrefix + key, JSON.stringify( state ) );
		}
	} catch ( e ) {
		// Storage unavailable (private mode / quota) — session still works.
	}
};

const clearState = ( key ) => {
	try {
		if ( window.localStorage ) {
			window.localStorage.removeItem( storagePrefix + key );
		}
	} catch ( e ) {
		// no-op
	}
};

const reduceMotion = () =>
	window.matchMedia &&
	window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

const buildState = ( checkboxes ) => {
	const state = {};
	checkboxes.forEach( ( box ) => {
		const id = box.getAttribute( 'data-item-id' );
		if ( id ) {
			state[ id ] = box.checked;
		}
	} );
	return state;
};

const initChecklist = ( wrapper ) => {
	if ( '1' === wrapper.dataset.bbClInit ) {
		return;
	}
	wrapper.dataset.bbClInit = '1';

	const key = wrapper.getAttribute( 'data-key' );
	if ( ! key ) {
		return;
	}

	const strike = '1' === wrapper.getAttribute( 'data-strike' );
	const checkboxes = Array.prototype.slice.call(
		wrapper.querySelectorAll( '.bb-cl-checkbox' )
	);
	if ( ! checkboxes.length ) {
		return;
	}

	const progressText = wrapper.querySelector( '.bb-cl-progress-text' );
	const total = checkboxes.length;

	const updateItemClass = ( box ) => {
		const item = box.closest( '.bb-cl-item' );
		if ( item && strike ) {
			item.classList.toggle( 'is-checked', box.checked );
		}
	};

	const updateProgress = () => {
		let done = 0;
		checkboxes.forEach( ( box ) => {
			if ( box.checked ) {
				done += 1;
			}
		} );
		const pct = total > 0 ? Math.round( ( done / total ) * 100 ) : 0;
		wrapper.style.setProperty( '--bb-cl-progress-pct', pct + '%' );

		if ( progressText ) {
			const template = progressText.getAttribute( 'data-template' ) || '%1$s of %2$s complete';
			progressText.textContent = template
				.replace( '%1$s', String( done ) )
				.replace( '%2$s', String( total ) );
		}
		wrapper.classList.toggle( 'is-complete', total > 0 && done === total );
	};

	// --- Restore stored state ------------------------------------------
	const stored = readState( key );
	checkboxes.forEach( ( box ) => {
		const id = box.getAttribute( 'data-item-id' );
		if ( id && Object.prototype.hasOwnProperty.call( stored, id ) ) {
			box.checked = !! stored[ id ];
		}
		updateItemClass( box );
	} );
	updateProgress();

	// --- Change handler -------------------------------------------------
	checkboxes.forEach( ( box ) => {
		box.addEventListener( 'change', () => {
			updateItemClass( box );
			writeState( key, buildState( checkboxes ) );
			updateProgress();
		} );
	} );

	// --- Reset handler --------------------------------------------------
	const resetBtn = wrapper.querySelector( '.bb-cl-reset' );
	if ( resetBtn ) {
		resetBtn.addEventListener( 'click', () => {
			const confirmMsg = resetBtn.getAttribute( 'data-confirm' ) || 'Reset your checklist progress?';
			// eslint-disable-next-line no-alert
			if ( ! window.confirm( confirmMsg ) ) {
				return;
			}
			clearState( key );
			checkboxes.forEach( ( box ) => {
				box.checked = false;
				updateItemClass( box );
			} );
			updateProgress();
		} );
	}

	// --- Reduced motion -------------------------------------------------
	if ( reduceMotion() ) {
		wrapper.classList.add( 'bb-cl--reduced-motion' );
	}
	if ( window.matchMedia ) {
		const mq = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		const onChange = ( e ) => {
			wrapper.classList.toggle( 'bb-cl--reduced-motion', e.matches );
		};
		if ( mq.addEventListener ) {
			mq.addEventListener( 'change', onChange );
		} else if ( mq.addListener ) {
			mq.addListener( onChange );
		}
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	const lists = document.querySelectorAll( '.bb-cl[data-key]' );
	lists.forEach( ( wrapper ) => initChecklist( wrapper ) );
} );
