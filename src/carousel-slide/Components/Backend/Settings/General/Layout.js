import { Flex, PanelBody, RangeControl, SelectControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Device, Label } from '../../../../../../bpl-tools/Components';
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon, AlignStretchIcon, arrowDownIcon, arrowLeftIcon, arrowRightIcon, arrowUpIcon, FlexCenterIcon, FlexEndIcon, FlexStartIcon, NoWrapIcon, SpaceAroundIcon, SpaceBetweenIcon, SpaceEvenlyIcon, WrapIcon, WrapReverseIcon } from '../../../../utils/icons';

const Layout = (props) => {
    const { attributes, updateObj, device } = props;
    const { layout } = attributes;

    const rotateVal = (layout[device]?.direction === 'column' || layout[device]?.direction === 'column-reverse') ? { style: { rotate: '90deg' } } : {}
    // const rotateVal = { style: { rotate: '90deg' }}

    return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
        <SelectControl label={__('Layout Type', 'b-blocks')} labelPosition='edge' value={layout.type} onChange={val => updateObj('layout', val, 'type')} options={[{ label: __('Flexbox', 'b-blocks'), value: 'flex', defaultChecked: true }, { label: __('Grid', 'b-blocks'), value: 'grid' }]} />

        {/* Flex */}
        <Flex align="center">
            <Label className='flex1'>{<Flex justify='flex-start' gap={0}>{__('Direction', 'b-blocks')} <Device /></Flex>}</Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.direction} onChange={(val) => updateObj('layout', val, device, 'direction')}>

                <ToggleGroupControlOptionIcon label="Row" value="row" icon={arrowRightIcon} />
                <ToggleGroupControlOptionIcon label="Column" value="column" icon={arrowDownIcon} />
                <ToggleGroupControlOptionIcon label="Row Reverse" value="row-reverse" icon={arrowLeftIcon} />
                <ToggleGroupControlOptionIcon label="Column Reverse" value="column-reverse" icon={arrowUpIcon} />

            </ToggleGroupControl>
        </Flex>

        <Label><Flex>{__('Justify Content', 'b-blocks')} <Device /></Flex></Label>
        <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.justify} onChange={(val) => updateObj('layout', val, device, 'justify')}>

            <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<FlexStartIcon {...rotateVal} />} />
            <ToggleGroupControlOptionIcon label="Center" value="center" icon={<FlexCenterIcon {...rotateVal} />} />
            <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<FlexEndIcon {...rotateVal} />} />
            <ToggleGroupControlOptionIcon label="Space Between" value="space-between" icon={<SpaceBetweenIcon {...rotateVal} />} />
            <ToggleGroupControlOptionIcon label="Space Around" value="space-around" icon={<SpaceAroundIcon {...rotateVal} />} />
            <ToggleGroupControlOptionIcon label="Space Evenly" value="space-evenly" icon={<SpaceEvenlyIcon {...rotateVal} />} />

        </ToggleGroupControl>


        <Flex align="center" className="mt10">
            <Label className='flex1'>{<Flex justify='flex-start' gap={0}>{__('Align Items', 'b-blocks')} <Device /></Flex>}</Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.alignItems} onChange={(val) => updateObj('layout', val, device, 'alignItems')}>

                <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon />} />
                <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon />} />
                <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon />} />
                <ToggleGroupControlOptionIcon label="Stretch" value="stretch" icon={<AlignStretchIcon />} />

            </ToggleGroupControl>
        </Flex>

        <Flex align="center" className="mt10">
            <Label className='flex1'>{<Flex gap={0}>{__('Wrap', 'b-blocks')} <Device /></Flex>}</Label>
            <ToggleGroupControl className='flex1' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.wrap} onChange={(val) => updateObj('layout', val, device, 'wrap')}>

                <ToggleGroupControlOptionIcon label="No Wrap" value="nowrap" icon={<NoWrapIcon />} />
                <ToggleGroupControlOptionIcon label="Wrap" value="wrap" icon={<WrapIcon />} />
                <ToggleGroupControlOptionIcon label="Wrap Reverse" value="wrap-reverse" icon={<WrapReverseIcon />} />

            </ToggleGroupControl>
        </Flex>

        {
            layout[device]?.wrap !== 'nowrap' || layout[device]?.wrap !== '' && <>
                <Label><Flex>{__('Align Content', 'b-blocks')} <Device /></Flex></Label>
                <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.alignContent} onChange={(val) => updateObj('layout', val, device, 'alignContent')}>

                    <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<FlexStartIcon {...rotateVal} />} />
                    <ToggleGroupControlOptionIcon label="Center" value="center" icon={<FlexCenterIcon {...rotateVal} />} />
                    <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<FlexEndIcon {...rotateVal} />} />
                    <ToggleGroupControlOptionIcon label="Space Between" value="space-between" icon={<SpaceBetweenIcon {...rotateVal} />} />
                    <ToggleGroupControlOptionIcon label="Space Around" value="space-around" icon={<SpaceAroundIcon {...rotateVal} />} />
                    <ToggleGroupControlOptionIcon label="Space Evenly" value="space-evenly" icon={<SpaceEvenlyIcon {...rotateVal} />} />

                </ToggleGroupControl>
            </>
        }


        {/* Grid */}

        <RangeControl label={__('Columns', 'b-blocks')} min={0} max={12} value={layout[device]?.gridColumns} onChange={(val) => updateObj('layout', val, device, 'gridColumns')} />

        <RangeControl label={__('Rows', 'b-blocks')} min={0} max={12} value={layout[device]?.gridRows} onChange={(val) => updateObj('layout', val, device, 'gridRows')} />

    </PanelBody>
};

export default Layout;