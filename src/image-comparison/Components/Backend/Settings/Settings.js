import { useState } from "react"
import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import General from './General/General';
import Styles from './Styles/Styles';
import { generalStyleTabs } from '../../../../utils/options';
import { tabController, updateData } from '../../../../../../bpl-tools/utils/functions';
import { BBlocksAds, MediaEditControl } from '../../../../../../bpl-tools/Components';
import ProModal from '../../../../backend/ProModal/ProModal';

const Settings = ({ attributes, setAttributes, isPremium }) => {
	const { alignment, beforeImg, afterImg } = attributes;
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
					{tab.name === "general" && <General {...premiumProps} {...{ attributes, setAttributes, updateObj }} />}
					{tab.name === "style" && <Styles {...premiumProps} {...{ attributes, setAttributes, updateObj }} />}
				</>}
			</TabPanel>
		</InspectorControls>

		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='Image Comparison'>
			<li>&emsp;<strong>{__('Label Position: ', 'b-blocks')}</strong>{__('Customize the label position to suit your needs.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Line Shape: ', 'b-blocks')}</strong>{__('Customize the line shape for a unique and eye-catching design.', 'b-blocks')}</li>

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


		<BlockControls>
			<MediaEditControl label={__('Edit Before Image:', 'image-compare')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
			<MediaEditControl label={__('Edit After Image:', 'image-compare')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />

			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Image Comparison Alignment')} alignmentControls={[
				{ title: __('Image Comparison in left', 'image-compare'), align: 'left', icon: 'align-left' },
				{ title: __('Image Comparison in center', 'image-compare'), align: 'center', icon: 'align-center' },
				{ title: __('Image Comparison in right', 'image-compare'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;