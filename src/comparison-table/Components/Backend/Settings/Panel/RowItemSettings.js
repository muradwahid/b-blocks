import { __ } from '@wordpress/i18n';
import { BaseControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { cellTypeSelect, defaultCell } from '../../../../utils/options';

/**
 * One feature row: label, tooltip, and one cell editor per column. `cells` is
 * padded to the column count on write so a row added before a column always
 * ends up with a matching cell.
 */
const RowItemSettings = ({ value = [], onChange, index, columns = [] }) => {
	const item = value[index];
	if (!item) return null;

	const update = (key, next) => onChange(value.map((row, i) => (i === index ? { ...(row || {}), [key]: next } : row)));

	const updateCell = (cellIndex, key, next) => onChange(value.map((row, i) => {
		if (i !== index) return row;

		const cells = Array.isArray(row?.cells) ? row.cells.slice() : [];
		while (cells.length < columns.length) cells.push(defaultCell());
		cells[cellIndex] = { ...(cells[cellIndex] || defaultCell()), [key]: next };

		return { ...(row || {}), cells };
	}));

	const cells = Array.isArray(item.cells) ? item.cells : [];

	return <>
		<TextControl label={__('Feature name', 'b-blocks')} value={item.label || ''} onChange={(val) => update('label', val)} placeholder={__('e.g. Unlimited storage', 'b-blocks')} __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('Tooltip (optional)', 'b-blocks')} value={item.tooltip || ''} onChange={(val) => update('tooltip', val)} placeholder={__('Extra explanation shown on hover/focus', 'b-blocks')} __nextHasNoMarginBottom />

		<BaseControl className='mt10' label={__('Cells', 'b-blocks')} __nextHasNoMarginBottom>
			{!columns.length && <p style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
				{__('Add at least one column to edit cells.', 'b-blocks')}
			</p>}

			{columns.map((column, cellIndex) => {
				const cell = cells[cellIndex] || defaultCell();

				return <div key={column?._key || cellIndex} className='b-blocks-comparison-table-cell-editor'>
					<div className='b-blocks-comparison-table-cell-editor__head'>
						<span>{column?.label || __('Column', 'b-blocks')}</span>

						<SelectControl
							value={'text' === cell.type ? 'text' : 'icon'}
							options={cellTypeSelect}
							onChange={(val) => updateCell(cellIndex, 'type', val)}
							__nextHasNoMarginBottom
						/>
					</div>

					{'text' === cell.type
						? <TextControl label={__('Text value', 'b-blocks')} hideLabelFromVision value={cell.text || ''} onChange={(val) => updateCell(cellIndex, 'text', val)} placeholder={__('e.g. 10 GB, Unlimited, $9/mo', 'b-blocks')} __nextHasNoMarginBottom />
						: <ToggleControl className='mt10' label={cell.value ? __('Yes (green check)', 'b-blocks') : __('No (red X)', 'b-blocks')} checked={!!cell.value} onChange={(val) => updateCell(cellIndex, 'value', val)} __nextHasNoMarginBottom />}
				</div>;
			})}
		</BaseControl>
	</>;
};
export default RowItemSettings;
