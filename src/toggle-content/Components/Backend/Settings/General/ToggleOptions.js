import { __ } from '@wordpress/i18n';
import { PanelBody, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl, TextControl, SelectControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { CenterIcon, LeftIcon, RightIcon } from '../../../../utils/icons';
import { switchTypeOptions } from '../../../../utils/options';

const ToggleOptions = (props) => {
  const { attributes, updateObj, device } = props;
  const { styles, label: labelContent, toggle:toggleOption } = attributes;
  const { toggle, header, label } = styles;
  return <>
    <PanelBody className='bPlPanelBody' title={__('Toggle', 'b-blocks')} initialOpen={true}>

      <SelectControl label={__('Switch Type', 'b-blocks')} labelPosition='edge' options={switchTypeOptions} value={toggleOption?.switchType} onChange={(val) => updateObj('toggle', val, 'switchType')} />
      
      <Flex className='mt10'>
        <Label className='flex1 mb0'>{__('Alignment', 'b-blocks')}<Device /></Label>
        <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={toggle?.[device]?.align} onChange={(val) => updateObj('styles', val, 'toggle', device, 'align')} isDeselectable >
          <ToggleGroupControlOptionIcon label='Left' value='flex-start' icon={LeftIcon} />
          <ToggleGroupControlOptionIcon label='Center' value='center' icon={CenterIcon} />
          <ToggleGroupControlOptionIcon label='Right' value='flex-end' icon={RightIcon} />
        </ToggleGroupControl>
      </Flex>

      <Flex className='mt10'>
        <Label className='flex1 mb0'>{__('Direction', 'b-blocks')}</Label>
        <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={toggle?.direction} onChange={(val) => updateObj('styles', val, 'toggle', 'direction')} isDeselectable >
          <ToggleGroupControlOption label='Horizontal' value='row' />
          <ToggleGroupControlOption label='Vertical' value='column' />
        </ToggleGroupControl>
      </Flex>

      <Flex align='center' className="mt10">
        <Label className='flex2 mb0'>{__('Heading Gap', 'b-blocks')}<Device /></Label>
        <UnitControl className='flex1' value={header?.[device]?.headingGap} onChange={(val) => updateObj('styles', val, 'header', device, 'headingGap')} />
      </Flex>

      <Flex align='center' className="mt10">
        <Label className='flex2 mb0'>{__('Label Gap', 'b-blocks')}</Label>
        <UnitControl className='flex1' value={label?.[device]?.gap} onChange={(val) => updateObj('styles', val, 'label', device, 'gap')} />
      </Flex>
    </PanelBody>

    <PanelBody className='bPlPanelBody' title={__('Label', 'b-blocks')} initialOpen={false}>
      <TextControl label={__('Left Label', 'b-blocks')} value={labelContent?.left} onChange={(val) => updateObj('label', val, 'left')} />
      <TextControl label={__('Right Label', 'b-blocks')} value={labelContent?.right} onChange={(val) => updateObj('label', val, 'right')} />
    </PanelBody>

  </>
};

export default ToggleOptions;