import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalUnitControl as UnitControl, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { useState } from 'react';
import { BoxControl, Device, Label } from '../../../../../../../bpl-tools/Components';

import { Flex } from '@wordpress/components';
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from '../../../../utils/icons';
import { BorderBoxControl } from '@wordpress/components';

const TableStyleOptions = (props) => {

  const [normal, setNormal] = useState('normal');

  const { attributes, updateObj, device } = props;

  const { styles } = attributes;
  const { content } = styles;
  return <PanelBody className='bPlPanelBody' title={__('Table Style', 'b-blocks')} initialOpen={true}>

    <Flex align='center'>
      <Label className="mb0 flex2" >{__('Width', 'b-blocks')} <Device /></Label>
      <UnitControl className='flex1' value={content.width[device]} onChange={val => updateObj('styles', val, 'content', 'width', device)} />
    </Flex>

    <Flex align="center" className="mt10">
      <Label className='flex1'>{<Flex justify='flex-start'>{__('Alignment ', 'b-blocks')} <Device /></Flex>}</Label>
      <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={content.align[device]} onChange={(val) => updateObj('styles', val, 'content', 'align', device)}>

        <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon style={{ rotate: '-90deg' }} />} />
        <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon style={{ rotate: '-90deg' }} />} />
        <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon style={{ rotate: '-90deg' }} />} />

      </ToggleGroupControl>
    </Flex>


    <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => {
      setNormal(val)
    }}>
      <ToggleGroupControlOption label='Normal' value='normal' />
      <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>

    <BorderBoxControl className="mt10" label={__('Border', 'border')} value={content[normal].border} onChange={val => updateObj('styles', val, 'content', normal, 'border')} />
    <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={content[normal].radius[device]} onChange={val => updateObj('styles', val, 'content', normal, 'radius', device)} />

    {
      normal === 'hover' && <RangeControl
        className='mt10'
        label={__('Transition', 'b-blocks')}
        value={content.normal.transition}
        step={0.05}
        min={0}
        max={5}
        onChange={val => updateObj('styles', val, 'content', 'normal', 'transition')}
      />
    }
  </PanelBody>
};

export default TableStyleOptions;