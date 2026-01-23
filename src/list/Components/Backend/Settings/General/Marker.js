import { Flex, PanelBody, SelectControl, TextControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n';

import { Label } from '../../../../../../../bpl-tools/Components';

import { markerOptions } from '../../../../utils/options'

const Marker = (props) => {
  const { attributes, updateObj } = props;
  const { marker } = attributes;
  const { markerType} = marker;
  const i18n = (label) => __(label, 'b-blocks');
  return <PanelBody className='bPlPanelBody' title={__('Marker', 'b-blocks')} initialOpen={false}>
    <Flex align='center'>
      <Label className='flex1 mt0'>{i18n('Marker Type')}</Label>
      <SelectControl className='flex1' options={markerOptions} value={markerType} onChange={(val)=>updateObj('marker', val, 'markerType')} />
    </Flex>

    {/* { 
      markerType === 'icon' && <>
        <Flex align='center' className='mt10'>
          <Label className='flex1'>{i18n('Icon Alignment')}</Label>
          <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={align} onChange={(val) => updateObj('marker', val, 'align')} >
            <ToggleGroupControlOptionIcon label="Top" value="top" icon={VerticalTopIcon} />
            <ToggleGroupControlOptionIcon label="Center" value="center" icon={VerticalCenterIcon} />
            <ToggleGroupControlOptionIcon label="Bottom" value="bottom" icon={VerticalBottomIcon} />
          </ToggleGroupControl>
        </Flex>
      </>
    } */}

   {markerType==='emoji' && <TextControl label={i18n('Emoji')} value={marker.emoji} onChange={(val) => updateObj('marker', val, 'emoji')} />}
	</PanelBody>
}
export default Marker