import {
  __experimentalBorderBoxControl as BorderBoxControl,
  Flex,
  PanelBody,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
  BoxControl,
  ColorControl,
  Device,
  ShadowControl,
} from "../../../../../../../bpl-tools/Components";
import { updateData } from "../../../../../../../bpl-tools/utils/functions";

const TooltipStyle = ({ setAttributes, attributes, device }) => {
  const { tooltip } = attributes;
  return (
    <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Tooltip", "b-blocks")} >

      <UnitControl
        label={__("Width", "b-blocks")}
        labelPosition='edge'
        units={[{ label: "px", value: "px" }]}
        isUnitSelectTabbable
        value={tooltip.width}
        min={1}
        max={800}
        onChange={(value) =>
          setAttributes({
            tooltip: {
              ...tooltip,
              width: value,
            },
          })
        }
      />
      <BoxControl
        className="mt10"
        label={<Flex>{__("Padding", "b-blocks")} <Device /></Flex>}
        values={tooltip.padding[device]}
        resetValues={{
          left: "5px",
          right: "5px",
          top: "5px",
          bottom: "5px",
        }}
        onChange={(value) =>
          setAttributes({
            tooltip: updateData(tooltip, value, "padding", device),
          })
        }
      />

      <ColorControl
        label={__("Text Color", "b-blocks")}
        value={tooltip.textColor}
        colors={[
          { name: "red", color: "#f00" },
          { name: "white", color: "#fff" },
          { name: "blue", color: "#00f" },
        ]}
        onChange={(value) =>
          setAttributes({
            tooltip: { ...tooltip, textColor: value },
          })
        }
      />
      <ColorControl
        label={__("Background Color", "b-blocks")}
        value={tooltip.bgColor}
        colors={[
          { name: "red", color: "#f00" },
          { name: "white", color: "#fff" },
          { name: "blue", color: "#00f" },
        ]}
        onChange={(value) =>
          setAttributes({
            tooltip: { ...tooltip, bgColor: value },
          })
        }
      />
      <BorderBoxControl
        label={__("Border", "b-blocks")}
        value={tooltip.border}
        onChange={(value) =>
          setAttributes({ tooltip: updateData(tooltip, value, "border") })
        }
      />

      <BoxControl
        label={<Flex>{__("Border Radius", "b-blocks")} <Device /></Flex>}
        className="mt10"
        values={tooltip.borderRadius[device]}
        resetValues={{
          left: "3px",
          right: "3px",
          top: "3px",
          bottom: "3px",
        }}
        onChange={(value) =>
          setAttributes({
            tooltip: updateData(tooltip, value, "borderRadius", device),
          })
        }
      />

      <ShadowControl
        label={__("Shadow", "b-blocks")}
        value={tooltip.shadow}
        onChange={(value) => {
          setAttributes({
            tooltip: updateData(tooltip, value, "shadow"),
          });
        }}
      />
    </PanelBody>
  );
};
export default compose(
  withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })
)(TooltipStyle);
