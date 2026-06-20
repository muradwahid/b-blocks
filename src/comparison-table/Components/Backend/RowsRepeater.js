import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	SelectControl,
	ToggleControl,
	BaseControl,
} from '@wordpress/components';

import { makeKey } from './Edit';

const MAX_ROWS = 30;

/**
 * Repeater UI for comparison-table feature rows.
 *
 * Each row holds: label, optional tooltip, and a `cells` array sized to
 * match the number of columns. Each cell is either an "icon" (yes/no
 * boolean) or "text" (free-form string).
 *
 * The stable `_key` is used as the React key so input focus survives
 * reorders (lesson from the FAQ block tester run).
 */
const RowsRepeater = ({ rows = [], columns = [], onChange }) => {
	const items = Array.isArray(rows) ? rows : [];
	const cols = Array.isArray(columns) ? columns : [];

	const updateRow = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		onChange(copy);
	};

	const updateCell = (rowIndex, cellIndex, key, next) => {
		const copy = items.map((row, i) => {
			if (i !== rowIndex) return row;
			const cells = Array.isArray(row && row.cells) ? row.cells.slice() : [];
			while (cells.length < cols.length) {
				cells.push({ type: 'icon', value: false, text: '' });
			}
			cells[cellIndex] = { ...(cells[cellIndex] || {}), [key]: next };
			return { ...(row || {}), cells };
		});
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
		if (items.length >= MAX_ROWS) return;
		const _key = makeKey('row');
		const cells = cols.map(() => ({ type: 'icon', value: true, text: '' }));
		onChange([
			...items,
			{ _key, label: __('New feature', 'b-blocks'), tooltip: '', cells },
		]);
	};

	return (
		<div className='bb-ct-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No feature rows yet. Add the first one below.', 'b-blocks')}
				</p>
			)}

			{items.map((row, idx) => {
				const cells = Array.isArray(row && row.cells) ? row.cells : [];
				return (
					<div key={(row && row._key) || idx} className='bb-ct-repeater__row'>
						<div className='bb-ct-repeater__header'>
							<strong style={{ fontSize: 12 }}>
								{__('Row', 'b-blocks')} #{idx + 1}
							</strong>
							<div className='bb-ct-repeater__actions'>
								<Button
									variant='tertiary'
									size='small'
									icon='arrow-up-alt2'
									label={__('Move row up', 'b-blocks')}
									onClick={() => moveItem(idx, idx - 1)}
									disabled={idx === 0}
								/>
								<Button
									variant='tertiary'
									size='small'
									icon='arrow-down-alt2'
									label={__('Move row down', 'b-blocks')}
									onClick={() => moveItem(idx, idx + 1)}
									disabled={idx === items.length - 1}
								/>
								<Button
									variant='tertiary'
									isDestructive
									size='small'
									icon='trash'
									label={__('Remove row', 'b-blocks')}
									onClick={() => removeAt(idx)}
								/>
							</div>
						</div>

						<TextControl
							label={__('Feature name', 'b-blocks')}
							value={(row && row.label) || ''}
							onChange={(val) => updateRow(idx, 'label', val)}
							placeholder={__('e.g. Unlimited storage', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={__('Tooltip (optional)', 'b-blocks')}
							value={(row && row.tooltip) || ''}
							onChange={(val) => updateRow(idx, 'tooltip', val)}
							placeholder={__('Extra explanation shown on hover/focus', 'b-blocks')}
							__nextHasNoMarginBottom
						/>

						<BaseControl
							label={__('Cells', 'b-blocks')}
							__nextHasNoMarginBottom
						>
							{cols.length === 0 && (
								<p style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
									{__('Add at least one column to edit cells.', 'b-blocks')}
								</p>
							)}
							{cols.map((col, cIdx) => {
								const cell = cells[cIdx] || { type: 'icon', value: false, text: '' };
								const colLabel = (col && col.label) || __('Column', 'b-blocks');
								return (
									<div key={(col && col._key) || cIdx} className='bb-ct-cell-editor'>
										<div className='bb-ct-cell-editor__head'>
											<span>{colLabel}</span>
											<SelectControl
												value={cell.type === 'text' ? 'text' : 'icon'}
												options={[
													{ label: __('Icon (yes/no)', 'b-blocks'), value: 'icon' },
													{ label: __('Text', 'b-blocks'), value: 'text' },
												]}
												onChange={(val) => updateCell(idx, cIdx, 'type', val)}
												__nextHasNoMarginBottom
											/>
										</div>
										{cell.type === 'text' ? (
											<TextControl
												label={__('Text value', 'b-blocks')}
												hideLabelFromVision
												value={cell.text || ''}
												onChange={(val) => updateCell(idx, cIdx, 'text', val)}
												placeholder={__('e.g. 10 GB, Unlimited, $9/mo', 'b-blocks')}
												__nextHasNoMarginBottom
											/>
										) : (
											<ToggleControl
												label={cell.value
													? __('Yes (green check)', 'b-blocks')
													: __('No (red X)', 'b-blocks')}
												checked={!!cell.value}
												onChange={(val) => updateCell(idx, cIdx, 'value', val)}
											/>
										)}
									</div>
								);
							})}
						</BaseControl>
					</div>
				);
			})}

			<div className='bb-ct-repeater__add'>
				<Button
					variant='secondary'
					icon='plus'
					onClick={addRow}
					disabled={items.length >= MAX_ROWS}
				>
					{__('Add Row', 'b-blocks')}
				</Button>
				{items.length >= MAX_ROWS && (
					<p style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
						{__('Maximum of 30 rows reached.', 'b-blocks')}
					</p>
				)}
			</div>
		</div>
	);
};

export default RowsRepeater;
