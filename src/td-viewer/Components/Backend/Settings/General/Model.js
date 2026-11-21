import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, ToggleControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, InlineDetailMediaUpload } from '../../../../../../../bpl-tools/Components';
import { pxUnit, perUnit, emUnit } from '../../../../../../../bpl-tools/utils/options';
import { loadingTypes } from '../../../../utils/options';

const Model = ({ attributes, setAttributes }) => {
	const { model, width, height, isTouchMove, isZoom, loadingType } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('3D Model Settings', 'b-blocks')}>
		<Label className=''>{__('Model:', 'b-blocks')}</Label>
		<InlineDetailMediaUpload types={['model/gltf-binary']} value={model} onChange={val => setAttributes({ model: val, animationName: '', variantName: '' })} placeholder={__('Enter Model URL', 'b-blocks')} />

		{/* <PanelRow>
			<Label className='mb5'>{__('Source Type:', 'b-blocks')}</Label>
			<BtnGroup value={sourceType} onChange={val => setAttributes({ sourceType: val })} options={sourceTypes} />
		</PanelRow>
		{'upload' === sourceType && <small>{__('Please refresh the page first, if you install the plugin for the first time from gutenberg editor')}</small>}

		{'upload' === sourceType && <>
			<Label>{__('Upload:', 'b-blocks')}</Label>

			<div className='editImageHolder'>
				<div className='mediaControl'>
					<MediaUpload allowedTypes={['model/gltf-binary']} value={model?.id} onSelect={onModelSelect} render={({ open }) =>
						!model.url ? <div className='btnControl'>
							<Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
						</div> : <div className='btnControl'>
							<Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
							<Button icon='exit' onClick={() => setAttributes({ model: { id: null, url: '', title: '' } })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
						</div>} />
				</div>

				<model-viewer class='modelPreview' src={model?.url} alt={model?.title}></model-viewer>
			</div>
		</>}

		{'link' === sourceType && <>
			<Label>{__('Model Link:', 'b-blocks')}</Label>
			<TextControl value={modelLink} onChange={val => setAttributes({ modelLink: val })} />
		</>} */}

		<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit(), perUnit(), emUnit()]} />
		<small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

		<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ height: val })} units={[pxUnit(), perUnit(), emUnit()]} />
		<small>{__('Keep height 0, to 350px height.', 'b-blocks')}</small>

		<ToggleControl className='mt20' label={__('Controls via mouse/touch', 'b-blocks')} checked={isTouchMove} onChange={val => setAttributes({ isTouchMove: val })} />

		{isTouchMove && <>
			<ToggleControl className='mt20' label={__('Zoom', 'b-blocks')} checked={isZoom} onChange={val => setAttributes({ isZoom: val })} />
			<small>{__(`Enable 'Controls via mouse/touch' to work Zoom!`, 'b-blocks')}</small>
		</>}

		<PanelRow className='mt20'>
			<Label className=''>{__('Loading Type:', 'b-blocks')}</Label>
			<SelectControl value={loadingType} onChange={val => setAttributes({ loadingType: val })} options={loadingTypes} />
		</PanelRow>
	</PanelBody>;
};
export default Model;
