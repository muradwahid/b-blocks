import { InspectorControls} from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

//bpl-tools
import { tabController } from '../../../../../../bpl-tools/utils/functions';
import  Advanced from "../../../../../../bpl-tools/Advanced"

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props} />
				</>}

				{'advanced' === tab.name && <>
					<Advanced advanced={advanced} onChange={(value) => setAttributes({ advanced: value })} isPremium={isPremium} />
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;