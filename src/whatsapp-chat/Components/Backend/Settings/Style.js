import { PanelBody, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { BoxControl, ColorControl, Device, ShadowControl, Typography, Background } from '../../../../../../bpl-tools/Components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { BorderBoxControl } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';

const Style = (props) => {
  const { attributes, updateObj, device } = props;
  const { styles, pulseAnimation, showIcon, showStatusDot } = attributes;

  const [hoverState, setHoverState] = useState('normal');
  const [iconHoverState, setIconHoverState] = useState('normal');


  return <>
    <PanelBody title="Style" initialOpen={true} className='bPlPanelBody'>

      <BoxControl label={<Flex>{__('Margin', 'b-blocks')}<Device /></Flex>} values={styles[device].margin} onChange={val => updateObj('styles', val, device, 'margin')} />

      <BoxControl className='mt10' label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={styles[device].padding} onChange={val => updateObj('styles', val, device, 'padding')} />

      {pulseAnimation && <ColorControl label={__('Pulse Color', 'b-blocks')} value={styles.pulseColor} onChange={val => updateObj('styles', val, 'pulseColor')} />}

      <Typography value={styles.typo} onChange={val => updateObj('styles', val, 'typo')} />

      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={hoverState} onChange={(val) => setHoverState(val)} isDeselectable >
        <ToggleGroupControlOption label='Normal' value='normal' />
        <ToggleGroupControlOption label='Hover' value='hover' />
      </ToggleGroupControl>

      <Background value={styles[hoverState].bg} onChange={val => updateObj('styles', val, hoverState, 'bg')} />

      <ColorControl label={__('Text Color', 'b-blocks')} value={styles[hoverState].color} onChange={val => updateObj('styles', val, hoverState, 'color')} />

      <BorderBoxControl label={__('Border', 'b-blocks')} values={styles[hoverState].border} onChange={val => updateObj('styles', val, hoverState, 'border')} />

      <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={styles[hoverState].radius} onChange={val => updateObj('styles', val, hoverState, 'radius')} />

      <ShadowControl label={__('Box Shadow', 'b-blocks')} values={styles[hoverState].shadow} onChange={val => updateObj('styles', val, hoverState, 'shadow')} />

      {
        hoverState === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} min={0} max={5000} step={0.01} value={styles.hover.transition} onChange={val => updateObj('styles', val, 'hover', 'transition')} />
      }

    </PanelBody>

    {showIcon && <PanelBody title="Icon" initialOpen={false} className='bPlPanelBody'>
      <UnitControl label={__('Icon Size', 'b-blocks')} value={styles.icon.size} onChange={val => updateObj('styles', val, 'icon', 'size')} />
      <br />
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={iconHoverState} onChange={(val) => setIconHoverState(val)} isDeselectable >
        <ToggleGroupControlOption label='Normal' value='normal' />
        <ToggleGroupControlOption label='Hover' value='hover' />
      </ToggleGroupControl>

      <ColorControl label={__('Icon Color', 'b-blocks')} value={styles.icon[iconHoverState].color} onChange={val => updateObj('styles', val, 'icon', iconHoverState, 'color')} />

    </PanelBody>}

    {showStatusDot && <PanelBody title="Status" initialOpen={false} className='bPlPanelBody'>
      <UnitControl label={__('Status Size', 'b-blocks')} value={styles.status.size} onChange={val => updateObj('styles', val, 'status', 'size')} />

      <Background isImage={false} label={__('Status Color', 'b-blocks')} value={styles.status.color} onChange={val => updateObj('styles', val, 'status', 'color')} />

      <UnitControl label={__('Position X', 'b-blocks')} value={styles.status.position.x} onChange={val => updateObj('styles', val, 'status', 'position', 'x')} />

      <UnitControl className='mt10' label={__('Position Y', 'b-blocks')} value={styles.status.position.y} onChange={val => updateObj('styles', val, 'status', 'position', 'y')} />

    </PanelBody>}
  </>
};

export default Style;