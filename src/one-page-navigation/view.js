import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import OnePageNavigation from './Components/Common/OnePageNavigation';
import Style from './Components/Common/Style';
import OnePageNav from './utils/runtime';

/**
 * Owns the runtime's lifecycle. useEffect runs after the commit, so the nav is
 * guaranteed to be in the DOM — unlike a timer or a single animation frame,
 * which can fire before a concurrent root has painted and never retry.
 *
 * The nav holds the ref itself, and is the block's only element child, so it is
 * also what Advanced's generated CSS targets (`#id > div`).
 */
const Mount = ({ attributes, id }) => {
	const nav = useRef(null);

	useEffect(() => {
		if (!nav.current) return undefined;

		const instance = new OnePageNav(nav.current);

		return () => instance.destroy();
	}, []);

	return <>
		<Style attributes={attributes} id={id} />

		<OnePageNavigation ref={nav} attributes={attributes} />
	</>;
};

const mount = () => {
	const navEls = document.querySelectorAll('.wp-block-b-blocks-one-page-navigation');

	navEls.forEach((navEl) => {
		let attributes;

		// One block saved with malformed JSON must not stop every later block on
		// the page from mounting.
		try {
			attributes = JSON.parse(navEl.dataset.attributes || '');
		} catch (error) {
			return;
		}

		createRoot(navEl).render(<Mount attributes={attributes} id={navEl.id} />);

		navEl.removeAttribute('data-attributes');
	});
};

// The event has already fired by the time an async or optimizer-deferred copy of
// this file runs, and it never fires again — the block would stay an empty div.
if ('loading' === document.readyState) {
	document.addEventListener('DOMContentLoaded', mount);
} else {
	mount();
}
