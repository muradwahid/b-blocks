import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { BlockControls, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { ToolbarButton } from '@wordpress/components';
import { ToolbarGroup } from '@wordpress/components';

import General from './General/General';
import Style from './Style/Style';
import { allTabs } from '../../../../utils/options';
import Advanced from '../../../../../../bpl-tools/Advanced'
const defEnabled = {
	dimension: ['padding', 'margin', 'width','minHeight', 'maxHeight'],
	transform: true,
	background: ['normal', 'hover', 'overlay'],
	borderShadow: ['normal', 'hover', 'border', 'shadow'],
	mask: true,
	animation: true,
	visibility: ['zIndex', 'overflow'],
	responsive: true,
	css: true
}

const Settings = ({ attributes, setAttributes, updateObj, isPremium, device }) => {
	const { image } = attributes;
	const { sourceType, source } = image;
	const props = { attributes, setAttributes, updateObj, isPremium, device }

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={allTabs}>
				{tab => <>
					{'general' === tab.name && <General {...props} />}

					{'style' === tab.name && <Style {...props} />}

					{'advanced' === tab.name && <Advanced advanced={attributes.advanced} onChange={value => setAttributes({ advanced: value })} isPremium={isPremium} enabled={defEnabled} />}

				</>}
			</TabPanel>
		</InspectorControls>

		<BlockControls>
			{source.url && sourceType === 'custom' && <ToolbarGroup>
				<MediaUploadCheck>
					<MediaUpload
						allowedTypes={['image/*']}
						onSelect={({ id, url, alt, title }) => updateObj('image', { id, url, alt, title }, 'source')}
						render={({ open }) => <ToolbarButton icon='edit' iconSize='25' title={__('Edit Custom Image', 'b-blocks')} onClick={open} />}
					/>
				</MediaUploadCheck>
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