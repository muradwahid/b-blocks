import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { HelpPanel } from '../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import { pluginSlug } from '../../../../utils/data';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	return <InspectorControls>
		<HelpPanel slug={pluginSlug} />

		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
			{(tab) => <>
				{'general' === tab.name && <General {...props} />}

				{'style' === tab.name && <Style {...props} />}
			</>}
		</TabPanel>
	</InspectorControls>;
};
export default Settings;
