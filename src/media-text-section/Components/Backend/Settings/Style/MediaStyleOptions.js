import { BorderBoxControl, PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { Background, BoxControl, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { Flex } from '@wordpress/components';

const MediaStyleOptions = (props) => {
    const { attributes, updateObj, device } = props;
    const { styles } = attributes;
    const { media } = styles;
    return <>
        <PanelBody className='bPlPanelBody' title={__('Media', 'b-blocks')} initialOpen={true}>

            <BoxControl label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={media[device].padding} onChange={val => updateObj('styles', val, 'media', device, 'padding')} />

            <Background value={media.bg} onChange={val => updateObj('styles', val, 'media', 'bg')} />

            <BorderBoxControl label={__('Border', 'b-blocks')} value={media.border} onChange={val => updateObj('styles', val, 'media', 'border')} />

            <BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={media.radius} onChange={val => updateObj('styles', val, 'media', 'radius')} />

            <ShadowControl label={__('Shadow', 'b-blocks')} value={media.shadow} onChange={val => updateObj('styles', val, 'media', 'shadow')} />

            <ToggleControl className='mt10' label={__('Overlay', 'b-blocks')} checked={media.overlay.isOverlay} onChange={val => updateObj('styles', val, 'media', 'overlay', 'isOverlay')} />

            {media.overlay.isOverlay && <>
                <Background label={__('Overlay Color', 'b-blocks')} value={media.overlay.bg} onChange={val => updateObj('styles', val, 'media', 'overlay', 'bg')} />
                <RangeControl label={__('Opacity', 'b-blocks')} value={typeof media.overlay.opacity === 'number' ? media.overlay.opacity : (parseFloat(media.overlay.opacity) || 0.5)} onChange={val => updateObj('styles', val, 'media', 'overlay', 'opacity')} min={0} max={1} step={0.1} />
            </>}

        </PanelBody>
    </>
};

export default MediaStyleOptions;