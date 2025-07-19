import { PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { animationEffectOptions, slideDirectionOptions } from '../../../../utils/options';
const AnimationSettings = ({ attributes, updateObj }) => {
	const { animation } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Animation Settings', 'b-blocks')} initialOpen={false} >

			<SelectControl className='mb10' label={__('Effect', 'b-blocks')} labelPosition='edge' value={animation.effect} options={animationEffectOptions} onChange={(value) => updateObj('animation', value, 'effect')} />

			<RangeControl label={__('Slider Speed(ms)', 'b-blocks')} value={animation.sliderSpeed} onChange={(value) => updateObj('animation', value, 'sliderSpeed')} min={0} max={10000} />

			<ToggleControl className='mt10' label={__('Autoplay', 'b-blocks')} checked={animation.isAutoplay} value={animation.isAutoplay} onChange={(value) => updateObj('animation', value, 'isAutoplay')} />

			<RangeControl label={__('Autoplay Speed(ms)', 'b-blocks')} value={animation.autoPlaySpeed} onChange={(value) => updateObj('animation', value, 'autoPlaySpeed')} min={0} max={10000} />

			{animation.isAutoplay && <ToggleControl label={__('Pause On Hover', 'b-blocks')} checked={animation.isPauseOnHover} value={animation.isPauseOnHover} onChange={(value) => updateObj('animation', value, 'isPauseOnHover')} />}

			<ToggleControl className='mt10' label={__('Infinite Loop', 'b-blocks')} checked={animation.isLoop} value={animation.isLoop} onChange={(value) => updateObj('animation', value, 'isLoop')} />

			<ToggleControl className='mt10' label={__('Grab Cursor', 'b-blocks')} checked={animation.isGrabCursor} value={animation.isGrabCursor} onChange={(value) => updateObj('animation', value, 'isGrabCursor')} />

			<ToggleControl className='mt10' label={__('Navigation Arrows', 'b-blocks')} checked={animation.isArrows} value={animation.isArrows} onChange={(value) => updateObj('animation', value, 'isArrows')} />

			{animation.effect === 'slide' && <SelectControl className='mt10' label={__('Direction', 'b-blocks')} labelPosition='edge' value={animation.direction} options={slideDirectionOptions} onChange={(value) => updateObj('animation', value, 'direction')} />}
		</PanelBody>
	</>
};

export default AnimationSettings;
