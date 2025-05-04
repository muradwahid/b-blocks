import { Flex, PanelBody } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import React from "react";
import { BoxControl, ColorControl, Device, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";

const FormLabelStyles = ({ attributes, updateObj, device }) => {
    const { formLabel } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Form Labels", "register-form")} initialOpen={false} >

            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={formLabel.margin[device]} onChange={(value) => updateObj('formLabel', value, "margin", device)} />

            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={formLabel.padding[device]} onChange={(value) => updateObj('formLabel', value, "padding", device)} />

            <Typography label={__("Typography", "register-form")} value={formLabel.typography} onChange={(value) => updateObj('formLabel', value, "typography")} />

            <ColorControl label={__("Color", "register-form")} value={formLabel.color.text} onChange={(value) => updateObj('formLabel', value, "color", "text")} />

            <ColorControl label={__("Background", "register-form")} value={formLabel.color.bg} onChange={(value) => updateObj('formLabel', value, "color", "bg")} />

            <BorderControl label={__("Border", "register-form")} value={formLabel.border} onChange={(value) => updateObj('formLabel', value, "border")} />

        </PanelBody>
    );
};
export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(FormLabelStyles);
