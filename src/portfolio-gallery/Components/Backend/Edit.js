import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';
import { slugify } from './slugify';

const LAYOUT_OPTIONS = ['grid', 'masonry'];
const ASPECT_OPTIONS = ['auto', '1-1', '4-3', '16-9', '3-4'];
const HOVER_OPTIONS = ['none', 'zoom', 'darken'];
const ALIGN_OPTIONS = ['left', 'center', 'right'];
const CAPTION_POSITION_OPTIONS = ['below', 'overlay'];
const FONT_WEIGHTS = ['400', '500', '600', '700'];

const aspectToCss = (key) => {
	switch (key) {
		case '1-1': return '1 / 1';
		case '4-3': return '4 / 3';
		case '16-9': return '16 / 9';
		case '3-4': return '3 / 4';
		case 'auto':
		default: return 'auto';
	}
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		items = [],
		categories = [],
		layout,
		columns = {},
		columnGap,
		rowGap,
		imageRadius,
		aspectRatio,
		showCaptions,
		captionPosition,
		captionColor,
		captionFontSize,
		showFilter,
		filterAllLabel,
		showAllButton,
		defaultFilter,
		filterAlign,
		filterBarGap,
		btnActiveBg,
		btnActiveColor,
		btnInactiveBg,
		btnInactiveColor,
		btnFontSize,
		btnFontWeight,
		btnPaddingV,
		btnPaddingH,
		btnBorderRadius,
		btnGap,
		hoverEffect,
		hoverDuration,
		lightbox,
	} = attributes;

	const safeLayout = LAYOUT_OPTIONS.includes(layout) ? layout : 'grid';
	const safeAspect = ASPECT_OPTIONS.includes(aspectRatio) ? aspectRatio : 'auto';
	const safeHover = HOVER_OPTIONS.includes(hoverEffect) ? hoverEffect : 'zoom';
	const safeAlign = ALIGN_OPTIONS.includes(filterAlign) ? filterAlign : 'center';
	const safeCaptionPos = CAPTION_POSITION_OPTIONS.includes(captionPosition) ? captionPosition : 'below';
	const safeBtnWeight = FONT_WEIGHTS.includes(btnFontWeight) ? btnFontWeight : '500';

	const cols = {
		desktop: Math.max(1, Math.min(6, parseInt(columns?.desktop, 10) || 3)),
		tablet: Math.max(1, Math.min(6, parseInt(columns?.tablet, 10) || 2)),
		mobile: Math.max(1, Math.min(6, parseInt(columns?.mobile, 10) || 1)),
	};

	// Build the canonical category list with slugs (for the buttons + dropdowns).
	const seen = {};
	const catList = [];
	(categories || []).forEach((label) => {
		const trimmed = (label || '').toString().trim();
		if (!trimmed) return;
		const slug = slugify(trimmed);
		if (seen[slug]) return;
		seen[slug] = true;
		catList.push({ label: trimmed, slug });
	});

	const resolvedDefault = (() => {
		const v = (defaultFilter || 'all').toString().toLowerCase();
		if (v === 'all') {
			if (!showAllButton && catList.length) return catList[0].slug;
			return 'all';
		}
		return seen[v] ? v : 'all';
	})();

	const hasAspect = safeAspect !== 'auto' && safeLayout !== 'masonry';

	const wrapperStyle = {
		'--bb-pg-cols-desktop': cols.desktop,
		'--bb-pg-cols-tablet': cols.tablet,
		'--bb-pg-cols-mobile': cols.mobile,
		'--bb-pg-col-gap': `${Math.max(0, Math.min(80, parseInt(columnGap, 10) || 0))}px`,
		'--bb-pg-row-gap': `${Math.max(0, Math.min(80, parseInt(rowGap, 10) || 0))}px`,
		'--bb-pg-img-radius': `${Math.max(0, Math.min(64, parseInt(imageRadius, 10) || 0))}px`,
		'--bb-pg-aspect': aspectToCss(safeAspect),
		'--bb-pg-caption-color': captionColor || 'currentColor',
		'--bb-pg-caption-size': `${Math.max(10, Math.min(24, parseInt(captionFontSize, 10) || 14))}px`,
		'--bb-pg-filter-bar-gap': `${Math.max(0, Math.min(80, parseInt(filterBarGap, 10) || 0))}px`,
		'--bb-pg-btn-gap': `${Math.max(0, Math.min(32, parseInt(btnGap, 10) || 0))}px`,
		'--bb-pg-btn-active-bg': btnActiveBg || '#0d6efd',
		'--bb-pg-btn-active-color': btnActiveColor || '#ffffff',
		'--bb-pg-btn-inactive-bg': btnInactiveBg || '#f0f0f0',
		'--bb-pg-btn-inactive-color': btnInactiveColor || '#333333',
		'--bb-pg-btn-font-size': `${Math.max(10, Math.min(24, parseInt(btnFontSize, 10) || 14))}px`,
		'--bb-pg-btn-font-weight': safeBtnWeight,
		'--bb-pg-btn-pad-v': `${Math.max(0, Math.min(32, parseInt(btnPaddingV, 10) || 0))}px`,
		'--bb-pg-btn-pad-h': `${Math.max(0, Math.min(64, parseInt(btnPaddingH, 10) || 0))}px`,
		'--bb-pg-btn-radius': `${Math.max(0, Math.min(50, parseInt(btnBorderRadius, 10) || 0))}px`,
		'--bb-pg-hover-duration': `${Math.max(0, Math.min(800, parseInt(hoverDuration, 10) || 0))}ms`,
	};

	const wrapperClasses = [
		'bb-pg-wrapper',
		`bb-pg-layout--${safeLayout}`,
		`bb-pg-align--${safeAlign}`,
		`bb-pg-hover--${safeHover}`,
		hasAspect ? 'has-aspect' : '',
		showCaptions ? `has-captions bb-pg-caption--${safeCaptionPos}` : '',
		lightbox ? 'has-lightbox' : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const addItem = () => {
		if (items.length >= 60) return;
		const _key = `pg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		setAttributes({
			items: [
				...items,
				{
					_key,
					imageId: 0,
					imageUrl: '',
					imageAlt: '',
					caption: '',
					categorySlug: '',
				},
			],
		});
	};

	const renderItemFigure = (item) => {
		const safe = item || {};
		const hasImage = !!safe.imageUrl;
		return (
			<figure className='bb-pg-figure'>
				{hasImage ? (
					<img
						className='bb-pg-img'
						src={safe.imageUrl}
						alt={safe.imageAlt || ''}
						loading='lazy'
						decoding='async'
					/>
				) : (
					<span
						className='bb-pg-img'
						aria-hidden='true'
						style={{
							display: 'block',
							width: '100%',
							minHeight: 140,
							background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
						}}
					/>
				)}
				{showCaptions && safe.caption && (
					<figcaption className='bb-pg-caption'>{safe.caption}</figcaption>
				)}
				{safeHover === 'darken' && <span className='bb-pg-darken' aria-hidden='true' />}
			</figure>
		);
	};

	return (
		<>
			<Settings
				attributes={attributes}
				setAttributes={setAttributes}
				onAddItem={addItem}
				categoryList={catList}
			/>

			<div {...blockProps}>
				{showFilter && (catList.length > 0 || showAllButton) && (
					<div
						className='bb-pg-bar'
						role='toolbar'
						aria-label={__('Filter gallery', 'b-blocks')}
					>
						{showAllButton && (
							<button
								type='button'
								className={`bb-pg-btn${resolvedDefault === 'all' ? ' is-active' : ''}`}
								aria-pressed={resolvedDefault === 'all' ? 'true' : 'false'}
								onClick={(e) => e.preventDefault()}
							>
								{filterAllLabel || __('All', 'b-blocks')}
							</button>
						)}
						{catList.map((cat) => (
							<button
								key={cat.slug}
								type='button'
								className={`bb-pg-btn${resolvedDefault === cat.slug ? ' is-active' : ''}`}
								aria-pressed={resolvedDefault === cat.slug ? 'true' : 'false'}
								onClick={(e) => e.preventDefault()}
							>
								{cat.label}
							</button>
						))}
					</div>
				)}

				{items.length === 0 ? (
					<p className='bb-pg-empty'>
						{__('No images yet. Add the first one from the sidebar.', 'b-blocks')}
					</p>
				) : (
					<ul className='bb-pg-grid' role='list' aria-label={__('Gallery images', 'b-blocks')}>
						{items.map((item, idx) => (
							<li
								key={item?._key || idx}
								className='bb-pg-item'
								data-bb-pg-category={(item && item.categorySlug) || ''}
							>
								{renderItemFigure(item)}
							</li>
						))}
					</ul>
				)}

				<div
					className='bb-pg-editor-bottom-actions'
					style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}
				>
					<Button
						variant='secondary'
						onClick={addItem}
						icon='plus'
						disabled={items.length >= 60}
					>
						{items.length >= 60
							? __('Maximum 60 images', 'b-blocks')
							: __('Add Image', 'b-blocks')}
					</Button>
				</div>
			</div>
		</>
	);
};

export default Edit;
