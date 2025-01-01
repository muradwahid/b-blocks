import { __ } from '@wordpress/i18n';
import { withSelect } from "@wordpress/data";
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { ToolbarButton } from '@wordpress/components';
import { ToolbarGroup } from '@wordpress/components';

import { updateData } from '../../../../../../bpl-tools/utils/functions';

import { generalStyleTabs } from '../../../utils/options';
import General from "./General/General";
import Style from "./Style/Style";

const Settings = ({ attributes, setAttributes, device }) => {
	const { image } = attributes;
	const { sourceType, source } = image;

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>
				{tab => <>
					{'general' === tab.name && <General attributes={attributes} setAttributes={setAttributes} device={device} />}

					{'style' === tab.name && <Style attributes={attributes} setAttributes={setAttributes} device={device} />}
				</>}
			</TabPanel>
		</InspectorControls>


		<BlockControls>
			{source.url && sourceType === 'custom' && <ToolbarGroup>
				<ToolbarButton icon='edit' iconSize='25' title={__('Edit Custom Image', 'b-blocks')} onClick={() => setAttributes({ image: updateData(image, '', 'source', 'url') })} />
			</ToolbarGroup>}
		</BlockControls>
	</>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Settings);