import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl } from '@wordpress/components';

import { ColorControl, IconLibrary } from '../../../../../../../bpl-tools/Components';

/**
 * One column (plan). Rendered inside ItemsPanel, which runs in controlled mode
 * here — `value`/`onChange` rather than `attributes`/`setAttributes` — so the
 * parent can mirror structural changes into every row's cells.
 */
const ColumnItemSettings = ({ value = [], onChange, index, featuredLabel = '' }) => {
	const item = value[index];
	if (!item) return null;

	const update = (key, next) => {
		let items = value.map((column, i) => (i === index ? { ...(column || {}), [key]: next } : column));

		// Exactly one featured column, same rule the old repeater enforced.
		if ('isFeatured' === key && true === next) {
			items = items.map((column, i) => (i === index ? column : { ...(column || {}), isFeatured: false }));
		}

		onChange(items);
	};

	return <>
		<TextControl label={__('Column label', 'b-blocks')} value={item.label || ''} onChange={(val) => update('label', val)} placeholder={__('e.g. Pro', 'b-blocks')} __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('Subtitle (optional)', 'b-blocks')} value={item.subtitle || ''} onChange={(val) => update('subtitle', val)} placeholder={__('e.g. $19/mo', 'b-blocks')} __nextHasNoMarginBottom />

		{/* Shown in the column header — position and size live in Layout and
		    Style → Icons, so every column shares one treatment. */}
		<IconLibrary
			className='mt10'
			label={__('Header Icon', 'b-blocks')}
			value={item.icon}
			onChange={(val) => update('icon', val)}
		/>

		{item.icon ? <ColorControl
			className='mt10'
			label={__('Icon Color:', 'b-blocks')}
			value={item.iconColor}
			onChange={(val) => update('iconColor', val)}
		/> : null}

		{/* Drives --bb-ct-col-accent, which the Minimal, Ribbon and Stacked
		    themes colour their header, icons and card by. */}
		<ColorControl
			className='mt10'
			label={__('Accent Color:', 'b-blocks')}
			value={item.accent}
			onChange={(val) => update('accent', val)}
		/>

		<TextControl className='mt10' label={__('CTA URL (optional)', 'b-blocks')} value={item.ctaUrl || ''} onChange={(val) => update('ctaUrl', val)} placeholder='https://' type='url' __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('CTA button label', 'b-blocks')} value={item.ctaLabel || ''} onChange={(val) => update('ctaLabel', val)} placeholder={__('e.g. Choose Plan', 'b-blocks')} __nextHasNoMarginBottom />

		<ToggleControl
			className='mt10'
			label={__('Featured column (highlight)', 'b-blocks')}
			checked={!!item.isFeatured}
			onChange={(val) => update('isFeatured', val)}
			help={__('Only one column can be featured at a time.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		{/* `badge` is per-column and falls back to the block-level Featured
		    Label, so this can be overridden here without touching the default
		    every other column would use. */}
		{!!item.isFeatured && <TextControl
			className='mt10'
			label={__('Badge text', 'b-blocks')}
			value={item.badge || ''}
			onChange={(val) => update('badge', val)}
			placeholder={featuredLabel || __('Most Popular', 'b-blocks')}
			help={__('Leave empty to use the Featured Label from the Content panel.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>}
	</>;
};
export default ColumnItemSettings;
