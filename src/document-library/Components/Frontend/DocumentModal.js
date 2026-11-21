import { useRef } from 'react';
import { labels, useDialog } from '../../utils/common';

import DocumentEmbed from '../../../document-embed/Components/Frontend/DocumentEmbed';
import { closeIcon } from '../../utils/icons';

/**
 * "View" modal. Shows the document with the Document Embed viewer.
 *
 * The "custom" viewer (bundled PDF.js) is used for PDFs on this site only: PDF.js refuses a file
 * from another origin, so those keep the Google viewer, which needs no CORS from the remote host.
 */
const DocumentModal = ({ doc, assetsUrl = '', onClose }) => {

	const dialogRef = useRef(null);
	const closeRef = useRef(null);

	const focusEdge = useDialog({ dialogRef, closeRef, onClose });

	return <div className='b-blocks-document-library-modal-overlay' onClick={(e) => e.target === e.currentTarget && onClose()}>
		<span tabIndex={0} onFocus={() => focusEdge(true)} />

		<div ref={dialogRef} className='b-blocks-document-library-modal' role='dialog' aria-modal='true' aria-label={doc.title}>
			<div className='b-blocks-document-library-modal-head'>
				<h3>{doc.title}</h3>

				<button ref={closeRef} type='button' className='b-blocks-document-library-modal-close' onClick={onClose} aria-label={labels.close}>{closeIcon}</button>
			</div>

			<div className='b-blocks-document-library-modal-body'>
				{'audio' === doc.kind ?
					<audio className='b-blocks-document-library-audio' controls src={doc.url} /> :
					<div className='wp-block-b-blocks-document-embed'>
						<DocumentEmbed
							attributes={{
								// The type travels too: a link with no extension (a download script) is still opened as a PDF.
								document: { url: doc.url, name: doc.title, mime: doc.mime || '' },
								// Reader mode: just the pages; the card has its own Download button.
								// A file from this site opens in the built-in viewer with either choice; only the Custom engine takes
								// viewer controls such as reader mode, so it is used here for every file from this site.
								viewer: { engine: doc.isLocal ? 'custom' : 'default', readerMode: true },
								performance: { gviewFallback: true }
							}}
							assetsUrl={assetsUrl}
						/>
					</div>}
			</div>
		</div>

		<span tabIndex={0} onFocus={() => focusEdge(false)} />
	</div>;
};
export default DocumentModal;
