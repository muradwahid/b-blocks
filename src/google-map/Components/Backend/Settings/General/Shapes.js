import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ItemsPanel } from '../../../../../../../bpl-tools/Components';

import { addNewShape } from '../../../../utils/options';
import ShapeItemSettings from '../Panel/ShapeItemSettings/ShapeItemSettings';

const Shapes = ({ attributes, setAttributes }) => <PanelBody className='bPlPanelBody' title={__('Shapes', 'b-blocks')} initialOpen={false}>
	<ItemsPanel
		attributes={attributes}
		setAttributes={setAttributes}
		arrKey='shapes'
		itemLabel='Shape'
		design='sortable'
		minItem={0}
		ItemSettings={ShapeItemSettings}
		newItem={addNewShape((attributes.shapes?.length || 0) + 1, attributes.source?.center)}
	/>
</PanelBody>;
export default Shapes;
