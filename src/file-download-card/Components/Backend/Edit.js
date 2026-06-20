import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	AlignmentToolbar,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import Settings from './Settings/Settings';
import { badgeForMime } from '../../utils/data';

const clamp = (value, min, max, fallback) => {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) return fallback;
	return Math.max(min, Math.min(max, n));
};

const shadowMap = {
	none: 'none',
	sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
	md: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
	lg: '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)',
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		fileUrl,
		fileId,
		fileName,
		fileType,
		fileSize,
		cardTitle,
		cardDescription,
		buttonLabel,
		showFileType,
		showFileSize,
		layout,
		iconStyle,
		alignment,
		maxWidth,
		cardBg,
		cardBorderColor,
		cardBorderWidth,
		cardBorderRadius,
		paddingV,
		paddingH,
		shadow,
		iconBg,
		iconColor,
		iconSize,
		iconRadius,
		titleColor,
		titleSize,
		titleWeight,
		descColor,
		descSize,
		metaColor,
		metaSize,
		btnBg,
		btnText,
		btnRadius,
		btnPaddingV,
		btnPaddingH,
		btnSize,
		btnWeight,
	} = attributes;

	const badgeLabel = fileUrl ? badgeForMime(fileType, fileUrl) : 'FILE';

	const wrapperClass = [
		'bb-fdc',
		`bb-fdc--${layout}`,
		`bb-fdc--icon-${iconStyle}`,
		`bb-fdc--align-${alignment}`,
		clamp(cardBorderWidth, 0, 8, 1) > 0 ? 'bb-fdc--has-border' : '',
	]
		.filter(Boolean)
		.join(' ');

	const wrapperStyle = {
		'--bb-fdc-max-width':
			clamp(maxWidth, 0, 1600, 480) === 0 ? '100%' : `${clamp(maxWidth, 0, 1600, 480)}px`,
		'--bb-fdc-card-bg': cardBg || '#ffffff',
		'--bb-fdc-border-color': cardBorderColor || '#e0e0e0',
		'--bb-fdc-border-width': `${clamp(cardBorderWidth, 0, 8, 1)}px`,
		'--bb-fdc-radius': `${clamp(cardBorderRadius, 0, 32, 8)}px`,
		'--bb-fdc-shadow': shadowMap[shadow] || shadowMap.sm,
		'--bb-fdc-pad-v': `${clamp(paddingV, 0, 80, 20)}px`,
		'--bb-fdc-pad-h': `${clamp(paddingH, 0, 80, 24)}px`,
		'--bb-fdc-icon-bg': iconBg || '#2563eb',
		'--bb-fdc-icon-color': iconColor || '#ffffff',
		'--bb-fdc-icon-size': `${clamp(iconSize, 32, 96, 48)}px`,
		'--bb-fdc-icon-radius': `${clamp(iconRadius, 0, 48, 8)}px`,
		'--bb-fdc-title-color': titleColor || '#111827',
		'--bb-fdc-title-size': `${clamp(titleSize, 12, 36, 16)}px`,
		'--bb-fdc-title-weight': titleWeight || '600',
		'--bb-fdc-desc-color': descColor || '#6b7280',
		'--bb-fdc-desc-size': `${clamp(descSize, 11, 24, 14)}px`,
		'--bb-fdc-meta-color': metaColor || '#9ca3af',
		'--bb-fdc-meta-size': `${clamp(metaSize, 10, 18, 12)}px`,
		'--bb-fdc-btn-bg': btnBg || '#2563eb',
		'--bb-fdc-btn-text': btnText || '#ffffff',
		'--bb-fdc-btn-radius': `${clamp(btnRadius, 0, 9999, 6)}px`,
		'--bb-fdc-btn-pad-v': `${clamp(btnPaddingV, 0, 48, 10)}px`,
		'--bb-fdc-btn-pad-h': `${clamp(btnPaddingH, 0, 80, 20)}px`,
		'--bb-fdc-btn-size': `${clamp(btnSize, 11, 20, 14)}px`,
		'--bb-fdc-btn-weight': btnWeight || '600',
	};

	const blockProps = useBlockProps({ className: wrapperClass, style: wrapperStyle });

	const onSelectFile = (media) => {
		setAttributes({
			fileId: media?.id || 0,
			fileUrl: media?.url || '',
			fileName: media?.title || media?.filename || '',
			fileType: media?.mime || '',
			fileSize: media?.filesizeHumanReadable || '',
		});
	};

	const showMeta =
		(showFileType && badgeLabel) || (showFileSize && fileSize && fileSize.trim());

	if (!fileUrl) {
		return (
			<>
				<Settings attributes={attributes} setAttributes={setAttributes} />
				<div {...blockProps}>
					<MediaUploadCheck>
						<MediaUpload
							value={fileId || 0}
							onSelect={onSelectFile}
							render={({ open }) => (
								<button
									type='button'
									className='bb-fdc-placeholder'
									onClick={open}
								>
									<span className='bb-fdc-placeholder-icon'>{__('FILE', 'b-blocks')}</span>
									<span>{__('Select a file from the media library to create a download card.', 'b-blocks')}</span>
								</button>
							)}
						/>
					</MediaUploadCheck>
				</div>
			</>
		);
	}

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<BlockControls>
				<MediaUploadCheck>
					<ToolbarGroup>
						<MediaUpload
							value={fileId || 0}
							onSelect={onSelectFile}
							render={({ open }) => (
								<ToolbarButton
									icon='media-document'
									label={__('Replace file', 'b-blocks')}
									onClick={open}
								/>
							)}
						/>
					</ToolbarGroup>
				</MediaUploadCheck>

				<ToolbarGroup>
					<ToolbarButton
						icon='align-pull-left'
						label={__('Horizontal layout', 'b-blocks')}
						isPressed={layout === 'horizontal'}
						onClick={() => setAttributes({ layout: 'horizontal' })}
					/>
					<ToolbarButton
						icon='editor-insertmore'
						label={__('Vertical layout', 'b-blocks')}
						isPressed={layout === 'vertical'}
						onClick={() => setAttributes({ layout: 'vertical' })}
					/>
				</ToolbarGroup>

				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val || 'left' })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<article className='bb-fdc-card'>
					<span className='bb-fdc-badge' aria-hidden='true'>
						{badgeLabel}
					</span>

					<div className='bb-fdc-body'>
						<RichText
							tagName='h3'
							className='bb-fdc-title'
							value={cardTitle}
							onChange={(val) => setAttributes({ cardTitle: val })}
							placeholder={fileName || __('Card title…', 'b-blocks')}
							allowedFormats={[]}
						/>

						<RichText
							tagName='p'
							className='bb-fdc-desc'
							value={cardDescription}
							onChange={(val) => setAttributes({ cardDescription: val })}
							placeholder={__('Optional short description', 'b-blocks')}
							allowedFormats={[]}
						/>

						{showMeta ? (
							<p className='bb-fdc-meta'>
								{showFileType && badgeLabel ? (
									<span className='bb-fdc-meta-type'>{badgeLabel}</span>
								) : null}
								{showFileType && badgeLabel && showFileSize && fileSize ? (
									<span className='bb-fdc-meta-sep'>&middot;</span>
								) : null}
								{showFileSize && fileSize ? (
									<span className='bb-fdc-meta-size'>{fileSize}</span>
								) : null}
							</p>
						) : null}
					</div>

					<div className='bb-fdc-action'>
						<span className='bb-fdc-btn'>
							<svg
								className='bb-fdc-btn-icon'
								viewBox='0 0 24 24'
								aria-hidden='true'
								focusable='false'
							>
								<path
									d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
							<span className='bb-fdc-btn-label'>
								{buttonLabel || __('Download', 'b-blocks')}
							</span>
						</span>
					</div>
				</article>
			</div>
		</>
	);
};

export default Edit;
