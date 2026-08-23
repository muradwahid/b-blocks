import { useCallback } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ItemsPanel, Notice } from '../../../../../../../bpl-tools/Components';

import { makeKey, MAX_ROWS } from '../../../../utils/data';
import { addNewRow } from '../../../../utils/options';
import RowItemSettings from '../Panel/RowItemSettings';

const Rows = ({ attributes, setAttributes }) => {
	const columns = attributes.columns || [];
	const rows = attributes.rows || [];

	// Rows reorder independently of columns, so the sortable needs no mirroring
	// — only add and copy are intercepted.
	const onChange = (next) => setAttributes({ rows: next });

	const handleAdd = useCallback((next) => {
		if (rows.length >= MAX_ROWS) return;
		setAttributes({ rows: next });
	}, [JSON.stringify(rows)]);

	const handleCopy = useCallback((index) => {
		if (rows.length >= MAX_ROWS) return;

		const source = rows[index] || {};
		const duplicate = {
			...source,
			_key: makeKey('row'),
			cells: (source.cells || []).map((cell) => ({ ...cell }))
		};

		setAttributes({ rows: [...rows.slice(0, index + 1), duplicate, ...rows.slice(index + 1)] });
	}, [JSON.stringify(rows)]);

	// Bound so ItemSettings can render one cell editor per column; ItemsPanel
	// only forwards its own props in the non-sortable designs.
	const ItemSettings = useCallback(
		(itemProps) => <RowItemSettings {...itemProps} columns={columns} />,
		[JSON.stringify(columns)]
	);

	return <PanelBody className='bPlPanelBody' title={__('Feature Rows', 'b-blocks')} initialOpen={false}>
		<ItemsPanel
			value={rows}
			onChange={onChange}
			arrKey='rows'
			itemLabel='Row'
			title='label'
			design='sortable'
			minItem={0}
			ItemSettings={ItemSettings}
			newItem={addNewRow(makeKey, columns.length)}
			handleAdd={handleAdd}
			handleCopy={handleCopy}
		/>

		{rows.length >= MAX_ROWS && <Notice status='info' isIcon={true}>
			{__('Maximum of 30 rows reached.', 'b-blocks')}
		</Notice>}
	</PanelBody>;
};
export default Rows;
