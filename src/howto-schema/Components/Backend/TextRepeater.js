import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

/**
 * Generic string-array repeater for supplies and tools.
 *
 * `value` is an array of `{ _key, text }` objects. `_key` is a stable
 * string used as the React key so input focus survives reorders and
 * additions (lesson learned from the FAQ block tester run — array index
 * as key caused TextControl state loss on reorder).
 *
 * `onChange(nextArray)` returns the updated list.
 */
const TextRepeater = ({
	value = [],
	onChange,
	addLabel,
	placeholder = '',
	removeLabel,
	keyPrefix = 'item',
}) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), text: next } : row
		));
		onChange(copy);
	};

	const removeAt = (index) => {
		const copy = items.filter((_, i) => i !== index);
		onChange(copy);
	};

	const addRow = () => {
		const _key = `${keyPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([...items, { _key, text: '' }]);
	};

	return (
		<div className='bb-howto-text-repeater'>
			{items.map((row, idx) => (
				<div
					key={row?._key || `${keyPrefix}-${idx}`}
					style={{
						display: 'flex',
						gap: 8,
						alignItems: 'flex-end',
						marginBottom: 8,
					}}
				>
					<div style={{ flex: '1 1 auto' }}>
						<TextControl
							value={(row && row.text) || ''}
							onChange={(val) => updateAt(idx, val)}
							placeholder={placeholder}
							hideLabelFromVision
							label={`${addLabel || __('Item', 'b-blocks')} #${idx + 1}`}
							__nextHasNoMarginBottom
						/>
					</div>
					<Button
						variant='tertiary'
						isDestructive
						size='small'
						icon='trash'
						label={removeLabel || __('Remove item', 'b-blocks')}
						onClick={() => removeAt(idx)}
					/>
				</div>
			))}

			<Button variant='secondary' onClick={addRow} icon='plus'>
				{addLabel || __('Add Item', 'b-blocks')}
			</Button>
		</div>
	);
};

export default TextRepeater;
