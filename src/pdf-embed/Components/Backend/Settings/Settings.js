import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	TextControl,
	TextareaControl,
	ToggleControl,
	Button,
	Notice,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const Settings = ({ attributes, setAttributes }) => {
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
		fallbackText,
		noindex,
		addID,
		addClass,
		addCSS,
	} = attributes;

	const h = height || {};

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

	const clearPdf = () => {
		setAttributes({ pdfId: 0, pdfUrl: '', pdfName: '' });
	};

	const setHeight = (key, value) => {
		setAttributes({ height: { ...h, [key]: value } });
	};

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('PDF', 'b-blocks')} initialOpen={true}>
				{pdfUrl ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							marginBottom: 10,
							padding: '8px 10px',
							background: '#f0f0f1',
							borderRadius: 6,
						}}
					>
						<strong style={{ fontSize: 11 }}>{__('PDF', 'b-blocks')}</strong>
						<span
							style={{
								fontSize: 12,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{pdfName || pdfUrl}
						</span>
					</div>
				) : null}

				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
					<MediaUploadCheck>
						<MediaUpload
							value={pdfId || 0}
							onSelect={onSelectPdf}
							allowedTypes={['application/pdf']}
							render={({ open }) => (
								<Button variant='secondary' onClick={open}>
									{pdfUrl ? __('Replace PDF', 'b-blocks') : __('Select PDF', 'b-blocks')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{pdfUrl && (
						<Button variant='link' isDestructive onClick={clearPdf}>
							{__('Remove', 'b-blocks')}
						</Button>
					)}
				</div>

				<TextControl
					label={__('Document title', 'b-blocks')}
					value={pdfName || ''}
					onChange={(val) => setAttributes({ pdfName: val })}
					placeholder={__('e.g. 2026 Annual Report', 'b-blocks')}
					help={__(
						'Used as the iframe accessible name. Recommended for screen-reader users.',
						'b-blocks'
					)}
					__nextHasNoMarginBottom
				/>

				{pdfUrl && !pdfName ? (
					<Notice status='warning' isDismissible={false}>
						{__(
							'Add a document title so screen readers can announce the embedded PDF.',
							'b-blocks'
						)}
					</Notice>
				) : null}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
				<TextControl
					label={__('Height — Desktop', 'b-blocks')}
					value={h.desktop || ''}
					onChange={(val) => setHeight('desktop', val)}
					placeholder='600px'
					help={__('CSS length, e.g. 600px or 80vh.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Height — Tablet', 'b-blocks')}
					value={h.tablet || ''}
					onChange={(val) => setHeight('tablet', val)}
					placeholder='500px'
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Height — Mobile', 'b-blocks')}
					value={h.mobile || ''}
					onChange={(val) => setHeight('mobile', val)}
					placeholder='400px'
					__nextHasNoMarginBottom
				/>

				<TextControl
					className='mt20'
					label={__('Width', 'b-blocks')}
					value={width || ''}
					onChange={(val) => setAttributes({ width: val })}
					placeholder='100%'
					help={__('CSS width of the viewer, e.g. 100% or 800px.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Max Width', 'b-blocks')}
					value={maxWidth}
					onChange={(val) => setAttributes({ maxWidth: val })}
					min={0}
					max={1600}
					step={10}
					help={maxWidth === 0 ? __('(no max)', 'b-blocks') : `${maxWidth}px`}
				/>

				<SelectControl
					label={__('Alignment', 'b-blocks')}
					value={alignment}
					options={[
						{ label: __('Left', 'b-blocks'), value: 'left' },
						{ label: __('Center', 'b-blocks'), value: 'center' },
						{ label: __('Right', 'b-blocks'), value: 'right' },
					]}
					onChange={(val) => setAttributes({ alignment: val })}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Download Button', 'b-blocks')}
				initialOpen={false}
			>
				<ToggleControl
					label={__('Show download button', 'b-blocks')}
					checked={!!showDownload}
					onChange={(val) => setAttributes({ showDownload: val })}
				/>

				{showDownload ? (
					<TextControl
						label={__('Button label', 'b-blocks')}
						value={downloadLabel || ''}
						onChange={(val) => setAttributes({ downloadLabel: val })}
						placeholder={__('Download PDF', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				) : null}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Border Width', 'b-blocks')}
					value={borderWidth}
					onChange={(val) => setAttributes({ borderWidth: val })}
					min={0}
					max={8}
				/>

				<PanelRow>
					<Label>{__('Border Color:', 'b-blocks')}</Label>
					<ColorControl
						value={borderColor || '#e0e0e0'}
						onChange={(val) => setAttributes({ borderColor: val })}
						defaultColor='#e0e0e0'
					/>
				</PanelRow>

				<RangeControl
					className='mt10'
					label={__('Border Radius', 'b-blocks')}
					value={borderRadius}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={32}
				/>

				<SelectControl
					label={__('Shadow', 'b-blocks')}
					value={shadow}
					options={[
						{ label: __('None', 'b-blocks'), value: 'none' },
						{ label: __('Small', 'b-blocks'), value: 'small' },
						{ label: __('Medium', 'b-blocks'), value: 'medium' },
						{ label: __('Large', 'b-blocks'), value: 'large' },
					]}
					onChange={(val) => setAttributes({ shadow: val })}
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Advanced', 'b-blocks')}
				initialOpen={false}
			>
				<TextareaControl
					label={__('Fallback text', 'b-blocks')}
					value={fallbackText || ''}
					onChange={(val) => setAttributes({ fallbackText: val })}
					help={__(
						'Displayed inside the iframe when the browser cannot render PDFs natively.',
						'b-blocks'
					)}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					className='mt20'
					label={__('Prevent indexing', 'b-blocks')}
					checked={!!noindex}
					onChange={(val) => setAttributes({ noindex: val })}
					help={__(
						"Adds noindex to the embedded frame. Does not affect the parent page's SEO.",
						'b-blocks'
					)}
				/>

				<TextControl
					className='mt20'
					label={__('Custom ID', 'b-blocks')}
					value={addID || ''}
					onChange={(val) => setAttributes({ addID: val })}
					placeholder={__('Enter a custom HTML id', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={__('Custom Class', 'b-blocks')}
					value={addClass || ''}
					onChange={(val) => setAttributes({ addClass: val })}
					placeholder={__('Enter additional CSS class(es)', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<TextareaControl
					label={__('Custom CSS', 'b-blocks')}
					value={addCSS || ''}
					onChange={(val) => setAttributes({ addCSS: val })}
					placeholder={__('Enter additional CSS', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
