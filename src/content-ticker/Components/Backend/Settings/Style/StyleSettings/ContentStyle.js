import { Flex, PanelBody, TabPanel } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BoxControl, ColorControl, Device, Typography } from '../../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../utils/options';

const ContentStyle = ({ attributes, updateObj, device }) => {
	const { style } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Content Style', 'b-blocks')} initialOpen={false} >
		<BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={style.padding[device]} resetValues={{ top: '0px', right: '0px', bottom: '0px', left: '0px' }} onChange={(value) => updateObj('style', value, 'padding', device)} />

		<BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={style.bRadius} resetValues={{ top: '0px', right: '0px', bottom: '0px', left: '0px' }} onChange={(value) => updateObj('style', value, 'bRadius')} />

		<ColorControl label={__('Background', 'b-blocks')} value={style.bg} onChange={(value) => updateObj('style', value, 'bg')} />

		<Typography label={__('Typography', 'b-blocks')} value={style.typography} onChange={(value) => updateObj('style', value, 'typography')} />
		<TabPanel className='bPlTabPanel mini mt10' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController} >
			{tab => <ColorControl label={__('Text Color', 'b-blocks')} value={style.color[tab.name]} onChange={(value) => updateObj('style', value, 'color', tab.name)} />}
		</TabPanel>
	</PanelBody>
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(ContentStyle);
