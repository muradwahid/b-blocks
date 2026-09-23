import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { __ } from '@wordpress/i18n';

import { prefix } from '../../utils/data';
import { closeIcon, instagramIcon, nextIcon, prevIcon } from '../../utils/icons';
import { captionNodes } from '../../utils/options';
import Profile from './Profile';

/**
 * A carousel post arrives with a `children` list. Scroll-snap does the paging,
 * so the strip works on touch without a slider library and the arrows only have
 * to nudge it by one panel.
 */
const Carousel = ({ feed }) => {
	const strip = useRef(null);
	const slides = feed?.children?.data || [];

	const nudge = (direction) => {
		const el = strip.current;

		if (el) el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
	};

	return <div className={`${prefix}-carousel`}>
		<div className={`${prefix}-slides`} ref={strip}>
			{slides.map((slide) => <div className={`${prefix}-slide`} key={slide.id}>
				{slide.thumbnail_url
					? <video controls poster={slide.thumbnail_url} src={slide.media_url} />
					: <img src={slide.media_url} alt='' />}
			</div>)}
		</div>

		{1 < slides.length && <>
			<button type='button' className={`${prefix}-nav ${prefix}-nav-prev`} onClick={(e) => { e.stopPropagation(); nudge(-1); }} aria-label={__('Previous slide', 'b-blocks')}>{prevIcon}</button>

			<button type='button' className={`${prefix}-nav ${prefix}-nav-next`} onClick={(e) => { e.stopPropagation(); nudge(1); }} aria-label={__('Next slide', 'b-blocks')}>{nextIcon}</button>
		</>}
	</div>;
};

const Lightbox = ({ attributes, user, feeds = [], index, blockId = '', container, isBackend = false, onClose, onMove }) => {
	const { lightbox = {}, elements = {} } = attributes;
	const dialog = useRef(null);
	const [ready, setReady] = useState(false);

	const feed = feeds[index];

	const keys = useCallback((event) => {
		if ('Escape' === event.key) onClose();

		if ('ArrowRight' === event.key) onMove(1);

		if ('ArrowLeft' === event.key) onMove(-1);
	}, [onClose, onMove]);

	useEffect(() => {
		const doc = container?.ownerDocument || document;
		doc.addEventListener('keydown', keys);

		// The page behind must not scroll while the dialog is up; the original
		// value is put back so a theme that sets its own overflow is respected.
		const previous = doc.body?.style?.overflow;

		if (doc.body) doc.body.style.overflow = 'hidden';
		dialog.current?.focus();
		setReady(true);

		return () => {
			doc.removeEventListener('keydown', keys);
			if (doc.body && undefined !== previous) doc.body.style.overflow = previous;
		};
	}, [keys, container]);

	if (!feed) return null;

	const { media_type: type = 'IMAGE', media_url: url = '', thumbnail_url: poster = '', caption = '', permalink = '' } = feed;

	const safeId = blockId || 'default';

	const dynamicStyles = `
		.${prefix}-lightbox[data-bb-id="${safeId}"] {
			${lightbox.backdrop ? `background: ${lightbox.backdrop} !important;` : ''}
		}
		.${prefix}-lightbox[data-bb-id="${safeId}"] .${prefix}-close {
			${lightbox.closeColor ? `color: ${lightbox.closeColor} !important;` : ''}
			${lightbox.closeBg ? `background: ${lightbox.closeBg} !important;` : ''}
		}
		.${prefix}-lightbox[data-bb-id="${safeId}"] .${prefix}-close svg {
			${lightbox.closeColor ? `fill: currentColor !important;` : ''}
		}
		.${prefix}-lightbox[data-bb-id="${safeId}"] .${prefix}-close:hover {
			${lightbox.closeHoverColor ? `color: ${lightbox.closeHoverColor} !important;` : ''}
			${lightbox.closeHoverBg ? `background: ${lightbox.closeHoverBg} !important;` : ''}
		}
		.${prefix}-lightbox[data-bb-id="${safeId}"] .${prefix}-nav {
			${lightbox.navColor ? `color: ${lightbox.navColor} !important;` : ''}
			${lightbox.navBg ? `background: ${lightbox.navBg} !important;` : ''}
		}
		.${prefix}-lightbox[data-bb-id="${safeId}"] .${prefix}-nav svg {
			${lightbox.navColor ? `fill: currentColor !important;` : ''}
		}
		.${prefix}-lightbox[data-bb-id="${safeId}"] .${prefix}-nav:hover {
			${lightbox.navHoverColor ? `color: ${lightbox.navHoverColor} !important;` : ''}
			${lightbox.navHoverBg ? `background: ${lightbox.navHoverBg} !important;` : ''}
		}
	`;

	const dialogEl = <div
		className={`${prefix}-lightbox${ready ? ' is-open' : ''}`}
		data-bb-id={safeId}
		role='dialog'
		aria-modal='true'
		aria-label={__('Instagram post', 'b-blocks')}
		ref={dialog}
		tabIndex={-1}
		onMouseDown={(e) => e.stopPropagation()}
		onClick={(event) => {
			event.stopPropagation();
			if (event.target === event.currentTarget) onClose();
		}}
	>
		<style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

		<button type='button' className={`${prefix}-close`} onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label={__('Close', 'b-blocks')}>{closeIcon}</button>

		{1 < feeds.length && <>
			<button type='button' className={`${prefix}-nav ${prefix}-nav-prev`} onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label={__('Previous post', 'b-blocks')}>{prevIcon}</button>

			<button type='button' className={`${prefix}-nav ${prefix}-nav-next`} onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label={__('Next post', 'b-blocks')}>{nextIcon}</button>
		</>}

		<div className={`${prefix}-dialog`} onClick={(e) => e.stopPropagation()}>
			<div className={`${prefix}-media`}>
				{'VIDEO' === type && <video controls autoPlay poster={poster} src={url} />}

				{'CAROUSEL_ALBUM' === type && <Carousel feed={feed} />}

				{'IMAGE' === type && <img src={url} alt='' />}
			</div>

			<div className={`${prefix}-details`}>
				{lightbox.showProfile && <Profile attributes={attributes} user={user} compact={true} />}

				{lightbox.showCaption && (caption || isBackend) && <div className={`${prefix}-full-caption`}>
					{captionNodes(caption || (isBackend ? __('Instagram caption preview text with #hashtags', 'b-blocks') : ''), elements.linkHashtags)}
				</div>}

				{lightbox.showLink && permalink && <a className={`${prefix}-permalink`} href={permalink} target='_blank' rel='noreferrer nofollow noopener'>
					{instagramIcon} {__('View on Instagram', 'b-blocks')}
				</a>}
			</div>
		</div>
	</div>;

	// Rendered at the body so an ancestor with a transform, filter or contain
	// cannot turn `position: fixed` into a box trapped inside the block.
	const portalTarget = container?.ownerDocument?.body || (typeof document !== 'undefined' ? document.body : null);
	return portalTarget ? createPortal(dialogEl, portalTarget) : dialogEl;
};

export default Lightbox;
