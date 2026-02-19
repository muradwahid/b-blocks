import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

const BreadCrumbStyles = ({ attributes, updateObj, device }) => {
  const { styles } = attributes;
  const { crumbs } = styles;

  const [crumbsType, setCrumbsType] = useState('normal');

  return <PanelBody className='bPlPanelBody' title={__('Breadcrumb Styles', 'b-blocks')} initialOpen={true}>
    <Typography value={crumbs.typo} onChange={(val) => updateObj('styles', val, 'crumbs', 'typo')} />

    <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={crumbsType} onChange={(val) => setCrumbsType(val)} isDeselectable >
      <ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
      <ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
      <ToggleGroupControlOption label={__('Active', 'b-blocks')} value='active' />
    </ToggleGroupControl>

    <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={crumbs[crumbsType][device].padding} onChange={(val) => updateObj('styles', val, 'crumbs', crumbsType, device, 'padding')} />

    <ColorControl label={__('Color', 'b-blocks')} value={crumbs[crumbsType].color} onChange={(val) => updateObj('styles', val, 'crumbs', crumbsType, 'color')} />

    <Background isImage={false} label={__('Background', 'b-blocks')} value={crumbs[crumbsType].bg} onChange={(val) => updateObj('styles', val, 'crumbs', crumbsType, 'bg')} />

    <ShadowControl label={__('Shadow', 'b-blocks')} values={crumbs[crumbsType].shadow} onChange={(val) => updateObj('styles', val, 'crumbs', crumbsType, 'shadow')} />

    <BorderBoxControl label={__('Border', 'b-blocks')} value={crumbs[crumbsType].border} onChange={(val) => updateObj('styles', val, 'crumbs', crumbsType, 'border')} />

    <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={crumbs[crumbsType][device].radius} onChange={(val) => updateObj('styles', val, 'crumbs', crumbsType, device, 'radius')} />

    {crumbsType === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} min={0} max={5} step={0.01} value={crumbs.hover.transition} onChange={(val) => updateObj('styles', val, 'crumbs', 'hover', 'transition')} />}

  </PanelBody>
};

export default BreadCrumbStyles;