import { PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Background} from '../../../../../../../bpl-tools/Components';

const BodyStyleOptions = ({ attributes, updateObj }) => {
  const [normal, setNormal] = useState('normal');

  const { styles } = attributes;
  const { body } = styles;

  return <>
    <PanelBody className='bPlPanelBody' title={__('Body', 'b-blocks')} initialOpen={false}>

      <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => {
        setNormal(val)
      }}>
        <ToggleGroupControlOption label='Normal' value='normal' />
        <ToggleGroupControlOption label='Hover' value='hover' />
      </ToggleGroupControl>

      <Background label={__('Background', 'b-blocks')} value={body[normal].bg} onChange={val => updateObj('styles', val, 'body', normal, 'bg')} />

      {normal === 'hover' && <RangeControl label={__('Transition', 'b-blocks')} value={body.normal.transition} onChange={val => updateObj('styles', val, 'body', 'normal', 'transition')} step={0.05} min={0} max={5} />}  

    </PanelBody>
  </>
};

export default BodyStyleOptions;