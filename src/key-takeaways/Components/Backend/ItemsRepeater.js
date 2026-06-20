import { __ } from '@wordpress/i18n';
import { Button, TextareaControl } from '@wordpress/components';

/**
 * Sidebar repeater UI for the Key Takeaways items.
 *
 * Each row exposes the takeaway text in a TextareaControl plus move
 * up/down and remove actions. The list is capped at MAX_ITEMS.
 *
 * Stable `_key` IDs are used as React keys so reordering doesn't destroy
 * focus on the field the user is typing in.
 */
const MAX_ITEMS = 12;

const ItemsRepeater = ({ value = [], onChange }) => {
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
		const _key = `kt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{ _key, text: __('New takeaway', 'b-blocks') },
		]);
	};

	const atCap = items.length >= MAX_ITEMS;

	return (
		<div className='bb-kt-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No takeaways yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div key={row?._key || idx} className='bb-kt-repeater__row'>
					<div className='bb-kt-repeater__row-head'>
						<strong className='bb-kt-repeater__row-title'>
							{__('Item', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-kt-repeater__row-actions'>
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

					<TextareaControl
						label={__('Takeaway text', 'b-blocks')}
						value={(row && row.text) || ''}
						onChange={(val) => updateAt(idx, 'text', val)}
						placeholder={__('Summarize a key point…', 'b-blocks')}
						rows={2}
						__nextHasNoMarginBottom
					/>
				</div>
			))}

			<Button
				variant='secondary'
				className='bb-kt-add-item'
				onClick={addRow}
				icon='plus'
				disabled={atCap}
			>
				{atCap
					? __('Maximum 12 items', 'b-blocks')
					: __('Add Item', 'b-blocks')}
			</Button>
		</div>
	);
};

export default ItemsRepeater;
