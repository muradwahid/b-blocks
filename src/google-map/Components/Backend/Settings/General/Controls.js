import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import { Notice } from '../../../../../../../bpl-tools/Components';

import { controlPositions } from '../../../../utils/options';

const Controls = ({ controls = {}, updateObj }) => {
	const disabled = !!controls.disableDefaultUI;

	return <PanelBody className='bPlPanelBody' title={__('Map Controls', 'b-blocks')} initialOpen={false}>
		<ToggleControl
			label={__('Hide all default controls', 'b-blocks')}
			checked={disabled}
			onChange={(val) => updateObj('controls', !!val, 'disableDefaultUI')}
			__nextHasNoMarginBottom
		/>

		{disabled && <Notice status='info' isIcon={true}>
			{__('All built-in controls are hidden. Turn this off to pick them individually.', 'b-blocks')}
		</Notice>}

		{!disabled && <>
			<ToggleControl className='mt10' label={__('Zoom Buttons', 'b-blocks')} checked={!!controls.zoom} onChange={(val) => updateObj('controls', !!val, 'zoom')} __nextHasNoMarginBottom />

			{controls.zoom && <SelectControl
				className='mt10'
				label={__('Zoom Control Position', 'b-blocks')}
				value={controls.zoomPosition || 'RIGHT_BOTTOM'}
				options={controlPositions}
				onChange={(val) => updateObj('controls', val, 'zoomPosition')}
				__nextHasNoMarginBottom
			/>}

			<ToggleControl className='mt10' label={__('Map Type Switcher', 'b-blocks')} checked={!!controls.mapType} onChange={(val) => updateObj('controls', !!val, 'mapType')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Street View (Pegman)', 'b-blocks')} checked={!!controls.streetView} onChange={(val) => updateObj('controls', !!val, 'streetView')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Fullscreen', 'b-blocks')} checked={!!controls.fullscreen} onChange={(val) => updateObj('controls', !!val, 'fullscreen')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Scale', 'b-blocks')} checked={!!controls.scale} onChange={(val) => updateObj('controls', !!val, 'scale')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Rotate / Tilt', 'b-blocks')} checked={!!controls.rotate} onChange={(val) => updateObj('controls', !!val, 'rotate')} __nextHasNoMarginBottom />
		</>}

		<ToggleControl
			className='mt10'
			label={__('Keyboard Shortcuts', 'b-blocks')}
			checked={false !== controls.keyboardShortcuts}
			onChange={(val) => updateObj('controls', !!val, 'keyboardShortcuts')}
			help={__('Lets keyboard users pan and zoom the map. Keep this on for accessibility.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};
export default Controls;
