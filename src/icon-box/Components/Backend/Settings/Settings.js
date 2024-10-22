import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { HelpPanel } from '../../../../../../bpl-tools/Components';
import Advanced from '../../../../../../bpl-tools/Advanced';

import General from './General/General';
import { generalStyleTabs } from '../../../../utils/options';
import { pluginSlug } from '../../../../utils/data';

const Settings = (props) => {
	const { attributes, setAttributes } = props;
	const { advanced } = attributes;

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
			{'general' === tab.name && <>
				<HelpPanel slug={pluginSlug} />

				<General attributes={attributes} setAttributes={setAttributes} />
			</>}

			{'style' === tab.name && <Advanced advanced={advanced} onChange={val => setAttributes({ advanced: val })} enabled={{ dimension: ['padding', 'margin'], background: ['normal', 'hover'], borderShadow: ['normal', 'hover', 'border', 'shadow'], visibility: ['zIndex'] }} />}
		</>}</TabPanel>
	</InspectorControls>;
};
export default Settings;