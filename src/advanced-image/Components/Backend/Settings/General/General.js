import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Device } from '../../../../../../../bpl-tools/Components';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import { hoverEffectOptions, imgFitOptions, imgSizes, imgSrcOptions, imgStyleOptions } from '../../../../utils/options';

const General = ({ attributes, setAttributes, device }) => {
	const { image, layout, style, caption } = attributes;
	const { sourceType, link } = image;
	const { height, isAutoHeight, isAutoFit, fitOptionType } = layout;
	const { hoverEffect, optionType } = style;
	const { enabled } = caption;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')}>
			<SelectControl
				label={__('Source', 'b-blocks')}
				labelPosition='left'
				value={sourceType}
				options={imgSrcOptions}
				onChange={(v) => setAttributes({ image: updateData(image, v, 'sourceType') })}
			/>

			<SelectControl
				className='mt20'
				label={__('Styles', 'b-blocks')}
				labelPosition='left'
				value={optionType}
				options={imgStyleOptions}
				help={optionType === 'Circle' || optionType === 'Rhombus' || optionType === 'Octagon' || optionType === 'Triangle' ? `Please Use Equal 'Height' & 'Width' For Perfect ${optionType} Shape.` : ''}
				onChange={(v) => setAttributes({ style: updateData(style, v, 'optionType') })}
			/>

			<SelectControl
				className='mt20'
				label={__('Size', 'b-blocks')}
				labelPosition='left'
				value={layout.size}
				options={imgSizes}
				onChange={(val) => {
					let newWidth;
					switch (val) {
						case 'thumbnail':
							newWidth = '150px';
							break;
						case 'medium':
							newWidth = '300px';
							break;
						case 'large':
							newWidth = '1024px';
							break;
						default:
							newWidth = '100%';
					}

					setAttributes({
						layout: {
							...layout,
							size: val,
							width: {
								desktop: newWidth,
								tablet: newWidth,
								mobile: newWidth
							}
						}
					});
				}}
			/>
			<span>{__('Width will be change while changing the Size', 'b-blocks')}</span>

			<PanelRow className='mt20'>
				<Label>{__('Width', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<UnitControl
				value={layout.width[device]}
				onChange={(v) => setAttributes({ layout: updateData(layout, v, 'width', device) })}
			/>

			<ToggleControl
				className='mt20'
				checked={isAutoHeight}
				label={__('Auto Height', 'b-blocks')}
				onChange={(v) => setAttributes({ layout: updateData(layout, v, 'isAutoHeight') })}
			/>

			{!isAutoHeight && <>
				<PanelRow className='mt10'>
					<Label>{__('Height', 'b-blocks')}</Label>
					<Device />
				</PanelRow>
				<UnitControl
					value={height[device]}
					onChange={(v) => setAttributes({ layout: updateData(layout, v, 'height', device) })}
				/>
			</>}

			<ToggleControl
				className='mt20'
				checked={isAutoFit}
				label={__('Auto Fit', 'b-blocks')}
				onChange={(v) => setAttributes({ layout: updateData(layout, v, 'isAutoFit') })}
			/>
			{isAutoFit && <SelectControl
				className='mt10'
				label={__('Image Fit Options', 'b-blocks')}
				labelPosition='left'
				value={fitOptionType}
				options={imgFitOptions}
				onChange={(v) => setAttributes({ layout: updateData(layout, v, 'fitOptionType') })}
			/>}

			<TextControl
				className='mt20'
				label={__('Link', 'b-blocks')}
				placeholder='https://example.com'
				help='If you want to link the image, please enter the URL. If not want to link leave as blank'
				value={link.url}
				onChange={(v) => setAttributes({ image: updateData(image, v, 'link', 'url') })}
			/>

			{link.url && <ToggleControl
				className='mt20'
				checked={link.tab === '_blank'}
				label={__('Open in New Tab', 'b-blocks')}
				onChange={(v) => setAttributes({ link: updateData(link, v ? '_blank' : '_self', 'tab') })}
			/>}

			<SelectControl
				className='mt20'
				label={__('Hover Effect', 'b-blocks')}
				labelPosition='left'
				value={hoverEffect}
				options={hoverEffectOptions}
				onChange={(v) => setAttributes({ style: updateData(style, v, 'hoverEffect') })}
			/>
		</PanelBody>

		{
			sourceType === 'custom' && <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					checked={enabled}
					label={__('Display Caption', 'b-blocks')}
					onChange={(v) => setAttributes({ caption: updateData(caption, v, 'enabled') })}
				/>
			</PanelBody>
		}

	</>
};
export default General;