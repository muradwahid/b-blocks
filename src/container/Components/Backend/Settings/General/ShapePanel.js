import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { PanelRow, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, ColorControl, Device, MediaArea } from '../../../../../../../bpl-tools/Components';
import { SelectControlPro } from '../../../../../../../bpl-tools/ProControls';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import { shapedOptions } from '../../../../utils/options';

const ShapePanel = ({ labelPrefix, shape, setAttributes, uploadSvg, type, color, width, height, isUpload, isFlip, isFront, name, premiumProps, device }) => {

	return <>
		<ToggleControl className='mt15' label={`${labelPrefix} Upload Shape`} checked={isUpload} onChange={val => setAttributes({ shape: updateData(shape, val, name, 'isUpload') })} />

		{isUpload ? <MediaArea
			className='mt20'
			value={uploadSvg}
			types='image/svg+xml'
			onChange={({ id, url, alt, title }) => setAttributes({ shape: updateData(shape, { id, url, alt, title }, name, 'uploadSvg') })}
			height='100%'
			width='100%'
		/> : <SelectControlPro
			className='mt20'
			label={__(`${labelPrefix} Shape Type`, 'b-blocks')}
			value={type}
			options={shapedOptions}
			onChange={val => setAttributes({ shape: updateData(shape, val, name, 'type') })}
			{...premiumProps}
			proValues={['cloud', 'mountain', 'fire', 'sports', 'travel']}
		/>}

		<PanelRow className='mt20'>
			<Label className=''>{__(`${labelPrefix} Shape Width:`, 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<UnitControl
			value={width[device]}
			onChange={val => setAttributes({ shape: updateData(shape, val, name, 'width', device) })}
			beforeIcon='grid-view'
			step={1}
		/>

		<PanelRow className='mt20'>
			<Label className=''>{__(`${labelPrefix} Shape Height:`, 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<UnitControl
			value={height[device]}
			onChange={val => setAttributes({ shape: updateData(shape, val, name, 'height', device) })}
			beforeIcon='grid-view'
		/>

		<ColorControl
			className='mt20'
			label={__(`${labelPrefix} Shape Color`, 'b-blocks')}
			value={color}
			onChange={val => setAttributes({ shape: updateData(shape, val, name, 'color') })}
			defaultColor='#000'
		/>

		<ToggleControl
			className='mt20'
			label='Flip'
			checked={isFlip}
			onChange={val => setAttributes({ shape: updateData(shape, val, name, 'isFlip') })}
		/>

		<ToggleControl
			className='mt10'
			label='Bring to Front'
			checked={isFront}
			onChange={val => setAttributes({ shape: updateData(shape, val, name, 'isFront') })}
		/>
	</>
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(ShapePanel);