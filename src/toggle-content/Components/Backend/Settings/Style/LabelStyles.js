import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const LabelStyles = (props) => {
  const { attributes, updateObj } = props;
  const { styles } = attributes;
  const { label } = styles;

  const [active, setActive] = useState('inactive');
  
  return <PanelBody className='bPlPanelBody' title={__('Label Styles', 'b-blocks')} initialOpen={false}>
    <Typography value={label.typo} onChange={val=>updateObj('styles', val, 'label', 'typo')} />
          <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={active} onChange={(val) => setActive(val)} >
            <ToggleGroupControlOption label='Normal' value='inactive' />
            <ToggleGroupControlOption label='Active' value='active' />
    </ToggleGroupControl>

    <ColorControl label={__('Left Label Color', 'b-blocks')} value={label[active].first.color} onChange={val => updateObj('styles', val, 'label', active, 'first', 'color')} />
    <ColorControl label={__('Right Label Color', 'b-blocks')} value={label[active].second.color} onChange={val => updateObj('styles', val, 'label', active, 'second', 'color')} />
    </PanelBody>
};

export default LabelStyles;