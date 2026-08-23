import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl, ToggleControl, Button } from '@wordpress/components';

import { LAYOUT_OPTIONS, ICON_STYLE_OPTIONS } from '../../../../utils/options';
import { badgeForMime } from '../../../../utils/data';

const General = ({ attributes, updateObj, setAttributes }) => {
	const { file = {}, content = {}, layout = {}, icon = {} } = attributes;

	const { id: fileId, url: fileUrl, name: fileName, type: fileType, size: fileSize, buttonLabel, openNewTab, showFileType = true, showFileSize = true } = file;

	const onSelectFile = (media) => {
		setAttributes({
			file: {
				...file,
				id: media?.id || 0,
				url: media?.url || '',
				name: media?.title || media?.filename || '',
				type: media?.mime || '',
				size: media?.filesizeHumanReadable || '',
			},
		});
	};

	const clearFile = () => setAttributes({ file: { ...file, id: 0, url: '', name: '', type: '', size: '' } });

	const badgeLabel = fileUrl ? badgeForMime(fileType, fileUrl) : '';

	return <>
		<PanelBody className='bPlPanelBody' title={__('File', 'b-blocks')} initialOpen={true}>
			{fileUrl ? (
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 10px', background: '#f0f0f1', borderRadius: 6 }}>
					<strong style={{ fontSize: 11 }}>{badgeLabel}</strong>
					<span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName || fileUrl}</span>
				</div>
			) : null}

			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
				<MediaUploadCheck>
					<MediaUpload
						value={fileId || 0}
						onSelect={onSelectFile}
						render={({ open }) => (
							<Button variant='secondary' onClick={open}>
								{fileUrl ? __('Replace File', 'b-blocks') : __('Select File', 'b-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{fileUrl && (
					<Button variant='link' isDestructive onClick={clearFile}>{__('Remove', 'b-blocks')}</Button>
				)}
			</div>

			<TextControl
				label={__('Or enter file URL', 'b-blocks')}
				value={fileId ? '' : fileUrl || ''}
				onChange={(val) => setAttributes({ file: { ...file, url: val, id: 0 } })}
				type='url'
				placeholder='https://'
				help={fileId ? __('Using a media-library file. Remove it to enter an external URL.', 'b-blocks') : __('Use for files hosted outside the media library.', 'b-blocks')}
				// disabled={!!fileId}
				__nextHasNoMarginBottom
			/>

			<TextControl
				className='mt20'
				label={__('Card title', 'b-blocks')}
				value={content.title || ''}
				onChange={(val) => updateObj('content', val, 'title')}
				placeholder={fileName || __('Auto-uses file name', 'b-blocks')}
				help={__('Also editable inline on the block canvas.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<TextControl
				label={__('Description', 'b-blocks')}
				value={content.description || ''}
				onChange={(val) => updateObj('content', val, 'description')}
				placeholder={__('Optional short description', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<TextControl
				label={__('Button label', 'b-blocks')}
				value={buttonLabel || ''}
				onChange={(val) => updateObj('file', val, 'buttonLabel')}
				placeholder={__('Download', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<TextControl
				label={__('File size (override)', 'b-blocks')}
				value={fileSize || ''}
				onChange={(val) => updateObj('file', val, 'size')}
				placeholder='e.g. 2.4 MB'
				help={fileId ? __('Auto-detected from the media library on the front end.', 'b-blocks') : __('Shown for external URLs (not auto-detected).', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<ToggleControl className='mt20' label={__('Open in new tab', 'b-blocks')} checked={!!openNewTab} onChange={(val) => updateObj('file', !!val, 'openNewTab')} />
			<ToggleControl label={__('Show file type badge', 'b-blocks')} checked={!!showFileType} onChange={(val) => updateObj('file', !!val, 'showFileType')} />
			<ToggleControl label={__('Show file size', 'b-blocks')} checked={!!showFileSize} onChange={(val) => updateObj('file', !!val, 'showFileSize')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
			<SelectControl
				label={__('Layout', 'b-blocks')}
				labelPosition='edge'
				value={layout.type || 'horizontal'}
				options={LAYOUT_OPTIONS}
				onChange={(val) => updateObj('layout', val, 'type')}
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Icon Badge', 'b-blocks')} initialOpen={false}>
			<SelectControl
				label={__('Style', 'b-blocks')}
				value={icon.style || 'filled'}
				options={ICON_STYLE_OPTIONS}
				onChange={(val) => updateObj('icon', val, 'style')}
				__nextHasNoMarginBottom
			/>

			<RangeControl
				className='mt10'
				label={__('Badge Size', 'b-blocks')}
				value={parseInt(icon.size, 10) || 48}
				onChange={(val) => updateObj('icon', val, 'size')}
				min={32}
				max={96}
				__nextHasNoMarginBottom
			/>
		</PanelBody>
	</>;
};
export default General;
