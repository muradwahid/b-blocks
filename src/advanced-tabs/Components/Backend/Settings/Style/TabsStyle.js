import { useState } from 'react';
import { BorderBoxControl, Flex, PanelBody,  RangeControl,  __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, Device } from '../../../../../../../bpl-tools/Components';

const TabsStyle = ({ attributes, updateObj, device }) => {
  const [active, setActive] = useState('normal');
  const [normal, setNormal] = useState('normal');

  const { styles } = attributes;

  const { tabs } = styles;


  return <PanelBody className='bPlPanelBody' title={__('Tabs', 'b-blocks')} initialOpen={false}>

    <UnitControl label={<Flex>{__('Tabs Gap', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={tabs[device].gap} onChange={val => updateObj('styles', val,'tabs', device, 'gap')} />

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={active} onChange={(val) => {
      setActive(val)
      setNormal('normal')
    }}>
          <ToggleGroupControlOption label='Default' value='normal' />
          <ToggleGroupControlOption label='Active' value='active' />
    </ToggleGroupControl>

    <ToggleGroupControl  className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => setNormal(val)}>
          <ToggleGroupControlOption label='Normal' value='normal' />
          <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>
    
    <BoxControl className='mt10' label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>} values={tabs[active][normal][device].margin} onChange={val => updateObj('styles', val, 'tabs', active, normal, device, 'margin')} />
    
    <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')} <Device/></Flex>} values={tabs[active][normal][device].padding } onChange={val=>updateObj('styles',val,'tabs',active,normal,device,'padding')} />

    <Background label={__('Background', 'b-blocks')} value={tabs[active][normal].bg} onChange={val=>updateObj('styles',val,'tabs',active,normal,'bg')}  />
    

    <BorderBoxControl label={__('Border','b-blocks')} value={tabs[active][normal].border} onChange={val=>updateObj('styles',val,'tabs',active,normal,'border')} />

    <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')} <Device/></Flex>} values={tabs[active][normal][device].radius} onChange={val=>updateObj('styles',val,'tabs',active,normal,device,'radius')} />

    {
      normal === 'hover' && <RangeControl className='mt10' label={__('Transition', 'b-blocks')} min={0} max={5} step={0.01} value={tabs.normal.hover.transition} onChange={val=>updateObj('styles',val,'tabs','normal','hover','transition')} />
    }
    </PanelBody>
};

export default TabsStyle;