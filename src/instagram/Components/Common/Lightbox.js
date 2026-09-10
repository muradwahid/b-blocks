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
			<button type='button' className={`${prefix}-nav ${prefix}-nav-prev`} onClick={() => nudge(-1)} aria-label={__('Previous slide', 'b-blocks')}>{prevIcon}</button>

			<button type='button' className={`${prefix}-nav ${prefix}-nav-next`} onClick={() => nudge(1)} aria-label={__('Next slide', 'b-blocks')}>{nextIcon}</button>
		</>}
	</div>;
};

const Lightbox = ({ attributes, user, feeds = [], index, blockId = '', onClose, onMove }) => {
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
		document.addEventListener('keydown', keys);

		// The page behind must not scroll while the dialog is up; the original
		// value is put back so a theme that sets its own overflow is respected.
		const previous = document.body.style.overflow;

		document.body.style.overflow = 'hidden';
		dialog.current?.focus();
		setReady(true);

		return () => {
			document.removeEventListener('keydown', keys);
			document.body.style.overflow = previous;
		};
	}, [keys]);

	if (!feed) return null;

	const { media_type: type = 'IMAGE', media_url: url = '', thumbnail_url: poster = '', caption = '', permalink = '' } = feed;

	const dialogEl = <div className={`${prefix}-lightbox${ready ? ' is-open' : ''}`} data-bb-id={blockId} role='dialog' aria-modal='true' aria-label={__('Instagram post', 'b-blocks')} ref={dialog} tabIndex={-1} onClick={(event) => event.target === event.currentTarget && onClose()}>
		<button type='button' className={`${prefix}-close`} onClick={onClose} aria-label={__('Close', 'b-blocks')}>{closeIcon}</button>

		{1 < feeds.length && <>
			<button type='button' className={`${prefix}-nav ${prefix}-nav-prev`} onClick={() => onMove(-1)} aria-label={__('Previous post', 'b-blocks')}>{prevIcon}</button>

			<button type='button' className={`${prefix}-nav ${prefix}-nav-next`} onClick={() => onMove(1)} aria-label={__('Next post', 'b-blocks')}>{nextIcon}</button>
		</>}

		<div className={`${prefix}-dialog`}>
			<div className={`${prefix}-media`}>
				{'VIDEO' === type && <video controls autoPlay poster={poster} src={url} />}

				{'CAROUSEL_ALBUM' === type && <Carousel feed={feed} />}

				{'IMAGE' === type && <img src={url} alt='' />}
			</div>

			<div className={`${prefix}-details`}>
				{lightbox.showProfile && <Profile attributes={attributes} user={user} compact={true} />}

				{lightbox.showCaption && caption && <div className={`${prefix}-full-caption`}>{captionNodes(caption, elements.linkHashtags)}</div>}

				{lightbox.showLink && permalink && <a className={`${prefix}-permalink`} href={permalink} target='_blank' rel='noreferrer nofollow noopener'>
					{instagramIcon} {__('View on Instagram', 'b-blocks')}
				</a>}
			</div>
		</div>
	</div>;

	// Rendered at the body so an ancestor with a transform, filter or contain
	// cannot turn `position: fixed` into a box trapped inside the block.
	return document.body ? createPortal(dialogEl, document.body) : dialogEl;
};

export default Lightbox;
