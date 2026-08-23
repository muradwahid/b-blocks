import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, RangeControl, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';

const FooterStyles = ({ attributes, updateObj, device }) => {
  const [normal, setNormal] = useState('normal');

  const { styles } = attributes;
  const { footer } = styles;

  return <PanelBody className='bPlPanelBody' title={__('Footer', 'b-blocks')} initialOpen={false}>

    <Typography value={footer.typography} onChange={val => updateObj('styles', val, 'footer', 'typography') } />

    <BoxControl className='mt10' label={<Flex>{__('Padding','b-blocks')}<Device/></Flex>} value={footer.padding[device]} onChange={val=>updateObj('styles',val,'footer','padding',device)}  />
      

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => {
      setNormal(val)
    }}>
      <ToggleGroupControlOption label='Normal' value='normal' />
      <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>

    <ColorControl label={__('Color','b-blocks')} value={footer[normal].color} onChange={val=>updateObj('styles',val,'footer',normal,'color')} />
    
    <Background label={__('Background','b-blocks')} value={footer[normal].bg} onChange={val=>updateObj('styles',val,'footer',normal,'bg')} />
    
    { 
      normal==='hover' && <RangeControl className='mt10' label={__('Transition','b-blocks')} value={footer.normal.transition} step={0.05} min={0} max={5} onChange={val=>updateObj('styles',val,'footer','normal','transition')} />
    }

  </PanelBody>
};

export default FooterStyles;