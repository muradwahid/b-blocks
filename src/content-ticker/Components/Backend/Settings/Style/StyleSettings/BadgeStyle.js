import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../../bpl-tools/Components';

const BadgeStyle = ({ attributes, updateObj, device }) => {
	const { badge } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Badge Style', 'b-blocks')} initialOpen={true}>

		<UnitControl label={<Flex>{__('Width', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={badge[device].width} onChange={(value) => updateObj('badge', value, device, 'width')} />

		<UnitControl className='mt10' label={<Flex>{__('Height', 'b-blocks')} <Device /></Flex>} value={badge[device].height} labelPosition='edge' onChange={(value) => updateObj('badge', value, device, 'height')} />

		<Background label={__('Background', 'b-blocks')} value={badge.color.bg} onChange={(value) => updateObj('badge', value, 'color', 'bg')} defaults={{ color: '#0e0e0e' }} />

		<ColorControl label={__('Color', 'b-blocks')} value={badge.color.text} onChange={(value) => updateObj('badge', value, 'color', 'text')} default='#00F' />

		<Typography label={__('Typography', 'b-blocks')} value={badge.typography} onChange={(value) => updateObj('badge', value, 'typography')} />

		<BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={badge[device].padding} onChange={(value) => updateObj('badge', value, device, 'padding')} />

		<BoxControl className='mt10' label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={badge[device].margin} onChange={(value) => updateObj('badge', value, device, 'margin')} />

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={badge.border} onChange={(value) => updateObj('badge', value, 'border')} />

		<BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={badge[device].bRadius} onChange={(value) => updateObj('badge', value, device, 'bRadius')} />
	</PanelBody>
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(BadgeStyle);
