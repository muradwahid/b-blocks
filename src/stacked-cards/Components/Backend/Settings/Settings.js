import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TabPanel, Button } from '@wordpress/components';
import { select, dispatch } from '@wordpress/data';
import { createBlock } from "@wordpress/blocks";
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Advanced from '../../../../../../bpl-tools/Advanced';

const Settings = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { advanced } = attributes;

	const handleAddCard = () => {
		const innerBlocks = [...select("core/block-editor").getBlocks(clientId)];
		const newChildBlock = createBlock("b-blocks/container", { className:"bBlocksStackedSingleCard"});

		innerBlocks.push(newChildBlock);
		dispatch("core/block-editor").replaceInnerBlocks(clientId, innerBlocks, false);

	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
				{'general' === tab.name && <>
					<General {...props} />
				</>}


				{'style' === tab.name && <>
					<Advanced advanced={advanced} onChange={val => setAttributes({ advanced: val })} />
				</>}
			</>}</TabPanel>
		</InspectorControls>

		<BlockControls>
			{/* <AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Block Name Alignment')} alignmentControls={[
				{ title: __('Block Name in left', 'textdomain'), align: 'left', icon: 'align-left' },
				{ title: __('Block Name in center', 'textdomain'), align: 'center', icon: 'align-center' },
				{ title: __('Block Name in right', 'textdomain'), align: 'right', icon: 'align-right' }
			]} />

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} /> */}

			<Button onClick={handleAddCard} style={{ height: "100%" }}>Add Card</Button>
		</BlockControls>

	</>;
};
export default Settings;