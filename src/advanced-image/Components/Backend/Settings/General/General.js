import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { imgSizes, imgSrcOptions, imgStyleOptions } from '../../../../utils/options';

const General = ({ attributes, setAttributes, updateObj }) => {
	const { image, layout, style, caption } = attributes;
	const { sourceType, link } = image;
	const { optionType } = style;
	const { enabled } = caption;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')}>
			<SelectControl
				label={__('Source', 'b-blocks')}
				labelPosition='left'
				value={sourceType}
				options={imgSrcOptions}
				onChange={(v) => updateObj('image', v, 'sourceType')}
			/>

			<SelectControl
				className='mt20'
				label={__('Styles', 'b-blocks')}
				labelPosition='left'
				value={optionType}
				options={imgStyleOptions}
				help={optionType === 'Circle' || optionType === 'Rhombus' || optionType === 'Octagon' || optionType === 'Triangle' ? `Please Use Equal 'Height' & 'Width' For Perfect ${optionType} Shape.` : ''}
				onChange={(v) => updateObj('style', v, 'optionType')}
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

			<TextControl
				className='mt20'
				label={__('Link', 'b-blocks')}
				placeholder='https://example.com'
				help='If you want to link the image, please enter the URL. If not want to link leave as blank'
				value={link.url}
				onChange={(v) => updateObj('image', v, 'link', 'url')}
			/>

			{link.url && <ToggleControl
				className='mt20'
				checked={link.tab === '_blank'}
				label={__('Open in New Tab', 'b-blocks')}
				onChange={(v) => updateObj('image', v ? '_blank' : '_self', 'link', 'tab')}
			/>}

		</PanelBody>

		{
			sourceType === 'custom' && <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					checked={enabled}
					label={__('Display Caption', 'b-blocks')}
					onChange={(v) => updateObj('caption', v, 'enabled')}
				/>
			</PanelBody>
		}

	</>
};
export default General;