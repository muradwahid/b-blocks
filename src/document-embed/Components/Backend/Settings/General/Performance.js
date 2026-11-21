import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { BControlPro, PremiumBadge } from '../../../../../../../bpl-tools/ProControls';

const Performance = ({ attributes, updateObj, premiumProps }) => {
	const { performance = {} } = attributes;
	const { lazyLoad = false, gviewFallback = true } = performance;

	return <PanelBody className='bPlPanelBody' title={<>{__('Performance', 'b-blocks')} {!premiumProps?.isPremium && <PremiumBadge />}</>} initialOpen={false}>
		<BControlPro
			label={__('Lazy Load', 'b-blocks')}
			help={__('Load the viewer only when it scrolls near the screen.', 'b-blocks')}
			checked={lazyLoad}
			onChange={(val) => updateObj('performance', val, 'lazyLoad')}
			{...premiumProps}
			Component={ToggleControl}
		/>

		<BControlPro
			className='mt10'
			label={__('Google Viewer Fallback', 'b-blocks')}
			help={__('If the Google or Microsoft viewer has not loaded after 10 seconds, show a message with a link to open the document instead.', 'b-blocks')}
			checked={gviewFallback}
			onChange={(val) => updateObj('performance', val, 'gviewFallback')}
			{...premiumProps}
			Component={ToggleControl}
		/>
	</PanelBody>;
};
export default Performance;
