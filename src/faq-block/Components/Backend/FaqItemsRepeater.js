import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	TextareaControl,
} from '@wordpress/components';

/**
 * Repeater UI for FAQ items.
 *
 * Each row exposes a question (TextControl), an answer (TextareaControl),
 * reorder up/down controls, and a delete button. Adding a row appends an
 * empty `{ question: '', answer: '' }` entry. All edits go through
 * `onChange(newArray)` so the calling component owns the source of truth.
 */
const FaqItemsRepeater = ({ value = [], onChange }) => {
	const items = Array.isArray(value) ? value : [];

	const updateAt = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...row, [key]: next } : row
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
		const _key = `faq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{ _key, question: '', answer: '' },
		]);
	};

	return (
		<div className='bb-faq-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No FAQ items yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={row._key || idx}
					className='bb-faq-repeater__row'
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
						padding: 12,
						marginBottom: 12,
						background: '#f6f7f7',
						borderRadius: 4,
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: 8,
						}}
					>
						<strong style={{ fontSize: 12 }}>
							{__('Item', 'b-blocks')} #{idx + 1}
						</strong>
						<div style={{ display: 'flex', gap: 4 }}>
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
						label={__('Question', 'b-blocks')}
						value={row?.question || ''}
						onChange={(val) => updateAt(idx, 'question', val)}
						placeholder={__('Type the question here', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextareaControl
						label={__('Answer', 'b-blocks')}
						value={row?.answer || ''}
						onChange={(val) => updateAt(idx, 'answer', val)}
						placeholder={__('Type the answer here', 'b-blocks')}
						rows={4}
						__nextHasNoMarginBottom
					/>
				</div>
			))}

			<Button variant='secondary' onClick={addRow} icon='plus'>
				{__('Add Item', 'b-blocks')}
			</Button>
		</div>
	);
};

export default FaqItemsRepeater;
