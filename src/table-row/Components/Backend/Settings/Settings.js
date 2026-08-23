import { InspectorControls } from '@wordpress/block-editor';
import Style from './Style/Style';
import { PanelBody } from '@wordpress/components';
import { Button } from '../../../../../../bpl-tools/Components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const Settings = (props) => {

	const { parentClientId } = props;

	const { selectBlock } = useDispatch('core/block-editor');

	return <>
		<InspectorControls>
			{/* <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props} />
				</>}


				{'style' === tab.name && <>
					<Style {...props} />
				</>}
			</>}</TabPanel> */}

			<PanelBody initialOpen={true} >
				<Button
					onClick={() => selectBlock(parentClientId)}
				>
					{__('Open Parent Settings', 'b-blocks')}
				</Button>
			</PanelBody>


			<Style {...props} />

		</InspectorControls>
	</>;
};
export default Settings;