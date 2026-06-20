import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	BlockControls,
	AlignmentToolbar,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import Settings from './Settings/Settings';

const clamp = (value, min, max, fallback) => {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) return fallback;
	return Math.max(min, Math.min(max, n));
};

const shadowMap = {
	none: 'none',
	small: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
	medium: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
	large: '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)',
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		pdfId,
		pdfUrl,
		pdfName,
		height,
		width,
		maxWidth,
		alignment,
		showDownload,
		downloadLabel,
		borderRadius,
		borderWidth,
		borderColor,
		shadow,
	} = attributes;

	const h = height || {};

	const wrapperClass = [
		'bb-pe',
		`bb-pe--align-${alignment || 'center'}`,
		clamp(borderWidth, 0, 8, 1) > 0 ? 'bb-pe--has-border' : '',
	]
		.filter(Boolean)
		.join(' ');

	const wrapperStyle = {
		'--bb-pe-width': width || '100%',
		'--bb-pe-max-width':
			clamp(maxWidth, 0, 1600, 0) === 0 ? '100%' : `${clamp(maxWidth, 0, 1600, 0)}px`,
		'--bb-pe-h-desktop': h.desktop || '600px',
		'--bb-pe-h-tablet': h.tablet || '500px',
		'--bb-pe-h-mobile': h.mobile || '400px',
		'--bb-pe-radius': `${clamp(borderRadius, 0, 32, 4)}px`,
		'--bb-pe-border-width': `${clamp(borderWidth, 0, 8, 1)}px`,
		'--bb-pe-border-color': borderColor || '#e0e0e0',
		'--bb-pe-shadow': shadowMap[shadow] || shadowMap.none,
	};

	const blockProps = useBlockProps({ className: wrapperClass, style: wrapperStyle });

	const onSelectPdf = (media) => {
		const url = media?.url || '';
		const isPdf =
			(media?.mime || '').toLowerCase() === 'application/pdf' ||
			url.split('?')[0].split('#')[0].toLowerCase().endsWith('.pdf');

		if (!isPdf) {
			return;
		}

		setAttributes({
			pdfId: media?.id || 0,
			pdfUrl: url,
			pdfName: pdfName || media?.title || media?.filename || '',
		});
	};

	const displayName = pdfName || __('PDF document', 'b-blocks');

	if (!pdfUrl) {
		return (
			<>
				<Settings attributes={attributes} setAttributes={setAttributes} />
				<div {...blockProps}>
					<MediaUploadCheck>
						<MediaUpload
							value={pdfId || 0}
							onSelect={onSelectPdf}
							allowedTypes={['application/pdf']}
							render={({ open }) => (
								<button type='button' className='bb-pe-placeholder' onClick={open}>
									<span className='bb-pe-placeholder-icon'>{__('PDF', 'b-blocks')}</span>
									<span>
										{__(
											'Select a PDF from the media library to embed it inline.',
											'b-blocks'
										)}
									</span>
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
							value={pdfId || 0}
							onSelect={onSelectPdf}
							allowedTypes={['application/pdf']}
							render={({ open }) => (
								<ToolbarButton
									icon='media-document'
									label={__('Replace PDF', 'b-blocks')}
									onClick={open}
								/>
							)}
						/>
					</ToolbarGroup>
				</MediaUploadCheck>

				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val || 'center' })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<div className='bb-pe-frame-wrap'>
					<iframe
						className='bb-pe-frame'
						src={pdfUrl}
						title={displayName}
						loading='lazy'
						referrerPolicy='no-referrer-when-downgrade'
					/>
				</div>

				{showDownload ? (
					<div className='bb-pe-download'>
						<span className='bb-pe-btn'>
							<svg
								className='bb-pe-btn-icon'
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
							<span className='bb-pe-btn-label'>
								{downloadLabel || __('Download PDF', 'b-blocks')}
							</span>
						</span>
					</div>
				) : null}
			</div>
		</>
	);
};

export default Edit;
