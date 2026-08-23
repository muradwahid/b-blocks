import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, updateObj, isPremium } = props;
	const { layout = {}, advanced } = attributes;

	return <>
		<BlockControls>
			<AlignmentToolbar
				value={layout.alignment}
				onChange={(val) => updateObj('layout', val || 'center', 'alignment')}
			/>
		</BlockControls>

		<InspectorControls>

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <General {...props} />}

					{'style' === tab.name && <Style {...props} />}

					{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(advanced) => setAttributes({ advanced })} isPremium={isPremium} />}
				</>}
			</TabPanel>
		</InspectorControls>
	</>;
};

export default Settings;
