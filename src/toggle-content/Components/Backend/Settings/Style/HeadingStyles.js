import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { useState } from 'react';

const HeadingStyles = (props) => {
  const { attributes, updateObj, device } = props;
  const { styles } = attributes;
  const { header } = styles;

  const [normal, setNormal] = useState('normal');

  return <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={true}>
    <BoxControl values={header[device].padding} label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} onChange={val => updateObj('styles', val, 'header', device, 'padding')} />

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => setNormal(val)} >
      <ToggleGroupControlOption label='Normal' value='normal' />
      <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>

    <Background value={header[normal].bg} onChange={val => updateObj('styles', val, 'header', normal, 'bg')} />
    <BorderBoxControl className="mt10" value={header[normal].border} onChange={val => updateObj('styles', val, 'header', normal, 'border')} />
    <BoxControl values={header[normal][device].radius} className="mt10" label={<Flex>{__('Radius', 'b-blocks')}<Device /></Flex>} onChange={val => updateObj('styles', val, 'header', normal, device, 'radius')} />
  </PanelBody>
};

export default HeadingStyles;