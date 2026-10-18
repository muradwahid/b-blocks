import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController, updateAttributes } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/data';
import General from './General';
import Style from './Style';

const Settings = ( props ) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	const updateObj = updateAttributes( attributes, setAttributes );

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={ generalStyleTabs } onSelect={ tabController }>
			{ ( tab ) => <>
				{ 'general' === tab.name && <General { ...props } updateObj={ updateObj } /> }

				{ 'style' === tab.name && <Style { ...props } updateObj={ updateObj } /> }

				{ 'advanced' === tab.name && <Advanced
					advanced={ advanced }
					onChange={ ( val ) => setAttributes( { advanced: val } ) }
					isPremium={ isPremium }
				/> }
			</> }
		</TabPanel>
	</InspectorControls>;
};

export default Settings;
