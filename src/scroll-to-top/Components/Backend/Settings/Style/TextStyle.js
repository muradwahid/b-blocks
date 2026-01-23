import { useState } from 'react';
import { BorderBoxControl, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Background, BoxControl, ColorControl, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

const TextStyle = (props) => {
  const { attributes, updateObj } = props;
  const { styles } = attributes;
  const { text } = styles;

  const [normal, setNormal] = useState('normal');

  return <PanelBody title={__('Text Style', 'b-blocks')} className='bPlPanelBody' initialOpen={true}>

    <Typography label={__('Typography', 'b-blocks')} value={text.typography} onChange={(val) => updateObj('styles', val, 'text', 'typography')} />
    
    <ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={val => setNormal(val)}>
      <ToggleGroupControlOption label="Normal" value="normal" />
      <ToggleGroupControlOption label="Hover" value="hover" />
    </ToggleGroupControl>

    <ColorControl label={__('Text Color', 'b-blocks')} value={text[normal].color} onChange={(val) => updateObj('styles', val, 'text', normal, 'color')} />
    
    <Background label={__('Background', 'b-blocks')} value={text[normal].bg} onChange={(val) => updateObj('styles', val, 'text',normal,  'bg')} isImage={true} />
    
    <BoxControl label={__('Padding', 'b-blocks')} values={text[normal].padding} onChange={(val) => updateObj('styles', val, 'text', normal, 'padding')} />
    
    <ShadowControl label={__('Shadow', 'b-blocks')} value={text[normal].shadow} onChange={(val) => updateObj('styles', val, 'text', normal, 'shadow')} />

    <BorderBoxControl label={__('Border', 'b-blocks')} value={text[normal].border} onChange={(val) => updateObj('styles', val, 'text', normal, 'border')} />
    
    <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={text[normal].radius} onChange={(val) => updateObj('styles', val,  'text', normal, 'radius')} />

    </PanelBody>
};

export default TextStyle;