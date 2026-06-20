import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
	MediaUpload,
	MediaUploadCheck,
	MediaReplaceFlow,
	MediaPlaceholder,
	RichText,
	URLInput,
	ColorPalette,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	SelectControl,
	RangeControl,
	ToggleControl,
	FocalPointPicker,
	BaseControl,
	Button,
} from '@wordpress/components';

import {
	SHAPE_OPTIONS,
	SHAPE_VALUES,
	CLIP_SHAPES,
	SVG_SHAPES,
	HOVER_EFFECTS,
	SHADOW_OPTIONS,
	SHADOW_FILTERS,
	OBJECT_FIT_OPTIONS,
	ALIGN_OPTIONS,
} from '../Common/shapes';

const clamp = (value, min, max, fallback) => {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) return fallback;
	return Math.max(min, Math.min(max, n));
};

const positionToFocal = (pos) => {
	const map = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 };
	const parts = (pos || 'center center').toString().trim().split(/\s+/);
	const x = parts[0] !== undefined && map[parts[0]] !== undefined
		? map[parts[0]]
		: parseFloat(parts[0]);
	const y = parts[1] !== undefined && map[parts[1]] !== undefined
		? map[parts[1]]
		: parseFloat(parts[1]);
	return {
		x: Number.isNaN(x) ? 0.5 : x,
		y: Number.isNaN(y) ? 0.5 : y,
	};
};

