/**
 * Audio Player — frontend behavior.
 *
 * Dependency-free. Drives the native HTMLMediaElement API for a single track:
 * play/pause toggle, seek scrubber, volume slider, and a M:SS / M:SS timecode.
 * All state is scoped per block instance so multiple players on one page do not
 * interfere. Time/aria updates are written via textContent and setAttribute
 * (never innerHTML). User-facing strings (Play / Pause aria-labels) come from
 * server-rendered data-* attributes, so no client-side i18n is required.
 *
 * Respects prefers-reduced-motion: the only interaction feedback is an
 * instantaneous icon swap — there are no animations to suppress beyond the
 * (CSS-gated) buffering spinner.
 */
import './style.scss';

/**
 * Format a number of seconds as M:SS (or H:MM:SS for long tracks).
 *
 * @param {number} secs Seconds.
 * @return {string} Formatted timecode.
 */
const formatTime = ( secs ) => {
	if ( ! isFinite( secs ) || secs < 0 ) {
		secs = 0;
	}
	const total = Math.floor( secs );
	const hours = Math.floor( total / 3600 );
	const minutes = Math.floor( ( total % 3600 ) / 60 );
	const seconds = total % 60;
	const pad = ( n ) => String( n ).padStart( 2, '0' );

	if ( hours > 0 ) {
		return `${ hours }:${ pad( minutes ) }:${ pad( seconds ) }`;
	}
	return `${ minutes }:${ pad( seconds ) }`;
};

const initPlayer = ( player ) => {
	if ( '1' === player.dataset.bbApInit ) {
		return;
	}
	player.dataset.bbApInit = '1';

	const audio = player.querySelector( '.bb-ap-audio' );
	const btn = player.querySelector( '.bb-ap-playpause' );
	const iconPlay = player.querySelector( '.bb-ap-icon-play' );
	const iconPause = player.querySelector( '.bb-ap-icon-pause' );
	const spinner = player.querySelector( '.bb-ap-spinner' );
	const seek = player.querySelector( '.bb-ap-seek' );
	const volume = player.querySelector( '.bb-ap-volume' );
	const current = player.querySelector( '.bb-ap-current' );
	const duration = player.querySelector( '.bb-ap-duration' );

	if ( ! audio || ! btn ) {
		return;
	}

	const labelPlay = player.getAttribute( 'data-bb-ap-label-play' ) || 'Play';
	const labelPause = player.getAttribute( 'data-bb-ap-label-pause' ) || 'Pause';

	let seeking = false;

	const setBuffering = ( on ) => {
		if ( ! spinner ) {
			return;
		}
		spinner.hidden = ! on;
		if ( iconPlay && iconPause ) {
			// While buffering, hide whichever icon would otherwise show.
			if ( on ) {
				iconPlay.hidden = true;
				iconPause.hidden = true;
			}
		}
	};

	const syncPlayState = () => {
		const playing = ! audio.paused && ! audio.ended;
		if ( iconPlay && iconPause ) {
			iconPlay.hidden = playing;
			iconPause.hidden = ! playing;
		}
		btn.setAttribute( 'aria-pressed', playing ? 'true' : 'false' );
		btn.setAttribute( 'aria-label', playing ? labelPause : labelPlay );
		player.classList.toggle( 'is-playing', playing );
	};

	const updateSeekFill = () => {
		if ( ! seek ) {
			return;
		}
		const max = parseFloat( seek.max ) || 100;
		const val = parseFloat( seek.value ) || 0;
		const pct = max > 0 ? ( val / max ) * 100 : 0;
		seek.style.setProperty( '--progress', `${ pct }%` );
	};

	const updateVolumeFill = () => {
		if ( ! volume ) {
			return;
		}
		const pct = ( parseFloat( volume.value ) || 0 ) * 100;
		volume.style.setProperty( '--progress', `${ pct }%` );
	};

	// --- Metadata: set duration + seek range. ---
	const onLoadedMeta = () => {
		const dur = isFinite( audio.duration ) ? audio.duration : 0;
		if ( seek ) {
			seek.max = String( dur || 0 );
			seek.setAttribute( 'aria-valuemax', String( Math.floor( dur ) ) );
		}
		if ( duration ) {
			duration.textContent = formatTime( dur );
		}
	};

	// --- Time update: scrubber + timecode + aria. ---
	const onTimeUpdate = () => {
		if ( seeking ) {
			return;
		}
		const cur = audio.currentTime || 0;
		if ( seek ) {
			seek.value = String( cur );
			seek.setAttribute( 'aria-valuenow', String( Math.floor( cur ) ) );
			seek.setAttribute( 'aria-valuetext', formatTime( cur ) );
			updateSeekFill();
		}
		if ( current ) {
			current.textContent = formatTime( cur );
		}
	};

	// --- Wire events. ---
	btn.addEventListener( 'click', () => {
		if ( audio.paused || audio.ended ) {
			const p = audio.play();
			if ( p && typeof p.catch === 'function' ) {
				p.catch( () => {
					// Autoplay/gesture rejection — leave UI in paused state.
					syncPlayState();
				} );
			}
		} else {
			audio.pause();
		}
	} );

	audio.addEventListener( 'play', syncPlayState );
	audio.addEventListener( 'pause', syncPlayState );
	audio.addEventListener( 'ended', syncPlayState );
	audio.addEventListener( 'loadedmetadata', onLoadedMeta );
	audio.addEventListener( 'durationchange', onLoadedMeta );
	audio.addEventListener( 'timeupdate', onTimeUpdate );
	audio.addEventListener( 'waiting', () => setBuffering( true ) );
	audio.addEventListener( 'playing', () => {
		setBuffering( false );
		syncPlayState();
	} );
	audio.addEventListener( 'canplay', () => setBuffering( false ) );

	if ( seek ) {
		const startSeek = () => {
			seeking = true;
		};
		const doSeek = () => {
			const val = parseFloat( seek.value ) || 0;
			seek.setAttribute( 'aria-valuenow', String( Math.floor( val ) ) );
			seek.setAttribute( 'aria-valuetext', formatTime( val ) );
			if ( current ) {
				current.textContent = formatTime( val );
			}
			updateSeekFill();
		};
		const endSeek = () => {
			if ( isFinite( audio.duration ) ) {
				audio.currentTime = parseFloat( seek.value ) || 0;
			}
			seeking = false;
		};

		seek.addEventListener( 'pointerdown', startSeek );
		seek.addEventListener( 'input', doSeek );
		seek.addEventListener( 'change', endSeek );
		// Keyboard arrows fire input but not pointerdown; commit on input too.
		seek.addEventListener( 'keyup', endSeek );
	}

	if ( volume ) {
		volume.addEventListener( 'input', () => {
			const v = Math.min( 1, Math.max( 0, parseFloat( volume.value ) || 0 ) );
			audio.volume = v;
			if ( v > 0 ) {
				audio.muted = false;
			}
			updateVolumeFill();
		} );
		updateVolumeFill();
	}

	// --- Initial sync (covers autoplay + already-buffered metadata). ---
	syncPlayState();
	if ( audio.readyState >= 1 ) {
		onLoadedMeta();
		onTimeUpdate();
	}
};

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( '.bb-ap .bb-ap-player' )
		.forEach( ( player ) => initPlayer( player ) );
} );
