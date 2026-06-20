import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const PlayIcon = ({ color, size }) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill={color || '#ffffff'}
		focusable='false'
		aria-hidden='true'
		style={{ width: '45%', height: '45%', display: 'block', marginLeft: `${Math.round(size * 0.04)}px` }}
	>
		<path d='M8 5v14l11-7z' />
	</svg>
);

// Server-side URL parsers, mirrored client-side so the editor preview can
// pick a sensible auto-poster without round-tripping to PHP.
const extractYouTubeId = (url) => {
	if (!url) return null;
	const patterns = [
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/i,
		/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{11})/i,
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/i,
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/i,
	];
	for (const p of patterns) {
		const m = url.match(p);
		if (m) return m[1];
	}
	return null;
};

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		triggerType,
		posterUrl, posterAlt, videoSource, videoUrl, videoRatio, posterRadius,
		posterWidth, alignment, playIcon
	} = attributes;
	const isButtonOnly = triggerType === 'button-only';

	const id = `block-${clientId}`;
	const icon = playIcon || {};
	const iconSize = Math.max(24, Math.min(200, parseInt(icon.size, 10) || 72));
	const iconShape = icon.bgShape || 'circle';
	const iconRadius = iconShape === 'circle' ? '50%' : (iconShape === 'rounded' ? '12px' : '0');
	const iconBg = iconShape === 'none' ? 'transparent' : (icon.bgColor || 'rgba(0,0,0,0.55)');
	const iconColor = icon.color || '#ffffff';

	const wrapperClasses = `bb-video-popup bb-vp-align-${alignment || 'center'}`;

	const css = `
		#${id} { text-align: ${alignment || 'center'}; }
		#${id} .bb-vp-trigger {
			display: inline-block;
			position: relative;
			width: ${posterWidth || '100%'};
			max-width: 100%;
			border-radius: ${posterRadius || '0px'};
			overflow: hidden;
			background: transparent;
			border: 0;
			padding: 0;
		}
		#${id} .bb-vp-trigger img {
			display: block;
			width: 100%;
			height: auto;
			border-radius: inherit;
		}
		#${id} .bb-vp-play {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: ${iconSize}px;
			height: ${iconSize}px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background-color: ${iconBg};
			color: ${iconColor};
			border-radius: ${iconRadius};
			pointer-events: none;
		}
		#${id} .bb-vp-editor-placeholder-ratio {
			aspect-ratio: ${videoRatio || '16/9'};
		}
	`;

	const sourceLabel = {
		youtube: __('YouTube', 'b-blocks'),
		vimeo: __('Vimeo', 'b-blocks'),
		self: __('Self-hosted MP4', 'b-blocks')
	}[videoSource] || __('YouTube', 'b-blocks');

	const blockProps = useBlockProps({ className: wrapperClasses, id });

	const hasVideo = !!(videoUrl && videoUrl.trim());

	// Pick the best available poster preview, in order:
	//   1. user-supplied poster image
	//   2. auto-derived from the video source (YT thumbnail, MP4 first frame)
	//   3. solid tile with just the play icon (Vimeo without poster falls here)
	let previewMode = 'none';
	let previewSrc = '';
	if (posterUrl) {
		previewMode = 'image';
		previewSrc = posterUrl;
	} else if (videoSource === 'youtube' && hasVideo) {
		const ytId = extractYouTubeId(videoUrl);
		if (ytId) {
			previewMode = 'image';
			previewSrc = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
		}
	} else if (videoSource === 'self' && hasVideo) {
		previewMode = 'video';
		previewSrc = videoUrl;
	}

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<style dangerouslySetInnerHTML={{ __html: css }} />

				{hasVideo && isButtonOnly && (
					<span
						className='bb-vp-trigger bb-vp-trigger--button-only'
						role='img'
						aria-label={__('Play button trigger preview', 'b-blocks')}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'transparent',
							border: 0,
							padding: 0,
						}}
					>
						<span
							className='bb-vp-play'
							aria-hidden='true'
							style={{
								position: 'static',
								transform: 'none',
								width: iconSize,
								height: iconSize,
								borderRadius: iconRadius,
								backgroundColor: iconBg,
								color: iconColor,
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<PlayIcon color={iconColor} size={iconSize} />
						</span>
					</span>
				)}

				{hasVideo && !isButtonOnly && previewMode === 'image' && (
					<span className='bb-vp-trigger' role='img' aria-label={posterAlt || __('Video poster preview', 'b-blocks')}>
						<img src={previewSrc} alt={posterAlt || ''} />
						<span className='bb-vp-play' aria-hidden='true'>
							<PlayIcon color={iconColor} size={iconSize} />
						</span>
					</span>
				)}

				{hasVideo && !isButtonOnly && previewMode === 'video' && (
					<span className='bb-vp-trigger' role='img' aria-label={posterAlt || __('Video first-frame preview', 'b-blocks')}>
						<video src={previewSrc} preload='metadata' muted playsInline disablePictureInPicture />
						<span className='bb-vp-play' aria-hidden='true'>
							<PlayIcon color={iconColor} size={iconSize} />
						</span>
					</span>
				)}

				{hasVideo && !isButtonOnly && previewMode === 'none' && (
					<span
						className='bb-vp-trigger bb-vp-trigger--no-poster'
						role='img'
						aria-label={__('Video preview (no poster)', 'b-blocks')}
						style={{ background: '#111', aspectRatio: (videoRatio || '16/9').replace('/', ' / ') }}
					>
						<span className='bb-vp-play' aria-hidden='true'>
							<PlayIcon color={iconColor} size={iconSize} />
						</span>
					</span>
				)}

				{!hasVideo && (
					<div
						className='bb-vp-editor-placeholder bb-vp-editor-placeholder-ratio'
						style={{ borderRadius: posterRadius || '0px' }}
					>
						<svg
							className='bb-vp-editor-icon'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='1.5'
							aria-hidden='true'
						>
							<rect x='2' y='4' width='20' height='16' rx='2' />
							<path d='M10 9l5 3-5 3V9z' fill='currentColor' />
						</svg>
						<div>{__('Video Popup', 'b-blocks')}</div>
						<div className='bb-vp-editor-hint'>
							{__('Paste a YouTube, Vimeo, or MP4 URL in the block sidebar. A poster image is optional.', 'b-blocks')}
						</div>
					</div>
				)}

				<div>
					<span className='bb-vp-editor-meta'>
						<span aria-hidden='true'>{hasVideo ? '▶' : '⚠️'}</span>
						{hasVideo
							? sourceLabel
							: __('Add a video URL', 'b-blocks')}
					</span>
				</div>
			</div>
		</>
	);
};

export default Edit;
