import { Flex, PanelBody, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,__experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { CenterIcon, LeftIcon, RightIcon } from '../../../../utils/icons';

const BreadCrumbOptions = (props) => {
  const { attributes, updateObj, device } = props;
  const { styles, home, options } = attributes;
  const { crumbs } = styles;


  return <PanelBody className='bPlPanelBody' title={__('BreadCrumb', 'b-blocks')} initialOpen={true}>
    <Flex className='mt10'>
      <Label className='flex1 mb0'>{__('Alignment', 'b-blocks')}<Device /></Label>
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={crumbs?.[device]?.align} onChange={(val) => updateObj('styles', val, 'crumbs',device, 'align')} isDeselectable size="small" style={{ padding: '2px' }} >
        <ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='start' icon={LeftIcon} />
        <ToggleGroupControlOptionIcon label={__('Center', 'b-blocks')} value='center' icon={CenterIcon} />
        <ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='end' icon={RightIcon} />
      </ToggleGroupControl>
    </Flex>

    <Flex className='mt10'>
      <Label className='flex2 mb0'>{__('Gap', 'b-blocks')}<Device /></Label>
      <UnitControl className='flex1' value={crumbs?.[device]?.gap} onChange={(val) => updateObj('styles', val, 'crumbs',device, 'gap')} />
    </Flex>

    <ToggleControl className='mt10' label={__('Show Home Page', 'b-blocks')} checked={options?.isHomeShow} onChange={(val) => updateObj('options', val, 'isHomeShow')} />
    
    {options?.isHomeShow && <TextControl className='mt10' label={__('Home Label', 'b-blocks')} value={home?.label} onChange={(val) => updateObj('home', val, 'label')} />}
    </PanelBody>
};

export default BreadCrumbOptions;