import { __ } from '@wordpress/i18n';
import {
	Flex, Notice, PanelBody, RangeControl, SelectControl, ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Device, Label, SelectTokenField } from '../../../../../../../bpl-tools/Components';

import { SIZE_UNITS, UNITS, changeOnOptions, deviceOptions, ratioOptions, thumbFitOptions, thumbViewOptions } from '../../../../utils/options';

const ThumbnailsSettings = ({ attributes, updateObj, device }) => {
	const { layout = {}, options = {}, thumbLayout = {} } = attributes;
	const hideOn = Array.isArray(thumbLayout.hideOn) ? thumbLayout.hideOn : [];
	const isGrid = 'grid' === thumbLayout.view;
	const isVertical = 'left' === layout.position || 'right' === layout.position;

	return <PanelBody className='bPlPanelBody' title={__('Thumbnails', 'b-blocks')} initialOpen={false}>
		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			label={__('Thumbnails View', 'b-blocks')}
			help={isGrid ? __('Every thumbnail at once, in rows.', 'b-blocks') : __('One strip that scrolls, with arrows when not every thumbnail fits.', 'b-blocks')}
			value={isGrid ? 'grid' : 'slider'}
			onChange={(val) => updateObj('thumbLayout', val || 'slider', 'view')}
		>
			{thumbViewOptions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<div className='mt20'>
			<Flex className='mb5'><span className='bPlLabel'>{isGrid ? __('Columns', 'b-blocks') : __('Thumbnails per View', 'b-blocks')}</span><Device /></Flex>
			<RangeControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={isGrid ? __('Columns', 'b-blocks') : __('Thumbnails per View', 'b-blocks')}
				hideLabelFromVision
				help={isGrid ? __('Empty: 4, or the larger screen’s.', 'b-blocks') : __('Empty: as many as fit at the Thumbnail Size.', 'b-blocks')}
				min={1}
				max={10}
				allowReset
				resetFallbackValue=''
				value={parseInt(thumbLayout[device]?.columns, 10) || ''}
				onChange={(val) => updateObj('thumbLayout', val || '', device, 'columns')}
			/>
		</div>

		{(isVertical || !isGrid) && <>

			<UnitControl className='mt20' __next40pxDefaultSize label={<Flex className='mb5'><Label className='bPlLabel'>{__('Thumbnail Size', 'b-blocks')}</Label><Device /></Flex>} labelPosition='edge' units={SIZE_UNITS} value={thumbLayout[device]?.size || ''} onChange={(val) => updateObj('thumbLayout', val || '', device, 'size')}
				help={isVertical ? __('Each thumbnail’s width, beside the main image.', 'b-blocks') : __('Each thumbnail’s height, when Thumbnails per View is empty.', 'b-blocks')}
			/>

		</>}

		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Thumbnail Ratio', 'b-blocks')}
			labelPosition='edge'
			value={thumbLayout.ratio || '1/1'}
			options={ratioOptions}
			onChange={(val) => updateObj('thumbLayout', val, 'ratio')}
		/>

		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Thumbnail Image Fit', 'b-blocks')}
			labelPosition='edge'
			help={__('Contain shows the whole image, inside the thumbnail’s shape.', 'b-blocks')}
			value={thumbLayout.fit || 'cover'}
			options={thumbFitOptions}
			onChange={(val) => updateObj('thumbLayout', val, 'fit')}
		/>

		<div className='mt20'>
			<Flex className='mb5'><span className='bPlLabel'>{__('Thumbnails Space', 'b-blocks')}</span><Device /></Flex>
			<UnitControl __next40pxDefaultSize label={__('Thumbnails Space', 'b-blocks')} hideLabelFromVision units={UNITS} value={layout[device]?.thumbGap || ''} onChange={(val) => updateObj('layout', val || '', device, 'thumbGap')} />
		</div>

		<br />

		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			label={__('Change Image On', 'b-blocks')}
			value={'hover' === thumbLayout.changeOn ? 'hover' : 'click'}
			onChange={(val) => updateObj('thumbLayout', val || 'click', 'changeOn')}
		>
			{changeOnOptions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<div className='mt20'>
			<span className='bPlLabel'>{__('Hide Thumbnails On', 'b-blocks')}</span>
			<div className='mt5'>
				<SelectTokenField
					multiple
					options={deviceOptions}
					value={hideOn}
					onChange={(val) => updateObj('thumbLayout', Array.isArray(val) ? val : [], 'hideOn')}
				/>
			</div>
			<p className='components-base-control__help'>{__('Then the arrows or the pagination on the main image change it.', 'b-blocks')}</p>

			{!!hideOn.length && !options.mainArrows && 'dots' !== options.pagination && <Notice className='mt10' status='warning' isDismissible={false}>
				{__('With the thumbnails hidden, only a swipe changes the image (on touch screens): turn on Show Main Image Arrows, or Pagination: Dots, in Settings.', 'b-blocks')}
			</Notice>}
		</div>

		{!isGrid && <>
			<ToggleControl
				className='mt20'
				__nextHasNoMarginBottom
				label={__('Center Active Thumbnail', 'b-blocks')}
				help={__('The strip scrolls to keep the chosen thumbnail in its middle.', 'b-blocks')}
				checked={!!thumbLayout.centered}
				onChange={(val) => updateObj('thumbLayout', val, 'centered')}
			/>

			<ToggleControl
				className='mt10'
				__nextHasNoMarginBottom
				label={__('Scroll With Mouse Wheel', 'b-blocks')}
				help={__('At either end the page scrolls on.', 'b-blocks')}
				checked={!!thumbLayout.mousewheel}
				onChange={(val) => updateObj('thumbLayout', val, 'mousewheel')}
			/>

			<ToggleControl
				className='mt10'
				__nextHasNoMarginBottom
				label={__('Disable Thumbnail Navigation Icon', 'b-blocks')}
				help={__('The arrows also hide by themselves when every thumbnail already fits.', 'b-blocks')}
				checked={!!options.hideArrows}
				onChange={(val) => updateObj('options', val, 'hideArrows')}
			/>
		</>}
	</PanelBody>;
};

export default ThumbnailsSettings;
