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

const clamp = (value, min, max, fallback) => {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) return fallback;
	return Math.max(min, Math.min(max, n));
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		layout,
		imagePosition,
		imageId,
		imageUrl,
		imageAlt,
		imageRatio,
		badge,
		badgeBg,
		badgeColor,
		heading,
		headingTag,
		excerpt,
		meta,
		metaIcon,
		ctaLabel,
		ctaStyle,
		cardLinkMode,
		maxWidth,
		alignment,
		imageSplitRatio,
		cardBg,
		headingColor,
		textColor,
		metaColor,
		ctaBg,
		ctaColor,
		borderWidth,
		borderColor,
		borderRadius,
		paddingV,
		paddingH,
		headingSizeDesktop,
		headingWeight,
		excerptSizeDesktop,
		excerptWeight,
		ctaFontSize,
		ctaWeight,
		ctaPaddingV,
		ctaPaddingH,
		ctaBorderRadius,
	} = attributes;

	const splitPct = parseInt(imageSplitRatio, 10) || 40;

	const wrapperClass = [
		'bb-ac',
		`bb-ac--${layout}`,
		layout === 'horizontal' ? `bb-ac--img-${imagePosition}` : '',
		`bb-ac--align-${alignment}`,
		`bb-ac--cta-${ctaStyle}`,
		clamp(borderWidth, 0, 8, 1) > 0 ? 'bb-ac--has-border' : '',
	]
		.filter(Boolean)
		.join(' ');

	const shadowMap = {
		none: 'none',
		sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
		md: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
		lg: '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)',
	};

	const wrapperStyle = {
		'--bb-ac-max-width': clamp(maxWidth, 0, 1600, 640) === 0 ? '100%' : `${clamp(maxWidth, 0, 1600, 640)}px`,
		'--bb-ac-img-ratio': imageRatio,
		'--bb-ac-img-basis': `${splitPct}%`,
		'--bb-ac-body-basis': `${100 - splitPct}%`,
		'--bb-ac-card-bg': cardBg || '#ffffff',
		'--bb-ac-heading-color': headingColor || '#111827',
		'--bb-ac-text-color': textColor || '#374151',
		'--bb-ac-meta-color': metaColor || '#6b7280',
		'--bb-ac-badge-bg': badgeBg || '#2563eb',
		'--bb-ac-badge-color': badgeColor || '#ffffff',
		'--bb-ac-cta-bg': ctaBg || '#2563eb',
		'--bb-ac-cta-color': ctaColor || '#ffffff',
		'--bb-ac-border-color': borderColor || '#e5e7eb',
		'--bb-ac-border-width': `${clamp(borderWidth, 0, 8, 1)}px`,
		'--bb-ac-radius': `${clamp(borderRadius, 0, 48, 8)}px`,
		'--bb-ac-shadow': shadowMap[attributes.shadow] || shadowMap.sm,
		'--bb-ac-pad-v': `${clamp(paddingV, 0, 80, 20)}px`,
		'--bb-ac-pad-h': `${clamp(paddingH, 0, 80, 20)}px`,
		'--bb-ac-head-size-d': `${clamp(headingSizeDesktop, 12, 48, 18)}px`,
		'--bb-ac-head-size-m': `${clamp(headingSizeDesktop, 12, 48, 18)}px`,
		'--bb-ac-head-weight': headingWeight || '600',
		'--bb-ac-exc-size-d': `${clamp(excerptSizeDesktop, 10, 28, 14)}px`,
		'--bb-ac-exc-size-m': `${clamp(excerptSizeDesktop, 10, 28, 14)}px`,
		'--bb-ac-exc-weight': excerptWeight || '400',
		'--bb-ac-cta-size': `${clamp(ctaFontSize, 10, 24, 14)}px`,
		'--bb-ac-cta-weight': ctaWeight || '600',
		'--bb-ac-cta-pad-v': `${clamp(ctaPaddingV, 0, 48, 8)}px`,
		'--bb-ac-cta-pad-h': `${clamp(ctaPaddingH, 0, 80, 18)}px`,
		'--bb-ac-cta-radius': `${clamp(ctaBorderRadius, 0, 48, 6)}px`,
	};

	const blockProps = useBlockProps({ className: wrapperClass, style: wrapperStyle });

	const HeadingTag = headingTag || 'h3';

	const Body = (
		<div className='bb-ac-body'>
			{badge ? <span className='bb-ac-badge'>{badge}</span> : null}

			<RichText
				tagName={HeadingTag}
				className='bb-ac-heading'
				value={heading}
				onChange={(val) => setAttributes({ heading: val })}
				placeholder={__('Article title goes here', 'b-blocks')}
				allowedFormats={['core/bold', 'core/italic']}
			/>

			<RichText
				tagName='p'
				className='bb-ac-excerpt'
				value={excerpt}
				onChange={(val) => setAttributes({ excerpt: val })}
				placeholder={__('Add a short excerpt or description…', 'b-blocks')}
				allowedFormats={['core/bold', 'core/italic']}
			/>

			{meta ? (
				<span className='bb-ac-meta'>
					{metaIcon ? <i className={`bb-ac-meta-icon ${metaIcon}`} aria-hidden='true' /> : null}
					<span className='bb-ac-meta-text'>{meta}</span>
				</span>
			) : null}

			{!cardLinkMode && ctaLabel ? (
				<span className='bb-ac-cta'>
					<span className='bb-ac-cta-label'>{ctaLabel}</span>
					{ctaStyle === 'link' ? (
						<svg className='bb-ac-cta-arrow' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
							<path
								d='M5 12h14M13 6l6 6-6 6'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					) : null}
				</span>
			) : null}
		</div>
	);

	const Media = imageUrl ? (
		<div className='bb-ac-media'>
			<img className='bb-ac-img' src={imageUrl} alt={imageAlt || ''} />
		</div>
	) : (
		<div className='bb-ac-media'>
			<div className='bb-ac-media-placeholder'>{__('No image selected', 'b-blocks')}</div>
		</div>
	);

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<BlockControls>
				<MediaUploadCheck>
					<ToolbarGroup>
						<MediaUpload
							allowedTypes={['image']}
							value={imageId || 0}
							onSelect={(media) =>
								setAttributes({
									imageId: media?.id || 0,
									imageUrl: media?.url || '',
									imageAlt: media?.alt || imageAlt || '',
								})
							}
							render={({ open }) => (
								<ToolbarButton
									icon='format-image'
									label={imageUrl ? __('Replace image', 'b-blocks') : __('Add image', 'b-blocks')}
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
						icon='align-pull-right'
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
				<article className='bb-ac-card'>
					{Media}
					{Body}
				</article>
			</div>
		</>
	);
};

export default Edit;
