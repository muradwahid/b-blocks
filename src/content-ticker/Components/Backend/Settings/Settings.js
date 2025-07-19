import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController, updateAttributes } from '../../../../../../bpl-tools/utils/functions';
import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes } = props;
	const { advanced } = attributes;

	const updateObj = updateAttributes(attributes, setAttributes);

	return <InspectorControls>
		<div className='bPlInspectorInfo'>
			Need more block like this? Checkout the bundle ➡{' '}
			<a href='https://wordpress.org/plugins/b-blocks' target='_blank' rel='noopener noreferrer'>B Blocks </a>
		</div>

		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController} >
			{(tab) => <>
				{'general' === tab.name && <General {...props} updateObj={updateObj} />}

				{'style' === tab.name && <Style {...props} updateObj={updateObj} />}

				{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(advanced) => setAttributes({ advanced })} isPremium={props.isPremium} />}
			</>}
		</TabPanel>
	</InspectorControls>
};
export default Settings;
