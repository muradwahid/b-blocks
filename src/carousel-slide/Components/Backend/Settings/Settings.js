import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { tabController } from '../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';

const Settings = (props) => {

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props} />
				</>}


				{'style' === tab.name && <>
					
				</>}
			</>}</TabPanel>
		</InspectorControls>

	</>;
};
export default Settings;