import { useEffect, useMemo, useState } from 'react';

import { cleanSectionId } from './options';
import OnePageNav from './runtime';
import { buildIndex, findSection } from './sections';

export const useUnresolvedSections = (items = [], ref) => {
	const [unresolved, setUnresolved] = useState('');

	const ids = items.map((item) => cleanSectionId(item.sectionId)).join('|');

	useEffect(() => {
		const doc = ref?.current?.ownerDocument;

		if (!doc) return undefined;

		const win = doc.defaultView || window;
		let timer = 0;

		const scan = () => {
			const headings = buildIndex(doc);

			const found = ids.split('|').reduce((out, id, index) => {
				if (id && !findSection(doc, id, headings)) out.push(index);

				return out;
			}, []).join(',');

			// Held as a string so an unchanged scan is a no-op. The editor mutates
			// the DOM continuously, and storing a fresh array each scan re-rendered
			// the block — and its whole inspector — on every frame.
			setUnresolved((previous) => previous === found ? previous : found);
		};

		scan();

		// A trailing throttle, not a debounce: continuous typing would keep
		// resetting a debounce and the scan would never run.
		const observer = new win.MutationObserver(() => {
			if (!timer) {
				timer = setTimeout(() => {
					timer = 0;
					scan();
				}, 500);
			}
		});

		// Character data as well: a section can now be matched by its heading, and
		// that heading changes as it is typed.
		observer.observe(doc.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['id'] });

		return () => {
			clearTimeout(timer);
			observer.disconnect();
		};
	}, [ids, ref]);

	// A stable array identity, so consumers are not re-rendered by this either.
	return useMemo(() => (unresolved ? unresolved.split(',').map(Number) : []), [unresolved]);
};

export const useCanvasNavigation = (ref, signature) => {
	useEffect(() => {
		const nav = ref?.current;

		if (!nav) return undefined;

		const instance = new OnePageNav(nav, { updateHash: false, manageFocus: false, preview: true });

		return () => instance.destroy();
	}, [ref, signature]);
};
