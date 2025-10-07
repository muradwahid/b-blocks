import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { HelpPanel } from '../../../../../../bpl-tools/Components';

import { updateAttributes } from '../../../../../../bpl-tools/utils/functions';
import { pluginSlug } from '../../../../utils/data';
import { generalStyleTabs } from '../../../../utils/options';
import General from './General/General';

const Settings = (props) => {
	const { attributes, setAttributes } = props;
	const { advanced } = attributes;
	const updateObj = updateAttributes(attributes,setAttributes);

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
			{'general' === tab.name && <>
				<HelpPanel slug={pluginSlug} />

				<General attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />
			</>}

			{'style' === tab.name && <Advanced advanced={advanced} onChange={val => setAttributes({ advanced: val })} enabled={{ dimension: ['padding', 'margin'], background: ['normal', 'hover'], borderShadow: ['normal', 'hover', 'border', 'shadow'], visibility: ['zIndex'] }} />}
		</>}</TabPanel>
	</InspectorControls>;
};
export default Settings;