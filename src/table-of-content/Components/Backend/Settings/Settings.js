import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

// import { BBlocksAds } from '../../../../../../bpl-tools/Components';
import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes,isPremium } = props;
	const { advanced } = attributes;

	const defEnabled = {
		dimension: ['padding', 'margin'],
		transform: true,
		background: ['normal', 'hover', 'overlay'],
		borderShadow: ['normal', 'hover', 'border', 'shadow'],
		mask: true,
		visibility: ['zIndex', 'overflow'],
		responsive: true,
		css: true
	}

	return <>
		<InspectorControls>
			{/* <div className='bPlInspectorInfo'>
				<BBlocksAds />
			</div> */}

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props} />

				</>}


				{'style' === tab.name && <>
					<Style {...props} />
				</>}
				{'advanced' === tab.name && <>
					<Advanced advanced={advanced} onChange={(value) => setAttributes({ advanced: value })} enabled={defEnabled} isPremium={isPremium} />
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;