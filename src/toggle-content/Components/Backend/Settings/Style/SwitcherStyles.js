import { PanelBody, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Background, Label } from '../../../../../../../bpl-tools/Components';

const SwitcherStyles = (props) => {
  const { attributes, updateObj } = props;
  const { styles } = attributes;
  const { toggle } = styles;
  const [active, setActive] = useState('inactive');
  return <PanelBody className='bPlPanelBody' title={__('Switcher', 'b-blocks')} initialOpen={false}>
    <Flex align='center'>
      <Label className='flex2 mb0'>{__('Width', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={toggle?.width} onChange={(val) => updateObj('styles', val, 'toggle', 'width')} />
    </Flex>

    <Flex align='center' className="mt10">
      <Label className='flex2 mb0'>{__('Height', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={toggle?.height} onChange={(val) => updateObj('styles', val, 'toggle', 'height')} />
    </Flex>

    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={active} onChange={(val) => setActive(val)} >
      <ToggleGroupControlOption label='Normal' value='inactive' />
      <ToggleGroupControlOption label='Active' value='active' />
    </ToggleGroupControl>

    <Background label={__('Color', 'b-blocks')} value={toggle[active].color} onChange={val => updateObj('styles', val, 'toggle', active, 'color')} isImage={false} />

    <Background label={__('Background', 'b-blocks')} value={toggle[active].bg} onChange={val => updateObj('styles', val, 'toggle', active, 'bg')} />

  </PanelBody>
};

export default SwitcherStyles;