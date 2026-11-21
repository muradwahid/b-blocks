import { badgeTones, categories, labels } from '../../../utils/common';


import { downloadIcon, eyeIcon } from '../../../utils/icons';

/** Card icon for the Grid, or the item's own image. */
export const FileIcon = ({ doc }) => doc.image?.url ?
	<img className='b-blocks-document-library-thumb' src={doc.image.url} alt='' loading='lazy' /> :
	<span className='b-blocks-document-library-icon'>{categories[doc.kind]?.icon}</span>;

/** Coloured badge with the extension, for the List. */
export const FileBadge = ({ doc, small = false }) => {
	const tone = badgeTones[doc.ext] || ({ images: 'image', videos: 'video', audio: 'audio', archives: 'archive' })[doc.kind] || 'other';

	return <span className={`b-blocks-document-library-badge is-${tone}${small ? ' is-small' : ''}`} aria-hidden='true'>{(doc.ext || 'file').slice(0, 4).toUpperCase()}</span>;
};

/** View and Download buttons. */
export const Actions = ({ doc, attributes, isBackend = false, onView }) => {
	const { viewButton = {}, downloadButton = {} } = attributes;
	const { show: showView = true, showText: showViewText = true, text: viewText = '' } = viewButton;
	// A document can open its own way; otherwise as set for the block.
	const action = doc.viewAction || viewButton.action || 'modal';
	const { show: showDownload = true, showText: showDownloadText = true, text: downloadText = '' } = downloadButton;

	if (!showView && !showDownload) {
		return null;
	}

	// "View: Annual report": the button text (or its default) and the document, for screen readers.
	const label = (text, fallback) => (labels.buttonFor || '').replace('%1$s', text || fallback).replace('%2$s', doc.title);

	// Links never navigate the editor away.
	const stay = (e) => isBackend && e.preventDefault();

	return <div className='b-blocks-document-library-actions'>
		{showView && ('newtab' === action ?
			<a className='b-blocks-document-library-btn is-view' href={doc.url} target='_blank' rel='noopener noreferrer' onClick={stay} aria-label={showViewText && viewText ? undefined : label(viewText, labels.view)}>
				{eyeIcon}
				{showViewText && viewText && <span>{viewText}</span>}
			</a> :
			<button type='button' className='b-blocks-document-library-btn is-view' onClick={() => onView(doc)} aria-haspopup='dialog' aria-label={showViewText && viewText ? undefined : label(viewText, labels.view)}>
				{eyeIcon}
				{showViewText && viewText && <span>{viewText}</span>}
			</button>)}

		{showDownload && <a
			className='b-blocks-document-library-btn is-download'
			href={doc.url}
			// A file on another site ignores the download attribute and would replace this page: it opens in a new tab.
			download={doc.isLocal ? doc.title || true : undefined}
			target={doc.isLocal ? undefined : '_blank'}
			rel='noopener noreferrer'
			onClick={stay}
			// An icon-only button (text hidden or emptied) is named for screen readers.
			aria-label={showDownloadText && downloadText ? undefined : label(downloadText, labels.download)}
		>
			{downloadIcon}
			{showDownloadText && downloadText && <span>{downloadText}</span>}
		</a>}
	</div>;
};
