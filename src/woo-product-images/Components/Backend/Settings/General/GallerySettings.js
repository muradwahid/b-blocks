import { __ } from '@wordpress/i18n';
import {
	Flex, PanelBody, RangeControl, SelectControl, TextControl, ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Device } from '../../../../../../../bpl-tools/Components';

import { UNITS, badgePositionOptions, effectOptions, paginationOptions, positionOptions } from '../../../../utils/options';

const GallerySettings = ({ attributes, updateObj, device }) => {
	const { layout = {}, options = {}, badge = {} } = attributes;

	return <PanelBody initialOpen={true} className='bPlPanelBody' title={__('Settings', 'b-blocks')}>
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			label={__('Gallery Position', 'b-blocks')}
			help={__('Where the thumbnails sit: beside the main image (a vertical strip) or above or below it (a horizontal one).', 'b-blocks')}
			value={layout.position || 'bottom'}
			onChange={(val) => updateObj('layout', val || 'bottom', 'position')}
		>
			{positionOptions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<Flex className='mb5 mt10'>
			<Flex className='flex2'>{__('Column Gap', 'b-blocks')}<Device /></Flex>
			<UnitControl className='flex1' __next40pxDefaultSize units={UNITS} value={layout[device]?.columnGap || ''} onChange={(val) => updateObj('layout', val || '', device, 'columnGap')} />
		</Flex>


		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Slide Effect', 'b-blocks')}
			labelPosition='edge'
			help={__('How one main image gives way to the next.', 'b-blocks')}
			value={effectOptions.some(({ value }) => value === options.effect) ? options.effect : 'slide'}
			options={effectOptions}
			onChange={(val) => updateObj('options', val || 'slide', 'effect')}
		/>

		<RangeControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Transition Speed (ms)', 'b-blocks')}
			min={0}
			max={1500}
			step={50}
			allowReset
			resetFallbackValue={350}
			value={Number.isFinite(options.speed) ? options.speed : 350}
			onChange={(val) => updateObj('options', Number.isFinite(val) ? val : 350, 'speed')}
		/>

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={__('Autoplay', 'b-blocks')}
			help={__('The main image moves on by itself; it stops once the shopper chooses an image. On the page only, and not for visitors who ask for reduced motion.', 'b-blocks')}
			checked={!!options.autoplay}
			onChange={(val) => updateObj('options', val, 'autoplay')}
		/>

		{options.autoplay && <>
			<RangeControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Autoplay Delay (ms)', 'b-blocks')}
				min={1000}
				max={10000}
				step={500}
				allowReset
				resetFallbackValue={4000}
				value={Number.isFinite(options.autoplayDelay) ? options.autoplayDelay : 4000}
				onChange={(val) => updateObj('options', Number.isFinite(val) ? val : 4000, 'autoplayDelay')}
			/>

			<ToggleControl
				className='mt10'
				__nextHasNoMarginBottom
				label={__('Pause on Hover', 'b-blocks')}
				checked={false !== options.autoplayPause}
				onChange={(val) => updateObj('options', val, 'autoplayPause')}
			/>
		</>}

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={__('Show Main Image Arrows', 'b-blocks')}
			help={__('Previous and next, on the main image.', 'b-blocks')}
			checked={!!options.mainArrows}
			onChange={(val) => updateObj('options', val, 'mainArrows')}
		/>

		<ToggleGroupControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			label={__('Pagination', 'b-blocks')}
			help={__('On the main image: a dot for each image, or a count like 2 / 5.', 'b-blocks')}
			value={['dots', 'fraction'].includes(options.pagination) ? options.pagination : 'none'}
			onChange={(val) => updateObj('options', val || 'none', 'pagination')}
		>
			{paginationOptions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={__('Enable Zoom on Hover', 'b-blocks')}
			help={__('On the page, for a mouse; not on touch screens, and not here in the editor, where it would get in the way of selecting the block.', 'b-blocks')}
			checked={false !== options.zoom}
			onChange={(val) => updateObj('options', val, 'zoom')}
		/>

		{false !== options.zoom && <RangeControl
			className='mt10'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Zoom Scale', 'b-blocks')}
			min={1.5}
			max={4}
			step={0.1}
			allowReset
			resetFallbackValue={2}
			value={Number.isFinite(options.zoomScale) ? options.zoomScale : 2}
			onChange={(val) => updateObj('options', Number.isFinite(val) ? val : 2, 'zoomScale')}
		/>}

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={__('Enable Lightbox', 'b-blocks')}
			help={__('A click on the main image, or its button, shows the images full size over the page. On the page only.', 'b-blocks')}
			checked={!!options.lightbox}
			onChange={(val) => updateObj('options', val, 'lightbox')}
		/>

		{options.lightbox && <ToggleControl
			className='mt10'
			__nextHasNoMarginBottom
			label={__('Show Captions', 'b-blocks')}
			help={__('Each image’s caption (Media Library), under it in the lightbox.', 'b-blocks')}
			checked={!!options.lightboxCaptions}
			onChange={(val) => updateObj('options', val, 'lightboxCaptions')}
		/>}

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={__('Show Sale Badge', 'b-blocks')}
			help={__('For a product on sale. Here, on the sample images, it always shows.', 'b-blocks')}
			checked={!!options.saleBadge}
			onChange={(val) => updateObj('options', val, 'saleBadge')}
		/>

		{options.saleBadge && <>
			<TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Badge Text', 'b-blocks')}
				help={__('Empty: “Sale!”. {discount} is the saving in percent: “-{discount}%” shows as -25%.', 'b-blocks')}
				maxLength={40}
				value={badge.text || ''}
				onChange={(val) => updateObj('badge', val, 'text')}
			/>

			<ToggleGroupControl
				className='mt20'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				label={__('Badge Position', 'b-blocks')}
				value={'top-right' === badge.position ? 'top-right' : 'top-left'}
				onChange={(val) => updateObj('badge', val || 'top-left', 'position')}
			>
				{badgePositionOptions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
			</ToggleGroupControl>
		</>}
	</PanelBody>;
};

export default GallerySettings;