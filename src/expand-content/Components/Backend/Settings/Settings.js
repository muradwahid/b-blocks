import { InspectorControls } from '@wordpress/block-editor';

import { TabPanel } from '@wordpress/components';
import { generalStyleTabs } from '../../../utils/options';
import { tabController } from '../../../../../../bpl-tools/utils/functions';
import Advanced from '../../../../../../bpl-tools/Advanced';

import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, updateObj } = props;
	const { advanced } = attributes;

	return <InspectorControls>
		<TabPanel className="bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController} >
			{(tab) => <>
				{"general" === tab.name && <General {...props} />}
				{"style" === tab.name && <Style {...props} />}
				{"advanced" === tab.name && <Advanced advanced={advanced} onChange={(value) => updateObj('advanced', value)} />}
			</>
			}
		</TabPanel>

	</InspectorControls>;
};

export default Settings;
