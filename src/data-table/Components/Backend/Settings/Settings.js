import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
// import { tabController } from '../../../../../bpl-tools/utils/functions';
import General from './General/General';
import Style from './Style/Style';
import { generalStyleTabs } from '../../../utils/options';
import { HelpPanel } from '../../../../../../bpl-tools/Components';
// import Style from './Style/Style';

const Settings = (props) => {

	return <>
		<InspectorControls>

			<HelpPanel slug='b-blocks' docsLink='https://bblockswp.com/docs/' />
			<TabPanel className='bPlTabPanel' activeClass='activeTab' initialTabName='general' tabs={generalStyleTabs}
			// onSelect={tabController}
			>{tab => <>
				
				{'general' === tab.name && <>
					<General {...props} />
				</>}

				{'style' === tab.name && <>
					<Style {...props} />
				</>}

			</>}</TabPanel>

		</InspectorControls>
	</>;
};
export default Settings;