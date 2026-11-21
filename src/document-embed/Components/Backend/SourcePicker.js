import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

import ProModal from '../../../backend/ProModal/ProModal';
import CloudBrowse from './CloudBrowse';
import { googleDriveIcon, dropboxIcon, boxIcon, uploadIcon, linkIcon, documentIcon } from '../../utils/icons';
import { documentTypes } from '../../utils/options';
import { cloudSource, fileNameOf } from '../../utils/common';

const cloudSources = {
	googleDrive: { title: __('Google Drive', 'b-blocks'), icon: googleDriveIcon, text: __('Paste the share link of a Drive file or Google Doc.', 'b-blocks'), placeholder: 'https://drive.google.com/file/d/…/view' },
	dropbox: { title: __('Dropbox', 'b-blocks'), icon: dropboxIcon, text: __('Paste the share link of a Dropbox file.', 'b-blocks'), placeholder: 'https://www.dropbox.com/scl/fi/…' },
	box: { title: __('Box', 'b-blocks'), icon: boxIcon, text: __('Paste the shared link of a Box file.', 'b-blocks'), placeholder: 'https://app.box.com/s/…' }
};

/**
 * First screen of an empty Document Embed block.
 */
const SourcePicker = ({ document = {}, setAttributes, onSelectMedia, isPremium = false }) => {
	// The source lives in the block (document.source), so this screen and the sidebar always agree.
	const source = cloudSources[document.source] ? document.source : 'url';
	const [isProModalOpen, setIsProModalOpen] = useState(false);
	const [url, setUrl] = useState('');
	const inputId = useInstanceId(SourcePicker, 'b-blocks-document-embed-url');

	const embed = (e) => {
		e.preventDefault();

		const link = url.trim();
		if ('' !== link) {
			// A pasted link is saved under the service it comes from. Share links end in "view" or an id, not a file name.
			const linkSource = cloudSource(link);
			setAttributes({ document: { ...document, id: 0, url: link, name: linkSource ? '' : fileNameOf(link), mime: '', size: '', source: linkSource || 'url' } });
		}
	};

	return <div className='b-blocks-document-embed-picker'>
		<div className='b-blocks-document-embed-picker-head'>
			<span className='b-blocks-document-embed-picker-head-icon'>{documentIcon}</span>

			<div>
				<h3>{__('Choose a document source', 'b-blocks')}</h3>
				<p>{__('PDF, Word, Excel and PowerPoint files are supported.', 'b-blocks')}</p>
			</div>
		</div>

		<div className='b-blocks-document-embed-picker-grid'>
			<MediaUploadCheck>
				<MediaUpload
					allowedTypes={documentTypes}
					onSelect={onSelectMedia}
					render={({ open }) => <button type='button' className='b-blocks-document-embed-picker-card is-primary' onClick={open}>
						<span className='b-blocks-document-embed-picker-card-icon'>{uploadIcon}</span>
						<strong>{__('Upload / Media Library', 'b-blocks')}</strong>
						<span>{__('Upload a new file or pick one you have already uploaded.', 'b-blocks')}</span>
					</button>}
				/>
			</MediaUploadCheck>

			{Object.entries(cloudSources).map(([key, { title, icon, text }]) => <button key={key} type='button' className={`b-blocks-document-embed-picker-card${key === source ? ' is-active' : ''}`} onClick={() => setAttributes({ document: { ...document, source: key === source ? 'url' : key } })} aria-pressed={key === source}>
				<span className='b-blocks-document-embed-picker-card-icon'>{icon}</span>
				<strong>{title}</strong>
				<span>{text}</span>
			</button>)}
		</div>

		<form className='b-blocks-document-embed-picker-url' onSubmit={embed}>
			<label htmlFor={inputId}>{cloudSources[source] ? cloudSources[source].text : __('Or embed from URL', 'b-blocks')}</label>

			<div className='b-blocks-document-embed-picker-url-row'>
				<span className='b-blocks-document-embed-picker-url-field'>
					{linkIcon}
					<input id={inputId} type='url' value={url} onChange={(e) => setUrl(e.target.value)} placeholder={cloudSources[source]?.placeholder || 'https://example.com/document.pdf'} />
				</span>

				<button type='submit' className='components-button is-primary' disabled={'' === url.trim()}>{__('Embed', 'b-blocks')}</button>
			</div>
		</form>

		{cloudSources[source] && <CloudBrowse
			source={source}
			isPremium={isPremium}
			setIsProModalOpen={setIsProModalOpen}
			onPick={(picked) => setAttributes({ document: { ...document, id: 0, size: '', ...picked } })}
		/>}

		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block={__('Document Embed', 'b-blocks')}>
			<li>&emsp;<strong>{__('Cloud Pickers: ', 'b-blocks')}</strong>{__('Browse Google Drive, Dropbox and Box from the editor instead of pasting share links.', 'b-blocks')}</li>
		</ProModal>
	</div>;
};
export default SourcePicker;
