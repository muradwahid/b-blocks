import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';

/**
 * Resolve the effective desktop pixel value for a responsive object,
 * falling back through desktop → tablet → mobile → default. Mirrors the
 * cascade emitted by render.php / style.scss.
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

const PRESET_MAP = {
	'check': 'fa-solid fa-check',
	'circle-check': 'fa-solid fa-circle-check',
	'cross': 'fa-solid fa-xmark',
	'circle-cross': 'fa-solid fa-circle-xmark',
	'arrow': 'fa-solid fa-arrow-right',
	'star': 'fa-solid fa-star',
	'dot': 'fa-solid fa-circle',
};

const resolveItemIcon = (blockPreset, blockClass, itemPreset, itemClass) => {
	const blockResolved = blockPreset === 'custom'
		? (blockClass || 'fa-solid fa-check')
		: (PRESET_MAP[blockPreset] || 'fa-solid fa-check');

	const ip = (itemPreset || '').toString().trim();
	if (!ip) return blockResolved;
	if (ip === 'custom') return (itemClass || '').toString().trim() || 'fa-solid fa-check';
	return PRESET_MAP[ip] || 'fa-solid fa-check';
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		items = [],
		ariaLabel,
		columns = {},
		columnGap = {},
		rowGap = {},
		iconPreset,
		iconClass,
		iconSize = {},
		iconColor,
		iconBg,
		iconRadius,
		iconPadding,
		iconGap,
		iconAlign,
		textSize = {},
		textColor,
		textWeight,
		showDescription,
		descriptionSize = {},
		descriptionColor,
		alignment,
	} = attributes;

	const safeAlignment = ['left', 'center', 'right'].includes(alignment) ? alignment : 'left';
	const safeIconAlign = ['flex-start', 'center', 'flex-end'].includes(iconAlign) ? iconAlign : 'flex-start';
	const safeWeight = ['400', '500', '600', '700'].includes(textWeight) ? textWeight : '400';

	const cols = {
		desktop: parseInt(columns?.desktop, 10) || 1,
		tablet: parseInt(columns?.tablet, 10) || 1,
		mobile: parseInt(columns?.mobile, 10) || 1,
	};

	const colGapDesktop = resolveFont(columnGap, '24px');
	const rowGapDesktop = resolveFont(rowGap, '12px');
	const iconSizeDesktop = resolveFont(iconSize, '18px');
	const textSizeDesktop = resolveFont(textSize, '16px');
	const descSizeDesktop = resolveFont(descriptionSize, '13px');

	const safeIconBg = (iconBg || '').toString().trim();
	const safeIconColor = (iconColor || '').toString().trim() || '#22c55e';

	const wrapperStyle = {
		'--bb-il-cols': cols.desktop,
		'--bb-il-cols-tablet': cols.tablet,
		'--bb-il-cols-mobile': cols.mobile,
		'--bb-il-col-gap': colGapDesktop,
		'--bb-il-col-gap-tablet': colGapDesktop,
		'--bb-il-col-gap-mobile': colGapDesktop,
		'--bb-il-row-gap': rowGapDesktop,
		'--bb-il-row-gap-tablet': rowGapDesktop,
		'--bb-il-row-gap-mobile': rowGapDesktop,
		'--bb-il-icon-size': iconSizeDesktop,
		'--bb-il-icon-size-tablet': iconSizeDesktop,
		'--bb-il-icon-size-mobile': iconSizeDesktop,
		'--bb-il-icon-color': safeIconColor,
		'--bb-il-icon-bg': safeIconBg || 'transparent',
		'--bb-il-icon-radius': `${parseInt(iconRadius, 10) >= 0 ? parseInt(iconRadius, 10) : 50}%`,
		'--bb-il-icon-padding': `${parseInt(iconPadding, 10) >= 0 ? parseInt(iconPadding, 10) : 4}px`,
		'--bb-il-icon-gap': `${parseInt(iconGap, 10) >= 0 ? parseInt(iconGap, 10) : 10}px`,
		'--bb-il-icon-align': safeIconAlign,
		'--bb-il-text-size': textSizeDesktop,
		'--bb-il-text-size-tablet': textSizeDesktop,
		'--bb-il-text-size-mobile': textSizeDesktop,
		'--bb-il-text-color': textColor || 'inherit',
		'--bb-il-text-weight': safeWeight,
		'--bb-il-desc-size': descSizeDesktop,
		'--bb-il-desc-size-tablet': descSizeDesktop,
		'--bb-il-desc-size-mobile': descSizeDesktop,
		'--bb-il-desc-color': descriptionColor || 'inherit',
	};

	const wrapperClasses = [
		'bb-il-block',
		`bb-il-align--${safeAlignment}`,
		safeIconBg ? 'has-icon-bg' : '',
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

	const listAriaLabel = (ariaLabel || '').toString().trim() || __('Feature list', 'b-blocks');

	return (
		<>
			<Settings
				attributes={attributes}
				setAttributes={setAttributes}
			/>

			<div {...blockProps}>
				{items.length === 0 ? (
					<p className='bb-il-empty'>
						{__('No items yet. Add the first one from the sidebar.', 'b-blocks')}
					</p>
				) : (
					<ul className='bb-il' aria-label={listAriaLabel}>
						{items.map((item, idx) => {
							const itemIcon = resolveItemIcon(
								iconPreset,
								iconClass,
								item?.iconPreset,
								item?.iconClass,
							);
							const itemShowIcon = item ? item.showIcon !== false : true;
							const perItemStyle = {};
							if (item?.iconColor) {
								perItemStyle['--bb-il-icon-color'] = item.iconColor;
							}
							if (item?.iconBg) {
								perItemStyle['--bb-il-icon-bg'] = item.iconBg;
							}
							const itemClasses = item?.iconBg ? 'bb-il-item has-icon-bg' : 'bb-il-item';

							return (
								<li
									key={(item && item._key) || idx}
									className={itemClasses}
									style={perItemStyle}
								>
									{itemShowIcon && itemIcon ? (
										<span className='bb-il-icon' aria-hidden='true'>
											<i className={itemIcon} />
										</span>
									) : (
										<span className='bb-il-icon bb-il-icon--hidden' aria-hidden='true' />
									)}

									<div className='bb-il-body'>
										<RichText
											tagName='span'
											className='bb-il-text'
											value={(item && item.text) || ''}
											onChange={(val) => updateItem(idx, 'text', val)}
											placeholder={__('List item text', 'b-blocks')}
											allowedFormats={['core/bold', 'core/italic', 'core/link']}
										/>

										{showDescription && (
											<RichText
												tagName='span'
												className='bb-il-desc'
												value={(item && item.description) || ''}
												onChange={(val) => updateItem(idx, 'description', val)}
												placeholder={__('Optional description…', 'b-blocks')}
												allowedFormats={['core/bold', 'core/italic', 'core/link']}
											/>
										)}

										<div
											className='bb-il-editor-item-actions'
											style={{
												display: 'flex',
												justifyContent: 'flex-start',
												gap: 4,
												marginTop: 6,
											}}
										>
											<Button
												variant='tertiary'
												size='small'
												icon='arrow-up-alt2'
												label={__('Move item up', 'b-blocks')}
												onClick={() => moveItem(idx, idx - 1)}
												disabled={idx === 0}
											/>
											<Button
												variant='tertiary'
												size='small'
												icon='arrow-down-alt2'
												label={__('Move item down', 'b-blocks')}
												onClick={() => moveItem(idx, idx + 1)}
												disabled={idx === items.length - 1}
											/>
											<Button
												variant='tertiary'
												isDestructive
												size='small'
												icon='trash'
												label={__('Remove item', 'b-blocks')}
												onClick={() => removeItem(idx)}
											/>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</>
	);
};

export default Edit;
