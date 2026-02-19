import { useState } from 'react';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const TabsSubTitleStyle = ({ attributes, updateObj }) => {
  const [active, setActive] = useState('normal');
  const [normal, setNormal] = useState('normal');

  const { styles } = attributes;

  const { tabSubTitle } = styles;


  return <PanelBody className='bPlPanelBody' title={__('Tabs SubTitle', 'b-blocks')} initialOpen={false}>

    <Typography label={__('Typography', 'b-blocks')} value={tabSubTitle.typography} onChange={val => updateObj('styles', val, 'tabSubTitle', 'typography')} />

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

    <ColorControl label={__('Color', 'b-blocks')} value={tabSubTitle[active][normal].color} onChange={val => updateObj('styles', val, 'tabSubTitle', active, normal, 'color')} />

  </PanelBody>

};

export default TabsSubTitleStyle;