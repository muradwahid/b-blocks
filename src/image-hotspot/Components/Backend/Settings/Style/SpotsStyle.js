import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, TabPanel, __experimentalUnitControl as UnitControl, } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { BoxControl, ColorControl, Device } from '../../../../../../../bpl-tools/Components';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';

const SpotsStyle = ({ attributes, device, updateObj }) => {
	const { spots } = attributes;
	return <PanelBody className='bPlPanelBody' initialOpen={false} title={__('Spots', 'b-blocks')} >
		<UnitControl label={<Flex>{__('Width', 'b-blocks')} <Device /></Flex>} labelPosition='edge' units={[{ label: 'PX', value: 'px' }]} isUnitSelectTabbable value={spots[device].width} min={1} max={700} onChange={(value) => updateObj('spots', value, device, 'width')} />

		<UnitControl label={<Flex>{__('Height', 'b-blocks')}<Device /></Flex>} labelPosition='edge' className='mt10' units={[{ label: 'PX', value: 'px' }]} isUnitSelectTabbable value={spots[device].height} min={1} max={700} onChange={(value) => updateObj('spots', value, device, 'height')} />

		<UnitControl label={<Flex>{__('Icon Size', 'b-blocks')} <Device /></Flex>} labelPosition='edge' className='mt10' units={[{ label: 'PX', value: 'px' }]} isUnitSelectTabbable value={spots[device].iconSize} min={1} max={200} onChange={(value) => updateObj('spots', value, device, 'iconSize')} />

		<BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} className='mt10' values={spots[device].padding} resetValues={{ left: '0px', right: '0px', top: '0px', bottom: '0px' }} onChange={(value) => updateObj('spots', value, device, 'padding')} />

		<BoxControl label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} className='mt10' values={spots[device].radius} resetValues={{ left: '5px', right: '5px', top: '5px', bottom: '5px' }} onChange={(value) => updateObj('spots', value, device, 'radius')} />

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs} >
			{({ name }) => <>

				<ColorControl label='Text/Icon Color' value={spots[name].color.icon} colors={[{ name: 'red', color: '#f00' }, { name: 'white', color: '#fff' }, { name: 'blue', color: '#00f' },]} onChange={(value) => updateObj('spots', value, name, 'color', 'icon')} />

				<ColorControl label='Background Color' value={spots[name].color.bg} colors={[{ name: 'red', color: '#f00' }, { name: 'white', color: '#fff' }, { name: 'blue', color: '#00f' }]} onChange={(value) => updateObj('spots', value, name, 'color', 'bg')} />

				<BorderBoxControl label={__('Border', 'b-blocks')} value={spots[name].border} onChange={(value) => updateObj('spots', value, name, 'border')} />

			</>}
		</TabPanel>
	</PanelBody>
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(SpotsStyle);
