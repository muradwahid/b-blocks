import { Flex, PanelBody, RangeControl, SelectControl, TabPanel } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import { BoxControl, BtnGroup, ColorControl, Device } from "../../../../../../../bpl-tools/Components";
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import { alignmentOptions, borderOptions } from "../../../../utils/options";

const HeaderStyle = ({ attributes, setAttributes, device }) => {
  const { headerStyle } = attributes;
  const update = (property, value, secondProperty, thirdProperty) => {
    let updatedData;
    if (thirdProperty) {
      updatedData = produce(headerStyle, (draft) => {
        draft[property][secondProperty][thirdProperty] = value;
      });
    } else if (secondProperty) {
      updatedData = produce(headerStyle, (draft) => {
        draft[property][secondProperty] = value;
      });
    } else {
      updatedData = produce(headerStyle, (draft) => {
        draft[property] = value;
      });
    }
    setAttributes({ headerStyle: updatedData });
  };

  return (
    <PanelBody className='bPlPanelBody' title={__("Header Style", "b-blocks")} initialOpen={false}>
      <RangeControl label={__("Border Radius", "data-block")} min={0} max={200} value={headerStyle.bRadius} onChange={(value) => update("bRadius", value)} />

      <BoxControl label={<Flex>{__("Padding", "data-block")}<Device /></Flex>} values={headerStyle.padding[device]} onChange={(value) => update("padding", value, [device])} />

      <TabPanel className='bPlTabPanel mini mt10' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
        {
          tab => <>
            <ColorControl className="mt10" label={__("Color", "b-blocks")} value={headerStyle.color[tab.name]} onChange={(value) => update("color", value, [tab.name])} />

            <ColorControl className="mt10" label={__("Background", "b-blocks")} value={headerStyle.bg[tab.name]} onChange={(value) => update("bg", value, [tab.name])} style={{ margin: "10px 0" }} />

            <SelectControl className="mt10" label={__("Border Type", "b-blocks")} labelPosition="left" value={headerStyle.borderType[tab.name]} options={borderOptions} onChange={(value) => update("borderType", value, [tab.name])} />

            {headerStyle.borderType[tab.name] !== "default" && headerStyle.borderType[tab.name] !== "none" && <>
              <RangeControl className="mt10" label={__("Border Width", "b-blocks")} value={headerStyle.border[tab.name].width} min={0} max={30} step={1} onChange={(value) => update("border", value, [tab.name], "width")} />

              <ColorControl className="mt10" label={__("Border Color", "b-blocks")} value={headerStyle.border[tab.name].color} onChange={(value) => update("border", value, [tab.name], "color")} style={{ margin: "10px 0" }} />
            </>}

            {tab.name === "normal" && (<>
              <RangeControl className="mt10" label={<Flex>{__("Icon/Image Size")}<Device /></Flex>} min={0} max={200} value={headerStyle.iconSize[device]} onChange={(value) => update("iconSize", value, [device])} />

              <RangeControl className="mt10" label={<Flex>{__("Icon/Image Space")} <Device /></Flex>} min={0} max={200} value={headerStyle.iconSpace[device]} onChange={(value) => update("iconSpace", value, [device])} />

              <ColorControl className="mt10" label={__("Icon Color", "b-blocks")} value={headerStyle.iconColor} onChange={(value) => update("iconColor", value)} style={{ margin: "10px 0" }} />

              <BtnGroup className="mt10" label={__("Title Alignment", "b-blocks")} options={alignmentOptions} value={headerStyle.titleAlign} onChange={(val) => update("titleAlign", val)} isIcon={true} />
            </>
            )}
          </>
        }
      </TabPanel>

    </PanelBody>
  );
};
export default withSelect((select) => {
  const { getDeviceType } = select("core/editor");

  return {
    device: getDeviceType()?.toLowerCase(),
  };
})(HeaderStyle);
