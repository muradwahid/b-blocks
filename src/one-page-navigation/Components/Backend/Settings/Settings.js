import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { allTabs, hasPanel } from '../../../utils/options';
import Animation from './General/Animation';
import Behavior from './General/Behavior';
import Items from './General/Items';
import Layout from './General/Layout';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced, layout = {} } = attributes;

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={allTabs} onSelect={tabController}>

			{(tab) => <>

				{'general' === tab.name && <>
					<Layout {...props} />

					<Items {...props} />

					<Behavior {...props} />

					{hasPanel(layout.preset || 'glassBullseye', 'animation') && <Animation {...props} />}
				</>}

				{'style' === tab.name && <Style {...props} />}

				{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(val) => setAttributes({ advanced: val })} isPremium={isPremium} />}

			</>}

		</TabPanel>
	</InspectorControls>;
};

export default Settings;
