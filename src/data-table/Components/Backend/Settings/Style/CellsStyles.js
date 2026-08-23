import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { Flex, BorderBoxControl, RangeControl } from '@wordpress/components';

const CellsStyles = ({ attributes, updateObj, device }) => {
  const [normal, setNormal] = useState('normal');
  
  const { styles } = attributes;
  const { cells } = styles;

  return <PanelBody className='bPlPanelBody' title={__('Cells', 'b-blocks')} initialOpen={false}>

    <BoxControl label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={cells[device].padding} onChange={val => updateObj('styles', val, 'cells', device, 'padding')} />

    <Typography value={cells.typography} onChange={val => updateObj('styles', val, 'cells', 'typography')} />

    <BorderBoxControl label={__('Border', 'b-blocks')} onChange={val => updateObj('styles', val, 'cells', 'border')} values={cells.border} />
    
    <BoxControl className='mt10' label={<Flex>{__('Border Radius', 'b-blocks')}<Device /></Flex>} values={cells[device].radius} onChange={val => updateObj('styles', val, 'cells', device, 'radius')} />


              <ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={normal} onChange={(val) => {
                setNormal(val)
              }}>
                <ToggleGroupControlOption label='Normal' value='normal' />
                <ToggleGroupControlOption label='Hover' value='hover' />
    </ToggleGroupControl>  
    
    <ColorControl label={__('Odd Row Text Color', 'b-blocks')} value={cells.oddCell[normal].color} onChange={val => updateObj('styles', val, 'cells', 'oddCell', normal, 'color')} />

    <Background label={__('Odd Row Background', 'b-blocks')} value={cells.oddCell[normal].bg} onChange={val => updateObj('styles', val, 'cells', 'oddCell', normal, 'bg')} />
    
    <ColorControl label={__('Even Row Text Color', 'b-blocks')} value={cells.evenCell[normal].color} onChange={val => updateObj('styles', val, 'cells', 'evenCell', normal, 'color')} />

    <Background label={__('Even Row Background', 'b-blocks')} value={cells.evenCell[normal].bg} onChange={val => updateObj('styles', val, 'cells', 'evenCell', normal, 'bg')} />
    
    {
      normal==='hover' && <RangeControl className='mt10' label={__('Transition', 'b-blocks')} value={cells.oddCell.normal.transition} step={0.05} min={0} max={5} onChange={val=>updateObj('styles',val,'cells','oddCell','normal','transition')} />
    }

  </PanelBody>
};

export default CellsStyles;