import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, TextControl, __experimentalNumberControl as NumberControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device } from '../../../../../../../bpl-tools/Components';

const Display = ({ attributes, updateObj, device = 'desktop', terms }) => {
	const { searchField = {}, resultBox = {} } = attributes;
	const { filter = '', filterAllText = 'All' } = searchField;

	// The taxonomies the editor's term list has (Category, Tag, Product category…), each once.
	const taxonomies = terms.filter((t, i) => terms.findIndex((other) => other.taxonomy === t.taxonomy) === i).map((t) => ({ label: t.taxonomyLabel, value: t.taxonomy }));

	return <PanelBody className='bPlPanelBody' title={__('Display', 'b-blocks')} initialOpen={false}>
		<SelectControl label={__('Filter Dropdown', 'b-blocks')} help={__('Visitors pick one term before or while searching; the full results page (View All) follows it.', 'b-blocks')} labelPosition='edge' value={filter} options={[{ label: __('None', 'b-blocks'), value: '' }, ...taxonomies]} onChange={(val) => updateObj('searchField', val, 'filter')} __next40pxDefaultSize __nextHasNoMarginBottom />
		{'' !== filter && <TextControl className='mt10' label={__('First Option Text', 'b-blocks')} help={__('The option that searches every term.', 'b-blocks')} value={filterAllText} onChange={(val) => updateObj('searchField', val, 'filterAllText')} __next40pxDefaultSize __nextHasNoMarginBottom />}

		<NumberControl className='mt10' label={<Flex justify='flex-start'>{__('Result Columns', 'b-blocks')} <Device /></Flex>} help={__('Results side by side (1–6). Mobile shows one column unless set.', 'b-blocks')} labelPosition='edge' value={resultBox[device]?.columns || ''} min={1} max={6} onChange={(val) => updateObj('resultBox', val ?? '', device, 'columns')} />
		{1 < parseInt(resultBox[device]?.columns, 10) && <UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Column Gap', 'b-blocks')} <Device /></Flex>} value={resultBox[device]?.gap || ''} labelPosition='edge' onChange={(val) => updateObj('resultBox', val || '', device, 'gap')} />}
	</PanelBody>;
};
export default Display;
