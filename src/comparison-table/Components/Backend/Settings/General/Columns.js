import { useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ItemsPanel, Notice } from '../../../../../../../bpl-tools/Components';

import { makeKey, MAX_COLUMNS, MIN_COLUMNS, splitColumns, withFeatureColumn } from '../../../../utils/data';
import { addNewColumn, defaultCell } from '../../../../utils/options';
import ColumnItemSettings from '../Panel/ColumnItemSettings';

const Columns = ({ attributes, setAttributes, device = 'desktop' }) => {

	const columns = withFeatureColumn(attributes.columns || []);
	const { plans } = splitColumns(columns);

	const cellIndexOf = (index) => index - (columns.findIndex((c) => c?.isFeatureColumn) < index ? 1 : 0);
	const rows = attributes.rows || [];

	const mapCells = (mapper) => rows.map((row) => ({
		...(row || {}),
		cells: mapper(Array.isArray(row?.cells) ? row.cells : [])
	}));

	const onChange = (next) => {
		const oldKeys = columns.map((column) => column?._key);
		const newKeys = next.map((column) => column?._key);
		const isReorder = oldKeys.length === newKeys.length
			&& newKeys.every((key) => oldKeys.includes(key))
			&& newKeys.join('|') !== oldKeys.join('|');

		if (isReorder) {

			if (next.findIndex((c) => c?.isFeatureColumn) !== 0) {
				setAttributes({ columns });
				return;
			}

			const oldPlanKeys = plans.map((c) => c?._key);
			const newPlanKeys = next.filter((c) => !c?.isFeatureColumn).map((c) => c?._key);
			const order = newPlanKeys.map((key) => oldPlanKeys.indexOf(key));
			setAttributes({ columns: next, rows: mapCells((cells) => order.map((i) => cells[i] || defaultCell())) });
			return;
		}

		setAttributes({ columns: next });
	};

	const handleAdd = useCallback((next) => {
		if (plans.length >= MAX_COLUMNS) return;
		setAttributes({ columns: next, rows: mapCells((cells) => [...cells, defaultCell()]) });
	}, [JSON.stringify(columns), JSON.stringify(rows)]);

	const handleCopy = useCallback((index) => {

		if (columns[index]?.isFeatureColumn || plans.length >= MAX_COLUMNS) return;

		const duplicate = { ...(columns[index] || {}), _key: makeKey('col'), isFeatured: false };

		setAttributes({
			columns: [...columns.slice(0, index + 1), duplicate, ...columns.slice(index + 1)],
			rows: mapCells((cells) => {
				const cell = cellIndexOf(index);
				const next = cells.slice();
				next.splice(cell + 1, 0, { ...(cells[cell] || defaultCell()) });
				return next;
			})
		});
	}, [JSON.stringify(columns), JSON.stringify(rows)]);

	const handleDelete = useCallback((index) => {
		if (columns[index]?.isFeatureColumn || plans.length <= MIN_COLUMNS) return;
		setAttributes({
			columns: columns.filter((_column, i) => i !== index),
			rows: mapCells((cells) => cells.filter((_cell, i) => i !== cellIndexOf(index)))
		});
	}, [JSON.stringify(columns), JSON.stringify(rows)]);

	const ItemSettings = useCallback(
		(itemProps) => <ColumnItemSettings {...itemProps} featuredLabel={attributes.content?.featuredLabel} device={device} />,
		[attributes.content?.featuredLabel, device]
	);

	return <PanelBody className='bPlPanelBody' title={__('Columns (Plans)', 'b-blocks')} initialOpen={false}>
		<ItemsPanel
			value={columns}
			onChange={onChange}
			arrKey='columns'
			itemLabel='Column'
			title='label'
			design='sortable'
			minItem={MIN_COLUMNS + 1}
			ItemSettings={ItemSettings}
			newItem={addNewColumn(makeKey)}
			handleAdd={handleAdd}
			handleCopy={handleCopy}
			handleDelete={handleDelete}
		/>

		{plans.length >= MAX_COLUMNS && <Notice status='info' isIcon={true}>
			{__('Maximum of 6 columns reached.', 'b-blocks')}
		</Notice>}
	</PanelBody>;
};
export default Columns;
