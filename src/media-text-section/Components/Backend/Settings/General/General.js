import { Flex, PanelBody, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, __experimentalToggleGroupControlOption as ToggleGroupControlOption, Dashicon, __experimentalUnitControl as UnitControl, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Device, InlineMediaUpload, Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from '../../../../utils/icon';


const SPLIT_OPTIONS = [
    { label: '30 / 70', value: '30-70' },
    { label: '40 / 60', value: '40-60' },
    { label: '50 / 50', value: '50-50' },
    { label: '60 / 40', value: '60-40' },
    { label: '70 / 30', value: '70-30' },
    { label: 'Custom', value: 'custom' }
];

const General = (props) => {
    const { attributes, updateObj, device } = props;
    const { layout, styles, media } = attributes;

    return <>
        <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
            <Flex align="center" className='mt10'>
                <Label className='flex1'>{<Flex justify='flex-start' gap={0}>{__('Direction', 'b-blocks')} <Device /></Flex>}</Label>
                <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.direction} onChange={(val) => updateObj('layout', val, device, 'direction')}>

                    <ToggleGroupControlOptionIcon label="Row" value="row" icon={<Dashicon icon='align-pull-left' />} />
                    <ToggleGroupControlOptionIcon label="Row Reverse" value="row-reverse" icon={<Dashicon icon='align-pull-right' />} />

                </ToggleGroupControl>
            </Flex>

            <Flex align="center" className="mt10">
                <Label className='flex1'>{<Flex justify='flex-start' gap={0}>{__('Alignment', 'b-blocks')} <Device /></Flex>}</Label>
                <ToggleGroupControl className='flex1' size='small' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={layout[device]?.alignItems} onChange={(val) => updateObj('layout', val, device, 'alignItems')}>

                    <ToggleGroupControlOptionIcon label="Top" value="flex-start" icon={<AlignStartIcon />} />
                    <ToggleGroupControlOptionIcon label="Center" value="center" icon={<AlignCenterIcon />} />
                    <ToggleGroupControlOptionIcon label="Bottom" value="flex-end" icon={<AlignEndIcon />} />

                </ToggleGroupControl>
            </Flex>

            <Flex className='mt10'>
                <Label className='flex2'><Flex>{__('Gap', 'b-blocks')} <Device /></Flex></Label>
                <UnitControl className='flex1' value={styles.layout[device]?.gap} onChange={val => updateObj('styles', val, 'layout', device, 'gap')} />
            </Flex>

            <SelectControl
                className='mt10'
                label={<Flex>{__('Split Ratio', 'b-blocks')} <Device /></Flex>}
                labelPosition='edge'
                help={__('Media / content column widths.', 'b-blocks')}
                value={styles.layout[device]?.ratio?.splitRatio}
                options={SPLIT_OPTIONS}
                onChange={(val) => {
                    if (val === '30-70') {
                        updateObj('styles', { media: '30%', content: '70%', splitRatio: val }, 'layout', device, 'ratio');
                    } else if (val === '40-60') {
                        updateObj('styles', { media: '40%', content: '60%', splitRatio: val }, 'layout', device, 'ratio');
                    } else if (val === '50-50') {
                        updateObj('styles', { media: '50%', content: '50%', splitRatio: val }, 'layout', device, 'ratio');
                    } else if (val === '60-40') {
                        updateObj('styles', { media: '60%', content: '40%', splitRatio: val }, 'layout', device, 'ratio');
                    } else if (val === '70-30') {
                        updateObj('styles', { media: '70%', content: '30%', splitRatio: val }, 'layout', device, 'ratio');
                    } else {
                        updateObj('styles', { ...styles.layout[device]?.ratio, splitRatio: val }, 'layout', device, 'ratio');
                    }
                }}
                __nextHasNoMarginBottom
            />
            {styles.layout[device]?.ratio?.splitRatio === 'custom' && <Flex className='mt10'>

                <UnitControl label={__('Media Width', 'b-blocks')} className='flex1' value={styles.layout[device]?.ratio.media} onChange={val => updateObj('styles', val, 'layout', device, 'ratio', 'media')} />

                <UnitControl label={__('Content Width', 'b-blocks')} className='flex1' value={styles.layout[device]?.ratio.content} onChange={val => updateObj('styles', val, 'layout', device, 'ratio', 'content')} />

            </Flex>}

        </PanelBody>

        <PanelBody className='bPlPanelBody' title={__('Media', 'b-blocks')} initialOpen={false}>
            <Flex align="center" className="mt10">
                <Label className='flex1'>{__('Media Type', 'b-blocks')}</Label>
                <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={media.mediaType} onChange={(val) => updateObj('media', val, 'mediaType')}>

                    <ToggleGroupControlOption label="Image" value="image" />
                    <ToggleGroupControlOption label="Video" value="video" />

                </ToggleGroupControl>
            </Flex>
            <br />
            {media.mediaType === 'image' && <>
                <MediaArea height="100%" width="100%" value={media.image} onChange={val => updateObj('media', val, 'image')} />
                <>
                    <Label className='flex1 mt10'>{__('Object Fit', 'b-blocks')}</Label>
                    <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={styles.media.image.objFit} onChange={(val) => updateObj('styles', val, 'media', 'image', 'objFit')}>

                        <ToggleGroupControlOption label="Cover" value="cover" />
                        <ToggleGroupControlOption label="Contain" value="contain" />
                        <ToggleGroupControlOption label="Fill" value="fill" />

                    </ToggleGroupControl>
                </>
            </>}

            {media.mediaType === 'video' && <>

                <InlineMediaUpload placeholder={__('Enter Video URL', 'b-blocks')} value={media.video?.url} onChange={val => updateObj('media', val, 'video', 'url')} types={['video/*']} />

                <Label className='mt10'>{__('Video Poster', 'b-blocks')}</Label>
                <MediaArea height="100%" width="100%" value={media.video?.poster} onChange={val => updateObj('media', val, 'video', 'poster')} />

                <ToggleControl
                    className='mt10'
                    label={__('Autoplay', 'b-blocks')}
                    checked={!!media.video?.autoplay}
                    onChange={(val) => updateObj('media', val, 'video', 'autoplay')}
                />

                <ToggleControl
                    className='mt10'
                    label={__('Loop', 'b-blocks')}
                    checked={media.video?.loop !== false}
                    onChange={(val) => updateObj('media', val, 'video', 'loop')}
                />

                <ToggleControl
                    className='mt10'
                    label={__('Muted', 'b-blocks')}
                    checked={media.video?.muted !== false}
                    onChange={(val) => updateObj('media', val, 'video', 'muted')}
                />

                <ToggleControl
                    className='mt10'
                    label={__('Show Controls Bar', 'b-blocks')}
                    checked={media.video?.controls !== false}
                    onChange={(val) => updateObj('media', val, 'video', 'controls')}
                />

                {media.video?.controls !== false && (
                    <ToggleControl
                        className='mt10'
                        label={__('Show controls on hover', 'b-blocks')}
                        checked={!!media.video?.controlsOnHover}
                        onChange={(val) => updateObj('media', val, 'video', 'controlsOnHover')}
                    />
                )}

                <ToggleControl
                    className='mt10'
                    label={__('Allow Download', 'b-blocks')}
                    checked={!!media.video?.allowDownload}
                    onChange={(val) => updateObj('media', val, 'video', 'allowDownload')}
                />

                <ToggleControl
                    className='mt10'
                    label={__('Allow Fullscreen', 'b-blocks')}
                    checked={media.video?.allowFullscreen !== false}
                    onChange={(val) => updateObj('media', val, 'video', 'allowFullscreen')}
                />

                <ToggleControl
                    className='mt10'
                    label={__('Allow Picture-in-Picture', 'b-blocks')}
                    checked={media.video?.allowPip !== false}
                    onChange={(val) => updateObj('media', val, 'video', 'allowPip')}
                />

                <>
                    <Label className='flex1 mt10'>{__('Object Fit', 'b-blocks')}</Label>
                    <ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={styles.media.video?.objFit} onChange={(val) => updateObj('styles', val, 'media', 'video', 'objFit')}>

                        <ToggleGroupControlOption label="Cover" value="cover" />
                        <ToggleGroupControlOption label="Contain" value="contain" />
                        <ToggleGroupControlOption label="Fill" value="fill" />

                    </ToggleGroupControl>
                </>

            </>
            }

        </PanelBody>
    </>
};

export default General;