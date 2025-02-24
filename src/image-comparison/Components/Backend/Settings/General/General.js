import React from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, TabPanel, TextControl, __experimentalInputControl as InputControl, RangeControl } from '@wordpress/components';

import { InlineDetailMediaUpload, BtnGroup, HelpPanel } from '../../../../../../../bpl-tools/Components';
import { ChangeImageData } from '../../../../../../../bpl-tools/Components/Deprecated';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { BControlPro } from '../../../../../../../bpl-tools/ProControls';

import { beforeAfterImgTab, iconOptions, labelHAlignOptions, labelVAlignOptions, orientationOptions } from '../../../../utils/options';
import Presets from '../Panel/Presets/Presets';
const General = ({ attributes, updateObj, isPremium, setIsProModalOpen }) => {
    const { beforeImg, afterImg, orientation, isLabel, label, beforeLabel, afterLabel, isCap, cap, options, dragg } = attributes;
    return (
        <>
            <HelpPanel slug='before-after-image-compare' docsLink='https://bblockswp.com/docs/image-compare' />

            <PanelBody className='bPlPanelBody' title={__('Image Comparison', 'image-compare')} initialOpen={true}>

                <BtnGroup className='mb10' label={__('Orientation', 'image-compare')} options={orientationOptions} value={orientation} onChange={val => updateObj('orientation', val)} isIcon={true} />

                <TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={beforeAfterImgTab} onSelect={tabController}>{tab => <>
                    {'before-img' == tab.name && <>
                        <InlineDetailMediaUpload className='mt10' value={beforeImg} onChange={val => updateObj('beforeImg', val)} placeholder={__('Enter Image URL', 'image-compare')} />

                        <ChangeImageData className='mt20' value={beforeImg} onChange={val => updateObj('beforeImg', val)} />
                    </>}

                    {'after-img' == tab.name && <>
                        <InlineDetailMediaUpload className='mt10' value={afterImg} onChange={val => updateObj('afterImg', val)} placeholder={__('Enter Image URL', 'image-compare')} />

                        <ChangeImageData className='mt20' value={afterImg} onChange={val => updateObj('afterImg', val)} />
                    </>}
                </>}</TabPanel>
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Labels', 'image-compare')} initialOpen={false}>
                <ToggleControl label={__('Show Labels', 'image-compare')} checked={isLabel} onChange={val => updateObj('isLabel', val)} />

                {isLabel && <>
                    {'horizontal' === orientation && <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Label Position', 'image-compare')} options={labelHAlignOptions} value={label.hAlign} onChange={val => updateObj('label', { ...label, hAlign: val })} isIcon={true} Component={BtnGroup} />}

                    {'vertical' === orientation && <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Label Position', 'image-compare')} options={labelVAlignOptions} value={label.vAlign} onChange={val => updateObj('label', { ...label, vAlign: val })} isIcon={true} Component={BtnGroup} />}

                    <TextControl label={__('Before Label', 'image-compare')} value={beforeLabel} onChange={val => updateObj('beforeLabel', val)} placeholder={__('Before image label', 'image-compare')} />

                    <TextControl label={__('After Label', 'image-compare')} value={afterLabel} onChange={val => updateObj('afterLabel', val)} placeholder={__('After image label', 'image-compare')} />
                </>}
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Caption', 'image-compare')} initialOpen={false}>
                <ToggleControl label={__('Show Caption', 'image-compare')} checked={isCap} onChange={val => updateObj('isCap', val)} />
                {
                    isCap && <InputControl className='mt10' labelPosition='edge' label={__('Caption', 'image-compare')} value={cap} onChange={val => updateObj("cap", val)} />
                }
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Options', 'image-compare')} initialOpen={false}>

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Default Offset', 'image-compare')} step={0.1} max={1} min={0} value={options.defaultOffset} onChange={val => updateObj('options', val, 'defaultOffset')} Component={RangeControl} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Move Slider On Mouse Over', 'image-compare')} checked={options.moveMouseOver} onChange={val => updateObj('options', val, 'moveMouseOver')} Component={ToggleControl} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} className='mt10' label={__('Auto Slide', 'image-compare')} checked={options.autoSlide.isAutoSlide} onChange={val => updateObj('options', val, 'autoSlide', 'isAutoSlide')} Component={ToggleControl} />
                {
                    options.autoSlide.isAutoSlide && <>

                        <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Auto Slide Speed', 'image-compare')} step={1} max={20} maxLength={20} minLength={0} min={0} value={options.autoSlide.speed} onChange={val => updateObj('options', val, 'autoSlide', 'speed')} Component={RangeControl} />

                        <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Stop Slider On Mouse Over', 'image-compare')} checked={options.autoSlide.isHoverStop} onChange={val => updateObj('options', val, 'autoSlide', 'isHoverStop')} Component={ToggleControl} />
                    </>
                }
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Presets', 'image-compare')} initialOpen={false}>
                <Presets value={dragg.type} setIsProModalOpen={setIsProModalOpen} options={iconOptions} onChange={val => updateObj("dragg", val, "type")} isPremium={isPremium} />
            </PanelBody>
        </>
    );
};

export default General;