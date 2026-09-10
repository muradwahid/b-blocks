import { Flex, PanelBody, PanelRow, RangeControl, SelectControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon, AlignStretchIcon, arrowDownIcon, arrowLeftIcon, arrowRightIcon, arrowUpIcon, FlexCenterIcon, FlexEndIcon, FlexStartIcon, NoWrapIcon, SpaceAroundIcon, SpaceBetweenIcon, SpaceEvenlyIcon, WrapIcon, WrapReverseIcon } from '../../../../utils/icon';
import { emUnit, pxUnit, vhUnit } from '../../../../../../../bpl-tools/utils/options';

const Layout = (props) => {
    const { attributes, setAttributes, updateObj, device } = props;
    const { layout, heightType, columnGap, height } = attributes;

    const rotateVal = (layout[device]?.direction === 'column' || layout[device]?.direction === 'column-reverse') ? { style: { rotate: '90deg' } } : {}
    // const rotateVal = { style: { rotate: '90deg' }}

    const heightTypes = [
        { label: __('Auto', 'b-blocks'), value: 'auto' },
        { label: __('Window Height (100%)', 'b-blocks'), value: 'window' },
        { label: __('Custom', 'b-blocks'), value: 'custom' }
    ];

    const columnVal = ['column', 'column-reverse'];
    return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
        {/* <SelectControl label={__('Layout Type', 'b-blocks')} labelPosition='edge' value={layout.type} onChange={val => updateObj('layout', val, 'type')} options={[{ label: __('Flexbox', 'b-blocks'), value: 'flex', defaultChecked: true }, { label: __('Grid', 'b-blocks'), value: 'grid' }]} /> */}

        <PanelRow className='mt20'>
            <Label className=''>{__('Height:', 'b-blocks')}</Label>
            <SelectControl value={heightType} onChange={val => {
                setAttributes({ heightType: val, height: 'window' === val ? '100vh' : 'auto' === val ? 'auto' : 'initial' })
            }} options={heightTypes} />
        </PanelRow>

        {'custom' === heightType && <UnitControl className='mt10' label={__('Min Height:', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ height: val })} units={[pxUnit(), emUnit(), vhUnit()]} />}

        {/* Flex */}
        {layout.type === 'flex' && <>
            <Label className='flex1 mt10'>{<Flex justify='flex-start' gap={0}>{__('Direction', 'b-blocks')} <Device /></Flex>}</Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.direction} onChange={(val) => updateObj('layout', val, device, 'direction')}>

                <ToggleGroupControlOptionIcon label="Row" value="row" icon={arrowRightIcon} />
                <ToggleGroupControlOptionIcon label="Column" value="column" icon={arrowDownIcon} />
                <ToggleGroupControlOptionIcon label="Row Reverse" value="row-reverse" icon={arrowLeftIcon} />
                <ToggleGroupControlOptionIcon label="Column Reverse" value="column-reverse" icon={arrowUpIcon} />

            </ToggleGroupControl>


            <Label><Flex>{__('Justify Content', 'b-blocks')} <Device /></Flex></Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.justify} onChange={(val) => updateObj('layout', val, device, 'justify')}>

                <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<FlexStartIcon {...rotateVal} />} />
                <ToggleGroupControlOptionIcon label="Center" value="center" icon={<FlexCenterIcon {...rotateVal} />} />
                <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<FlexEndIcon {...rotateVal} />} />
                <ToggleGroupControlOptionIcon label="Space Between" value="space-between" icon={<SpaceBetweenIcon {...rotateVal} />} />
                <ToggleGroupControlOptionIcon label="Space Around" value="space-around" icon={<SpaceAroundIcon {...rotateVal} />} />
                <ToggleGroupControlOptionIcon label="Space Evenly" value="space-evenly" icon={<SpaceEvenlyIcon {...rotateVal} />} />

            </ToggleGroupControl>

            <Label className='flex1 mt10'>{<Flex justify='flex-start' gap={0}>{__('Align Items', 'b-blocks')} <Device /></Flex>}</Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.alignItems} onChange={(val) => updateObj('layout', val, device, 'alignItems')}>

                <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon style={{ rotate: layout[device]?.direction === 'column' || layout[device]?.direction === 'column-reverse' ? '-90deg' : '0deg' }} />} />
                <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon style={{ rotate: layout[device]?.direction === 'column' || layout[device]?.direction === 'column-reverse' ? '-90deg' : '0deg' }} />} />
                <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon style={{ rotate: layout[device]?.direction === 'column' || layout[device]?.direction === 'column-reverse' ? '-90deg' : '0deg' }} />} />
                <ToggleGroupControlOptionIcon label="Stretch" value="stretch" icon={<AlignStretchIcon style={{ rotate: layout[device]?.direction === 'column' || layout[device]?.direction === 'column-reverse' ? '-90deg' : '0deg' }} />} />

            </ToggleGroupControl>

            {!columnVal.includes(layout[device]?.direction) &&
                <Flex align="center" className="mt10">
                    <Label className='flex1'>{<Flex gap={0}>{__('Wrap', 'b-blocks')} <Device /></Flex>}</Label>
                    <ToggleGroupControl className='flex1' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.wrap} onChange={(val) => updateObj('layout', val, device, 'wrap')}>

                        <ToggleGroupControlOptionIcon label="No Wrap" value="nowrap" icon={<NoWrapIcon />} />
                        <ToggleGroupControlOptionIcon label="Wrap" value="wrap" icon={<WrapIcon />} />
                        <ToggleGroupControlOptionIcon label="Wrap Reverse" value="wrap-reverse" icon={<WrapReverseIcon />} />

                    </ToggleGroupControl>
                </Flex>}
            <Flex className="mt10">
                <Label className='mb0 flex2'>{<Flex gap={5} justify='flex-start'>{__('Gap:', 'b-blocks')}<Device /></Flex>}</Label>
                {device === 'desktop' && <UnitControl className='flex1' labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit()]} />}
                {
                    device !== 'desktop' && <UnitControl className='flex1' labelPosition='left' value={layout[device]?.columnGap} onChange={val => updateObj('layout', val, device, 'columnGap')} units={[pxUnit()]} />
                }
            </Flex>
            {
                (layout[device]?.wrap !== 'nowrap' && layout[device]?.wrap !== '') && <>
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
        </>}

        {/* Grid */}
        {layout.type === 'grid' && <>

            <Label><Flex>{__('Justify Content', 'b-blocks')} <Device /></Flex></Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.gridJustify} onChange={(val) => updateObj('layout', val, device, 'gridJustify')}>

                <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<FlexStartIcon />} />
                <ToggleGroupControlOptionIcon label="Center" value="center" icon={<FlexCenterIcon />} />
                <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<FlexEndIcon />} />
                <ToggleGroupControlOptionIcon label="Space Between" value="space-between" icon={<SpaceBetweenIcon />} />
                <ToggleGroupControlOptionIcon label="Space Around" value="space-around" icon={<SpaceAroundIcon />} />
                <ToggleGroupControlOptionIcon label="Space Evenly" value="space-evenly" icon={<SpaceEvenlyIcon />} />

            </ToggleGroupControl>

            <Label className='flex1 mt10'>{<Flex justify='flex-start' gap={0}>{__('Align Items', 'b-blocks')} <Device /></Flex>}</Label>
            <ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.gridAlignItems} onChange={(val) => updateObj('layout', val, device, 'gridAlignItems')}>

                <ToggleGroupControlOptionIcon label="Start" value="flex-start" icon={<AlignStartIcon />} />
                <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon />} />
                <ToggleGroupControlOptionIcon label="End" value="flex-end" icon={<AlignEndIcon />} />
                <ToggleGroupControlOptionIcon label="Stretch" value="stretch" icon={<AlignStretchIcon />} />

            </ToggleGroupControl>

            <RangeControl className='mt10' label={__('Columns', 'b-blocks')} min={0} max={12} value={layout[device]?.gridColumns} onChange={(val) => updateObj('layout', val, device, 'gridColumns')} />

            <RangeControl label={__('Rows', 'b-blocks')} min={0} max={12} value={layout[device]?.gridRows} onChange={(val) => updateObj('layout', val, device, 'gridRows')} />
        </>}

    </PanelBody>
};

export default Layout;