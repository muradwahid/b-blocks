import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, ToggleControl, SelectControl, TextControl, Button, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { interactionPrompts } from '../../../../utils/options';

const RotationCamera = ({ attributes, setAttributes, tdViewerRef }) => {
	const { isAutoRotate = true, rotationSpeed = '', autoRotateDelay = '', cameraOrbit = '', fieldOfView = '', interactionPrompt = '' } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Rotation & Camera', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Auto Rotate', 'b-blocks')} checked={isAutoRotate} onChange={val => setAttributes({ isAutoRotate: val })} />

		{isAutoRotate && <>
			<NumberControl className='mt20' label={__('Rotation Speed (deg per second):', 'b-blocks')} value={rotationSpeed} onChange={val => setAttributes({ rotationSpeed: val })} placeholder={__('auto', 'b-blocks')} />
			<small>{__('Use a negative number to rotate the other way. Leave empty for the default speed.', 'b-blocks')}</small>

			<NumberControl className='mt20' label={__('Auto Rotate Delay (ms):', 'b-blocks')} value={autoRotateDelay} onChange={val => setAttributes({ autoRotateDelay: val })} min={0} step={100} placeholder='3000' />
			<small>{__('Wait time before rotation starts again after interaction. 1000ms = 1s.', 'b-blocks')}</small>
		</>}

		<TextControl className='mt20' label={__('Camera Angle:', 'b-blocks')} value={cameraOrbit} onChange={val => setAttributes({ cameraOrbit: val })} placeholder='0deg 75deg 105%' help={__('Horizontal angle, vertical angle and distance. Leave empty for the default view.', 'b-blocks')} />

		<PanelRow>
			<Button variant='secondary' onClick={() => {
				const viewer = tdViewerRef.current?.querySelector('model-viewer');
				if (!viewer) return;
				const { theta, phi, radius } = viewer.getCameraOrbit();
				setAttributes({ cameraOrbit: `${(theta * 180 / Math.PI).toFixed(1)}deg ${(phi * 180 / Math.PI).toFixed(1)}deg ${radius.toFixed(3)}m` });
			}}>{__('Use Current View', 'b-blocks')}</Button>

			{cameraOrbit && <Button variant='tertiary' isDestructive onClick={() => setAttributes({ cameraOrbit: '' })}>{__('Reset', 'b-blocks')}</Button>}
		</PanelRow>
		<small>{__('Turn the model in the preview, then save that angle as the starting view.', 'b-blocks')}</small>

		<NumberControl className='mt20' label={__('Field of View (deg):', 'b-blocks')} value={fieldOfView} onChange={val => setAttributes({ fieldOfView: val })} min={10} max={90} placeholder={__('auto', 'b-blocks')} />
		<small>{__('A lower value zooms in. Leave empty for auto.', 'b-blocks')}</small>

		<PanelRow className='mt20'>
			<Label className=''>{__('Interaction Prompt:', 'b-blocks')}</Label>
			<SelectControl value={interactionPrompt} onChange={val => setAttributes({ interactionPrompt: val })} options={interactionPrompts} />
		</PanelRow>
		<small>{__('The hand hint that shows the model can be turned.', 'b-blocks')}</small>
	</PanelBody>;
};
export default RotationCamera;
