// Shared by the editor and the page. The page bundle (view.js) loads React only: nothing here, and nothing the
// frontend components import, may come from a @wordpress package.

import { useEffect, useRef } from 'react';

// Every visitor-facing text of both blocks, already translated by PHP (BBlocksDocumentEmbedHandler::labels()).
// render.php prints it before the page script; the editor gets the same map on its script. Plain data:
// placeholders (%s, %d, %1$s) are filled where the text is used, plurals are { one, other }.
export const labels = window.bBlocksDocumentLabels || {};

// Share-link addresses of the cloud sources, so a pasted link is saved under the source it belongs to.
export const cloudLinks = {
	googleDrive: /^https?:\/\/(drive|docs)\.google\.com\//i,
	dropbox: /^https?:\/\/([a-z0-9-]+\.)?dropbox(usercontent)?\.com\//i,
	box: /^https?:\/\/([a-z0-9-]+\.)?box(cloud)?\.com\//i
};

// The cloud service a link belongs to ('googleDrive', 'dropbox', 'box'), or '' for a plain link.
export const cloudSource = (url) => Object.keys(cloudLinks).find((key) => cloudLinks[key].test(url || '')) || '';

// Google Drive and Dropbox documents show in the service's own viewer: no toolbar or Download button on the page.
export const noToolbarLink = (url) => cloudLinks.googleDrive.test(url || '') || cloudLinks.dropbox.test(url || '');

// Whether a link points at this site (relative links do). An empty or unreadable link does not.
export const isLocalUrl = (url) => {
	if (!url) {
		return false;
	}
	try {
		return new URL(url, window.location.href).origin === window.location.origin;
	} catch (e) {
		return false;
	}
};

// The file name at the end of a link, readable ("My%20file.pdf" → "My file.pdf"). A malformed escape stays as written.
export const fileNameOf = (link) => {
	const name = String(link || '').split(/[?#]/)[0].split('/').pop() || '';
	try {
		return decodeURIComponent(name);
	} catch (e) {
		return name;
	}
};

/**
 * A modal dialog (Embed lightbox, Library popup): focus moves to its close button, Escape closes it, and focus goes
 * back to the opener when it closes. Returns focusEdge for the two Tab guards around the dialog: key presses inside
 * the viewer's iframe never reach this page, so a keydown trap alone would let focus walk out after the iframe.
 *
 * openerRef: the element that opened it; without one, whatever had focus when the dialog appeared.
 */
export const useDialog = ({ isOpen = true, dialogRef, closeRef, onClose, openerRef }) => {
	// The latest onClose, without restarting the listeners on every render.
	const close = useRef(onClose);
	close.current = onClose;

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		const doc = closeRef.current?.ownerDocument || document;
		const opener = openerRef?.current || doc.activeElement;
		closeRef.current?.focus();

		const onKey = (e) => 'Escape' === e.key && close.current();
		doc.addEventListener('keydown', onKey);

		// When focus moves into a frame from this site (the PDF viewer), Escape is listened for there too;
		// another site's frame cannot be reached.
		const win = doc.defaultView;
		const frames = new Set();
		const onBlur = () => {
			const frameWin = 'IFRAME' === doc.activeElement?.tagName ? doc.activeElement.contentWindow : null;
			if (!frameWin || frames.has(frameWin)) {
				return;
			}
			try {
				frameWin.addEventListener('keydown', onKey);
				frames.add(frameWin);
			} catch (error) {
				// A frame from another site.
			}
		};
		win?.addEventListener('blur', onBlur);

		return () => {
			doc.removeEventListener('keydown', onKey);
			win?.removeEventListener('blur', onBlur);
			frames.forEach((frameWin) => {
				try {
					frameWin.removeEventListener('keydown', onKey);
				} catch (error) {
					// Already gone.
				}
			});
			opener?.focus?.();
		};
	}, [isOpen]);

	return (last) => {
		const focusable = dialogRef.current?.querySelectorAll('button, a[href], iframe, input, select, video, audio') || [];
		(last ? focusable[focusable.length - 1] : focusable[0])?.focus();
	};
};
