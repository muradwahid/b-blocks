import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, Flex, RangeControl } from '@wordpress/components';
import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';

const HeaderStyleOptions = (props) => {
  const { attributes, device, updateObj } = props;

  const [normal, setNormal] = useState('normal');

  const { styles } = attributes;
  const { header } = styles;

  return <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={false}>
    
    <Typography value={header.typography} onChange={val => updateObj('styles', val, 'header', 'typography') } />

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => {
      setNormal(val)
    }}>
      <ToggleGroupControlOption label='Normal' value='normal' />
      <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>

    <ColorControl label={__('Color', 'b-blocks')} value={header[normal].color} onChange={val => updateObj('styles', val, 'header', normal, 'color')} />
    
    <Background label={__('Background', 'b-blocks')} value={header[normal].bg} onChange={val => updateObj('styles', val, 'header', normal, 'bg')} />
    
    <BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={header[normal].padding[device]} onChange={val => updateObj('styles', val, 'header', normal, 'padding', device)} />
    
    {
      normal === 'hover' && <RangeControl className='mt10' label={__('Transition', 'b-blocks')} value={header.normal.transition} step={0.05} min={0} max={5} onChange={val=>updateObj('styles',val,'header','transition')} />
    }

	</PanelBody>
};

export default HeaderStyleOptions;