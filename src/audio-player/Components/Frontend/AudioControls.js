import { useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { formatTime } from './useAudioPlayer';
import { PlayIcon, PauseIcon, StopIcon, PrevIcon, NextIcon, RestartIcon, RepeatIcon, DownloadIcon } from '../../utils/icon';

const P = 'b-blocks-audio-player';

/* --- Controls --- */
export const PlayButton = ({ player, className = '' }) => {
	const { playing, buffering, togglePlay } = player;
	return (
		<button
			type='button'
			className={`${P}-playpause ${className}`.trim()}
			aria-label={playing ? __('Pause', 'b-blocks') : __('Play', 'b-blocks')}
			aria-pressed={playing ? 'true' : 'false'}
			onClick={togglePlay}
		>
			{buffering
				? <span className={`${P}-spinner`} aria-hidden='true' />
				: <span className={`${P}-icon`} aria-hidden='true'>{playing ? <PauseIcon /> : <PlayIcon />}</span>}
		</button>
	);
};

export const SkipButton = ({ player, dir, className = '' }) => (
	<button
		type='button'
		className={`${P}-skip ${P}-skip--${dir < 0 ? 'prev' : 'next'} ${className}`.trim()}
		aria-label={dir < 0 ? __('Previous', 'b-blocks') : __('Next', 'b-blocks')}
		onClick={() => player.skip(dir)}
	>
		{dir < 0 ? <PrevIcon /> : <NextIcon />}
	</button>
);

export const StopButton = ({ player, className = '' }) => (
	<button type='button' className={`${P}-stop ${className}`.trim()} aria-label={__('Stop', 'b-blocks')} onClick={player.stop}><StopIcon /></button>
);

export const RestartButton = ({ player, className = '' }) => (
	<button type='button' className={`${P}-restart ${className}`.trim()} aria-label={__('Restart', 'b-blocks')} onClick={player.restart}><RestartIcon /></button>
);

export const RepeatButton = ({ player, className = '' }) => (
	<button
		type='button'
		className={`${P}-repeat ${player.repeat ? 'is-active' : ''} ${className}`.trim()}
		aria-label={__('Repeat', 'b-blocks')}
		aria-pressed={player.repeat ? 'true' : 'false'}
		onClick={player.toggleRepeat}
	><RepeatIcon /></button>
);

export const SpeedButton = ({ player, className = '' }) => (
	<button type='button' className={`${P}-speed ${className}`.trim()} aria-label={__('Playback speed', 'b-blocks')} onClick={player.cycleSpeed}>
		{player.speed}x
	</button>
);

export const SeekBar = ({ player, className = '' }) => {
	const { seekingRef, currentTime, duration, seekTo } = player;

	// While dragging, the thumb follows a local value and the media element is
	// left alone; the real seek is committed once on release (seeking on every
	// change thrashes the element and makes it snap back to ~0 on mouse-up).
	const [drag, setDrag] = useState(null);
	const dragRef = useRef(null);
	const seekToRef = useRef(seekTo);
	dragRef.current = drag;
	seekToRef.current = seekTo;

	const shown = drag !== null ? drag : currentTime;
	const pct = duration > 0 ? Math.min(100, (shown / duration) * 100) : 0;

	// Commit the seek when the pointer is released anywhere (incl. outside the
	// input), then hand control back to the media element.
	useEffect(() => {
		const end = () => {
			if (dragRef.current === null) return;
			const val = dragRef.current;
			seekingRef.current = false;
			setDrag(null);
			seekToRef.current(val);
		};
		window.addEventListener('pointerup', end);
		window.addEventListener('mouseup', end);
		window.addEventListener('touchend', end);
		window.addEventListener('pointercancel', end);
		return () => {
			window.removeEventListener('pointerup', end);
			window.removeEventListener('mouseup', end);
			window.removeEventListener('touchend', end);
			window.removeEventListener('pointercancel', end);
		};
	}, [seekingRef]);

	// A plain range input (same structure as the volume slider, which works). The
	// filled portion is drawn with a gradient track driven by the --progress var.
	return (
		<input
			type='range'
			className={`${P}-seek ${className}`.trim()}
			min='0'
			max={duration || 0}
			step='0.1'
			value={shown}
			aria-label={__('Seek', 'b-blocks')}
			aria-valuemin='0'
			aria-valuemax={Math.floor(duration)}
			aria-valuenow={Math.floor(shown)}
			aria-valuetext={formatTime(shown)}
			style={{ '--b-blocks-audio-player-var-progress': `${pct}%` }}
			onPointerDown={() => { seekingRef.current = true; }}
			onChange={(e) => { seekingRef.current = true; setDrag(parseFloat(e.target.value) || 0); }}
			onKeyUp={(e) => { const v = parseFloat(e.currentTarget.value) || 0; seekingRef.current = false; setDrag(null); seekTo(v); }}
		/>
	);
};

export const VolumeSlider = ({ player, className = '' }) => (
	<input
		type='range'
		className={`${P}-volume ${className}`.trim()}
		min='0'
		max='1'
		step='0.01'
		value={player.muted ? 0 : player.volume}
		aria-label={__('Volume', 'b-blocks')}
		style={{ '--b-blocks-audio-player-var-progress': `${(player.muted ? 0 : player.volume) * 100}%` }}
		onChange={(e) => player.setVol(e.target.value)}
	/>
);

export const Timecode = ({ player, remaining = false, className = '' }) => {
	const { currentTime, duration } = player;
	if (remaining) {
		return <span className={`${P}-time ${className}`.trim()} aria-hidden='true'>-{formatTime(Math.max(0, duration - currentTime))}</span>;
	}
	return (
		<span className={`${P}-time ${className}`.trim()} aria-hidden='true'>
			<span className={`${P}-current`}>{formatTime(currentTime)}</span>
			<span className={`${P}-sep`}> / </span>
			<span className={`${P}-duration`}>{formatTime(duration)}</span>
		</span>
	);
};

export const DownloadLink = ({ url, className = '' }) => (
	<a className={`${P}-download ${className}`.trim()} href={url} download aria-label={__('Download audio', 'b-blocks')}>
		<DownloadIcon />
		<span className='screen-reader-text'>{__('Download audio', 'b-blocks')}</span>
	</a>
);