const focalToPosition = (focal) => {
	const x = Math.round((focal?.x ?? 0.5) * 100);
	const y = Math.round((focal?.y ?? 0.5) * 100);
	return `${x}% ${y}%`;
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		imageId,
		imageUrl,
		imageAlt,
		shape,
		customSvgUrl,
		imageWidth,
		imageHeight,
		alignment,
		caption,
		captionColor,
		captionFontSize,
		linkUrl,
		linkNewTab,
		hoverEffect,
		hoverDuration,
		borderWidth,
		borderColor,
		shadow,
		backgroundColor,
		objectFit,
		objectPosition,
	} = attributes;

	const instanceId = useInstanceId(Edit, 'bb-im-clip');
	const safeShape = SHAPE_VALUES.includes(shape) ? shape : 'circle';
	const safeAlign = ALIGN_OPTIONS.some((a) => a.value === alignment) ? alignment : 'center';
	const isCustom = safeShape === 'custom';
	const isSvgShape = Object.prototype.hasOwnProperty.call(SVG_SHAPES, safeShape);

	const width = clamp(imageWidth, 40, 800, 300);
	const height = clamp(imageHeight, 0, 800, 300);

	const onSelectImage = (media) => {
		if (!media || !media.url) return;
		setAttributes({
			imageId: media.id || 0,
			imageUrl: media.url,
			imageAlt: media.alt || imageAlt || '',
		});
	};

	const marginByAlign = {
		left: '0 auto 0 0',
		center: '0 auto',
		right: '0 0 0 auto',
	};

	const figureStyle = {
		maxWidth: `${width}px`,
		margin: marginByAlign[safeAlign],
	};

	const maskStyle = {
		width: `${width}px`,
		height: height > 0 ? `${height}px` : 'auto',
		maxWidth: '100%',
		background: backgroundColor || 'transparent',
		filter: SHADOW_FILTERS[shadow] || '',
	};

	const imgClip = isCustom
		? undefined
		: isSvgShape
			? `url(#${instanceId})`
			: (CLIP_SHAPES[safeShape] || CLIP_SHAPES.circle);

	const imgStyle = {
		display: 'block',
		width: '100%',
		height: height > 0 ? `${height}px` : 'auto',
		objectFit: objectFit === 'contain' ? 'contain' : 'cover',
		objectPosition: objectPosition || 'center center',
		WebkitClipPath: imgClip,
		clipPath: imgClip,
		border: borderWidth > 0 ? `${clamp(borderWidth, 0, 12, 0)}px solid ${borderColor || '#000000'}` : undefined,
		transition: `transform ${clamp(hoverDuration, 0, 800, 300)}ms ease`,
	};

	if (isCustom && customSvgUrl) {
		imgStyle.WebkitMaskImage = `url(${customSvgUrl})`;
		imgStyle.maskImage = `url(${customSvgUrl})`;
		imgStyle.WebkitMaskSize = 'cover';
		imgStyle.maskSize = 'cover';
		imgStyle.WebkitMaskRepeat = 'no-repeat';
		imgStyle.maskRepeat = 'no-repeat';
		imgStyle.WebkitMaskPosition = 'center';
		imgStyle.maskPosition = 'center';
	}

	const blockProps = useBlockProps({
		className: `bb-im-block bb-im-align-${safeAlign}`,
	});

	const focal = positionToFocal(objectPosition);

	const renderInspector = (
		<InspectorControls>
			<PanelBody title={__('Image', 'b-blocks')} initialOpen={true}>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelectImage}
						allowedTypes={['image']}
						value={imageId}
						render={({ open }) => (
							<Button variant="secondary" onClick={open} style={{ marginBottom: 12 }}>
								{imageUrl ? __('Replace Image', 'b-blocks') : __('Select Image', 'b-blocks')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
				{imageUrl && (
					<Button
						variant="link"
						isDestructive
						onClick={() => setAttributes({ imageId: 0, imageUrl: '', imageAlt: '' })}
						style={{ display: 'block', marginBottom: 12 }}
					>
						{__('Remove Image', 'b-blocks')}
					</Button>
				)}
				<TextControl
					label={__('Alt Text', 'b-blocks')}
					value={imageAlt}
					onChange={(val) => setAttributes({ imageAlt: val })}
					placeholder={__('Leave empty to use media library alt text', 'b-blocks')}
				/>
				<SelectControl
					label={__('Object Fit', 'b-blocks')}
					value={objectFit}
					options={OBJECT_FIT_OPTIONS}
					onChange={(val) => setAttributes({ objectFit: val })}
				/>
				{imageUrl && (
					<FocalPointPicker
						label={__('Object Position', 'b-blocks')}
						url={imageUrl}
						value={focal}
						onChange={(val) => setAttributes({ objectPosition: focalToPosition(val) })}
					/>
				)}
			</PanelBody>

			<PanelBody title={__('Shape', 'b-blocks')} initialOpen={true}>
				<SelectControl
					label={__('Mask Shape', 'b-blocks')}
					value={safeShape}
					options={SHAPE_OPTIONS}
					onChange={(val) => setAttributes({ shape: val })}
				/>
				{isCustom && (
					<MediaUploadCheck>
						<BaseControl
							label={__('Custom SVG Mask', 'b-blocks')}
							help={__('Upload an SVG. It is applied as a CSS mask-image.', 'b-blocks')}
						>
							<MediaUpload
								onSelect={(media) => setAttributes({ customSvgUrl: media?.url || '' })}
								allowedTypes={['image/svg+xml']}
								render={({ open }) => (
									<Button variant="secondary" onClick={open}>
										{customSvgUrl ? __('Replace SVG', 'b-blocks') : __('Upload SVG', 'b-blocks')}
									</Button>
								)}
							/>
						</BaseControl>
						{customSvgUrl && (
							<TextControl
								label={__('SVG URL', 'b-blocks')}
								value={customSvgUrl}
								onChange={(val) => setAttributes({ customSvgUrl: val })}
							/>
						)}
					</MediaUploadCheck>
				)}
				<BaseControl label={__('Shape Preview', 'b-blocks')}>
					<div
						aria-hidden="true"
						style={{
							width: 80,
							height: 80,
							background: '#c7ccd4',
							WebkitClipPath: isCustom ? undefined : (isSvgShape ? `url(#${instanceId})` : (CLIP_SHAPES[safeShape] || CLIP_SHAPES.circle)),
							clipPath: isCustom ? undefined : (isSvgShape ? `url(#${instanceId})` : (CLIP_SHAPES[safeShape] || CLIP_SHAPES.circle)),
							WebkitMaskImage: isCustom && customSvgUrl ? `url(${customSvgUrl})` : undefined,
							maskImage: isCustom && customSvgUrl ? `url(${customSvgUrl})` : undefined,
							WebkitMaskSize: 'cover',
							maskSize: 'cover',
							WebkitMaskRepeat: 'no-repeat',
							maskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
							maskPosition: 'center',
						}}
					/>
				</BaseControl>
			</PanelBody>

			<PanelBody title={__('Size & Layout', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Width (px)', 'b-blocks')}
					value={width}
					onChange={(val) => setAttributes({ imageWidth: clamp(val, 40, 800, 300) })}
					min={40}
					max={800}
					step={10}
				/>
				<RangeControl
					label={__('Height (px) — 0 = auto from width', 'b-blocks')}
					value={height}
					onChange={(val) => setAttributes({ imageHeight: clamp(val, 0, 800, 0) })}
					min={0}
					max={800}
					step={10}
				/>
				<SelectControl
					label={__('Alignment', 'b-blocks')}
					value={safeAlign}
					options={ALIGN_OPTIONS}
					onChange={(val) => setAttributes({ alignment: val })}
				/>
			</PanelBody>

			<PanelBody title={__('Link', 'b-blocks')} initialOpen={false}>
				<BaseControl label={__('Link URL', 'b-blocks')}>
					<URLInput
						value={linkUrl}
						onChange={(val) => setAttributes({ linkUrl: val })}
					/>
				</BaseControl>
				{linkUrl && (
					<ToggleControl
						label={__('Open in new tab', 'b-blocks')}
						checked={!!linkNewTab}
						onChange={(val) => setAttributes({ linkNewTab: val })}
					/>
				)}
			</PanelBody>

			<PanelBody title={__('Caption', 'b-blocks')} initialOpen={false}>
				<p style={{ fontSize: 12, color: '#757575' }}>
					{__('Edit the caption inline below the image on the canvas.', 'b-blocks')}
				</p>
				<BaseControl label={__('Caption Color', 'b-blocks')}>
					<ColorPalette
						value={captionColor}
						onChange={(val) => setAttributes({ captionColor: val || '' })}
					/>
				</BaseControl>
				<RangeControl
					label={__('Caption Font Size (px)', 'b-blocks')}
					value={clamp(captionFontSize, 10, 28, 14)}
					onChange={(val) => setAttributes({ captionFontSize: clamp(val, 10, 28, 14) })}
					min={10}
					max={28}
				/>
			</PanelBody>

			<PanelBody title={__('Style', 'b-blocks')} initialOpen={false}>
				<BaseControl label={__('Background Color (behind shape)', 'b-blocks')}>
					<ColorPalette
						value={backgroundColor}
						onChange={(val) => setAttributes({ backgroundColor: val || '' })}
					/>
				</BaseControl>
				<RangeControl
					label={__('Border Width (px)', 'b-blocks')}
					value={clamp(borderWidth, 0, 12, 0)}
					onChange={(val) => setAttributes({ borderWidth: clamp(val, 0, 12, 0) })}
					min={0}
					max={12}
				/>
				{borderWidth > 0 && (
					<BaseControl label={__('Border Color', 'b-blocks')}>
						<ColorPalette
							value={borderColor}
							onChange={(val) => setAttributes({ borderColor: val || '#000000' })}
						/>
					</BaseControl>
				)}
				<SelectControl
					label={__('Shadow', 'b-blocks')}
					value={shadow}
					options={SHADOW_OPTIONS}
					onChange={(val) => setAttributes({ shadow: val })}
				/>
				<SelectControl
					label={__('Hover Effect', 'b-blocks')}
					value={hoverEffect}
					options={HOVER_EFFECTS}
					onChange={(val) => setAttributes({ hoverEffect: val })}
				/>
				{hoverEffect !== 'none' && (
					<RangeControl
						label={__('Hover Duration (ms)', 'b-blocks')}
						value={clamp(hoverDuration, 0, 800, 300)}
						onChange={(val) => setAttributes({ hoverDuration: clamp(val, 0, 800, 300) })}
						min={0}
						max={800}
						step={10}
					/>
				)}
				<p style={{ fontSize: 12, color: '#757575', marginTop: 8 }}>
					{__('Ensure caption contrast ≥ 4.5:1 against its background.', 'b-blocks')}
				</p>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{renderInspector}

			<BlockControls>
				<BlockAlignmentToolbar
					value={['left', 'center', 'right'].includes(safeAlign) ? safeAlign : undefined}
					onChange={(val) => setAttributes({ alignment: val || 'center' })}
					controls={['left', 'center', 'right']}
				/>
				{imageUrl && (
					<ToolbarGroup>
						<MediaReplaceFlow
							mediaId={imageId}
							mediaURL={imageUrl}
							allowedTypes={['image']}
							onSelect={onSelectImage}
							name={__('Replace', 'b-blocks')}
						/>
					</ToolbarGroup>
				)}
				<ToolbarGroup>
					<ToolbarButton
						icon="format-image"
						label={__('Image Mask', 'b-blocks')}
						disabled
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				{(isSvgShape) && (
					<svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
						<defs>
							<clipPath id={instanceId} clipPathUnits="objectBoundingBox">
								<path d={SVG_SHAPES[safeShape]} />
							</clipPath>
						</defs>
					</svg>
				)}

				{imageUrl ? (
					<figure className="bb-im-figure" style={figureStyle}>
						<div className="bb-im-mask" style={maskStyle}>
							<img
								className="bb-im-img"
								src={imageUrl}
								alt={imageAlt || ''}
								style={imgStyle}
								loading="lazy"
								decoding="async"
							/>
						</div>
						<RichText
							tagName="figcaption"
							className="bb-im-caption"
							value={caption}
							onChange={(val) => setAttributes({ caption: val })}
							placeholder={__('Add a caption…', 'b-blocks')}
							style={{
								color: captionColor || undefined,
								fontSize: `${clamp(captionFontSize, 10, 28, 14)}px`,
							}}
							allowedFormats={['core/bold', 'core/italic', 'core/link']}
						/>
					</figure>
				) : (
					<MediaPlaceholder
						icon="format-image"
						labels={{ title: __('Image Mask', 'b-blocks'), instructions: __('Select an image from your media library to apply a shape mask.', 'b-blocks') }}
						onSelect={onSelectImage}
						accept="image/*"
						allowedTypes={['image']}
					/>
				)}
			</div>
		</>
	);
};

export default Edit;
