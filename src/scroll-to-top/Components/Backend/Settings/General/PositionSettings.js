import { __ } from '@wordpress/i18n';
import { PanelBody,__experimentalUnitControl as UnitControl,__experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, Flex } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

const PositionSettings = (props) => {
  const { attributes, updateObj, device } = props;
  const { scroll } = attributes;

  return <PanelBody title={__('Position', 'b-blocks')} className='bPlPanelBody' initialOpen={false}>
          <ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={scroll.position} onChange={(val) => updateObj('scroll', val, 'position')} isDeselectable>
            <ToggleGroupControlOption label="Bottom Left" value="left" />
            <ToggleGroupControlOption label="Bottom Right" value="right" />
    </ToggleGroupControl>

    {scroll.position === 'right' && <Flex align='center'>
      <Label className='flex2 mt10'>{<Flex>{__('Right', 'b-blocks')} <Device /></Flex>}</Label>
      <UnitControl className='mt10 flex1' value={scroll[device].position.right} onChange={(val) => updateObj('scroll', val,  device,'position', 'right')} /></Flex>}
    
    {scroll.position === 'left' && <Flex align='center'>
      <Label className='flex2 mt10'>{<Flex>{__('Left', 'b-blocks')} <Device /></Flex>}</Label>
      <UnitControl className='mt10 flex1' value={scroll[device].position.left} onChange={(val) => updateObj('scroll', val, device, 'position', 'left')} /></Flex>}

    {(scroll.position === 'left' || scroll.position === 'right') &&    <Flex align='center'>
      <Label className='flex2 mt10'>{<Flex>{__('Bottom', 'b-blocks')} <Device /></Flex>}</Label>
      <UnitControl className='mt10 flex1' value={scroll[device].position.bottom} onChange={(val) => updateObj('scroll', val,device, 'position',  'bottom')} /></Flex>}

    </PanelBody>
};

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })(PositionSettings);