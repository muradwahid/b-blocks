import { __ } from "@wordpress/i18n";

import { __experimentalInputControl as InputControl, __experimentalNumberControl as NumberControl, ToggleControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { BtnGroup, MediaArea } from "../../../../../../../bpl-tools/Components";
import starIcon from "../../../../../../assets/icons/starIcon.svg";
import { placeholderImg } from '../../../../utils/data';
import { headerAlignOptions } from '../../../../utils/options';
const HeaderSettings = ({ attributes, index, updateObj }) => {
  const { headings } = attributes;
  const item = headings[index];

  return (
    <>
      <InputControl label={__("Column Name", "b-blocks")} value={item.clName} onChange={(value) => updateObj('headings', value, index, "clName")} type="text" labelPosition="left" />

      <NumberControl label={__("Column Span", "b-blocks")} labelPosition="left" className="mt10" style={{ gap: "13px" }} onChange={(value) => updateObj('headings', value, index, "clSpan")} step={1} min={1} max={10} value={item.clSpan} />

      <UnitControl className='mt10' label={__("Width", "b-blocks")} labelPosition='edge' onChange={(value) => updateObj('headings', value, index, "width")} isUnitSelectTabbable value={item.width} />

      <ToggleControl className='mt10' label={__("Enable Header Icon", "b-blocks")} checked={item.enableIcon} value={item.enableIcon} onChange={(value) => updateObj('headings', value, index, "enableIcon")} />

      {item.enableIcon && (
        <>
          <BtnGroup label={__('Icon Type', 'b-blocks')} isIcon={true} value={item.iconType} options={headerAlignOptions} onChange={(value) => updateObj('headings', value, index, "iconType")} />

          {item?.iconType === "icon" && (
            <MediaArea default={starIcon} value={{ url: item.icon }} types={["image/svg+xml"]} onChange={(value) => updateObj('headings', value.url, index, "icon")} />
          )}

          {item?.iconType === "image" && (
            <MediaArea label={__("Choose Image", "b-blocks")} default={placeholderImg} value={{ url: item.image }} height="100%" width="100%" onChange={(value) => updateObj('headings', value.url, index, "image")} />
          )}
        </>
      )}
    </>
  );
};
export default HeaderSettings;
