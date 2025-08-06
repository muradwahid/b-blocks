import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TabPanel, ToolbarButton, ToolbarGroup } from '@wordpress/components';


import { generalStyleTabs } from '../../../../utils/options';
import General from './General/General';
import Advanced from '../../../../../../bpl-tools/Advanced';
import usePremiumInEditor from '../../../../hooks/usePremiumInEditor';

const enabledAdvOptions = {
	dimension: ['padding', 'margin', 'height', 'minHeight', 'maxHeight'],
	transform: true,
	background: ['normal', 'hover', 'overlay'],
	borderShadow: ['normal', 'hover', 'border', 'shadow'],
	mask: true,
	animation: true,
	visibility: ['zIndex', 'overflow'],
	responsive: true,
	css: true
}

const Settings = props => {
	const {
		// nextClientId,
		attributes, setAttributes, columns, updateColumns } = props;

	const { advanced } = attributes;

	const { isPremium } = usePremiumInEditor();

	return <>
		<InspectorControls>

			<TabPanel className='bPlTabPanel bPlRemPrev' activeClass='activeTab' tabs={generalStyleTabs}>
				{
					tab => <>
						{
							tab.name === "general" && <><General {...props} /></>
						}
						{
							tab.name === "style" && <><Advanced advanced={advanced} onChange={value => setAttributes({ advanced: value })} enabled={enabledAdvOptions} isPremium={isPremium} /></>
						}
					</>
				}
			</TabPanel>

		</InspectorControls>


		<BlockControls>
			<ToolbarGroup label={__('Column Options', 'b-blocks')}>
				{columns < 6 && <ToolbarButton icon='plus' label={__('Add Column', 'b-blocks')} onClick={() => updateColumns('add')} />}

				{columns > 1 && <ToolbarButton icon='trash' label={__('Delete Column', 'b-blocks')} onClick={() => updateColumns('delete')} />}
			</ToolbarGroup>
		</BlockControls>
	</>;
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Settings);