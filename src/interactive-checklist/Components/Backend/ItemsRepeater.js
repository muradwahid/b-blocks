import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

/**
 * Sidebar repeater UI for the Interactive Checklist items.
 *
 * Each row exposes the item label in a TextControl plus move up/down and
 * remove actions. The list is capped at MAX_ITEMS. Each item carries a
 * stable `id` (used both as the React key, so reordering preserves focus,
 * and as the localStorage key for that item's checked state on the front
 * end).
 */
const MAX_ITEMS = 30;

const newId = () => `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const ItemsRepeater = ({ value = [], onChange }) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		onChange(copy);
	};

	const removeAt = (index) => {
		onChange(items.filter((_, i) => i !== index));
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
		onChange([
			...items,
			{ id: newId(), label: __('New item', 'b-blocks'), checked: false },
		]);
	};

	const atCap = items.length >= MAX_ITEMS;

	return (
		<div className='bb-cl-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No items yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div key={row?.id || idx} className='bb-cl-repeater__row'>
					<div className='bb-cl-repeater__row-head'>
						<strong className='bb-cl-repeater__row-title'>
							{__('Item', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-cl-repeater__row-actions'>
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
						label={__('Item label', 'b-blocks')}
						value={(row && row.label) || ''}
						onChange={(val) => updateAt(idx, 'label', val)}
						placeholder={__('Describe a task…', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				</div>
			))}

			<Button
				variant='secondary'
				className='bb-cl-add-item'
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
