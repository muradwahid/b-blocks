import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../../bpl-tools/Components';

const BadgeStyle = ({ attributes, updateObj, device }) => {
    const { badge } = attributes;

    return <PanelBody className='bPlPanelBody' title={__('Badge Style', 'b-blocks')} initialOpen={true}>

        <UnitControl label={<Flex>{__('Width', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={badge.width[device]} onChange={(value) => updateObj('badge', value, 'width', device)} />

        <UnitControl className='mt10' label={<Flex>{__('Height', 'b-blocks')} <Device /></Flex>} value={badge.height[device]} labelPosition='edge' onChange={(value) => updateObj('badge', value, 'height', device)} />

        <Background label={__('Background', 'b-blocks')} value={badge.color.bg} onChange={(value) => updateObj('badge', value, 'color', 'bg')} defaults={{ color: '#0e0e0e' }} />

        <ColorControl label={__('Color', 'b-blocks')} value={badge.color.text} onChange={(value) => updateObj('badge', value, 'color', 'text')} default='#00F' />

        <Typography label={__('Typography', 'b-blocks')} value={badge.typography} onChange={(value) => updateObj('badge', value, 'typography')} />

        <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={badge.padding[device]} onChange={(value) => updateObj('badge', value, 'padding', device)} />

        <BoxControl className='mt10' label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={badge.margin[device]} onChange={(value) => updateObj('badge', value, 'margin', device)} />

        <BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={badge.border} onChange={(value) => updateObj('badge', value, 'border')} />

        <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={badge.bRadius[device]} onChange={(value) => updateObj('badge', value, 'bRadius', device)} />
    </PanelBody>
};

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(BadgeStyle);
