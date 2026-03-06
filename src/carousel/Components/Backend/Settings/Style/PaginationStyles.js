import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl, Flex, BorderBoxControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { BoxControl, ColorControl, Label } from '../../../../../../../bpl-tools/Components';

const PaginationStyles = ({ attributes, updateObj }) => {
  const { styles } = attributes;
  const { pagination } = styles;

  const [normal, setNormal] = useState('normal');

  return <PanelBody className='bPlPanelBody' title={__('Pagination', 'b-blocks')} initialOpen={false}>
    <ToggleGroupControl className='flex1' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={normal} onChange={setNormal}>
      <ToggleGroupControlOption label="Normal" value="normal" />
      <ToggleGroupControlOption label="Active" value="active" />
    </ToggleGroupControl>

    <ColorControl label={__('Color', 'b-blocks')} value={pagination[normal].color} onChange={val => updateObj('styles', val, 'pagination', normal, 'color')} />

    <Flex className='mt10'>
      <Label className='mb0 flex3'>{__('Width', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={pagination[normal].width} onChange={val => updateObj('styles', val, 'pagination', normal, 'width')} />
    </Flex>

    <Flex className='mt10'>
      <Label className='mb0 flex3'>{__('Height', 'b-blocks')}</Label>
      <UnitControl className='flex1' value={pagination[normal].height} onChange={val => updateObj('styles', val, 'pagination', normal, 'height')} />
    </Flex>

    <BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={pagination[normal].border} onChange={val => updateObj('styles', val, 'pagination', normal, 'border')} />

    <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} value={pagination[normal].radius} onChange={val => updateObj('styles', val, 'pagination', normal, 'radius')} />

    {normal === 'active' && <RangeControl className='mt10' label={__('Transition', 'b-blocks')} value={pagination.active.transition} onChange={val => updateObj('styles', val, 'pagination', 'active', 'transition')} min={0} max={10} step={0.01} />}

  </PanelBody>
};

export default PaginationStyles;