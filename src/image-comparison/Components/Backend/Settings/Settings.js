import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from "react";

import { BBlocksAds, MediaEditControl } from '../../../../../../bpl-tools/Components';
import { tabController, updateData } from '../../../../../../bpl-tools/utils/functions';

import ProModal from '../../../../backend/ProModal/ProModal';
import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Styles from './Styles/Styles';

const Settings = ({ attributes, setAttributes, isPremium, activeIndex, setActiveIndex }) => {
    const { alignment, beforeImg, afterImg, theme } = attributes;
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const updateObj = (property, val, ...props) => {
        setAttributes({ [property]: updateData(attributes[property], val, ...props) });
    }

    const premiumProps = {
        isPremium,
        setIsProModalOpen
    };

    return <>
        <InspectorControls>
            <div className='bPlInspectorInfo'>
                <BBlocksAds />
            </div>

            <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
                {(tab) => <>
                    {tab.name === "general" && <General {...premiumProps} {...{ attributes, setAttributes, updateObj, activeIndex, setActiveIndex }} />}
                    {tab.name === "style" && <Styles {...premiumProps} {...{ attributes, setAttributes, updateObj }} />}
                </>}
            </TabPanel>

            {/* <PanelBody className='bPlPanelBody' title={__('Comparison Settings', 'image-compare')}>
				<BtnGroup className="mb10" label={__("Orientation", "image-compare")} options={orientationOptions} value={orientation} onChange={val => setAttributes({ orientation: val })} isIcon={true} />
				<UnitControl label={__('Width:', 'image-compare')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit(), vwUnit()]} />

				<BorderControl label={__('Border:', 'image-compare')} value={border} onChange={val => setAttributes({ border: val })} />

				<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={beforeAfterImgTab} onSelect={tabController}>{tab => <>
					{'before-img' == tab.name && <>
						<InlineDetailMediaUpload className='mt10' value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} placeholder={__('Enter Image URL', 'image-compare')} />

						<ChangeImageData className='mt20' value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
					</>}

					{'after-img' == tab.name && <>
						<InlineDetailMediaUpload className='mt10' value={afterImg} onChange={val => setAttributes({ afterImg: val })} placeholder={__('Enter Image URL', 'image-compare')} />

						<ChangeImageData className='mt20' value={afterImg} onChange={val => setAttributes({ afterImg: val })} />
					</>}
				</>}</TabPanel>

				<ToggleControl className='mt20' label={__('Swap Images', 'image-compare')} checked={isSwap} onChange={val => setAttributes({ isSwap: val, beforeImg: { ...afterImg }, afterImg: { ...beforeImg } })} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Labels Settings', 'image-compare')} initialOpen={false}>
				<ToggleControl label={__('Show Labels', 'image-compare')} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

				{isLabel && <>
					<TextControl label={__("Before Label", "image-compare")} value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__("Before image label", "image-compare")} />

					<TextControl label={__("After Label", "image-compare")} value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__("After image label", "image-compare")} />

					{"horizontal" === orientation && <BtnGroup label={__("Label Position", "image-compare")} options={labelHAlignOptions} value={label.hAlign} onChange={val => setAttributes({ label: { ...label, hAlign: val } })} isIcon={true} />}

					{"vertical" === orientation && <BtnGroup label={__("Label Position", "image-compare")} options={labelVAlignOptions} value={label.vAlign} onChange={val => setAttributes({ label: { ...label, vAlign: val } })} isIcon={true} />}

					<Typography value={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

					<ColorsControl value={labelColors} onChange={val => setAttributes({ labelColors: val })} defaults={{ color: '#fff', bg: '#00000080' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'image-compare')} value={labelPadding} onChange={val => setAttributes({ labelPadding: val })} defaults={{ vertical: '10px', horizontal: '15px' }} />
				</>}
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Caption Settings', 'image-compare')} initialOpen={false}>
				<ToggleControl label={__('Show Caption', 'image-compare')} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

				{isCap && <>
					<Typography value={capTypo} onChange={val => setAttributes({ capTypo: val })} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 } }} />

					<ColorsControl value={capColors} onChange={val => setAttributes({ capColors: val })} defaults={{ color: '#333', bg: '#f4f4f4' }} />

					<SpaceControl className='mt20' label={__('Padding:', 'image-compare')} value={capPadding} onChange={val => setAttributes({ capPadding: val })} defaults={{ vertical: '10px', horizontal: '15px' }} />
				</>}
			</PanelBody> */}
        </InspectorControls>

        <ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='Image Comparison'>
            <li>&emsp;<strong>{__('Theme: ', 'b-blocks')}</strong>{__('Create stunning before & after image comparisons in both single view and slider formats.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Label Position: ', 'b-blocks')}</strong>{__('Customize the label position to suit your needs.', 'b-blocks')}</li>
            {/* <li>&emsp;<strong>{__('Line Shape: ', 'b-blocks')}</strong>{__('Customize the line shape for a unique and eye-catching design.', 'b-blocks')}</li> */}

            <li>&emsp;<strong>{__('Default Offset: ', 'b-blocks')}</strong>{__('Adjusts the initial position of the slider.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Move Slider On Click: ', 'b-blocks')}</strong>{__('Enable the option to move the slider when the user clicks on it.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Move Slider On Mouse Over: ', 'b-blocks')}</strong>{__('Enable the option to move the slider when the mouse hover over it.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Auto Slide: ', 'b-blocks')}</strong>{__('Activate automatic sliding on the compare images.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Auto Slide Speed: ', 'b-blocks')}</strong>{__('Set the speed of the auto moving slider.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Stop Slider On Mouse Over: ', 'b-blocks')}</strong>{__('Pause the sliding movement when the mouse is over the images.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Line Size: ', 'b-blocks')}</strong>{__('Adjust the line size to your preferred thickness.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Line Color: ', 'b-blocks')}</strong>{__('Choose a desired color for the line.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Handler Color: ', 'b-blocks')}</strong>{__('Choose a desired color for the handler.', 'b-blocks')}</li>

            <li>&emsp;<strong>{__('Icon Color: ', 'b-blocks')}</strong>{__('Select the icon color from the options provided to match your design.', 'b-blocks')}</li>
        </ProModal>


        {
            theme === "default" && <BlockControls>
                <MediaEditControl label={__('Edit Before Image:', 'b-blocks')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
                <MediaEditControl label={__('Edit After Image:', 'b-blocks')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />

                <AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Image Comparison Alignment')} alignmentControls={[
                    { title: __('Image Comparison in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                    { title: __('Image Comparison in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                    { title: __('Image Comparison in right', 'b-blocks'), align: 'right', icon: 'align-right' }
                ]} />
            </BlockControls>
        }
    </>;
};
export default Settings;