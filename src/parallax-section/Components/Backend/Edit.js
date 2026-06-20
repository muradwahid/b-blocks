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
	ToolbarGroup,
	ToolbarButton,
	Button,
	Notice,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { buildSectionCss } from '../Common/style';

const POSITION_OPTIONS = [
	{ label: __('Center Center', 'b-blocks'), value: 'center center' },
	{ label: __('Center Top', 'b-blocks'), value: 'center top' },
	{ label: __('Center Bottom', 'b-blocks'), value: 'center bottom' },
	{ label: __('Left Center', 'b-blocks'), value: 'left center' },
	{ label: __('Left Top', 'b-blocks'), value: 'left top' },
	{ label: __('Left Bottom', 'b-blocks'), value: 'left bottom' },
	{ label: __('Right Center', 'b-blocks'), value: 'right center' },
	{ label: __('Right Top', 'b-blocks'), value: 'right top' },
	{ label: __('Right Bottom', 'b-blocks'), value: 'right bottom' },
];

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		bgImageId,
		bgImageUrl,
		bgImageAlt,
		bgImagePosition,
		parallaxMode,
		parallaxSpeed,
		disableOnMobile,
		minHeight,
		minHeightTablet,
		minHeightMobile,
		verticalAlign,
		contentMaxWidth,
		paddingTop,
		paddingBottom,
		paddingTopMobile,
		paddingBottomMobile,
		hasOverlay,
		overlayColor,
		overlayOpacity,
		overlayGradient,
		bgColor,
		contentAlign,
	} = attributes;

	const hasInnerBlocks = useSelect(
		(select) => select('core/block-editor').getBlocks(clientId).length > 0,
		[clientId]
	);

	const blockProps = useBlockProps({ className: 'bb-px' });
	const instanceId = blockProps.id || `bb-px-${clientId}`;

	const css = buildSectionCss(instanceId, attributes);

	const setImage = (media) => {
		if (!media) return;
		setAttributes({
			bgImageId: media.id || 0,
			bgImageUrl: media.url || '',
			bgImageAlt: media.alt || bgImageAlt || '',
		});
	};

	const clearImage = () =>
		setAttributes({ bgImageId: 0, bgImageUrl: '', bgImageAlt: '' });

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon='editor-alignleft'
						label={__('Align content left', 'b-blocks')}
						isPressed={contentAlign === 'left'}
						onClick={() => setAttributes({ contentAlign: 'left' })}
					/>
					<ToolbarButton
						icon='editor-aligncenter'
						label={__('Align content center', 'b-blocks')}
						isPressed={contentAlign === 'center'}
						onClick={() => setAttributes({ contentAlign: 'center' })}
					/>
					<ToolbarButton
						icon='editor-alignright'
						label={__('Align content right', 'b-blocks')}
						isPressed={contentAlign === 'right'}
						onClick={() => setAttributes({ contentAlign: 'right' })}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Background', 'b-blocks')} initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={['image']}
							value={bgImageId || undefined}
							onSelect={setImage}
							render={({ open }) => (
								<div style={{ marginBottom: 12 }}>
									{bgImageUrl && (
										<img
											src={bgImageUrl}
											alt=''
											style={{
												display: 'block',
												width: '100%',
												height: 'auto',
												maxHeight: 140,
												objectFit: 'cover',
												borderRadius: 4,
												marginBottom: 8,
											}}
										/>
									)}
									<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
										<Button variant='secondary' size='small' onClick={open} icon='format-image'>
											{bgImageUrl ? __('Replace Image', 'b-blocks') : __('Select Image', 'b-blocks')}
										</Button>
										{bgImageUrl && (
											<Button variant='tertiary' size='small' isDestructive onClick={clearImage}>
												{__('Remove image', 'b-blocks')}
											</Button>
										)}
									</div>
								</div>
							)}
						/>
					</MediaUploadCheck>

					<SelectControl
						label={__('Background Position', 'b-blocks')}
						value={bgImagePosition}
						options={POSITION_OPTIONS}
						onChange={(val) => setAttributes({ bgImagePosition: val })}
						__nextHasNoMarginBottom
					/>

					<SelectControl
						label={__('Parallax Mode', 'b-blocks')}
						value={parallaxMode}
						options={[
							{ label: __('Scroll (JS Parallax)', 'b-blocks'), value: 'scroll' },
							{ label: __('Fixed (CSS Fixed)', 'b-blocks'), value: 'fixed' },
							{ label: __('None (Static)', 'b-blocks'), value: 'none' },
						]}
						onChange={(val) => setAttributes({ parallaxMode: val })}
						__nextHasNoMarginBottom
					/>

					{parallaxMode === 'scroll' && (
						<RangeControl
							label={__('Background movement (%)', 'b-blocks')}
							help={__('0 = no movement, 100 = full scroll rate.', 'b-blocks')}
							value={parallaxSpeed}
							onChange={(val) => setAttributes({ parallaxSpeed: val ?? 40 })}
							min={0}
							max={100}
							step={5}
							__nextHasNoMarginBottom
						/>
					)}

					{parallaxMode !== 'none' && (
						<ToggleControl
							label={__('Disable Parallax on Mobile', 'b-blocks')}
							help={__('Falls back to a static background below 768px.', 'b-blocks')}
							checked={disableOnMobile}
							onChange={(val) => setAttributes({ disableOnMobile: val })}
							__nextHasNoMarginBottom
						/>
					)}

					<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Fallback Background Color', 'b-blocks')}</p>
					<ColorPalette
						value={bgColor}
						onChange={(val) => setAttributes({ bgColor: val || '' })}
					/>
				</PanelBody>

				<PanelBody title={__('Overlay', 'b-blocks')} initialOpen={true}>
					<ToggleControl
						label={__('Show Overlay', 'b-blocks')}
						checked={hasOverlay}
						onChange={(val) => setAttributes({ hasOverlay: val })}
						__nextHasNoMarginBottom
					/>
					{hasOverlay && (
						<>
							<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Overlay Color', 'b-blocks')}</p>
							<ColorPalette
								value={overlayColor}
								onChange={(val) => setAttributes({ overlayColor: val || '' })}
							/>
							<p style={{ margin: '12px 0 4px', fontWeight: 600 }}>{__('Overlay Gradient', 'b-blocks')}</p>
							<GradientPicker
								value={overlayGradient || undefined}
								onChange={(val) => setAttributes({ overlayGradient: val || '' })}
								gradients={[]}
								__nextHasNoMargin
							/>
							{overlayGradient && (
								<p style={{ margin: '4px 0 8px', fontSize: 12, color: '#757575' }}>
									{__('A gradient is set and takes precedence over the solid overlay color.', 'b-blocks')}
								</p>
							)}
							<RangeControl
								label={__('Overlay Opacity', 'b-blocks')}
								value={overlayOpacity}
								onChange={(val) => setAttributes({ overlayOpacity: val ?? 40 })}
								min={0}
								max={100}
								step={5}
								__nextHasNoMarginBottom
							/>
							<Notice status='info' isDismissible={false}>
								{__('Ensure text color meets WCAG AA contrast at this overlay opacity.', 'b-blocks')}
							</Notice>
						</>
					)}
				</PanelBody>

				<PanelBody title={__('Layout & Spacing', 'b-blocks')} initialOpen={false}>
					<TextControl
						label={__('Min Height', 'b-blocks')}
						help={__('Accepts px, vh, vw, rem, em, %.', 'b-blocks')}
						value={minHeight}
						onChange={(val) => setAttributes({ minHeight: val })}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Min Height (Tablet)', 'b-blocks')}
						value={minHeightTablet}
						onChange={(val) => setAttributes({ minHeightTablet: val })}
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={__('Min Height (Mobile)', 'b-blocks')}
						value={minHeightMobile}
						onChange={(val) => setAttributes({ minHeightMobile: val })}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Content Max Width (px)', 'b-blocks')}
						help={contentMaxWidth === 0 ? __('Full width', 'b-blocks') : undefined}
						value={contentMaxWidth}
						onChange={(val) => setAttributes({ contentMaxWidth: val ?? 1200 })}
						min={0}
						max={1920}
						step={10}
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
						label={__('Padding Top (px)', 'b-blocks')}
						value={paddingTop}
						onChange={(val) => setAttributes({ paddingTop: val ?? 80 })}
						min={0}
						max={300}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding Bottom (px)', 'b-blocks')}
						value={paddingBottom}
						onChange={(val) => setAttributes({ paddingBottom: val ?? 80 })}
						min={0}
						max={300}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding Top — Mobile (px)', 'b-blocks')}
						value={paddingTopMobile}
						onChange={(val) => setAttributes({ paddingTopMobile: val ?? 48 })}
						min={0}
						max={200}
						step={4}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Padding Bottom — Mobile (px)', 'b-blocks')}
						value={paddingBottomMobile}
						onChange={(val) => setAttributes({ paddingBottomMobile: val ?? 48 })}
						min={0}
						max={200}
						step={4}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps} aria-label={bgImageAlt || __('Content section', 'b-blocks')}>
				<style>{css}</style>

				<div className='bb-px-bg' aria-hidden='true' />
				{hasOverlay && <div className='bb-px-overlay' aria-hidden='true' />}

				<div className='bb-px-content'>
					<InnerBlocks
						template={[
							['core/heading', { level: 2, placeholder: __('Section heading…', 'b-blocks') }],
							['core/paragraph', { placeholder: __('Add your content here…', 'b-blocks') }],
						]}
						templateLock={false}
						renderAppender={hasInnerBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
					/>
				</div>
			</section>
		</>
	);
};

export default Edit;
