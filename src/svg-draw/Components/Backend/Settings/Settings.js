import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { BBlocksAds } from '../../../../../../bpl-tools/Components';
import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	return <>
		<InspectorControls>
			<div className='bPlInspectorInfo'>
				<BBlocksAds />
			</div>

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <>
						<General {...{ attributes, setAttributes }} />
					</>}

					{'style' === tab.name && <>
						<Style {...{ attributes, setAttributes }} />
					</>}
					{
						'advanced' === tab.name && <>
							<Advanced advanced={advanced} onChange={value => setAttributes({ advanced: value })} isPremium={isPremium} />
						</>
					}
				</>}
			</TabPanel>
		</InspectorControls>
	</>
};
export default Settings;
