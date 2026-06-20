import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Sidebar repeater UI for the Icon List items.
 *
 * Each row exposes: text (TextControl mirrors RichText for keyboard
 * accessibility), description (TextControl, visible when showDescription
 * is true on the parent block), per-item icon preset override, per-item
 * Font Awesome class (shown only when the preset is "custom"), per-item
 * show-icon toggle, link URL, and open-in-new-tab toggle.
 *
 * Stable `_key` IDs are required as React keys so reordering doesn't
 * destroy focus on the input the user is typing in.
 */
const MAX_ITEMS = 30;

const PRESET_OPTIONS = [
	{ label: __('Inherit from block', 'b-blocks'), value: '' },
	{ label: __('Check', 'b-blocks'), value: 'check' },
	{ label: __('Check (circle)', 'b-blocks'), value: 'circle-check' },
	{ label: __('Cross', 'b-blocks'), value: 'cross' },
	{ label: __('Cross (circle)', 'b-blocks'), value: 'circle-cross' },
	{ label: __('Arrow right', 'b-blocks'), value: 'arrow' },
	{ label: __('Star', 'b-blocks'), value: 'star' },
	{ label: __('Filled dot', 'b-blocks'), value: 'dot' },
	{ label: __('Custom (Font Awesome class)', 'b-blocks'), value: 'custom' },
];

const ItemsRepeater = ({
	value = [],
	onChange,
	showDescription = false,
}) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		onChange(copy);
	};

	const removeAt = (index) => {
		const copy = items.filter((_, i) => i !== index);
		onChange(copy);
	};

	const moveItem = (from, to) => {
		if (to < 0 || to >= items.length) return;
		const copy = items.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		onChange(copy);
	};

	const addRow = () => {
		if (items.length >= MAX_ITEMS) return;
		const _key = `il-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{
				_key,
				text: __('List item', 'b-blocks'),
				description: '',
				iconPreset: '',
				iconClass: '',
				iconColor: '',
				iconBg: '',
				showIcon: true,
				link: '',
				linkNewTab: false,
			},
		]);
	};

	const atCap = items.length >= MAX_ITEMS;

	return (
		<div className='bb-il-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No items yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={row?._key || idx}
					className='bb-il-repeater__row'
				>
					<div className='bb-il-repeater__row-head'>
						<strong className='bb-il-repeater__row-title'>
							{__('Item', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-il-repeater__row-actions'>
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
								onClick={() => removeAt(idx)}
							/>
						</div>
					</div>

					<TextControl
						label={__('Text', 'b-blocks')}
						value={(row && row.text) || ''}
						onChange={(val) => updateAt(idx, 'text', val)}
						placeholder={__('List item text', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{showDescription && (
						<TextControl
							label={__('Description', 'b-blocks')}
							value={(row && row.description) || ''}
							onChange={(val) => updateAt(idx, 'description', val)}
							placeholder={__('Optional secondary line', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}

					<SelectControl
						label={__('Icon', 'b-blocks')}
						value={(row && row.iconPreset) || ''}
						options={PRESET_OPTIONS}
						onChange={(val) => updateAt(idx, 'iconPreset', val)}
						help={__('Pick a preset, or choose Custom to enter your own Font Awesome class.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					{row?.iconPreset === 'custom' && (
						<TextControl
							label={__('Icon class (Font Awesome)', 'b-blocks')}
							value={(row && row.iconClass) || ''}
							onChange={(val) => updateAt(idx, 'iconClass', val)}
							placeholder='fa-solid fa-check'
							help={__('Example: fa-solid fa-check', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}

					<ToggleControl
						label={__('Show icon for this item', 'b-blocks')}
						checked={row ? row.showIcon !== false : true}
						onChange={(val) => updateAt(idx, 'showIcon', val)}
					/>

					<TextControl
						label={__('Link URL', 'b-blocks')}
						value={(row && row.link) || ''}
						onChange={(val) => updateAt(idx, 'link', val)}
						placeholder='https://'
						type='url'
						__nextHasNoMarginBottom
					/>

					{!!(row && row.link) && (
						<ToggleControl
							label={__('Open in new tab', 'b-blocks')}
							checked={!!(row && row.linkNewTab)}
							onChange={(val) => updateAt(idx, 'linkNewTab', val)}
						/>
					)}
				</div>
			))}

			<Button
				variant='secondary'
				className='bb-il-add-item'
				onClick={addRow}
				icon='plus'
				disabled={atCap}
			>
				{atCap
					? __('Maximum 30 items', 'b-blocks')
					: __('Add Item', 'b-blocks')}
			</Button>
		</div>
	);
};

export default ItemsRepeater;
