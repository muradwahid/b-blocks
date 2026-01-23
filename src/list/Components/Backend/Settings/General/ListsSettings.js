import { Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption,__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Device, ItemsPanel, Label } from "../../../../../../../bpl-tools/Components"
import { withSelect } from '@wordpress/data';
import { CenterIcon, JustifyIcon, LeftIcon, RightIcon } from '../../../../utils/icons';
import ItemSettings from './ItemSettings';

const ListsSettings = ({ attributes, updateObj, setAttributes, device }) => {
  const { layout,items } = attributes;
  const newItem = { text: `List Item ${items.length + 1}`, icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M448 128l-177.6 0c1 5.2 1.6 10.5 1.6 16l0 16 32 0 144 0c8.8 0 16-7.2 16-16s-7.2-16-16-16zM224 144c0-17.7-14.3-32-32-32c0 0 0 0 0 0l-24 0c-66.3 0-120 53.7-120 120l0 48c0 52.5 33.7 97.1 80.7 113.4c-.5-3.1-.7-6.2-.7-9.4c0-20 9.2-37.9 23.6-49.7c-4.9-9-7.6-19.4-7.6-30.3c0-15.1 5.3-29 14-40c-8.8-11-14-24.9-14-40l0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40c0 8.8 7.2 16 16 16s16-7.2 16-16l0-40 0-40zM192 64s0 0 0 0c18 0 34.6 6 48 16l208 0c35.3 0 64 28.7 64 64s-28.7 64-64 64l-82 0c1.3 5.1 2 10.5 2 16c0 25.3-14.7 47.2-36 57.6c2.6 7 4 14.5 4 22.4c0 20-9.2 37.9-23.6 49.7c4.9 9 7.6 19.4 7.6 30.3c0 35.3-28.7 64-64 64l-64 0-24 0C75.2 448 0 372.8 0 280l0-48C0 139.2 75.2 64 168 64l24 0zm64 336c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l64 0zm16-176c0 5.5-.7 10.9-2 16l2 0 32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0 0 16zm-24 64l-40 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 16 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-24 0z'/></svg>", link: "", newWindow: false, textColor: "", markerColor: "" }
  return <>
    <PanelBody className='bPlPanelBody' title={__('Lists Layout', 'b-blocks')} initialOpen={true}>
      <Label className="mb0">{<Flex>{__('Layout', 'lists')} <Device/></Flex>}</Label>
      <ToggleGroupControl  __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout[device].type} onChange={(val) => { updateObj('layout', val, device,'type') }} className="mt10" >
        <ToggleGroupControlOption label="Vertical" value="vertical" />
        <ToggleGroupControlOption label="Horizontal" value="horizontal" />
      </ToggleGroupControl>
      
      {layout[device].type === 'vertical'&& <Flex align='center' className='mt10' gap={5}>
        <Label className='flex1'>{<Flex>{__('Alignment', 'lists')} <Device /></Flex>}</Label>
        <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout[device].verticalAlign} onChange={(val) => updateObj('layout', val, device,'verticalAlign')}>
          <ToggleGroupControlOptionIcon label="Left" value="flex-start" icon={LeftIcon} />
          <ToggleGroupControlOptionIcon label="Center" value="center" icon={CenterIcon} />
          <ToggleGroupControlOptionIcon label="Right" value=" flex-end" icon={RightIcon} />
        </ToggleGroupControl>
      </Flex>}
      
      {layout[device].type === 'horizontal' && <div className='mt10'>
        <Label className='flex1'>{<Flex>{__('Alignment', 'lists')} <Device /></Flex>}</Label>
        <ToggleGroupControl className='flex1 mt5' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout[device].horizontalAlign} onChange={(val) => updateObj('layout', val, device, 'horizontalAlign')} >
          <ToggleGroupControlOptionIcon label="Left" value="flex-start" icon={LeftIcon} />
          <ToggleGroupControlOptionIcon label="Center" value="center" icon={CenterIcon} />
          <ToggleGroupControlOptionIcon label="Right" value="flex-end" icon={RightIcon} />
          <ToggleGroupControlOptionIcon label="Justify" value="space-between" icon={JustifyIcon} />
        </ToggleGroupControl>
      </div>}
    </PanelBody>
    <PanelBody className='bPlPanelBody' title={__('Lists', 'b-blocks')} initialOpen={false}>
      <ItemsPanel {...{ attributes, setAttributes }} newItem={newItem} design='sortable' itemLabel='List' arrKey='items' title='text' ItemSettings={ItemSettings} updateObj={updateObj} />
    </PanelBody>
  </>;
};

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })(ListsSettings);