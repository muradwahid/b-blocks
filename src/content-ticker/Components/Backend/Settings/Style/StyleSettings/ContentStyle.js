import { Flex, PanelBody } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import React, { useState } from "react";
import { BoxControl, ColorControl, Device, Typography } from "../../../../../../../../bpl-tools/Components";
import Tab from "../../Panel/Tab/Tab";

const ContentStyle = ({ attributes, setAttributes, device }) => {
  const { style } = attributes;
  const [tab, setTab] = useState("normal");
  const update = (property, value, secondProperty, thirdProperty) => {
    const updatedData = produce(style, (draft) => {
      if (thirdProperty) {
        draft[property][secondProperty][thirdProperty] = value;
      } else if (secondProperty) {
        draft[property][secondProperty] = value;
      } else {
        draft[property] = value;
      }
    });
    setAttributes({ style: updatedData });
  };
  return (
    <PanelBody className="bPlPanelBody" title={__("Content Style", "b-blocks")} initialOpen={false} >

      <BoxControl label={<Flex>{__("Padding", "b-blocks")} <Device /></Flex>} values={style.padding[device]} resetValues={{ top: "0px", right: "0px", bottom: "0px", left: "0px" }} onChange={(value) => update("padding", value, device)} />

      <BoxControl label={__("Border Radius", "b-blocks")} values={style.bRadius} resetValues={{ top: "0px", right: "0px", bottom: "0px", left: "0px" }} onChange={(value) => update("bRadius", value)} />

      <ColorControl label={__("Background", "b-blocks")} value={style.bg} onChange={(value) => update("bg", value)} />

      <Tab options={[{ label: "Normal", value: "normal" }, { label: "Hover", value: "hover" }]} onChange={(val) => setTab(val)} value={tab} />

      <ColorControl label={__("Text Color", "b-blocks")} value={style.color[tab]} onChange={(value) => update("color", value, tab)} />

      <Typography label={__("Typography", "b-blocks")} value={style.typography} onChange={(value) => update("typography", value)} />

    </PanelBody>
  );
};

export default withSelect((select) => {
  const { getDeviceType } = select("core/editor");

  return {
    device: getDeviceType()?.toLowerCase(),
  };
})(ContentStyle);
