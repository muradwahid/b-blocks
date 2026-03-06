import { Flex, PanelBody, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, BorderBoxControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';

import { useState } from 'react';

const NavigationStyles = ({ attributes, updateObj, device }) => {
  const { styles } = attributes;
  const { navigation } = styles;

  const [normal, setNormal] = useState('normal');

  return <PanelBody className='bPlPanelBody' title={__('Navigation', 'b-blocks')} initialOpen={true}>
    <Flex>
      <Label className='mb0 flex3'>{__('Size', 'b-blocks')}<Device /></Label>
      <UnitControl className='flex1' value={navigation[device].arrow.size} onChange={val => updateObj('styles', val, 'navigation', device, 'arrow', 'size')} />
    </Flex>

    <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={navigation[device].padding} onChange={val => updateObj('styles', val, 'navigation', device, 'padding')} />

    <ToggleGroupControl className='flex1 mt10' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={normal} onChange={setNormal}>
      <ToggleGroupControlOption label="Normal" value="normal" />
      <ToggleGroupControlOption label="Hover" value="hover" />
    </ToggleGroupControl>

    <ColorControl label={__("Color", "b-blocks")} value={navigation[normal].color} onChange={val => updateObj('styles', val, 'navigation', normal, 'color')} />

    <Background label={__('Background', 'b-blocks')} value={navigation[normal].bg} onChange={val => updateObj('styles', val, 'navigation', normal, 'bg')} isImage={false} />
    
    <BorderBoxControl label={__('Border', 'b-blocks')} value={navigation[normal].border} onChange={val => updateObj('styles', val, 'navigation', normal, 'border')} />
    
    <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')}<Device/></Flex>} values={navigation[normal][device].radius} onChange={val => updateObj('styles', val, 'navigation', normal, device, 'radius')} />
    
    {normal==='hover' &&  <RangeControl className='mt10' label={__('Transition', 'b-blocks')} value={navigation.hover.transition} onChange={val => updateObj('styles', val, 'navigation', 'hover', 'transition')} min={0} max={10} step={0.01} />}

  </PanelBody>
};

export default NavigationStyles;