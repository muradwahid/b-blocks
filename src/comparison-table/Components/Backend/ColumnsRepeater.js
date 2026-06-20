import { __ } from '@wordpress/i18n';
import {
	Button,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { makeKey } from './Edit';

const MAX_COLUMNS = 6;
const MIN_COLUMNS = 2;

/**
 * Repeater UI for comparison-table columns. Each column row has label,
 * optional subtitle, optional CTA URL/label, and a featured toggle. Adding
 * or removing a column also resizes every row's `cells` array so the data
 * model stays consistent.
 */
const ColumnsRepeater = ({ columns = [], rows = [], onChange, onRowsChange }) => {
	const items = Array.isArray(columns) ? columns : [];
	const rowItems = Array.isArray(rows) ? rows : [];

	const updateAt = (index, key, next) => {
		let copy = items.map((col, i) => (
			i === index ? { ...(col || {}), [key]: next } : col
		));
		// Enforce exactly one featured column.
		if ('isFeatured' === key && next === true) {
			copy = copy.map((col, i) => (
				i === index ? col : { ...(col || {}), isFeatured: false }
			));
		}
		onChange(copy);
	};

	const removeAt = (index) => {
		if (items.length <= MIN_COLUMNS) return;
		const copyCols = items.filter((_, i) => i !== index);
		onChange(copyCols);
		// Splice the cell from every row.
		const copyRows = rowItems.map((row) => {
			const cells = Array.isArray(row && row.cells) ? row.cells.slice() : [];
			cells.splice(index, 1);
			return { ...(row || {}), cells };
		});
		onRowsChange(copyRows);
	};

	const moveItem = (from, to) => {
		if (to < 0 || to >= items.length) return;
		const copyCols = items.slice();
		const [movedCol] = copyCols.splice(from, 1);
		copyCols.splice(to, 0, movedCol);
		onChange(copyCols);
		// Mirror the move inside every row's cells.
		const copyRows = rowItems.map((row) => {
			const cells = Array.isArray(row && row.cells) ? row.cells.slice() : [];
			const [movedCell] = cells.splice(from, 1);
			cells.splice(to, 0, movedCell);
			return { ...(row || {}), cells };
		});
		onRowsChange(copyRows);
	};

	const addColumn = () => {
		if (items.length >= MAX_COLUMNS) return;
		const _key = makeKey('col');
		onChange([
			...items,
			{
				_key,
				label: __('New Plan', 'b-blocks'),
				subtitle: '',
				badge: '',
				isFeatured: false,
				ctaUrl: '',
				ctaLabel: '',
			},
		]);
		// Append a default cell to every row.
		const copyRows = rowItems.map((row) => ({
			...(row || {}),
			cells: [
				...(Array.isArray(row && row.cells) ? row.cells : []),
				{ type: 'icon', value: false, text: '' },
			],
		}));
		onRowsChange(copyRows);
	};

	return (
		<div className='bb-ct-repeater'>
			{items.length === 0 && (
				<p style={{ marginTop: 0, opacity: 0.7 }}>
					{__('No columns yet. Add the first plan below.', 'b-blocks')}
				</p>
			)}

			{items.map((col, idx) => (
				<div key={(col && col._key) || idx} className='bb-ct-repeater__row'>
					<div className='bb-ct-repeater__header'>
						<strong style={{ fontSize: 12 }}>
							{__('Column', 'b-blocks')} #{idx + 1}
						</strong>
						<div className='bb-ct-repeater__actions'>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-left-alt2'
								label={__('Move column left', 'b-blocks')}
								onClick={() => moveItem(idx, idx - 1)}
								disabled={idx === 0}
							/>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-right-alt2'
								label={__('Move column right', 'b-blocks')}
								onClick={() => moveItem(idx, idx + 1)}
								disabled={idx === items.length - 1}
							/>
							<Button
								variant='tertiary'
								isDestructive
								size='small'
								icon='trash'
								label={__('Remove column', 'b-blocks')}
								onClick={() => removeAt(idx)}
								disabled={items.length <= MIN_COLUMNS}
							/>
						</div>
					</div>

					<TextControl
						label={__('Column label', 'b-blocks')}
						value={(col && col.label) || ''}
						onChange={(val) => updateAt(idx, 'label', val)}
						placeholder={__('e.g. Pro', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('Subtitle (optional)', 'b-blocks')}
						value={(col && col.subtitle) || ''}
						onChange={(val) => updateAt(idx, 'subtitle', val)}
						placeholder={__('e.g. $19/mo', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('CTA URL (optional)', 'b-blocks')}
						value={(col && col.ctaUrl) || ''}
						onChange={(val) => updateAt(idx, 'ctaUrl', val)}
						placeholder='https://'
						type='url'
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={__('CTA button label', 'b-blocks')}
						value={(col && col.ctaLabel) || ''}
						onChange={(val) => updateAt(idx, 'ctaLabel', val)}
						placeholder={__('e.g. Choose Plan', 'b-blocks')}
						__nextHasNoMarginBottom
					/>

					<ToggleControl
						label={__('Featured column (highlight)', 'b-blocks')}
						checked={!!(col && col.isFeatured)}
						onChange={(val) => updateAt(idx, 'isFeatured', val)}
						help={__('Only one column can be featured at a time.', 'b-blocks')}
					/>
				</div>
			))}

			<div className='bb-ct-repeater__add'>
				<Button
					variant='secondary'
					icon='plus'
					onClick={addColumn}
					disabled={items.length >= MAX_COLUMNS}
				>
					{__('Add Column', 'b-blocks')}
				</Button>
				{items.length >= MAX_COLUMNS && (
					<p style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
						{__('Maximum of 6 columns reached.', 'b-blocks')}
					</p>
				)}
			</div>
		</div>
	);
};

export default ColumnsRepeater;
