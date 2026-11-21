import { useEffect, useRef, useState } from 'react';
import { labels, useDialog } from '../../utils/common';

/**
 * The trigger (button, image, or any element on the page matching a selector) and the modal
 * holding the viewer. The viewer mounts only while the modal is open.
 */
const Lightbox = ({ lightbox = {}, name = '', isBackend = false, onOpenChange = () => { }, children }) => {
	const { trigger = 'button', buttonSize = 'medium', selector = '', image = {} } = lightbox;
	// An emptied text field still needs a label: the button is the only way to open the document.
	const buttonText = lightbox.buttonText || labels.viewDocument;

	const [isOpen, setIsOpen] = useState(false);
	const dialogRef = useRef(null);
	const closeRef = useRef(null);
	const openerRef = useRef(null);

	// Any element on the page matching the selector opens this block's modal.
	useEffect(() => {
		if (isBackend || 'selector' !== trigger || '' === selector.trim()) {
			return undefined;
		}

		const onClick = (e) => {
			let target = null;
			try {
				target = e.target.closest(selector);
			} catch (error) {
				return; // Not a valid selector.
			}

			if (target) {
				e.preventDefault();
				openerRef.current = target;
				setIsOpen(true);
			}
		};
		document.addEventListener('click', onClick);

		return () => document.removeEventListener('click', onClick);
	}, [isBackend, trigger, selector]);

	const focusEdge = useDialog({ isOpen, dialogRef, closeRef, openerRef, onClose: () => setIsOpen(false) });

	// The block asks for a secure-viewing link only once the dialog opens.
	useEffect(() => {
		onOpenChange(isOpen);
	}, [isOpen]);

	const open = (e) => {
		openerRef.current = e.currentTarget;
		setIsOpen(true);
	};

	return <>
		{'image' === trigger && image?.url ?
			<button type='button' className='b-blocks-document-embed-lightbox-img-btn' onClick={open} aria-haspopup='dialog'>
				<img className='b-blocks-document-embed-lightbox-img' src={image.url} alt={image.alt || buttonText} />
			</button> :
			'selector' === trigger && '' !== selector.trim() ?
				(isBackend && <p className='b-blocks-document-embed-lightbox-note'>{
					// One translated sentence, split where the selector goes so it can sit in <code>.
					(labels.selectorHint || '').split('%s').map((part, i) => <span key={i}>{0 < i && <code>{selector}</code>}{part}</span>)
				}</p>) :
				<button type='button' className={`b-blocks-document-embed-lightbox-btn ${buttonSize}`} onClick={open} aria-haspopup='dialog'>{buttonText}</button>}

		{isOpen && <div className='b-blocks-document-embed-lightbox-overlay' onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
			<span tabIndex={0} onFocus={() => focusEdge(true)} />

			<div ref={dialogRef} className='b-blocks-document-embed-lightbox' role='dialog' aria-modal='true' aria-label={name || buttonText}>
				<button ref={closeRef} type='button' className='b-blocks-document-embed-lightbox-close' onClick={() => setIsOpen(false)} aria-label={labels.close}>&times;</button>

				<div className='b-blocks-document-embed-lightbox-body'>{children}</div>
			</div>

			<span tabIndex={0} onFocus={() => focusEdge(false)} />
		</div>}
	</>;
};
export default Lightbox;
