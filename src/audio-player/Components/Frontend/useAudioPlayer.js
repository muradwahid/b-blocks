import { useEffect, useMemo, useRef, useState } from 'react';

export const formatTime = (secs) => {
	if (!isFinite(secs) || secs < 0) secs = 0;
	const total = Math.floor(secs);
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	const pad = (n) => String(n).padStart(2, '0');
	return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const buildTracks = (attributes) => {
	const { audio = {}, tracks = [] } = attributes;
	const clean = (Array.isArray(tracks) ? tracks : [])
		.map((t) => ({
			url: t?.url || '',
			title: t?.title || '',
			artist: t?.artist || '',
			art: t?.art?.url || '',
		}))
		.filter((t) => t.url);

	if (clean.length) return clean;

	return [{
		url: audio.url || '',
		title: audio.trackTitle || '',
		artist: audio.artistName || '',
		art: audio.albumArt?.url || '',
	}];
};

const useAudioPlayer = (attributes, isBackend = false) => {
	const { behavior = {} } = attributes;
	const {
		autoPlay = false, loop = false, skipSeconds = 10,
		speeds = [1, 1.25, 1.5, 2],
	} = behavior;

	const list = useMemo(() => buildTracks(attributes), [attributes]);
	const multi = list.length > 1;

	const audioRef = useRef(null);
	const seekingRef = useRef(false);
	const playOnLoadRef = useRef(false);
	const resumeTimeRef = useRef(0);
	const blobUrlRef = useRef('');
	const durFixRef = useRef(false);

	const [durations, setDurations] = useState({});
	const [index, setIndex] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [buffering, setBuffering] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [repeat, setRepeat] = useState(!!loop);

	const track = list[Math.min(index, list.length - 1)] || {};
	const url = track.url || '';

	const [mediaSrc, setMediaSrc] = useState(url);
	useEffect(() => {
		setMediaSrc(url);
		if (!url || typeof fetch === 'undefined') return undefined;
		let cancelled = false;
		fetch(url)
			.then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
			.then((blob) => {
				if (cancelled) return;
				const obj = URL.createObjectURL(blob);
				const el = audioRef.current;
				if (el) {
					resumeTimeRef.current = el.currentTime || 0;
					playOnLoadRef.current = !el.paused;
				}
				if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
				blobUrlRef.current = obj;
				setMediaSrc(obj);
			})
			.catch(() => { /* keep the direct URL (e.g. cross-origin without CORS) */ });
		return () => { cancelled = true; };
	}, [url]);

	useEffect(() => () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); }, []);

	useEffect(() => {
		if (typeof window === 'undefined' || typeof Audio === 'undefined' || !list || !list.length) return undefined;
		const tempAudios = [];
		list.forEach((t) => {
			if (!t.url) return;
			const audio = new Audio();
			audio.preload = 'metadata';
			const onMeta = () => {
				if (isFinite(audio.duration) && audio.duration > 0) {
					setDurations((prev) => ({ ...prev, [t.url]: audio.duration }));
				}
			};
			audio.addEventListener('loadedmetadata', onMeta);
			audio.src = t.url;
			tempAudios.push({ audio, onMeta });
		});

		return () => {
			tempAudios.forEach(({ audio, onMeta }) => {
				audio.removeEventListener('loadedmetadata', onMeta);
			});
		};
	}, [list]);

	useEffect(() => {
		const el = audioRef.current;
		if (!el) return undefined;

		const onPlay = () => setPlaying(true);
		const onPause = () => setPlaying(false);
		const onMeta = () => {
			if (el.duration === Infinity) {
				durFixRef.current = true;
				try { el.currentTime = 1e101; } catch (e) { /* noop */ }
				return;
			}
			const d = isFinite(el.duration) ? el.duration : 0;
			if (d > 0) {
				setDuration(d);
				if (url) setDurations((prev) => ({ ...prev, [url]: d }));
			}
			if (durFixRef.current || resumeTimeRef.current > 0) {
				durFixRef.current = false;
				const t = resumeTimeRef.current || 0;
				resumeTimeRef.current = 0;
				try { el.currentTime = t; } catch (e) { /* noop */ }
				setCurrentTime(t);
			}
			if (playOnLoadRef.current) {
				playOnLoadRef.current = false;
				const p = el.play();
				if (p && typeof p.catch === 'function') p.catch(() => setPlaying(false));
			}
		};
		const onTime = () => { if (!seekingRef.current && !durFixRef.current) setCurrentTime(el.currentTime || 0); };
		const onWaiting = () => setBuffering(true);
		const onPlaying = () => { setBuffering(false); setPlaying(true); };
		const onCanPlay = () => setBuffering(false);
		const onVol = () => { setVolume(el.volume); setMuted(el.muted); };
		const onEnded = () => {
			if (repeat && !multi) { el.currentTime = 0; el.play().catch(() => {}); return; }
			if (multi && index < list.length - 1) { setIndex((i) => i + 1); return; }
			if (multi && repeat) { setIndex(0); return; }
			setPlaying(false);
		};

		el.addEventListener('play', onPlay);
		el.addEventListener('pause', onPause);
		el.addEventListener('loadedmetadata', onMeta);
		el.addEventListener('durationchange', onMeta);
		el.addEventListener('timeupdate', onTime);
		el.addEventListener('waiting', onWaiting);
		el.addEventListener('playing', onPlaying);
		el.addEventListener('canplay', onCanPlay);
		el.addEventListener('volumechange', onVol);
		el.addEventListener('ended', onEnded);

		el.playbackRate = speed;
		if (el.readyState >= 1) onMeta();

		return () => {
			el.removeEventListener('play', onPlay);
			el.removeEventListener('pause', onPause);
			el.removeEventListener('loadedmetadata', onMeta);
			el.removeEventListener('durationchange', onMeta);
			el.removeEventListener('timeupdate', onTime);
			el.removeEventListener('waiting', onWaiting);
			el.removeEventListener('playing', onPlaying);
			el.removeEventListener('canplay', onCanPlay);
			el.removeEventListener('volumechange', onVol);
			el.removeEventListener('ended', onEnded);
		};
	}, [url, repeat, multi, index, list.length]);

	useEffect(() => {
		if (audioRef.current) audioRef.current.playbackRate = speed;
	}, [speed, url]);

	const startedRef = useRef(false);
	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		if (!startedRef.current && autoPlay && !isBackend) {
			startedRef.current = true;
			el.muted = true;
			el.play().catch(() => {});
		}
	}, [autoPlay, isBackend, url]);

	const play = () => {
		const el = audioRef.current;
		if (!el) return;
		const p = el.play();
		if (p && typeof p.catch === 'function') p.catch(() => setPlaying(false));
	};
	const pause = () => audioRef.current && audioRef.current.pause();
	const togglePlay = () => {
		const el = audioRef.current;
		if (!el) return;
		(el.paused || el.ended) ? play() : pause();
	};
	const stop = () => {
		const el = audioRef.current;
		if (!el) return;
		el.pause();
		el.currentTime = 0;
		setCurrentTime(0);
	};
	const restart = () => {
		const el = audioRef.current;
		if (!el) return;
		el.currentTime = 0;
		setCurrentTime(0);
		play();
	};
	const clampTime = (t) => {
		let val = parseFloat(t);
		if (Number.isNaN(val)) return null;
		const el = audioRef.current;
		const elDur = el && isFinite(el.duration) ? el.duration : 0;
		const dur = elDur || duration || durations[url] || 0;
		if (dur > 0) val = Math.min(val, dur);
		return Math.max(0, val);
	};

	const previewTime = (t) => {
		const val = clampTime(t);
		if (val !== null) setCurrentTime(val);
	};

	const seekTo = (t) => {
		const val = clampTime(t);
		if (val === null) return;
		setCurrentTime(val);
		const el = audioRef.current;
		if (el) {
			try { el.currentTime = val; } catch (err) { /* not seekable yet */ }
		}
	};
	const skip = (dir) => {
		if (multi) { playIndex(index + dir); return; }
		const el = audioRef.current;
		if (!el) return;
		const next = Math.min(Math.max(0, (el.currentTime || 0) + dir * skipSeconds), el.duration || 0);
		seekTo(next);
	};
	const playIndex = (i) => {
		const next = ((i % list.length) + list.length) % list.length;
		if (next === index) { togglePlay(); return; }

		playOnLoadRef.current = true;
		setIndex(next);
		setCurrentTime(0);
	};
	const setVol = (v) => {
		const el = audioRef.current;
		const val = Math.min(1, Math.max(0, parseFloat(v) || 0));
		setVolume(val);
		if (el) { el.volume = val; if (val > 0) el.muted = false; }
	};
	const toggleMute = () => {
		const el = audioRef.current;
		if (!el) return;
		el.muted = !el.muted;
	};
	const cycleSpeed = () => {
		const arr = (speeds && speeds.length) ? speeds : [1];
		const i = arr.indexOf(speed);
		setSpeed(arr[(i + 1) % arr.length]);
	};
	const toggleRepeat = () => setRepeat((r) => !r);

	const effDuration = duration || durations[url] || 0;
	const seekPct = effDuration > 0 ? (currentTime / effDuration) * 100 : 0;

	return {
		audioRef, seekingRef, mediaSrc,
		list, index, multi, track, url,
		playing, buffering, duration: effDuration, durations, currentTime, volume, muted, speed, repeat,
		seekPct,
		togglePlay, stop, restart, skip, seekTo, previewTime, playIndex, setVol, toggleMute, cycleSpeed, toggleRepeat,
	};
};
export default useAudioPlayer;
