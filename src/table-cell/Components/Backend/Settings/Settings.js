import { InspectorControls} from '@wordpress/block-editor';
import { TabPanel, PanelBody } from '@wordpress/components';

import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { Button } from '../../../../../../bpl-tools/Components';

const Settings = (props) => {

	const { parentClientId } = props;

	const { selectBlock } = useDispatch('core/block-editor');

	return <>
		<InspectorControls>
			<PanelBody initialOpen={true} >
				<Button
					onClick={() => selectBlock(parentClientId)}
				>
					{__('Open Parent Settings','b-blocks')}
				</Button>
			</PanelBody>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props}  />
				</>}


				{'style' === tab.name && <>
					<Style {...props} />
				</>}
			</>}</TabPanel>
		</InspectorControls>
	</>;
};
export default Settings;