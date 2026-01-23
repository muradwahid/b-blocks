import { Flex, PanelBody, SelectControl, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { CenterIcon, LeftIcon, RightIcon } from '../../../../utils/icons';
import { scrollTypeOptions } from '../../../../utils/options';

const ScrollSettings = (props) => {
  const { attributes, updateObj, device } = props;
  const { scroll, icon } = attributes;

  return <PanelBody title={__('Scroll To Top', 'b-blocks')} className='bPlPanelBody' initialOpen={true}>
    <Flex align="center">
    <Label className='flex1'>{<Flex>{__('Alignment', 'lists')} <Device /></Flex>}</Label>
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={scroll[device].align} onChange={(val) => updateObj('scroll', val, device, 'align')}>
        <ToggleGroupControlOptionIcon label="Left" value="flex-start" icon={LeftIcon} />
        <ToggleGroupControlOptionIcon label="Center" value="center" icon={CenterIcon} />
        <ToggleGroupControlOptionIcon label="Right" value="flex-end" icon={RightIcon} />
      </ToggleGroupControl>
    </Flex>

    <SelectControl className='mt10' label={__('Scroll Type', 'b-blocks')} labelPosition='edge' options={scrollTypeOptions} value={scroll.scrollType} onChange={(val) => updateObj('scroll', val, 'scrollType')} />
    
    {scroll.scrollType === 'text' && <TextControl className='mt10' label={__('Scroll Text', 'b-blocks')} value={icon.text} onChange={(val) => updateObj('icon', val, 'text')} />}
    
  </PanelBody>;
}
export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })(ScrollSettings);