import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import { Background, BoxControl, ColorControl, Device, Typography } from "../../../../../../../../bpl-tools/Components";

const BadgeStyle = ({ attributes, setAttributes, device }) => {
  const { badge } = attributes;
  const update = (property, value, secondProperty, thirdProperty) => {
    const updatedData = produce(badge, (draft) => {
      if (thirdProperty) {
        draft[property][secondProperty][thirdProperty] = value;
      } else if (secondProperty) {
        draft[property][secondProperty] = value;
      } else {
        draft[property] = value;
      }
    });
    setAttributes({ badge: updatedData });
  };
  return (
    <PanelBody className="bPlPanelBody" title={__("Badge Style", "b-blocks")} initialOpen={true}>

      <UnitControl label={<Flex>{__("Width", "b-blocks")} <Device /></Flex>} value={badge.width[device]} onChange={(value) => update("width", value, device)} />

      <UnitControl label={<Flex>{__("Height", "b-blocks")} <Device /></Flex>} value={badge.height[device]} onChange={(value) => update("height", value, device)} />

      <Background label={__("Background", "b-blocks")} value={badge.color.bg} onChange={(value) => update("color", value, "bg")} defaults={{ color: "#0e0e0e" }} />

      <ColorControl label={__("Color", "b-blocks")} value={badge.color.text} onChange={(value) => update("color", value, "text")} default="#00F" />

      <Typography label={__("Typography", "b-blocks")} value={badge.typography} onChange={(value) => update("typography", value)} />

      <BoxControl label={<Flex>{__("Padding", "b-blocks")} <Device /></Flex>} values={badge.padding[device]} onChange={(value) => update("padding", value, [device])} />

      <BoxControl label={<Flex>{__("Margin", "b-blocks")} <Device /></Flex>} values={badge.margin.desktop} onChange={(value) => update("margin", value, [device])} />

      <BorderBoxControl label={__("Border", "b-blocks")} value={badge.border} onChange={(value) => update("border", value)} />

      <BoxControl label={<Flex>{__("Border Radius", "b-blocks")} <Device /></Flex>} values={badge.bRadius[device]} onChange={(value) => update("bRadius", value, [device])} />
    </PanelBody>
  );
};

export default withSelect((select) => {
  const { getDeviceType } = select('core/editor');

  return {
    device: getDeviceType()?.toLowerCase(),
  };
})(BadgeStyle);
