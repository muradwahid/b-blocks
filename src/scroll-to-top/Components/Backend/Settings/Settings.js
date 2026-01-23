import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced'
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const defEnabled = {
	dimension: ['padding', 'margin', 'width','height'],
	// dimension: ['padding', 'margin', 'width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'],
	transform: true,
	background: ['normal', 'hover', 'overlay'],
	borderShadow: ['normal', 'hover', 'border', 'shadow'],
	mask: true,
	animation: true,
	visibility: ['zIndex', 'overflow'],
	responsive: true,
	css: true
}

const Settings = (props) => {

	const { attributes, setAttributes } = props;
	const { advanced } = attributes;


	return <>
		<InspectorControls>
			
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				
				{'general' === tab.name && <>
					<General {...props} />
				</>}

				{'style' === tab.name && <>
						<Style {...props} />
				</>}

				{'advanced' === tab.name && <>
					<Advanced advanced={advanced} onChange={value => setAttributes({ advanced: value })} enabled={defEnabled} isPremium={true} />
				</>}

			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;