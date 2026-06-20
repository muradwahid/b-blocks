import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';

const OVERLAY_MODES = ['hover', 'always', 'slide-up'];
const ASPECT_RATIOS = ['1-1', '4-3', '16-9', '3-2', '3-4'];
const FONT_WEIGHTS = ['400', '500', '600', '700'];

/**
 * Resolve a responsive font-size object to the effective desktop pixel
 * value used in the editor preview. Cascades desktop → tablet → mobile →
 * fallback so an unset desktop value still produces a sensible preview.
 */
const resolveFont = (responsive, fallback) => {
	const r = responsive || {};
	const desk = (r.desktop || '').toString().trim();
	if (desk) return desk;
	const tab = (r.tablet || '').toString().trim();
	if (tab) return tab;
	const mob = (r.mobile || '').toString().trim();
	if (mob) return mob;
	return fallback;
};

const aspectToCss = (key) => {
	switch (key) {
		case '1-1': return '1 / 1';
		case '16-9': return '16 / 9';
		case '3-2': return '3 / 2';
		case '3-4': return '3 / 4';
		case '4-3':
		default: return '4 / 3';
	}
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		items = [],
		columns = {},
		columnGap,
		rowGap,
		aspectRatio,
		borderRadius,
		overlayMode,
		overlayColor,
		overlayOpacity,
		titleColor,
		titleFontSize = {},
		titleFontWeight,
		descColor,
		descFontSize = {},
		showDesc,
		showArrow,
		zoomOnHover,
		zoomScale,
		animDuration,
	} = attributes;

	const safeOverlayMode = OVERLAY_MODES.includes(overlayMode) ? overlayMode : 'hover';
	const safeAspect = ASPECT_RATIOS.includes(aspectRatio) ? aspectRatio : '4-3';
	const safeWeight = FONT_WEIGHTS.includes(titleFontWeight) ? titleFontWeight : '600';

	const cols = {
		desktop: Math.max(1, Math.min(6, parseInt(columns?.desktop, 10) || 3)),
		tablet: Math.max(1, Math.min(6, parseInt(columns?.tablet, 10) || 2)),
		mobile: Math.max(1, Math.min(6, parseInt(columns?.mobile, 10) || 1)),
	};

	const wrapperStyle = {
		'--bb-ib-cols': cols.desktop,
		'--bb-ib-cols-tablet': cols.tablet,
		'--bb-ib-cols-mobile': cols.mobile,
		'--bb-ib-col-gap': `${Math.max(0, Math.min(80, parseInt(columnGap, 10) || 0))}px`,
		'--bb-ib-row-gap': `${Math.max(0, Math.min(80, parseInt(rowGap, 10) || 0))}px`,
		'--bb-ib-radius': `${Math.max(0, Math.min(64, parseInt(borderRadius, 10) || 0))}px`,
		'--bb-ib-aspect': aspectToCss(safeAspect),
		'--bb-ib-overlay-color': overlayColor || '#000000',
		'--bb-ib-overlay-opacity': typeof overlayOpacity === 'number' ? overlayOpacity : 0.55,
		'--bb-ib-title-color': titleColor || '#ffffff',
		'--bb-ib-title-font-size': resolveFont(titleFontSize, '20px'),
		'--bb-ib-title-font-size-tablet': resolveFont(titleFontSize, '20px'),
		'--bb-ib-title-font-size-mobile': resolveFont(titleFontSize, '20px'),
		'--bb-ib-title-weight': safeWeight,
		'--bb-ib-desc-color': descColor || '#f1f5f9',
		'--bb-ib-desc-font-size': resolveFont(descFontSize, '15px'),
		'--bb-ib-desc-font-size-tablet': resolveFont(descFontSize, '15px'),
		'--bb-ib-desc-font-size-mobile': resolveFont(descFontSize, '15px'),
		'--bb-ib-zoom': typeof zoomScale === 'number' ? zoomScale : 1.08,
		'--bb-ib-duration': `${Math.max(0, Math.min(800, parseInt(animDuration, 10) || 0))}ms`,
	};

	const wrapperClasses = [
		'bb-ib-block',
		`bb-ib-overlay--${safeOverlayMode}`,
		zoomOnHover ? 'has-zoom' : 'no-zoom',
		showArrow ? 'has-arrow' : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const updateItem = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		setAttributes({ items: copy });
	};

	const removeItem = (index) => {
		const copy = items.filter((_, i) => i !== index);
		setAttributes({ items: copy });
	};

	const moveItem = (from, to) => {
		if (to < 0 || to >= items.length) return;
		const copy = items.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		setAttributes({ items: copy });
	};

	const addItem = () => {
		if (items.length >= 24) return;
		const _key = `ib-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		setAttributes({
			items: [
				...items,
				{
					_key,
					imageId: 0,
					imageUrl: '',
					imageAlt: '',
					title: __('New Item', 'b-blocks'),
					description: '',
					ctaLabel: '',
					ctaUrl: '',
					ctaNewTab: false,
				},
			],
		});
	};

	return (
		<>
			<Settings
				attributes={attributes}
				setAttributes={setAttributes}
				onAddItem={addItem}
				onRemoveItem={removeItem}
				onMoveItem={moveItem}
				onUpdateItem={updateItem}
			/>

			<div {...blockProps}>
				{items.length === 0 ? (
					<p className='bb-ib-empty'>
						{__('No items yet. Add the first one from the sidebar.', 'b-blocks')}
					</p>
				) : (
					<ul className='bb-ib-grid' role='list' aria-label={__('Image gallery', 'b-blocks')}>
						{items.map((item, idx) => {
							const safe = item || {};
							const hasImage = !!safe.imageUrl;
							return (
								<li
									key={safe._key || idx}
									className='bb-ib-item'
								>
									<div className='bb-ib-card'>
										{hasImage ? (
											<img
												className='bb-ib-img'
												src={safe.imageUrl}
												alt={safe.imageAlt || ''}
												loading='lazy'
												decoding='async'
											/>
										) : (
											<span
												className='bb-ib-img bb-ib-img--placeholder'
												aria-hidden='true'
											/>
										)}
										<span className='bb-ib-overlay'>
											<RichText
												tagName='span'
												className='bb-ib-title'
												value={safe.title || ''}
												onChange={(val) => updateItem(idx, 'title', val)}
												placeholder={__('Item title', 'b-blocks')}
												allowedFormats={[]}
											/>
											{showDesc && (
												<RichText
													tagName='span'
													className='bb-ib-desc'
													value={safe.description || ''}
													onChange={(val) => updateItem(idx, 'description', val)}
													placeholder={__('Short description…', 'b-blocks')}
													allowedFormats={[]}
												/>
											)}
											{safe.ctaUrl && safe.ctaLabel && (
												<span className='bb-ib-cta-label'>{safe.ctaLabel}</span>
											)}
										</span>
									</div>
								</li>
							);
						})}
					</ul>
				)}

				<div
					className='bb-ib-editor-bottom-actions'
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: 12,
					}}
				>
					<Button
						variant='secondary'
						onClick={addItem}
						icon='plus'
						disabled={items.length >= 24}
					>
						{items.length >= 24
							? __('Maximum 24 items', 'b-blocks')
							: __('Add Image Box Item', 'b-blocks')}
					</Button>
				</div>
			</div>
		</>
	);
};

export default Edit;
