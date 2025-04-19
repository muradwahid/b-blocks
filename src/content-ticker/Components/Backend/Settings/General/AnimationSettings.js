import { PanelBody, RangeControl, SelectControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import React, { Fragment } from "react";
import { animationEffectOptions, slideDirectionOptions } from '../../../../utils/options';
const AnimationSettings = ({ attributes, setAttributes }) => {
  const { animation } = attributes;
  const update = (property, value) => {
    const updatedData = produce(animation, (draft) => {
      draft[property] = value;
    });
    setAttributes({ animation: updatedData });
  };
  return (
    <Fragment>
      <PanelBody className='bPlPanelBody' title={__("Animation Settings", "b-blocks")} initialOpen={false} >

        <SelectControl className='mb10' label={__("Effect", "b-blocks")} labelPosition='edge' value={animation.effect} options={animationEffectOptions} onChange={(value) => update("effect", value)} />

        <RangeControl label={__("Slider Speed(ms)", "b-blocks")} value={animation.sliderSpeed} onChange={(value) => update("sliderSpeed", value)} min={0} max={10000} />

        <ToggleControl className='mt10' label={__("Autoplay", "b-blocks")} checked={animation.isAutoplay} value={animation.isAutoplay} onChange={(value) => update("isAutoplay", value)} />

        <RangeControl label={__("Autoplay Speed(ms)", "b-blocks")} value={animation.autoPlaySpeed} onChange={(value) => update("autoPlaySpeed", value)} min={0} max={10000} />

        {
          animation.isAutoplay && <ToggleControl label={__("Pause On Hover", "b-blocks")} checked={animation.isPauseOnHover} value={animation.isPauseOnHover} onChange={(value) => update("isPauseOnHover", value)} />
        }

        <ToggleControl className='mt10' label={__("Infinite Loop", "b-blocks")} checked={animation.isLoop} value={animation.isLoop} onChange={(value) => update("isLoop", value)} />

        <ToggleControl className='mt10' label={__("Grab Cursor", "b-blocks")} checked={animation.isGrabCursor} value={animation.isGrabCursor} onChange={(value) => update("isGrabCursor", value)} />

        <ToggleControl className='mt10' label={__("Navigation Arrows", "b-blocks")} checked={animation.isArrows} value={animation.isArrows} onChange={(value) => update("isArrows", value)} />

        {animation.effect === "slide" && (
          <SelectControl className='mt10' label={__("Direction", "b-blocks")} labelPosition='edge' value={animation.direction} options={slideDirectionOptions} onChange={(value) => update("direction", value)} />
        )}
      </PanelBody>
    </Fragment>
  );
};

export default AnimationSettings;
