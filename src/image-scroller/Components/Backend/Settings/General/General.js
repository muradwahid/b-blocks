import { PanelBody, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { Flex, RangeControl, SelectControl, ToggleControl } from "@wordpress/components";
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Device, HelpPanel, MediaArea } from "../../../../../../../bpl-tools/Components";
import { updateData } from "../../../../../../../bpl-tools/utils/functions";
import { directionOptions, easingOptions } from "../../../../utils/options";

const General = (props) => {
    const { attributes, setAttributes, device } = props;
    const { image, options } = attributes;

    return (
        <>
            <HelpPanel
                slug="b-blocks"
                docsLink="https://bplugins.com/docs/content-slider-block/guides/general"
            />

            <PanelBody className="bPlPanelBody" title={__("Image", "b-blocks")} initialOpen={true} >

                <MediaArea value={image.img} height="100%" width="100%" onChange={(value) => setAttributes({ image: updateData(image, value, "img") })} />

                <UnitControl className="mt10" label={<Flex>{__("Container Height", "b-blocks")} <Device /></Flex>} value={image.height[device]} onChange={(value) => setAttributes({ image: updateData(image, value, "height", device) })} />

            </PanelBody>

            <PanelBody className="bPlPanelBody" title={__("Options", "b-blocks")} initialOpen={false}>
                <SelectControl label={__("Scroll Direction", "b-blocks")} labelPosition="edge" className="mt10" options={directionOptions} value={options.direction} onChange={(value) => setAttributes({ options: updateData(options, value, "direction") })} />

                <ToggleControl label={__("Auto Scroll", "b-blocks")} className="mt10" value={options.isScrollAuto} checked={options.isScrollAuto} onChange={(value) => setAttributes({ options: updateData(options, value, "isScrollAuto"), })} />

                {options.isScrollAuto && <>

                    <RangeControl label={__("Scroll Duration (ms)", "b-blocks")} className="mt10" step={50} max={10000} value={options.duration} onChange={(value) => setAttributes({ options: updateData(options, value, "duration") })} />

                    <SelectControl label={__("Easing", "b-blocks")} labelPosition="edge" className="mt10" options={easingOptions} value={options.easing} onChange={(value) => setAttributes({ options: updateData(options, value, "easing") })} />

                </>}
            </PanelBody>
        </>
    );
};
export default compose(
    withSelect((select) => {
        const { getDeviceType } = select('core/editor');

        return {
            device: getDeviceType()?.toLowerCase(),
        };
    })
)(General);