import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { MediaArea } from '../../../../../../../bpl-tools/Components';
import { BControlPro, PremiumBadge } from '../../../../../../../bpl-tools/ProControls';
import { sizeOptions, triggerOptions } from '../../../../utils/options';

const Lightbox = ({ attributes, updateObj, premiumProps }) => {
	const { lightbox = {} } = attributes;
	const { enabled = false, trigger = 'button', buttonText = '', buttonSize = 'medium', selector = '', image = {} } = lightbox;

	return <PanelBody className='bPlPanelBody' title={<>{__('Lightbox', 'b-blocks')} {!premiumProps?.isPremium && <PremiumBadge />}</>} initialOpen={false}>
		<BControlPro
			label={__('Open in a Lightbox', 'b-blocks')}
			help={__('Show a trigger on the page; the document opens in a popup.', 'b-blocks')}
			checked={enabled}
			onChange={(val) => updateObj('lightbox', val, 'enabled')}
			{...premiumProps}
			Component={ToggleControl}
		/>

		{enabled && <>
			<SelectControl
				className='mt10'
				label={__('Trigger', 'b-blocks')}
				value={trigger}
				options={triggerOptions}
				labelPosition='edge'
				onChange={(val) => updateObj('lightbox', val, 'trigger')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>

			{'button' === trigger && <SelectControl
				className='mt10'
				label={__('Button Size', 'b-blocks')}
				value={buttonSize}
				options={sizeOptions}
				labelPosition='edge'
				onChange={(val) => updateObj('lightbox', val, 'buttonSize')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>}

			{'selector' !== trigger && <TextControl
				className='mt10'
				label={'image' === trigger ? __('Image Alt Text', 'b-blocks') : __('Button Text', 'b-blocks')}
				value={'image' === trigger ? image.alt || '' : buttonText}
				placeholder={'image' === trigger ? '' : __('View Document', 'b-blocks')}
				onChange={(val) => 'image' === trigger ? updateObj('lightbox', val, 'image', 'alt') : updateObj('lightbox', val, 'buttonText')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>}

			{'image' === trigger && <div className='mt10'>
				{!image.url && <p className='b-blocks-document-embed-warning'>{__('Until an image is selected, a button opens the document.', 'b-blocks')}</p>}

				{/* The area's own delete button clears the image; the alt text above is kept for the next one. */}
				<MediaArea
					label={image.url ? __('Replace Image', 'b-blocks') : __('Choose Image', 'b-blocks')}
					value={image}
					types={['image']}
					width='100%'
					height='120px'
					onChange={(media) => updateObj('lightbox', { id: media?.id || 0, url: media?.url || '', alt: media?.alt || image.alt || '' }, 'image')}
				/>
			</div>}

			{'selector' === trigger && <TextControl
				className='mt10'
				label={__('CSS Selector', 'b-blocks')}
				value={selector}
				placeholder='.open-brochure'
				help={__('Clicking any element on the page that matches this selector opens the document.', 'b-blocks')}
				onChange={(val) => updateObj('lightbox', val, 'selector')}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>}

			{'selector' === trigger && '' === selector.trim() && <p className='b-blocks-document-embed-warning'>{__('Until a selector is set, a button opens the document.', 'b-blocks')}</p>}
		</>}
	</PanelBody>;
};
export default Lightbox;
