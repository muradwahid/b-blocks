
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Device } from "../../../../../../../bpl-tools/Components";
import { updateData } from "../../../../../../../bpl-tools/utils/functions";
import DefaultHeaderStyle from "./DefaultHeaderStyle";
import ListSettings from "./ListSettings";
import SlideSettings from "./SlideSettings";
import TimelineSettings from "./TimelineSettings";


const Style = ({ attributes, setAttributes, device }) => {
  const { theme, sticky } = attributes;
  return (
    <>
      {
        sticky.toggle && <PanelBody className="bPlPanelBody" title={__("Container", "b-blocks")}>
          <UnitControl
            value={sticky.width[device]}
            label={<Flex>{__("Width", "b-blocks")} <Device /></Flex>}
            onChange={(val) =>
              setAttributes({
                sticky: updateData(sticky, val, "width", device),
              })
            }
          />
        </PanelBody>
      }

      {/* <BoxStyle attributes={attributes} setAttributes={setAttributes} /> */}
      {theme === "default" && <DefaultHeaderStyle attributes={attributes} setAttributes={setAttributes} />}
      {"slide" === theme && <SlideSettings attributes={attributes} setAttributes={setAttributes} />}
      {"timeline" === theme && <TimelineSettings attributes={attributes} setAttributes={setAttributes} />}
      {"list" === theme && <ListSettings attributes={attributes} setAttributes={setAttributes} />}
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
)(Style);