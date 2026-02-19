import { PanelBody, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon, AlignStretchIcon, ArrowBarToDown, ArrowBarToLeft, ArrowBarToRight, ArrowBarToUp, CenterIcon, LeftIcon, NoWrapIcon, RightIcon, WrapIcon, WrapReverseIcon } from '../../../../utils/icons';

const TabsSettings = (props) => {
  const { attributes, updateObj, device } = props;
  const { tabs, styles } = attributes;
  const { tabs: tabStyle, content } = styles;

  const layoutVal = ['row', 'row-reverse'];
  const columnVal = ['column', 'column-reverse'];

  return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
    <Flex className='mt10'>
      <Label className='flex1 mb0'>{__('Layout', 'b-blocks')}<Device /></Label>
      <ToggleGroupControl style={{ padding: '2px' }} className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={tabs?.[device]?.direction} onChange={(val) => { updateObj('tabs', val, device, 'direction') }} size='small'>
        <ToggleGroupControlOptionIcon label='Top' value='column' icon={ArrowBarToUp} />
        <ToggleGroupControlOptionIcon label='Bottom' value='column-reverse' icon={ArrowBarToDown} />
        <ToggleGroupControlOptionIcon label='Right' value='row-reverse' icon={ArrowBarToRight} />
        <ToggleGroupControlOptionIcon label='Left' value='row' icon={ArrowBarToLeft} />
      </ToggleGroupControl>
    </Flex>

    {columnVal.includes(tabs?.[device]?.direction) && <Flex align="center" className="mt10">
      <Label className='flex1'>{<Flex justify='flex-start'>{__('Justify ', 'b-blocks')} <Device /></Flex>}</Label>
      <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={tabs[device]?.columnJustify} onChange={(val) => updateObj('tabs', val, device, 'columnJustify')}>

        <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon style={{ rotate: '-90deg' }} />} />
        <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon style={{ rotate: '-90deg' }} />} />
        <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon style={{ rotate: '-90deg' }} />} />
        <ToggleGroupControlOptionIcon label="Stretch" value="stretch" icon={<AlignStretchIcon style={{ rotate: '-90deg' }} />} />

      </ToggleGroupControl>
    </Flex>}
    {layoutVal.includes(tabs?.[device]?.direction) && <Flex align="center" className="mt10">
      <Label className='flex1'>{<Flex justify='flex-start'>{__('Justify ', 'b-blocks')} <Device /></Flex>}</Label>
      <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={tabs[device]?.rowJustify} onChange={(val) => updateObj('tabs', val, device, 'rowJustify')}>

        <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon />} />
        <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon />} />
        <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon />} />
        <ToggleGroupControlOptionIcon label="Stretch" value="stretch" icon={<AlignStretchIcon />} />

      </ToggleGroupControl>
    </Flex>}

    <Flex className='mt10'>
      <Label className='flex1 mb0'>{__('Tab Content Alignment', 'b-blocks')}<Device /></Label>
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={tabs?.[device]?.contentAlign} onChange={(val) => updateObj('tabs', val, device, 'contentAlign')} isDeselectable size="small" style={{ padding: '2px' }} >
        <ToggleGroupControlOptionIcon label='Left' value='start' icon={LeftIcon} />
        <ToggleGroupControlOptionIcon label='Center' value='center' icon={CenterIcon} />
        <ToggleGroupControlOptionIcon label='Right' value='end' icon={RightIcon} />
      </ToggleGroupControl>
    </Flex>

    {columnVal.includes(tabs?.[device]?.direction) && <Flex className='mt10'>
      <Label className='flex1 mb0'>{__('Wrap', 'b-blocks')}<Device /></Label>
      <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={tabs?.[device]?.wrap} onChange={(val) => updateObj('tabs', val, device, 'wrap')} isDeselectable style={{ padding: '2px' }} >
        <ToggleGroupControlOptionIcon label='Wrap' value='wrap' icon={<WrapIcon />} />
        <ToggleGroupControlOptionIcon label='No Wrap' value='nowrap' icon={<NoWrapIcon />} />
        <ToggleGroupControlOptionIcon label='Wrap Reverse' value='wrap-reverse' icon={<WrapReverseIcon />} />
      </ToggleGroupControl>
    </Flex>}

    {layoutVal.includes(tabs?.[device]?.direction) && <>

      <Flex className='mt10'>
        <Label className="mb0 flex3">{__('Tabs Menu Width', 'b-blocks')}<Device /></Label>
        <UnitControl className="flex1" value={tabStyle[device].width} onChange={val => updateObj('styles', val, 'tabs', device, 'width')} />
      </Flex>

      <Flex className='mt10'>
        <Label className="mb0 flex3">{__('Content Width', 'b-blocks')}<Device /></Label>
        <UnitControl className="flex1" value={content[device].width} onChange={val => updateObj('styles', val, 'content', device, 'width')} />
      </Flex>
    </>
    }
  </PanelBody>
};

export default TabsSettings;