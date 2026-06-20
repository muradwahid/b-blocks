import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';

/**
 * Generic string-array repeater used for pros and cons.
 *
 * `value` is an array of strings, `onChange(nextArray)` returns the
 * updated list. Adding appends an empty string (placeholder visible
 * via the TextControl), removing splices by index.
 */
const TextRepeater = ({
	value = [],
	onChange,
	addLabel,
	placeholder = '',
	removeLabel,
}) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, next) => {
		const copy = items.map((row, i) => (i === index ? next : row));
		onChange(copy);
	};

	const removeAt = (index) => {
		const copy = items.filter((_, i) => i !== index);
		onChange(copy);
	};

	const addRow = () => {
		onChange([...items, '']);
	};

	return (
		<div className='bb-rb-text-repeater'>
			{items.map((row, idx) => (
				<div
					key={idx}
					style={{
						display: 'flex',
						gap: 8,
						alignItems: 'flex-end',
						marginBottom: 8,
					}}
				>
					<div style={{ flex: '1 1 auto' }}>
						<TextControl
							value={row || ''}
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
