import { useState } from 'react';
import { __ } from "@wordpress/i18n";
import { PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from "@wordpress/components";

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';

const IconStyle = (props) => {
  const { attributes, updateObj } = props;
  const { styles } = attributes;
  const { icon } = styles;
  const [normal, setNormal] = useState('normal');
  return <PanelBody title={__('Icon Style', 'b-blocks')} className='bPlPanelBody' initialOpen={true}>

    <ColorControl label={__('Icon Color', 'b-blocks')} value={icon.color} onChange={(val) => updateObj('styles', val, 'icon', 'color')} />

    <Background label={__('Background', 'b-blocks')} value={icon.bg} onChange={(val) => updateObj('styles', val, 'icon', 'bg')} />

    <ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={val => setNormal(val)}>
      <ToggleGroupControlOption label="Normal" value="normal" />
      <ToggleGroupControlOption label="Hover" value="hover" />
    </ToggleGroupControl>

    <RangeControl label={__('Rotate', 'b-blocks')} value={icon[normal].rotate} onChange={(val) => updateObj('styles', val, 'icon', normal, 'rotate')} max={360} />

    {normal === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} value={icon.hover.transition} onChange={(val) => updateObj('styles', val, 'icon', 'hover', 'transition')} step={0.05} max={10} />}

  </PanelBody>
};

export default IconStyle;