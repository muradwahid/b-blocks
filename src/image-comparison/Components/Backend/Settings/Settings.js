import { useState } from "react"
import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, TabPanel } from '@wordpress/components';

import { ColorsControl, InlineDetailMediaUpload, MediaEditControl, Typography, HelpPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, ChangeImageData, SpaceControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { pxUnit, perUnit, emUnit, vwUnit } from '../../../../../../bpl-tools/utils/options';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { pluginSlug, imbCompareDocs } from '../../../../utils/data';
const beforeAfterImgTab = [
	{ name: 'before-img', title: __('Before Img', 'b-blocks') },
	{ name: 'after-img', title: __('After Img', 'b-blocks') }
];

const Settings = ({ attributes, setAttributes }) => {
	const { alignment, width, border, beforeImg, afterImg, isSwap, isLabel, labelTypo, labelColors, labelPadding, isCap, capTypo, capColors, capPadding } = attributes;
=======
import { TabPanel } from '@wordpress/components';

import General from './General/General';
import Styles from './Styles/Styles';
import { generalStyleTabs } from '../../../../utils/options';
import { tabController, updateData } from '../../../../../../bpl-tools/utils/functions';
import { BBlocksAds, MediaEditControl } from '../../../../../../bpl-tools/Components';
import { AboutProModal } from '../../../../../../bpl-tools/ProControls';

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

		<AboutProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} link={`${window.origin}/wp-admin/tools.php?page=before-after-image-compare`}>
			<li>&emsp;<strong>{__('Label Position: ', 'image-compare')}</strong>{__('Customize the label position to suit your needs.', 'image-compare')}</li>
		</AboutProModal>


		<BlockControls>
			<MediaEditControl label={__('Edit Before Image:', 'b-blocks')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
			<MediaEditControl label={__('Edit After Image:', 'b-blocks')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />

			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Image Comparison Alignment')} alignmentControls={[
				{ title: __('Image Comparison in left', 'image-compare'), align: 'left', icon: 'align-left' },
				{ title: __('Image Comparison in center', 'image-compare'), align: 'center', icon: 'align-center' },
				{ title: __('Image Comparison in right', 'image-compare'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;