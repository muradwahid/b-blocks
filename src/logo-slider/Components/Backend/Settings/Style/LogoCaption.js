import { PanelBody, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React from "react";
import { ColorControl } from "../../../../../../../bpl-tools/Components";

function LogoCaption({ attributes, updateObj }) {
  const { sliderStyles } = attributes;
  const { caption } = sliderStyles;

  return <PanelBody className="bPlPanelBody" title={__("Logo Caption", "b-blocks")} initialOpen={false}>
    <SelectControl label={__("Caption Visibility", "b-blocks")} value={caption.hover} options={[{ value: "visible", label: "Always Visible" }, { value: "hover", label: "Visible on Hover" }]} onChange={(value) => updateObj('sliderStyles', value, 'caption', 'hover')} />

    <ColorControl label={__("Color", "b-blocks")} value={caption.color.text} onChange={(value) => updateObj('sliderStyles', value, 'caption', 'color', 'text')} />

    <ColorControl label={__("Background", "b-blocks")} value={caption.color.bg} onChange={(value) => updateObj('sliderStyles', value, 'caption', 'color', 'bg')} />
  </PanelBody>
}

export default LogoCaption;
