import { BorderBoxControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';
import { withSelect } from '@wordpress/data';

const MarkerStyle = (props) => {
  const { attributes, updateObj,device } = props;
  const { styles, marker: markerMain } = attributes;
  const { markerType } = markerMain;
  const { marker } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Marker Style','b-blocks')} initialOpen={false}>
    {markerType !== 'emoji' && <ColorControl label={__('Color', 'b-blocks')} value={marker.color} onChange={val => updateObj('styles', val, 'marker', 'color')} />}

    {(markerType !== 'icon' && markerType !== 'emoji') && <Flex className='mt10'>
      <Label className='mt0 flex1'>{__('Marker Size', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={marker.size} onChange={val => updateObj('styles', val, 'marker', 'size')} />
    </Flex>}

    {(markerType === 'icon' || markerType === 'emoji') && <Flex className='mt10'>
      <Label className='mt0 flex1'>{__('Icon/Emoji Size', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={marker.iconSize} onChange={val => updateObj('styles', val, 'marker', 'iconSize')} />
    </Flex>}

    <Flex className='mt10'>
      <Label className='mt0 flex1'>{__('Gap', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={marker.gap} onChange={val => updateObj('styles', val, 'marker', 'gap')} />
    </Flex>
    
    {
      markerType === 'icon' && <>
        <Background className='mt10' label={__('Background', 'b-blocks')} value={marker.bg} onChange={val => updateObj('styles', val, 'marker', 'bg')} isImage={false} />

        <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={marker[device].padding} onChange={val => updateObj('styles', val,'marker', device, 'padding')} />

        <BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={marker.border} onChange={val => updateObj('styles', val, 'marker', 'border')} />

        <BoxControl className='mt10' label={<Flex>{__('Radius', 'b-blocks')} <Device /></Flex>} values={marker[device].radius} onChange={val => updateObj('styles', val, 'marker', device, 'radius')} />
      </>
    }
  </PanelBody>
}

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
      device: getDeviceType()?.toLowerCase(),
    };
})(MarkerStyle);