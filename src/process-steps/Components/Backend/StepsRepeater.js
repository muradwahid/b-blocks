import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	TextareaControl,
} from '@wordpress/components';

/**
 * Sidebar repeater UI for Process Steps.
 *
 * Each step row holds: title (TextControl), description (TextareaControl),
 * and (when the badge type is "icon") a Font Awesome class TextControl.
 * Reorder up/down + delete controls per row. Adding a row appends a default
 * `{ _key, title, description, icon }`. Capped at 12 steps.
 *
 * The `_key` is a stable string used as the React key so input focus
 * survives reorders (lesson learned from the FAQ block tester run).
 */
const MAX_STEPS = 12;

const StepsRepeater = ({ value = [], onChange, badgeType = 'number' }) => {
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
		if (items.length >= MAX_STEPS) return;
		const _key = `ps-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{ _key, title: '', description: '', icon: '' },
		]);
	};

	const atCap = items.length >= MAX_STEPS;

	return (
		<div className='bb-ps-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No steps yet. Add one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={row?._key || idx}
					className='bb-ps-repeater__row'
				>
					<div className='bb-ps-repeater__row-head'>
						<strong className='bb-ps-repeater__row-title'>
							{__('Step', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-ps-repeater__row-actions'>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-up-alt2'
								label={__('Move step up', 'b-blocks')}
								onClick={() => moveItem(idx, idx - 1)}
								disabled={idx === 0}
							/>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-down-alt2'
								label={__('Move step down', 'b-blocks')}
								onClick={() => moveItem(idx, idx + 1)}
								disabled={idx === items.length - 1}
							/>
							<Button
								variant='tertiary'
								isDestructive
								size='small'
								icon='trash'
								label={__('Remove step', 'b-blocks')}
								onClick={() => removeAt(idx)}
							/>
						</div>
					</div>

					<TextControl
						label={__('Title', 'b-blocks')}
						value={(row && row.title) || ''}
						onChange={(val) => updateAt(idx, 'title', val)}
						placeholder={__('Short title for this step', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextareaControl
						label={__('Description', 'b-blocks')}
						value={(row && row.description) || ''}
						onChange={(val) => updateAt(idx, 'description', val)}
						placeholder={__('Explain what happens in this step', 'b-blocks')}
						rows={3}
						__nextHasNoMarginBottom
					/>

					{badgeType === 'icon' && (
						<TextControl
							label={__('Icon class (Font Awesome)', 'b-blocks')}
							value={(row && row.icon) || ''}
							onChange={(val) => updateAt(idx, 'icon', val)}
							placeholder='fa-solid fa-rocket'
							help={__('Example: fa-solid fa-rocket', 'b-blocks')}
							__nextHasNoMarginBottom
						/>
					)}
				</div>
			))}

			<Button
				variant='secondary'
				className='bb-ps-add-step'
				onClick={addRow}
				icon='plus'
				disabled={atCap}
			>
				{atCap
					? __('Maximum 12 steps', 'b-blocks')
					: __('Add Step', 'b-blocks')}
			</Button>
		</div>
	);
};

export default StepsRepeater;
