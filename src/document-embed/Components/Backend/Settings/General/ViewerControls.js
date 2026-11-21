import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { BControlPro, PremiumBadge } from '../../../../../../../bpl-tools/ProControls';
import { zoomOptions } from '../../../../utils/options';

const ViewerControls = ({ attributes, updateObj, premiumProps }) => {
	const { viewer = {} } = attributes;
	const { engine = 'default', thumbnails = false, initialPage = 1, defaultZoom = '' } = viewer;

	const toggle = (prop, label, help) => <BControlPro
		className='mt10'
		label={label}
		help={help}
		checked={viewer[prop]}
		onChange={(val) => updateObj('viewer', val, prop)}
		{...premiumProps}
		Component={ToggleControl}
	/>;

	return <PanelBody className='bPlPanelBody' title={<>{__('Viewer Controls', 'b-blocks')} {!premiumProps?.isPremium && <PremiumBadge />}</>} initialOpen={false}>
		{toggle('readerMode', __('Reader Mode', 'b-blocks'), __('A minimal view without the viewer controls.', 'b-blocks'))}

		{toggle('thumbnails', __('Thumbnails', 'b-blocks'), __('Allow the page thumbnail sidebar.', 'b-blocks'))}

		{thumbnails && toggle('sidebarOpen', __('Open Sidebar on Load', 'b-blocks'))}

		{'custom' === engine && toggle('horizontalScroll', __('Horizontal Scrollbar', 'b-blocks'))}

		{toggle('bypassCache', __('Load Latest Version', 'b-blocks'), __('Bypass the browser cache, for files you replace often.', 'b-blocks'))}

		{toggle('fullscreen', __('Full Screen Button', 'b-blocks'))}

		{toggle('fullscreenNewTab', __('Open Full Screen in a New Tab', 'b-blocks'))}

		{'custom' === engine && toggle('rememberPage', __('Remember Last Page', 'b-blocks'), __('Visitors come back to the page they last read. Kept in their own browser; nothing is stored on the site.', 'b-blocks'))}

		{toggle('onDemandRendering', __('On-Demand Page Rendering', 'b-blocks'), __('Render pages as they scroll into view. Faster for long documents.', 'b-blocks'))}

		<BControlPro
			className='mt10'
			label={__('Initial Page', 'b-blocks')}
			value={initialPage}
			min={1}
			labelPosition='edge'
			onChange={(val) => updateObj('viewer', Math.max(1, parseInt(val, 10) || 1), 'initialPage')}
			{...premiumProps}
			Component={NumberControl}
		/>

		{'custom' === engine && <BControlPro
			className='mt10'
			label={__('Default Zoom', 'b-blocks')}
			value={defaultZoom}
			options={zoomOptions}
			onChange={(val) => updateObj('viewer', val, 'defaultZoom')}
			{...premiumProps}
			Component={SelectControl}
		/>}
	</PanelBody>;
};
export default ViewerControls;
