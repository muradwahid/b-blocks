import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { BBlocksAds } from '../../../../../../bpl-tools/Components';
import { generalStyleTabs } from '../../../utils/options';

import ProModal from '../../../../backend/ProModal/ProModal';
import General from './General/General';
import Style from './Style/Style';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	const [ isProModalOpen,setIsProModalOpen] = useState(false);

	const premiumProps = {
		isProModalOpen,
		setIsProModalOpen,
		...props
	}

	return <>
		<InspectorControls>
			<div className='bPlInspectorInfo'>
				<BBlocksAds />
			</div>

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <>
						<General {...premiumProps} />
					</>}

					{'style' === tab.name && <>
						<Style {...premiumProps} />
					</>}
					{
						'advanced' === tab.name && <>
							<Advanced advanced={advanced} onChange={value => setAttributes({ advanced: value })} isPremium={isPremium} />
						</>
					}
				</>}
			</TabPanel>
		</InspectorControls>
		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='SVG Draw'>
			<li>&emsp;<strong>{__('SVG Upload: ', 'b-blocks')}</strong>{__('Upload custom SVG files from your device.', 'b-blocks')}</li>
			<li>&emsp;<strong>{__('Animation Easing: ', 'b-blocks')}</strong>{__('Advanced easing families (Quart, Quint, Elastic, Back, Circ, Expo, Bounce, and many variations) that create richer, more natural or stylized motion.', 'b-blocks')}</li>
		</ProModal>
	</>
};
export default Settings;
