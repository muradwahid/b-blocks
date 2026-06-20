import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
} from '@wordpress/components';

import { Label, ColorControl } from '../../../../../bpl-tools/Components';

/**
 * Sidebar repeater UI for the Typing Headline words list.
 *
 * Each row exposes:
 *   - text (TextControl) — the rotating word/phrase
 *   - optional per-word color override
 *
 * Stable `_key` IDs are required as React keys so reordering doesn't
 * destroy focus on the input the user is typing in (lesson learned from
 * the FAQ block tester run — see runs/faq-block/TEST_REPORT.md).
 */
const MAX_WORDS = 20;

const WordsRepeater = ({ value = [], onChange }) => {
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
		if (items.length >= MAX_WORDS) return;
		const _key = `th-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		onChange([
			...items,
			{
				_key,
				text: '',
				color: '',
			},
		]);
	};

	const atCap = items.length >= MAX_WORDS;

	return (
		<div className='bb-th-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No rotating words yet. Add the first one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => (
				<div
					key={row?._key || idx}
					className='bb-th-repeater__row'
				>
					<div className='bb-th-repeater__row-head'>
						<strong className='bb-th-repeater__row-title'>
							{__('Word', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-th-repeater__row-actions'>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-up-alt2'
								label={__('Move word up', 'b-blocks')}
								onClick={() => moveItem(idx, idx - 1)}
								disabled={idx === 0}
							/>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-down-alt2'
								label={__('Move word down', 'b-blocks')}
								onClick={() => moveItem(idx, idx + 1)}
								disabled={idx === items.length - 1}
							/>
							<Button
								variant='tertiary'
								isDestructive
								size='small'
								icon='trash'
								label={__('Remove word', 'b-blocks')}
								onClick={() => removeAt(idx)}
							/>
						</div>
					</div>

					<TextControl
						label={__('Text', 'b-blocks')}
						value={(row && row.text) || ''}
						onChange={(val) => updateAt(idx, 'text', val)}
						placeholder={__('e.g. grow faster', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
						<Label className=''>{__('Color override:', 'b-blocks')}</Label>
						<ColorControl
							value={(row && row.color) || ''}
							onChange={(val) => updateAt(idx, 'color', val || '')}
							defaultColor=''
						/>
					</div>
				</div>
			))}

			<Button
				variant='secondary'
				className='bb-th-add-word'
				onClick={addRow}
				icon='plus'
				disabled={atCap}
			>
				{atCap
					? __('Maximum 20 words', 'b-blocks')
					: __('Add Word', 'b-blocks')}
			</Button>
		</div>
	);
};

export default WordsRepeater;
