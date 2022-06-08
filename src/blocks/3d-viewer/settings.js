import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl, ToggleControl, SelectControl, __experimentalUnitControl as UnitControl, Button, ToolbarGroup, ToolbarButton, Dashicon } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import BtnGroup from '../../../../Components/BtnGroup';

import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const sourceTypes = [
	{ label: __('Upload', 'b-blocks'), value: 'upload' },
	{ label: __('Link', 'b-blocks'), value: 'link' }
];
const loadingTypes = [
	{ label: __('Auto', 'b-blocks'), value: 'auto' },
	{ label: __('Lazy', 'b-blocks'), value: 'lazy' },
	{ label: __('Eager', 'b-blocks'), value: 'eager' }
];

const Settings = ({ attributes, setAttributes }) => {
	const { alignment, sourceType, model, modelLink, width, height, isTouchMove, isZoom, loadingType } = attributes;

	const onModelSelect = ({ id, url, title }) => setAttributes({ model: { ...model, id, url, title } });

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/3d-viewer-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' size={23} />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' size={23} />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('3D Model Settings', 'b-blocks')}>
				<PanelRow>
					<Title mt='0'>{__('Source Type:', 'b-blocks')}</Title>
					<BtnGroup value={sourceType} onChange={val => setAttributes({ sourceType: val })} options={sourceTypes} />
				</PanelRow>
				{'upload' === sourceType && <small>{__('Please refresh the page first, if you install the plugin for the first time from gutenberg editor')}</small>}

				{'upload' === sourceType && <>
					<Title>{__('Upload:', 'b-blocks')}</Title>

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
					<Title>{__('Model Link:', 'b-blocks')}</Title>
					<TextControl value={modelLink} onChange={val => setAttributes({ modelLink: val })} />
				</>}

				<UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />
				<small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

				<UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ height: val })} units={[pxUnit, perUnit, emUnit]} />
				<small>{__('Keep height 0, to 350px height.', 'b-blocks')}</small>

				<ToggleControl className='mt20' label={__('Controls via mouse/touch', 'b-blocks')} checked={isTouchMove} onChange={val => setAttributes({ isTouchMove: val })} />

				{isTouchMove && <>
					<ToggleControl className='mt20' label={__('Zoom', 'b-blocks')} checked={isZoom} onChange={val => setAttributes({ isZoom: val })} />
					<small>{__(`Enable 'Controls via mouse/touch' to work Zoom!`, 'b-blocks')}</small>
				</>}

				<PanelRow className='mt20'>
					<Title mt='0' mb='0'>{__('Loading Type:', 'b-blocks')}</Title>
					<SelectControl value={loadingType} onChange={val => setAttributes({ loadingType: val })} options={loadingTypes} />
				</PanelRow>
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			{model?.url && <ToolbarGroup className='bPlToolbar'>
				<MediaUploadCheck>
					<MediaUpload allowedTypes={['model/gltf-binary']} value={model?.id} onSelect={onModelSelect} render={({ open }) => <ToolbarButton label={__('Edit 3D Model:', 'b-blocks')} icon='edit' onClick={open} />} />
				</MediaUploadCheck>
			</ToolbarGroup>}

			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('3D Model Alignment')} alignmentControls={[
				{ title: __('3D Model in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('3D Model in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('3D Model in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;