import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { addNewItem } from '../../../../utils/options';
import SpotItemSettings from '../Panel/SpotItemSettings/SpotItemSettings';

const Spots = ({ attributes, setAttributes, activeIdx, setActiveIdx }) => {
	const itemsProps = { attributes, setAttributes, arrKey: 'hotspot', activeIndex: activeIdx, setActiveIndex: setActiveIdx }
	const randomId = Math.floor(Math.random() * 91);
	const randomId2 = Math.floor(Math.random() * 91);

	return <PanelBody className='bPlPanelBody' initialOpen={false} title={__('Spots', 'b-blocks')} >
		<ItemsPanel {...itemsProps} newItem={addNewItem(randomId, randomId2)} itemLabel='Spot' design='all' ItemSettings={SpotItemSettings} />
	</PanelBody>
};

export default Spots;
