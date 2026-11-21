import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';

import { InlineMediaUpload } from '../../../../../../../bpl-tools/Components';
import CloudBrowse from '../../CloudBrowse';
import { documentTypes, engineOptions, sourceOptions } from '../../../../utils/options';
import { cloudSource, fileNameOf, isLocalUrl } from '../../../../utils/common';

const DocumentSource = ({ attributes, setAttributes, updateObj, onSelectMedia, isPdf, premiumProps = {} }) => {
	const { document = {}, viewer = {} } = attributes;
	const { id = 0, url = '', name = '', source = 'media' } = document;

	const isExternal = '' !== url && !isLocalUrl(url);

	// The service a link belongs to: Google Drive, Dropbox, Box, or none (a plain URL).
	const linkSource = cloudSource(url);

	return <PanelBody className='bPlPanelBody' title={__('Document Source', 'b-blocks')} initialOpen={true}>
		<SelectControl
			label={__('Source', 'b-blocks')}
			value={source}
			options={sourceOptions}
			labelPosition='edge'
			onChange={(val) => setAttributes({
				document: ('media' === val ? id > 0 : 0 === id && '' !== url && (linkSource || 'url') === val) ?
					{ ...document, source: val } :
					{ ...document, id: 0, url: '', name: '', mime: '', size: '', source: val }
			})}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		{'media' === source ? <div className='mt10'>
			{'' !== url && <p className='b-blocks-document-embed-file-name'>{name || url}</p>}

			<InlineMediaUpload
				label={'' !== url ? __('Replace Document', 'b-blocks') : __('Select Document', 'b-blocks')}
				value={url}
				types={documentTypes}
				// A file from the Media Library keeps its id, type and size; a typed URL is not an attachment.
				onChange={(val, media) => media ? onSelectMedia(media) : setAttributes({ document: { ...document, id: 0, url: val, name: fileNameOf(val), mime: '', size: '' } })}
				placeholder={__('Enter document URL', 'b-blocks')}
			/>
		</div> :
			<TextControl
				className='mt10'
				type='url'
				label={__('Document URL', 'b-blocks')}
				value={url}
				onChange={(val) => {
					// A link from Google Drive, Dropbox or Box moves the source along; anything else keeps the chosen one while typing.
					const typedSource = cloudSource(val.trim());
					setAttributes({ document: { ...document, id: 0, url: val, name: typedSource ? '' : fileNameOf(val), mime: '', size: '', source: typedSource || source } });
				}}
				placeholder='https://'
				help={{ googleDrive: __('A Google Drive or Google Docs share link.', 'b-blocks'), dropbox: __('A Dropbox share link.', 'b-blocks'), box: __('A Box shared link (…box.com/s/…).', 'b-blocks') }[source] || __('A direct link to the file.', 'b-blocks')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>}

		{['googleDrive', 'dropbox', 'box'].includes(source) && <div className='mt10'>
			<CloudBrowse source={source} {...premiumProps} onPick={(picked) => setAttributes({ document: { ...document, id: 0, size: '', ...picked } })} />
		</div>}

		<SelectControl
			className='mt20'
			label={__('Viewer Engine', 'b-blocks')}
			value={isPdf ? (viewer.engine || 'default') : 'default'}
			options={engineOptions.map((option) => ({ ...option, disabled: 'default' !== option.value && !isPdf }))}
			labelPosition='edge'
			onChange={(val) => updateObj('viewer', val, 'engine')}
			help={__('Custom PDF, Flipbook and Slider work with PDFs only. Other files need a public link.', 'b-blocks')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		{isPdf && isExternal && 'custom' === viewer.engine && <p className='b-blocks-document-embed-warning'>{__('Custom PDF only opens PDFs from this site, so this one uses the Google viewer. Upload it to the Media Library instead.', 'b-blocks')}</p>}
	</PanelBody>;
};
export default DocumentSource;