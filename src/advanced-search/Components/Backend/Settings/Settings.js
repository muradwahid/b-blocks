import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleAdvancedTabs } from '../../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium = false } = props;

	return <>
		<InspectorControls>

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleAdvancedTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <General {...props} />}

					{'style' === tab.name && <Style {...props} />}

					{'advanced' === tab.name && <Advanced advanced={attributes.advanced} onChange={(advanced) => setAttributes({ advanced })} isPremium={isPremium} />}
				</>}
			</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;
