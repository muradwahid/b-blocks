import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

import { PULSE_PRESET, presets } from '../../../../utils/options';

const Layout = ({ attributes, setAttributes }) => {
	const { layout = {}, animation = {} } = attributes;

	const choose = (val) => setAttributes({
		layout: { ...layout, preset: val },
		animation: { ...animation, pulse: PULSE_PRESET === val }
	});

	return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
		<SelectControl
			label={__('Choose A Style', 'b-blocks')}
			value={layout.preset || 'glassBullseye'}
			options={presets}
			onChange={choose}
			help={__('Pick how the navigation menu looks on your page.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};

export default Layout;
