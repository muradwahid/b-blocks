import { useEffect, useMemo, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';

import { prefix } from '../../utils/data';
import { fetchFeed } from '../../utils/fetch';
import { getWrapperClasses } from '../../utils/options';
import FollowBtn from './FollowBtn';
import Item from './Item';
import Lightbox from './Lightbox';
import Profile from './Profile';

const Skeleton = ({ count = 12 }) => <div className={`${prefix}-grid`}>
	{Array.from({ length: count }, (unused, index) => <div className={`${prefix}-item ${prefix}-skeleton`} key={index} />)}
</div>;

/**
 * Shared by the editor and the frontend. The feed is asked of our own endpoint,
 * which holds the token — nothing here ever talks to Graph directly.
 *
 * `isBackend` keeps the lightbox shut in the canvas, where a click belongs to the editor.
 */

const Instagram = ({ attributes, id = '', isBackend = false }) => {
	const wrapperRef = useRef(null);
	const { source = {}, elements = {} } = attributes;

	const [state, setState] = useState({ status: 'loading', user: {}, media: [], error: '' });
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(-1);

	const { account = '', limit = 24, perPage = 12, cacheMinutes = 30 } = source;

	useEffect(() => {
		let live = true;

		setState((previous) => ({ ...previous, status: 'loading', error: '' }));

		fetchFeed({ account, limit, cacheMinutes })
			.then((data) => live && setState({ status: 'ready', user: data?.user || {}, media: data?.media || [], error: '' }))
			.catch((error) => live && setState({ status: 'error', user: {}, media: [], error: error.message }));

		// A cancelled request must not overwrite the state of the one after it.
		return () => { live = false; };
	}, [account, limit, cacheMinutes]);

	// A new account or page size starts the listing over rather than leaving the
	// reader partway down a feed they have not seen.
	useEffect(() => setPage(1), [account, perPage]);

	const feed = { user: state.user, media: state.media };

	const step = parseInt(perPage, 10) || 12;
	const visible = useMemo(() => feed.media.slice(0, step * page), [feed.media, step, page]);
	const hasMore = feed.media.length > visible.length;

	const classes = getWrapperClasses(attributes);

	if ('loading' === state.status && !isBackend) {
		return <div className={classes}><Skeleton count={step} /></div>;
	}

	if ('error' === state.status && !isBackend && !feed.media.length) {
		return null;
	}

	if (!feed.media.length) {
		return <div className={classes}>
			<p className={`${prefix}-notice`}>
				{state.error || __('No posts to show yet.', 'b-blocks')}
			</p>
		</div>;
	}

	const move = (direction) => setOpen((current) => (current + direction + visible.length) % visible.length);

	const header = elements.profile || (elements.followButton && !elements.followInFooter);
	const footer = (elements.loadMore && hasMore) || (elements.followButton && elements.followInFooter);

	return <div className={classes} ref={wrapperRef}>
		{header && <div className={`${prefix}-header`}>

			{elements.profile && <Profile attributes={attributes} user={feed.user} />}

			{!elements.followInFooter && <FollowBtn attributes={attributes} username={feed.user?.username} isBackend={isBackend} />}

		</div>}

		<div className={`${prefix}-grid`}>
			{visible.map((post, index) => <Item key={post.id} attributes={attributes} feed={post} index={index} isBackend={isBackend} onOpen={setOpen} />)}
		</div>

		{ footer && <div className={`${prefix}-footer`}>

			{ elements.loadMore && hasMore && <button type='button' className={`${prefix}-load-more`} onClick={() => isBackend ? {} : setPage(page + 1)}>
				{elements.loadMoreLabel || __('Load More', 'b-blocks')}
			</button> }

			{elements.followInFooter && <FollowBtn attributes={attributes} username={feed.user?.username} isBackend={isBackend} />}

		</div> }

		{elements.lightbox && -1 < open && <Lightbox attributes={attributes} user={feed.user} feeds={visible} index={open} blockId={id} container={wrapperRef.current} isBackend={isBackend} onClose={() => setOpen(-1)} onMove={move} />}

	</div>;
};

export default Instagram;