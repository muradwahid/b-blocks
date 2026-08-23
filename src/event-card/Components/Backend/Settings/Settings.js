import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';
import Advanced from '../../../../../../bpl-tools/Advanced';

const Settings = (props) => {
	const { attributes, setAttributes } = props;
	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
			{(tab) => <>
				{'general' === tab.name && <General {...props} />}

				{'style' === tab.name && <Style {...props} />}

				{'advanced' === tab.name && <Advanced advanced={attributes.advanced} onChange={val => setAttributes({ advanced: val })} />}
			</>}
		</TabPanel>
	</InspectorControls>;
};
export default Settings;
