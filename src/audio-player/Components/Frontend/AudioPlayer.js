import { useEffect, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import useAudioPlayer, { formatTime } from './useAudioPlayer';
import {
	PlayButton, SkipButton, StopButton, RestartButton, RepeatButton, SpeedButton,
	SeekBar, VolumeSlider, Timecode, DownloadLink,
} from './AudioControls';
import { NoteIcon, PlayIcon, PauseIcon } from '../../utils/icon';

const P = 'b-blocks-audio-player';

const Meta = ({ track }) => (
	(track.title || track.artist) ? (
		<div className={`${P}-meta`}>
			{track.title ? <p className={`${P}-title`}>{track.title}</p> : null}
			{track.artist ? <p className={`${P}-artist`}>{track.artist}</p> : null}
		</div>
	) : null
);

const Art = ({ track, className = '' }) => (
	<div className={`${P}-art ${className}`.trim()}>
		{track.art
			? <img className={`${P}-art-img`} src={track.art} alt='' loading='lazy' decoding='async' />
			: <span className={`${P}-art-placeholder`} aria-hidden='true'><NoteIcon /></span>}
	</div>
);

const BAR_COUNT = 56;
const restHeight = (i) => {
	const x = Math.sin(i * 12.9898) * 43758.5453;
	return 18 + (x - Math.floor(x)) * 42;
};

const analysers = new WeakMap();
const getAnalyser = (audio) => {
	if (analysers.has(audio)) return analysers.get(audio);
	let entry = null;
	try {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (AC) {
			const ctx = new AC();
			const src = ctx.createMediaElementSource(audio);
			const analyser = ctx.createAnalyser();
			analyser.fftSize = 128; // 64 frequency bins
			analyser.smoothingTimeConstant = 0.75;
			src.connect(analyser);
			analyser.connect(ctx.destination); // keep audio audible
			entry = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
		}
	} catch (e) {
		entry = null;
	}
	analysers.set(audio, entry);
	return entry;
};

const WaveBars = ({ player }) => {
	const barsRef = useRef([]);
	const rafRef = useRef(0);
	const { playing, audioRef, url } = player;

	const paintRest = () => {
		for (let i = 0; i < barsRef.current.length; i++) {
			const el = barsRef.current[i];
			if (el) el.style.height = `${restHeight(i)}%`;
		}
	};

	useEffect(() => { paintRest(); }, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (!playing || !audio) { paintRest(); return undefined; }

		const entry = getAnalyser(audio);
		if (!entry) { paintRest(); return undefined; }
		if (entry.ctx.state === 'suspended') entry.ctx.resume();

		const { analyser, data } = entry;
		const bins = data.length;
		const n = BAR_COUNT;

		const tick = () => {
			analyser.getByteFrequencyData(data);
			for (let i = 0; i < n; i++) {
				const el = barsRef.current[i];
				if (!el) continue;
				const bin = Math.min(bins - 1, Math.floor(((i / n) ** 0.85) * bins));
				const v = data[bin] / 255; // 0..1
				el.style.height = `${8 + v * 92}%`;
			}
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(rafRef.current);
	}, [playing, url]);

	return (
		<div className={`${P}-bars`} aria-hidden='true'>
			{Array.from({ length: BAR_COUNT }).map((_, i) => (
				<span
					key={i}
					ref={(el) => { barsRef.current[i] = el; }}
					className={`${P}-bar${(i / BAR_COUNT) * 100 <= player.seekPct ? ' is-played' : ''}`}
				/>
			))}
		</div>
	);
};

const AudioPlayer = ({ attributes, isBackend = false }) => {
	const { layout = {}, behavior = {}, timecode = {} } = attributes;
	const player = useAudioPlayer(attributes, isBackend);
	const { url, track, list, index, playing } = player;

	const style = layout.style || 'bar';
	const tcLeft = timecode.position === 'left';
	const f = {
		seek: behavior.showSeek !== false,
		skip: behavior.showSkip !== false,
		timecode: behavior.showTimecode !== false,
		volume: behavior.showVolume !== false,
		download: behavior.showDownload !== false,
		restart: !!behavior.showRestart,
		stop: !!behavior.showStop,
		repeat: !!behavior.showRepeat,
		speed: !!behavior.showSpeed,
		remaining: !!behavior.showRemaining,
	};

	const wrapperClass = [
		P,
		`${P}--style-${style}`,
		`${P}--align-${layout.alignment || 'left'}`,
		playing ? 'is-playing' : '',
	].filter(Boolean).join(' ');

	if (!url) {
		return (
			<div className={wrapperClass}>
				<div className={`${P}-empty`}>
					<span className={`${P}-empty-icon`} aria-hidden='true'><NoteIcon /></span>
					<span className={`${P}-empty-title`}>{__('No audio selected', 'b-blocks')}</span>
					<span className={`${P}-empty-text`}>{__('Add an audio file to start playing.', 'b-blocks')}</span>
				</div>
			</div>
		);
	}

	const audioEl = (
		<audio ref={player.audioRef} className={`${P}-audio`} preload='metadata' src={player.mediaSrc || url}>
			{__('Your browser does not support the audio element.', 'b-blocks')}
		</audio>
	);

	// Shared control clusters ------------------------------------------------
	const transport = (extra = null) => (
		<div className={`${P}-transport`}>
			{f.restart ? <RestartButton player={player} /> : null}
			{f.skip ? <SkipButton player={player} dir={-1} /> : null}
			<PlayButton player={player} />
			{f.skip ? <SkipButton player={player} dir={1} /> : null}
			{f.stop ? <StopButton player={player} /> : null}
			{f.repeat ? <RepeatButton player={player} /> : null}
			{extra}
		</div>
	);

	const timecodeEl = f.timecode ? <Timecode player={player} /> : null;

	const barControls = (
		<div className={`${P}-controls`}>
			{transport()}
			{tcLeft ? timecodeEl : null}
			{f.seek ? <div className={`${P}-seek-wrap`}><SeekBar player={player} /></div> : null}
			{tcLeft ? null : timecodeEl}
			{f.remaining ? <Timecode player={player} remaining={true} /> : null}
			{f.speed ? <SpeedButton player={player} /> : null}
			{f.volume ? <VolumeSlider player={player} /> : null}
			{f.download ? <DownloadLink url={url} /> : null}
		</div>
	);

	// Theme layouts ----------------------------------------------------------
	let content;

	if (style === 'bar' || style === 'card') {
		content = (
			<div className={`${P}-player`} role='region' aria-label={__('Audio player', 'b-blocks')}>
				{style === 'card' ? <Art track={track} /> : null}
				<div className={`${P}-body`}>
					<Meta track={track} />
					{barControls}
				</div>
			</div>
		);
	} else if (style === 'bars') {
		content = (
			<div className={`${P}-player`} role='region' aria-label={__('Audio player', 'b-blocks')}>
				<Meta track={track} />
				<div className={`${P}-wave-seek`}>
					<WaveBars player={player} />
					<SeekBar player={player} className={`${P}-seek--overlay`} />
				</div>
				<div className={`${P}-controls`}>
					{transport()}
					{tcLeft && f.timecode ? <Timecode player={player} className={`${P}-time--current`} remaining={false} /> : null}
					{f.seek ? <div className={`${P}-seek-wrap`}><SeekBar player={player} /></div> : null}
					{!tcLeft && f.timecode ? <Timecode player={player} className={`${P}-time--current`} remaining={false} /> : null}
					{f.volume ? <VolumeSlider player={player} /> : null}
					{f.remaining ? <Timecode player={player} remaining={true} /> : null}
					{f.speed ? <SpeedButton player={player} /> : null}
					{f.download ? <DownloadLink url={url} /> : null}
				</div>
			</div>
		);
	} else if (style === 'vinyl') {
		content = (
			<div className={`${P}-player`} role='region' aria-label={__('Audio player', 'b-blocks')}>
				<div className={`${P}-vinyl`}>
					<div className={`${P}-vinyl-disc`}>
						{track.art ? <img className={`${P}-vinyl-art`} src={track.art} alt='' /> : null}
						<span className={`${P}-vinyl-center`} />
					</div>
					<div className={`${P}-vinyl-arm`} aria-hidden='true'>
						<span className={`${P}-vinyl-arm-base`} />
						<span className={`${P}-vinyl-arm-stick`} />
						<span className={`${P}-vinyl-arm-head`} />
					</div>
				</div>
				<div className={`${P}-body`}>
					{track.title ? <p className={`${P}-title ${P}-title--pill`}>{track.title}</p> : null}
					{f.seek ? <div className={`${P}-seek-wrap`}><SeekBar player={player} /></div> : null}
					{transport()}
					<div className={`${P}-vinyl-row`}>
						{f.timecode ? <span className={`${P}-time ${P}-time--pill`} aria-hidden='true'>{formatTime(player.currentTime)} / {formatTime(player.duration)}</span> : null}
						{f.remaining ? <Timecode player={player} remaining={true} className={`${P}-time--pill`} /> : null}
						{f.volume ? <VolumeSlider player={player} /> : null}
					</div>
				</div>
				{f.download ? <DownloadLink url={url} /> : null}
			</div>
		);
	} else if (style === 'coverflow') {
		content = (
			<div className={`${P}-player`} role='region' aria-label={__('Audio player', 'b-blocks')}>
				{f.download ? <DownloadLink url={url} /> : null}
				<div className={`${P}-coverflow`}>
					{list.map((t, i) => {
						const off = i - index;
						if (Math.abs(off) > 2) return null;
						return (
							<button
								type='button'
								key={i}
								className={`${P}-cover ${P}-cover--pos${off}`}
								aria-label={t.title || __('Track', 'b-blocks')}
								aria-current={off === 0 ? 'true' : undefined}
								onClick={() => player.playIndex(i)}
							>
								{t.art ? <img src={t.art} alt='' /> : <span className={`${P}-art-placeholder`} aria-hidden='true'><NoteIcon /></span>}
							</button>
						);
					})}
				</div>
				<Meta track={track} />
				<div className={`${P}-controls`}>
					{f.timecode ? <span className={`${P}-current`}>{formatTime(player.currentTime)}</span> : null}
					{f.seek ? <div className={`${P}-seek-wrap`}><SeekBar player={player} /></div> : null}
					{f.timecode ? <span className={`${P}-duration`}>{formatTime(player.duration)}</span> : null}
					{f.remaining ? <Timecode player={player} remaining={true} /> : null}
				</div>
				{transport()}
			</div>
		);
	} else if (style === 'playlist') {
		content = (
			<div className={`${P}-player`} role='region' aria-label={__('Audio player', 'b-blocks')}>
				{f.download ? <DownloadLink url={url} /> : null}
				<div className={`${P}-nowplaying`}>
					{f.timecode ? <span className={`${P}-current`}>{formatTime(player.currentTime)}</span> : null}
					{track.title ? <span className={`${P}-np-title`}>{track.title}</span> : null}
					{f.timecode ? <span className={`${P}-duration`}>{formatTime(player.duration)}</span> : null}
					{f.remaining ? <Timecode player={player} remaining={true} /> : null}
				</div>
				{f.seek ? <div className={`${P}-seek-wrap`}><SeekBar player={player} /></div> : null}
				{transport()}
				{f.volume ? <div className={`${P}-volume-row`}><VolumeSlider player={player} /></div> : null}
				<ul className={`${P}-list`}>
					{list.map((t, i) => {
						const trackDur = (i === index && player.duration > 0)
							? player.duration
							: (player.durations?.[t.url] || t.duration || 0);
						const selectRow = () => (i === index ? player.togglePlay() : player.playIndex(i));
						return (
							<li
								key={i}
								className={`${P}-list-item ${i === index ? 'is-active' : ''}`.trim()}
								onClick={selectRow}
								onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRow(); } }}
								role='button'
								tabIndex={0}
								aria-label={t.title || `${__('Track', 'b-blocks')} ${i + 1}`}
							>
								<button type='button' className={`${P}-list-play`} aria-hidden='true' tabIndex={-1} onClick={(e) => { e.stopPropagation(); selectRow(); }}>
									{i === index && playing ? <PauseIcon /> : <PlayIcon />}
								</button>
								<span className={`${P}-list-title`}>{t.title || `${__('Track', 'b-blocks')} ${i + 1}`}</span>
								<span className={`${P}-list-time`}>{formatTime(trackDur)}</span>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	return (
		<div className={wrapperClass}>
			{audioEl}
			{content}
		</div>
	);
};
export default AudioPlayer;