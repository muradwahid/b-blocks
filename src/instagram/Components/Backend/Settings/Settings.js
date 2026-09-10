import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { allTabs } from '../../../utils/options';
import Account from './General/Account';
import Buttons from './General/Buttons';
import Caption from './General/Caption';
import Grid from './General/Grid';
import Interaction from './General/Interaction';
import ProfileHeader from './General/ProfileHeader';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={allTabs} onSelect={tabController}>
			{(tab) => <>
				{'general' === tab.name && <>
					<Account {...props} />

					<Grid {...props} />

					<ProfileHeader {...props} />

					<Caption {...props} />

					<Buttons {...props} />

					<Interaction {...props} />
				</>}

				{'style' === tab.name && <Style {...props} />}

				{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(val) => setAttributes({ advanced: val })} isPremium={isPremium} />}
			</>}
		</TabPanel>
	</InspectorControls>;
};

export default Settings;
