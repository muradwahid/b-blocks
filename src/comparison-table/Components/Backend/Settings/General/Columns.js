import { useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl } from '@wordpress/components';

import { ItemsPanel, Notice } from '../../../../../../../bpl-tools/Components';

import { makeKey, MAX_COLUMNS, MIN_COLUMNS } from '../../../../utils/data';
import { addNewColumn, defaultCell } from '../../../../utils/options';
import ColumnItemSettings from '../Panel/ColumnItemSettings';

/**
 * ItemsPanel runs controlled here (`value`/`onChange`, not `attributes`), which
 * is what makes the cell mirroring possible: every structural change to columns
 * has to be applied to each row's `cells` in the same operation, and controlled
 * mode routes the sortable's reorder through onChange too.
 */
const Columns = ({ attributes, setAttributes, updateObj }) => {
	const columns = attributes.columns || [];
	const rows = attributes.rows || [];

	const mapCells = (mapper) => rows.map((row) => ({
		...(row || {}),
		cells: mapper(Array.isArray(row?.cells) ? row.cells : [])
	}));

	// Drag-reorder arrives as a reordered array, not a from/to pair, so the
	// permutation is recovered by matching _key and replayed onto the cells.
	const onChange = (next) => {
		const oldKeys = columns.map((column) => column?._key);
		const newKeys = next.map((column) => column?._key);
		const isReorder = oldKeys.length === newKeys.length
			&& newKeys.every((key) => oldKeys.includes(key))
			&& newKeys.join('|') !== oldKeys.join('|');

		if (isReorder) {
			const order = newKeys.map((key) => oldKeys.indexOf(key));
			setAttributes({ columns: next, rows: mapCells((cells) => order.map((i) => cells[i] || defaultCell())) });
			return;
		}

		setAttributes({ columns: next });
	};

	const handleAdd = useCallback((next) => {
		if (columns.length >= MAX_COLUMNS) return;
		setAttributes({ columns: next, rows: mapCells((cells) => [...cells, defaultCell()]) });
	}, [JSON.stringify(columns), JSON.stringify(rows)]);

	const handleCopy = useCallback((index) => {
		if (columns.length >= MAX_COLUMNS) return;

		// A duplicate needs a fresh key (ItemsPanel's default copy reuses it,
		// which would collide as a React key) and must not steal "featured".
		const duplicate = { ...(columns[index] || {}), _key: makeKey('col'), isFeatured: false };

		setAttributes({
			columns: [...columns.slice(0, index + 1), duplicate, ...columns.slice(index + 1)],
			rows: mapCells((cells) => {
				const next = cells.slice();
				next.splice(index + 1, 0, { ...(cells[index] || defaultCell()) });
				return next;
			})
		});
	}, [JSON.stringify(columns), JSON.stringify(rows)]);

	const handleDelete = useCallback((index) => {
		if (columns.length <= MIN_COLUMNS) return;
		setAttributes({
			columns: columns.filter((_column, i) => i !== index),
			rows: mapCells((cells) => cells.filter((_cell, i) => i !== index))
		});
	}, [JSON.stringify(columns), JSON.stringify(rows)]);

	// Bound so each column can show the global Featured Label as its
	// placeholder; ItemsPanel forwards only its own props to ItemSettings.
	const ItemSettings = useCallback(
		(itemProps) => <ColumnItemSettings {...itemProps} featuredLabel={attributes.content?.featuredLabel} />,
		[attributes.content?.featuredLabel]
	);

	return <PanelBody className='bPlPanelBody' title={__('Columns (Plans)', 'b-blocks')} initialOpen={false}>
		{/* The feature-name column is not part of the `columns` array — it has
		    no cells — so it gets its own field rather than a repeater item. */}
		<TextControl
			label={__('First column heading', 'b-blocks')}
			value={attributes.content?.featureColumnLabel || ''}
			onChange={(val) => updateObj('content', val, 'featureColumnLabel')}
			placeholder={__('e.g. Features, Package Details', 'b-blocks')}
			help={__('Leave empty to keep it blank on screen but still announced to screen readers.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		<hr />

		<ItemsPanel
			value={columns}
			onChange={onChange}
			arrKey='columns'
			itemLabel='Column'
			title='label'
			design='sortable'
			minItem={MIN_COLUMNS}
			ItemSettings={ItemSettings}
			newItem={addNewColumn(makeKey)}
			handleAdd={handleAdd}
			handleCopy={handleCopy}
			handleDelete={handleDelete}
		/>

		{columns.length >= MAX_COLUMNS && <Notice status='info' isIcon={true}>
			{__('Maximum of 6 columns reached.', 'b-blocks')}
		</Notice>}
	</PanelBody>;
};
export default Columns;
