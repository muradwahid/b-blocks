import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { HelpPanel } from '../../../../../../Components';

import General from './General/General';
import Style from './Style/Style';
import { generalStyleTabs } from '../../../../utils/options';
import { pluginSlug } from '../../../../utils/data';

const Settings = (props) => {
	const { attributes, setAttributes } = props;

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
			{'general' === tab.name && <>
				<HelpPanel slug={pluginSlug} />

				<General attributes={attributes} setAttributes={setAttributes} />
			</>}

			{'style' === tab.name && <Style attributes={attributes} setAttributes={setAttributes} />}
		</>}</TabPanel>
	</InspectorControls>;
};
export default Settings;