import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device } from '../../../../../../../bpl-tools/Components';
import { aspectOptions, sizeUnits } from '../../../../utils/options';

const Dimensions = ({ attributes, updateObj, device = 'desktop' }) => {
	const { align = '', dimensions = {}, lightbox = {} } = attributes;
	const { aspectRatio = '' } = dimensions;

	// In a lightbox the viewer fills the popup and these sizes are not used (they stay saved for when it is off).
	if (lightbox.enabled) {
		return <PanelBody className='bPlPanelBody' title={__('Dimensions', 'b-blocks')} initialOpen={false}>
			<p>{__('The document opens in a lightbox, so it fills the popup. These sizes apply when the lightbox is off.', 'b-blocks')}</p>
		</PanelBody>;
	}

	return <PanelBody className='bPlPanelBody' title={__('Dimensions', 'b-blocks')} initialOpen={false}>
		{'wide' !== align && 'full' !== align && <UnitControl
			__next40pxDefaultSize
			label={<>{__('Width', 'b-blocks')} <Device /></>}
			labelPosition='edge'
			value={dimensions[device]?.width}
			units={sizeUnits}
			onChange={(val) => updateObj('dimensions', val || '', device, 'width')}
		/>}

		<SelectControl
			className='mt10'
			label={__('Sizing', 'b-blocks')}
			labelPosition='edge'
			help={__('A page shape keeps the same proportions on every screen; a fixed height is set per device.', 'b-blocks')}
			value={aspectRatio}
			options={aspectOptions}
			onChange={(val) => updateObj('dimensions', val, 'aspectRatio')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>

		{'' === aspectRatio && <UnitControl
			className='mt10'
			__next40pxDefaultSize
			label={<>{__('Height', 'b-blocks')} <Device /></>}
			labelPosition='edge'
			value={dimensions[device]?.height}
			units={sizeUnits}
			onChange={(val) => updateObj('dimensions', val || '', device, 'height')}
		/>}
	</PanelBody>;
};
export default Dimensions;
