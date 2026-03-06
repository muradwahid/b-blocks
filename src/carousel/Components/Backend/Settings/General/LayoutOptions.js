import { RangeControl, PanelBody, Flex, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from '../../../../utils/icons';

const LayoutOptions = ({ attributes, updateObj, device }) => {
  const {layout, styles } = attributes;
  const { container } = styles;
  
  return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
    <RangeControl label={<Flex>{__('Slide View', 'b-blocks')} <Device /></Flex>} value={layout.slideView[device]} onChange={val=>updateObj('layout',val,'slideView',device)} beforeIcon='grid-view' min={1} max={12} />

    <RangeControl label={<Flex>{__('Slide Gap', 'b-blocks')} <Device /></Flex>}
     value={layout.space[device]} onChange={val=>updateObj('layout',val,'space',device)}  min={0} max={250} />
    
    <Flex>
      <Label className='mb0 flex3'>{__('Width', 'b-blocks')}<Device /></Label>
    <UnitControl className='flex1' labelPosition='edge' value={container[device].width} onChange={val => updateObj('styles', val, 'container', device, 'width')} />
    </Flex>

    <Flex className="mt10">
      <Label className='mb0 flex3'>{__('Height', 'b-blocks')}<Device /></Label>
      <UnitControl className='flex1' labelPosition='edge' value={container[device].height} onChange={val => updateObj('styles', val, 'container', device, 'height')} />
    </Flex>
    
    <Flex align="center" className="mt10">
      <Label className='flex1'>{<Flex justify='flex-start'>{__('Align Items ', 'b-blocks')} <Device /></Flex>}</Label>
      <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={container[device]?.alignItems} onChange={(val) => updateObj('styles', val, 'container', device, 'alignItems')}>

        <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon />} />
        <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon />} />
        <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon />} />

      </ToggleGroupControl>
    </Flex>

    </PanelBody>
};

export default LayoutOptions;