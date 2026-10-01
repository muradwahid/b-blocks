import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { PanelBody, SelectControl } from '@wordpress/components';

import { presets, presetOptions, applyPreset, currentPreset } from '../../../../utils/presets';


const Theme = ({ attributes, setAttributes }) => {
	const matched = useMemo(() => currentPreset(attributes), [attributes]);

	const chosen = matched || (presets[attributes.theme] ? attributes.theme : 'default');

	return <PanelBody className='bPlPanelBody' title={__('Theme', 'b-blocks')} initialOpen={true}>
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Preset', 'b-blocks')}
			labelPosition='edge'
			value={chosen}
			options={presetOptions}
			onChange={(value) => setAttributes({ ...applyPreset(value, attributes), theme: value })}
		/>
	</PanelBody>;
};

export default Theme;
