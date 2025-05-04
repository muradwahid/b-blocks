import { Flex, PanelBody, RangeControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import React from "react";
import { ColorControl, Device } from "../../../../../../../bpl-tools/Components";

const FieldIconStyles = ({ attributes, updateObj, device }) => {
    const { fieldIcons } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Form Icons", "register-form")} initialOpen={false}>
            <div className="mt10">
                <strong>Form Fields Icon</strong>
            </div>

            <RangeControl className='mt10' label={<Flex>{__("Icon Size", "register-form")} <Device /></Flex>} value={fieldIcons.icon.iconSize[device]} onChange={(value) => updateObj('fieldIcons', value, "icon", "iconSize", device)} />

            <ColorControl className='mt10' label={__("Icon Color", "register-form")} value={fieldIcons.icon.color} onChange={(value) => updateObj('fieldIcons', value, "icon", "color")} />

            <RangeControl className='mt10' label={<Flex>{__("Vertical Alignment", "register-form")} <Device /></Flex>} value={fieldIcons.icon.vertical[device]} min={-100} max={100} onChange={(value) => updateObj('fieldIcons', value, "icon", "vertical", device)} />

            <RangeControl className='mt10' label={<Flex>{__("Horizontal Alignment", "register-form")} <Device /></Flex>} value={fieldIcons.icon.horizontal[device]} onChange={(value) => updateObj('fieldIcons', value, "icon", "horizontal", device)} />

            <hr />

            <div className="mt10">
                <strong>Password Visibility Icon</strong>
            </div>

            <RangeControl className='mt10' label={<Flex>{__("Icon Size", "register-form")} <Device /></Flex>} value={fieldIcons.passVisibility.iconSize[device]} onChange={(value) => updateObj('fieldIcons', value, "passVisibility", "iconSize", device)} />

            <ColorControl className='mt10' label={__("Open Eye Color", "register-form")} value={fieldIcons.passVisibility.openColor} onChange={(value) => updateObj('fieldIcons', value, "passVisibility", "openColor")} />

            <ColorControl className='mt10' label={__("Close Eye Color", "register-form")} value={fieldIcons.passVisibility.closeColor} onChange={(value) => updateObj('fieldIcons', value, "passVisibility", "closeColor")} />

            <RangeControl className='mt10' label={<Flex>{__("Vertical Alignment", "register-form")} <Device /></Flex>} value={fieldIcons.passVisibility.vertical[device]} min={-100} max={100} onChange={(value) => updateObj('fieldIcons', value, "passVisibility", "vertical", device)} />

            <RangeControl className='mt10' label={<Flex>{__("Horizontal Alignment", "register-form")} <Device /></Flex>} value={fieldIcons.passVisibility.horizontal[device]} onChange={(value) => updateObj('fieldIcons', value, "passVisibility", "horizontal", device)} />
        </PanelBody >
    );
};
export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(FieldIconStyles);
