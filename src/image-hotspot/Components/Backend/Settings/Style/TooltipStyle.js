import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

const TooltipStyle = ({ attributes, device, updateObj }) => {
    const { tooltip } = attributes;

	return <PanelBody className='bPlPanelBody' initialOpen={false} title={__('Tooltip', 'b-blocks')} >

		<UnitControl label={<Flex>{__('Width', 'b-blocks')} <Device /></Flex>} labelPosition='edge' units={[{ label: 'px', value: 'px' }]} isUnitSelectTabbable value={tooltip[device].width} min={1} max={800} onChange={(value) => updateObj('tooltip', value, device, 'width')} />

		<BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={tooltip[device].padding} resetValues={{ left: '5px', right: '5px', top: '5px', bottom: '5px', }} onChange={(value) => updateObj('tooltip', value, device, 'padding')} />

		<ColorControl label={__('Text Color', 'b-blocks')} value={tooltip.textColor} colors={[{ name: 'red', color: '#f00' }, { name: 'white', color: '#fff' }, { name: 'blue', color: '#00f' },]} onChange={(value) => updateObj('tooltip', value, 'textColor')} />

        <ColorControl label={__('Background Color', 'b-blocks')} value={tooltip.bgColor} colors={[{ name: 'red', color: '#f00' }, { name: 'white', color: '#fff' }, { name: 'blue', color: '#00f' },]} onChange={(value) => updateObj('tooltip', value, 'bgColor')} />
        
        <Typography value={tooltip.typo} onChange={value=>updateObj('tooltip',value,'typo')} />

		<BorderBoxControl label={__('Border', 'b-blocks')} value={tooltip.border} onChange={(value) => updateObj('tooltip', value, 'border')} />

		<BoxControl label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} className='mt10' values={tooltip[device].radius} resetValues={{ left: '3px', right: '3px', top: '3px', bottom: '3px', }} onChange={(value) => updateObj('tooltip', value, device, 'radius')} />

		<ShadowControl label={__('Shadow', 'b-blocks')} value={tooltip.shadow} onChange={(value) => updateObj('tooltip', value, 'shadow')} />
	</PanelBody>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(TooltipStyle);
