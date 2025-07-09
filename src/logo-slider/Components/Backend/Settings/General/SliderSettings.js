import { PanelBody, RangeControl, SelectControl, ToggleControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import React from 'react';

const SliderSettings = ({ attributes, updateObj, device }) => {
    const { options } = attributes;
    return <PanelBody className='bPlPanelBody' title={__("Slider Settings", "b-blocks")} initialOpen={false}>

        <ToggleControl label={__("Enable Autoplay", "b-blocks")} checked={options.autoplay} value={options.autoplay} onChange={(value) => updateObj('options', value, 'autoplay')} />

        <SelectControl className="mt10" label={__("Slide Direction", "b-blocks")} labelPosition="edge" value={options.direction} options={[{ value: "rightToLeft", label: "Right to Left" }, { value: "leftToRight", label: "Left to Right" },]} onChange={(value) => updateObj('options', value, 'direction')} />

        <ToggleControl className="mt10 mb10" label={__("Show Navigation", "b-blocks")} checked={options.navigation} onChange={(value) => updateObj("options", value, "navigation")} />

        <ToggleControl className="mt10 mb10" label={__("Show Pagination", "b-blocks")} checked={options.pagination} onChange={(value) => updateObj('options', value, 'pagination')} />

        {options.pagination && (
            <ToggleControl className="mt10 mb10" label={__("Dynamic Pagination", "b-blocks")} checked={options.dynamicPagination} onChange={(value) => updateObj('options', value, 'dynamicPagination')} />
        )}

        <ToggleControl className="mt10 mb10" label={__("Infinite Loop", "b-blocks")} checked={options.loop} onChange={(value) => updateObj('options', value, 'loop')} />

        <ToggleControl className="mt10 mb10" label={__("Show Logo Caption", "b-blocks")} checked={options.isCaptionVisible} onChange={(value) => updateObj('options', value, 'isCaptionVisible')} />

        <RangeControl className="mt10 mb10" label={__("Slider Speed (Second)", "b-blocks")} value={options.speed} step={1} onChange={(value) => updateObj('options', value, 'speed')} min={1} max={10} />

        <RangeControl label={__("Slider Delay Speed (Second)", "b-blocks")} value={options.delay} step={1} onChange={(value) => updateObj('options', value, 'delay')} min={1} max={10} />

        <RangeControl className="mt10 mb10" label={__("Logos Per View", "b-blocks")} value={options.logoView[device]} onChange={(value) => updateObj('options', value, 'logoView', device)} step={1} min={1} max={20} />

        <RangeControl label={__("Space Between", "b-blocks")} value={options.space[device]} onChange={(value) => updateObj('options', value, 'space', device)} step={1} min={1} max={200} />
    </PanelBody>
};

export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(SliderSettings);