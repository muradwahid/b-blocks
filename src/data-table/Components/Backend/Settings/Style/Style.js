import { Flex, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import { BtnGroup, Device } from "../../../../../../../bpl-tools/Components";
import { alignmentOptions } from '../../../../utils/options';
import ContentStyle from "./ContentStyle";
import HeaderStyle from "./HeaderStyle";
const Style = ({ attributes, setAttributes, device, updateObj }) => {
  const { table } = attributes;
  const update = (property, value, secondProperty) => {
    let updatedData;
    if (secondProperty) {
      updatedData = produce(table, (draft) => {
        draft[property][secondProperty] = value;
      });
    } else {
      updatedData = produce(table, (draft) => {
        draft[property] = value;
      });
    }
    setAttributes({ table: updatedData });
  };

  return (
    <>
      <PanelBody className='bPlPanelBody' title={__("General Style", "b-blocks")} initialOpen={true}>

        <UnitControl label={<Flex>{__("Width", "b-blocks")} <Device /></Flex>} onChange={(value) => update("width", value, device)} isUnitSelectTabbable value={table.width[device]} min={0} max={table.width[device].includes("%") ? 100 : 1200} />

        <BtnGroup label={__("Alignment", "b-blocks")} options={alignmentOptions} value={table.alignment} onChange={(val) => update("alignment", val)} isIcon={true} />

        <ToggleControl className='mt10' label={__("Separate Border", "b-blocks")} checked={table.borderSeparator} onChange={(value) => update("borderSeparator", value)} />

      </PanelBody>
      <HeaderStyle attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />
      <ContentStyle attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />
    </>
  );
};

export default withSelect((select) => {
  const { getDeviceType } = select("core/editor");

  return {
    device: getDeviceType()?.toLowerCase(),
  };
})(Style);
