import { useState } from 'react';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';

const TabsIconStyle = ({ attributes, updateObj, device }) => {
  const [active, setActive] = useState('normal');
  const [normal, setNormal] = useState('normal');
  const { styles } = attributes;
  const { icon } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Tabs Icon', 'b-blocks')} initialOpen={false}>

    <UnitControl label={<Flex>{__('Size', 'b-blocks')}<Device /></Flex>} labelPosition='edge' value={icon[device].size} onChange={val => updateObj('styles', val, 'icon', device, 'size')} />

    <Label>{__('Icon Position', 'b-blocks')}<Device /></Label>
    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={icon[device].position} onChange={(val) => updateObj('styles', val, 'icon', device, 'position')}>
      <ToggleGroupControlOption label='Top' value='column' />
      <ToggleGroupControlOption label='Bottom' value='column-reverse' />
      <ToggleGroupControlOption label='Left' value='row' />
      <ToggleGroupControlOption label='Right' value='row-reverse' />
    </ToggleGroupControl>

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={active} onChange={(val) => {
      setActive(val)
      setNormal('normal')
    }}>
      <ToggleGroupControlOption label='Default' value='normal' />
      <ToggleGroupControlOption label='Active' value='active' />
    </ToggleGroupControl>

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => setNormal(val)}>
      <ToggleGroupControlOption label='Normal' value='normal' />
      <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>

    <BoxControl className='mt10' label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={icon[active][normal][device].margin} onChange={val => updateObj('styles', val, 'icon', active, normal, device, 'margin')} />
    
    <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device/></Flex>} values={icon[active][normal][device].padding} onChange={val => updateObj('styles', val, 'icon', active, normal, device, 'padding')} />
    
    <ColorControl className="mt10" label={__('Color', 'b-blocks')} value={icon[active][normal].color} onChange={val => updateObj('styles', val, 'icon', active, normal, 'color')} />

    <Background label={__('Background', 'b-blocks')} value={icon[active][normal].bg} onChange={val => updateObj('styles', val, 'icon', active, normal, 'bg')} />
    
    <BorderBoxControl label={__('Border', 'b-blocks')} value={icon[active][normal].border} onChange={val => updateObj('styles', val, 'icon', active, normal, 'border')} />
    
    <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={icon[active][normal][device].radius} onChange={val=>updateObj('styles',val,'icon',active,normal,device,'radius')} />

  </PanelBody>
};

export default TabsIconStyle;