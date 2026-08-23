import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useBlockProps, RichText, BlockControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { badgeForMime } from '../../utils/data';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { file = {}, content = {}, layout = {}, icon = {} } = attributes;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	const { url: fileUrl, id: fileId, name: fileName, type: fileType, size: fileSize, buttonLabel, showFileType = true, showFileSize = true } = file;

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

	const badge = fileUrl ? badgeForMime(fileType, fileUrl) : 'FILE';
	const hasSize = !!(fileSize && String(fileSize).trim());
	const showMeta = (showFileType && badge) || (showFileSize && hasSize);

	const wrapperClass = [
		'b-blocks-file-download-card',
		`b-blocks-file-download-card--${layout.type || 'horizontal'}`,
		`b-blocks-file-download-card--icon-${icon.style || 'filled'}`,
	].join(' ');

	const blockProps = useBlockProps({ id: `block-${clientId}` });
	if (!fileUrl) {
		return (
			<>
				<Settings {...{ ...props, updateObj, isPremium }} />
				<div {...blockProps}>
					<div>
						<MediaUploadCheck>
							<MediaUpload
								value={fileId || 0}
								onSelect={onSelectFile}
								render={({ open }) => (
									<button type='button' className='b-blocks-file-download-card-placeholder' onClick={open}>
										<span className='b-blocks-file-download-card-placeholder-icon'>{__('FILE', 'b-blocks')}</span>
										<span>{__('Select a file from the media library to create a download card.', 'b-blocks')}</span>
									</button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Settings {...{ ...props, updateObj, isPremium }} />

			<BlockControls>
				<MediaUploadCheck>
					<ToolbarGroup>
						<MediaUpload
							value={fileId || 0}
							onSelect={onSelectFile}
							render={({ open }) => (
								<ToolbarButton icon='media-document' label={__('Replace file', 'b-blocks')} onClick={open} />
							)}
						/>
					</ToolbarGroup>
				</MediaUploadCheck>

				<ToolbarGroup>
					<ToolbarButton
						icon='align-pull-left'
						label={__('Horizontal layout', 'b-blocks')}
						isPressed={(layout.type || 'horizontal') === 'horizontal'}
						onClick={() => updateObj('layout', 'horizontal', 'type')}
					/>
					<ToolbarButton
						icon='editor-insertmore'
						label={__('Vertical layout', 'b-blocks')}
						isPressed={layout.type === 'vertical'}
						onClick={() => updateObj('layout', 'vertical', 'type')}
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

				<div>
					<div className={wrapperClass}>
						<article className='b-blocks-file-download-card-card'>
							<span className='b-blocks-file-download-card-badge' aria-hidden='true'>{badge}</span>

							<div className='b-blocks-file-download-card-body'>
								<RichText
									tagName='h3'
									className='b-blocks-file-download-card-title'
									value={content.title}
									onChange={(val) => updateObj('content', val, 'title')}
									placeholder={fileName || __('Card title…', 'b-blocks')}
									allowedFormats={[]}
								/>

								<RichText
									tagName='p'
									className='b-blocks-file-download-card-desc'
									value={content.description}
									onChange={(val) => updateObj('content', val, 'description')}
									placeholder={__('Optional short description', 'b-blocks')}
									allowedFormats={[]}
								/>

								{showMeta ? (
									<p className='b-blocks-file-download-card-meta'>
										{showFileType && badge ? <span className='b-blocks-file-download-card-meta-type'>{badge}</span> : null}
										{showFileType && badge && showFileSize && hasSize ? <span className='b-blocks-file-download-card-meta-sep'>&middot;</span> : null}
										{showFileSize && hasSize ? <span className='b-blocks-file-download-card-meta-size'>{fileSize}</span> : null}
									</p>
								) : null}
							</div>

							<div className='b-blocks-file-download-card-action'>
								<span className='b-blocks-file-download-card-btn'>
									<svg className='b-blocks-file-download-card-btn-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
										<path d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
									</svg>
									<span className='b-blocks-file-download-card-btn-label'>{buttonLabel || __('Download', 'b-blocks')}</span>
								</span>
							</div>
						</article>
					</div>
				</div>
			</div>
		</>
	);
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);
