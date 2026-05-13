import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import General from './General';
import Style from './Style';


const Settings = (props) => {
	// const { alignment } = attributes
	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={[
				{ name: 'general', title: __('General', 'b-blocks') },
				{ name: 'style', title: __('Style', 'b-blocks') }
			]}>{tab => <>
				{'general' === tab.name && <>
					<General {...props} />
				</>}
				{'style' === tab.name && <>
					<Style {...props} />
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>
};
export default Settings;