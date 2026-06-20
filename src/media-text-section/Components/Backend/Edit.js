import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	BlockControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	ColorPalette,
	GradientPicker,
	FocalPointPicker,
	ToolbarGroup,
	ToolbarButton,
	Button,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { buildSectionCss, ratioToPercents } from '../Common/style';

const SPLIT_OPTIONS = [
	{ label: '30 / 70', value: '30-70' },
	{ label: '40 / 60', value: '40-60' },
	{ label: '50 / 50', value: '50-50' },
	{ label: '60 / 40', value: '60-40' },
	{ label: '70 / 30', value: '70-30' },
];

const ALLOWED_CONTENT_BLOCKS = undefined;

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		mediaPosition,
		mediaType,
		mediaId,
		mediaUrl,
		mediaAlt,
		mediaPosterUrl,
		splitRatio,
		minHeight,
		mediaFit,
		mediaFocal,
		stickyMedia,
		mediaOverlayColor,
		mediaOverlayOpacity,
		imageBorderRadius,
		imageBoxShadow,
		mediaPanelBg,
		contentPanelBg,
		sectionBg,
		sectionBgGradient,
		verticalAlign,
		contentPaddingTop,
		contentPaddingBottom,
		contentPaddingLeft,
		contentPaddingRight,
		mobileStackOrder,
		gapBetweenPanels,
		sectionLabel,
	} = attributes;

	const hasInnerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId).length > 0,
		[clientId]
	);

	const blockProps = useBlockProps({ className: 'bb-mts' });
	const instanceId = blockProps.id || `bb-mts-${clientId}`;

	const css = buildSectionCss(instanceId, attributes);
	const { left: leftPct } = ratioToPercents(splitRatio);
	const isReverse = mediaPosition === 'right';

	const setMedia = (media) => {
		if (!media) return;
		setAttributes({
			mediaId: media.id || 0,
			mediaUrl: media.url || '',
			mediaAlt: mediaType === 'image' ? (mediaAlt || media.alt || '') : mediaAlt,
		});
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon='align-pull-left'
						label={__('Show media on left', 'b-blocks')}
						isPressed={mediaPosition === 'left'}
						onClick={() => setAttributes({ mediaPosition: 'left' })}
					/>
					<ToolbarButton
						icon='align-pull-right'
						label={__('Show media on right', 'b-blocks')}
						isPressed={mediaPosition === 'right'}
						onClick={() => setAttributes({ mediaPosition: 'right' })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Layout', 'b-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Media Position', 'b-blocks')}
						value={mediaPosition}
						options={[
							{ label: __('Left', 'b-blocks'), value: 'left' },
							{ label: __('Right', 'b-blocks'), value: 'right' },
						]}
						onChange={(val) => setAttributes({ mediaPosition: val })}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Split Ratio', 'b-blocks')}
						help={__('Media / content column widths.', 'b-blocks')}
						value={splitRatio}
						options={SPLIT_OPTIONS}
						onChange={(val) => setAttributes({ splitRatio: val })}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Vertical Alignment', 'b-blocks')}
						value={verticalAlign}
						options={[
							{ label: __('Top', 'b-blocks'), value: 'top' },
							{ label: __('Center', 'b-blocks'), value: 'center' },
							{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
						]}
						onChange={(val) => setAttributes({ verticalAlign: val })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Minimum Height (px)', 'b-blocks')}
						help={__('0 = auto.', 'b-blocks')}
						value={minHeight}
						onChange={(val) => setAttributes({ minHeight: val ?? 0 })}
						min={0}
						max={1200}
						step={10}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Gap Between Panels (px)', 'b-blocks')}
						value={gapBetweenPanels}
						onChange={(val) => setAttributes({ gapBetweenPanels: val ?? 0 })}
						min={0}
						max={80}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Mobile Stack Order', 'b-blocks')}
						value={mobileStackOrder}
						options={[
							{ label: __('Image first', 'b-blocks'), value: 'media-first' },
							{ label: __('Content first', 'b-blocks'), value: 'content-first' },
						]}
						onChange={(val) => setAttributes({ mobileStackOrder: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Media', 'b-blocks')} initialOpen={false}>
					<SelectControl
						label={__('Media Type', 'b-blocks')}
						value={mediaType}
						options={[
							{ label: __('Image', 'b-blocks'), value: 'image' },
							{ label: __('Video', 'b-blocks'), value: 'video' },
						]}
						onChange={(val) =>
							setAttributes({ mediaType: val, mediaId: 0, mediaUrl: '' })
						}
						__nextHasNoMarginBottom
					/>

					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={mediaType === 'video' ? ['video'] : ['image']}
							value={mediaId || undefined}
							onSelect={setMedia}
							render={({ open }) => (
								<div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0 12px' }}>
									<Button variant='secondary' size='small' onClick={open} icon='format-image'>
										{mediaUrl
											? __('Replace', 'b-blocks')
											: mediaType === 'video'
												? __('Select Video', 'b-blocks')
												: __('Select Image', 'b-blocks')}
									</Button>
									{mediaUrl && (
										<Button
											variant='tertiary'
											size='small'
											isDestructive
											onClick={() => setAttributes({ mediaId: 0, mediaUrl: '' })}
										>
											{__('Remove', 'b-blocks')}
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>

					{mediaType === 'video' && (
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={['image']}
								value={undefined}
								onSelect={(media) => setAttributes({ mediaPosterUrl: media?.url || '' })}
								render={({ open }) => (
									<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
										<Button variant='secondary' size='small' onClick={open}>
											{mediaPosterUrl ? __('Replace Poster', 'b-blocks') : __('Select Poster Image', 'b-blocks')}
										</Button>
										{mediaPosterUrl && (
											<Button variant='tertiary' size='small' isDestructive onClick={() => setAttributes({ mediaPosterUrl: '' })}>
												{__('Remove', 'b-blocks')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
					)}

					{mediaType === 'image' && (
						<TextControl
							label={__('Alt Text', 'b-blocks')}
							help={__('Leave blank to use media library alt.', 'b-blocks')}
							value={mediaAlt}
							onChange={(val) => setAttributes({ mediaAlt: val })}
							__nextHasNoMarginBottom
						/>
					)}

					<SelectControl
						label={__('Object Fit', 'b-blocks')}
						value={mediaFit}
						options={[
							{ label: __('Cover', 'b-blocks'), value: 'cover' },
							{ label: __('Contain', 'b-blocks'), value: 'contain' },
							{ label: __('Fill', 'b-blocks'), value: 'fill' },
						]}
						onChange={(val) => setAttributes({ mediaFit: val })}
						__nextHasNoMarginBottom
					/>

					{mediaType === 'image' && mediaFit === 'cover' && mediaUrl && (
						<FocalPointPicker
							label={__('Focal Point', 'b-blocks')}
							url={mediaUrl}
							value={mediaFocal}
							onChange={(val) => setAttributes({ mediaFocal: val })}
							__nextHasNoMarginBottom
						/>
					)}

					<RangeControl
						label={__('Border Radius (px)', 'b-blocks')}
						value={imageBorderRadius}
						onChange={(val) => setAttributes({ imageBorderRadius: val ?? 0 })}
						min={0}
						max={64}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Box Shadow', 'b-blocks')}
						checked={imageBoxShadow}
						onChange={(val) => setAttributes({ imageBoxShadow: val })}
						__nextHasNoMarginBottom
					/>

					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Overlay Color', 'b-blocks')}</p>
					<ColorPalette
						value={mediaOverlayColor}
						onChange={(val) => setAttributes({ mediaOverlayColor: val || '' })}
					/>
					{mediaOverlayColor && (
						<RangeControl
							label={__('Overlay Opacity', 'b-blocks')}
							value={mediaOverlayOpacity}
							onChange={(val) => setAttributes({ mediaOverlayOpacity: val ?? 0 })}
							min={0}
							max={100}
							__nextHasNoMarginBottom
						/>
					)}

					<ToggleControl
						label={__('Sticky Media', 'b-blocks')}
						help={__('Media panel sticks while text scrolls (long content only).', 'b-blocks')}
						checked={stickyMedia}
						onChange={(val) => setAttributes({ stickyMedia: val })}
						__nextHasNoMarginBottom
					/>

					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Media Panel Background', 'b-blocks')}</p>
					<ColorPalette
						value={mediaPanelBg}
						onChange={(val) => setAttributes({ mediaPanelBg: val || '' })}
					/>
				</PanelBody>

				<PanelBody title={__('Content Panel', 'b-blocks')} initialOpen={false}>
					<p style={{ margin: '0 0 4px', fontWeight: 600 }}>{__('Content Panel Background', 'b-blocks')}</p>
					<ColorPalette
						value={contentPanelBg}
						onChange={(val) => setAttributes({ contentPanelBg: val || '' })}
					/>
					<RangeControl
						label={__('Padding Top (px)', 'b-blocks')}
						value={contentPaddingTop}
						onChange={(val) => setAttributes({ contentPaddingTop: val ?? 0 })}
						min={0}
						max={200}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding Bottom (px)', 'b-blocks')}
						value={contentPaddingBottom}
						onChange={(val) => setAttributes({ contentPaddingBottom: val ?? 0 })}
						min={0}
						max={200}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding Left (px)', 'b-blocks')}
						value={contentPaddingLeft}
						onChange={(val) => setAttributes({ contentPaddingLeft: val ?? 0 })}
						min={0}
						max={200}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding Right (px)', 'b-blocks')}
						value={contentPaddingRight}
						onChange={(val) => setAttributes({ contentPaddingRight: val ?? 0 })}
						min={0}
						max={200}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Section Background', 'b-blocks')} initialOpen={false}>
					<p style={{ margin: '0 0 4px', fontWeight: 600 }}>{__('Background Color', 'b-blocks')}</p>
					<ColorPalette
						value={sectionBg}
						onChange={(val) => setAttributes({ sectionBg: val || '' })}
					/>
					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Background Gradient', 'b-blocks')}</p>
					<GradientPicker
						value={sectionBgGradient || undefined}
						onChange={(val) => setAttributes({ sectionBgGradient: val || '' })}
						gradients={[]}
						__nextHasNoMargin
					/>
				</PanelBody>

				<PanelBody title={__('Accessibility', 'b-blocks')} initialOpen={false}>
					<TextControl
						label={__('Section Label', 'b-blocks')}
						help={__('Overrides auto-detected heading for aria-label.', 'b-blocks')}
						value={sectionLabel}
						onChange={(val) => setAttributes({ sectionLabel: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps} aria-label={sectionLabel || undefined}>
				<style>{css}</style>

				<div
					className={`bb-mts-inner${isReverse ? ' is-reverse' : ''}${stickyMedia ? ' has-sticky' : ''}`}
				>
					<div className='bb-mts-media' style={{ flexBasis: `${leftPct}%` }}>
						{mediaUrl ? (
							mediaType === 'video' ? (
								<video
									className='bb-mts-media-el'
									src={mediaUrl}
									poster={mediaPosterUrl || undefined}
									muted
									loop
									playsInline
								/>
							) : (
								<img
									className='bb-mts-media-el'
									src={mediaUrl}
									alt={mediaAlt || ''}
								/>
							)
						) : (
							<div className='bb-mts-placeholder'>
								<span>{__('Select an image or video in the Media panel.', 'b-blocks')}</span>
							</div>
						)}
						{!!mediaOverlayColor && mediaOverlayOpacity > 0 && (
							<span className='bb-mts-overlay' aria-hidden='true' />
						)}
					</div>

					<div className='bb-mts-content'>
						<InnerBlocks
							allowedBlocks={ALLOWED_CONTENT_BLOCKS}
							template={[
								['core/heading', { level: 2, placeholder: __('Section heading…', 'b-blocks') }],
								['core/paragraph', { placeholder: __('Add your content here…', 'b-blocks') }],
							]}
							templateLock={false}
							renderAppender={
								hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender
							}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Edit;
