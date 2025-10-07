import { PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { animationEffectOptions, easingOptions, slideDirectionOptions } from '../../../../utils/options';
const AnimationSettings = ({ attributes, updateObj }) => {
	const { options } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Ticker Options', 'b-blocks')} initialOpen={false} >

			<SelectControl className='mb10' label={__('Effect', 'b-blocks')} labelPosition='edge' value={options.effect} options={animationEffectOptions} onChange={(value) => updateObj('options', value, 'effect')} />

			<RangeControl label={__('Slider Speed(ms)', 'b-blocks')} value={options.sliderSpeed} onChange={(value) => updateObj('options', value, 'sliderSpeed')} min={0} max={10000} />

			<ToggleControl className='mt10' label={__('Autoplay', 'b-blocks')} checked={options.isAutoplay} value={options.isAutoplay} onChange={(value) => updateObj('options', value, 'isAutoplay')} />

			<SelectControl className='mt10' label={__('Easing', 'b-blocks')} labelPosition='edge' value={options.easing} options={easingOptions} onChange={(value) => updateObj('options', value, 'easing')} />

			<RangeControl label={__('Autoplay Speed(ms)', 'b-blocks')} value={options.autoPlaySpeed} onChange={(value) => updateObj('options', value, 'autoPlaySpeed')} min={0} max={10000} />

			{options.isAutoplay && <ToggleControl label={__('Pause On Hover', 'b-blocks')} checked={options.isPauseOnHover} value={options.isPauseOnHover} onChange={(value) => updateObj('options', value, 'isPauseOnHover')} />}

			<ToggleControl className='mt10' label={__('Infinite Loop', 'b-blocks')} checked={options.isLoop} value={options.isLoop} onChange={(value) => updateObj('options', value, 'isLoop')} />

			<ToggleControl className='mt10' label={__('Grab Cursor', 'b-blocks')} checked={options.isGrabCursor} value={options.isGrabCursor} onChange={(value) => updateObj('options', value, 'isGrabCursor')} />

			<ToggleControl className='mt10' label={__('Navigation Arrows', 'b-blocks')} checked={options.isArrows} value={options.isArrows} onChange={(value) => updateObj('options', value, 'isArrows')} />

			{options.effect === 'slide' && <SelectControl className='mt10' label={__('Direction', 'b-blocks')} labelPosition='edge' value={options.direction} options={slideDirectionOptions} onChange={(value) => updateObj('options', value, 'direction')} />}
		</PanelBody>
	</>
};

export default AnimationSettings;
