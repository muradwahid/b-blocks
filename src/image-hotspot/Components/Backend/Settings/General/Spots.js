import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { addNewItem } from '../../../../utils/options';
import SpotItemSettings from '../Panel/SpotItemSettings/SpotItemSettings';
import { pricingPage } from '../../../../../utils/data';

const Spots = ({ attributes, setAttributes, activeIdx, setActiveIdx, device }) => {
	const itemsProps = { attributes, setAttributes, arrKey: 'hotspot', activeIndex: activeIdx, setActiveIndex: setActiveIdx,device }
	const randomId = Math.floor(Math.random() * 91);
	const randomId2 = Math.floor(Math.random() * 91);
	const isPremium = true
	return <PanelBody className='bPlPanelBody' initialOpen={false} title={__('Spots', 'b-blocks')} >
		<ItemsPanel {...itemsProps} newItem={addNewItem(randomId, randomId2)} itemLabel='Spot' design={isPremium ? 'sortable' : 'single'} ItemSettings={SpotItemSettings} />
		{!isPremium && <small> <b><a href={pricingPage} target='__blank'>Upgrade to Premium</a></b> to unlock sorting and more features.</small>}
	</PanelBody>
};

export default Spots;
