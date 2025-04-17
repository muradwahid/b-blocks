import { __experimentalInputControl as InputControl, PanelBody, PanelRow, SelectControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { BButtonGroup, HelpPanel, IconLibrary, Label, MediaArea, SortableControl, TinyEditor } from "../../../../../../../bpl-tools/Components";

import { updateData } from '../../../../../../../bpl-tools/utils/functions';
import svgIcon from "../../../../../../assets/icons/christmas-star-icon.svg";
import oktaIconSvg from "../../../../../../assets/icons/okta-icon.svg";
import { htmlTags } from "../../../../utils/options";

const General = (props) => {
  const { attributes, setAttributes } = props;
  const { sortElements, heading, icon, separator, subHeading } = attributes;

  return (
    <>
      <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/content-slider-block/guides/general" />

      <PanelBody className="bPlPanelBody" initialOpen={true} title={__("Elements", "b-blocks")} >
        <SortableControl label={__("Sort Elements:")} value={sortElements} onChange={(val) => setAttributes({ sortElements: val })} />
      </PanelBody>

      <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Heading", "b-blocks")} >
        <PanelRow>
          <Label className="">{__("HTML Tag", "b-blocks")}</Label>
          <SelectControl value={heading.tag} onChange={(value) => setAttributes({ heading: { ...heading, tag: value } })} options={htmlTags} />
        </PanelRow>

        {["first", "last"].map((part) => (
          <InputControl key={part} className="mt20" label={__(`${part} Part`, "b-blocks")} value={heading[part].text} onChange={(value) => setAttributes({ heading: { ...heading, [part]: { ...heading[part], text: value }, }, })} />
        ))}
      </PanelBody>

      <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Separator", "b-blocks")} >
        <ToggleControl label={__("Show Separator", "b-blocks")} checked={separator.show} onChange={(value) => setAttributes({ separator: { ...separator, show: value } })} />

        {separator.show && (
          <>
            <PanelRow>
              <Label className="">Type</Label>
              <SelectControl value={separator.type} options={[{ label: "Line", value: "line" }, { label: "Icon", value: "icon" },]} onChange={(value) => setAttributes({ separator: { ...separator, type: value }, })} />
            </PanelRow>

            {separator.type === "icon" && (
              <>
                <BButtonGroup options={[{ label: "Library", value: "library" }, { label: "Upload", value: "upload" },]} value={separator.iconType} label={__("Icon Type", "b-blocks")} onChange={(value) => setAttributes({ separator: updateData(separator, value, "iconType"), })} />
                {separator.iconType === "library" && (
                  <IconLibrary label={__("Icon Library", "b-blocks")} value={separator.icon.library} onChange={(value) => setAttributes({ separator: updateData(separator, value, "icon", "library"), })} />
                )}
                {separator.iconType === "upload" && (
                  <>s
                    <Label>Icon</Label>
                    <MediaArea types="image/svg+xml" value={separator.icon} default={svgIcon} label={__("Choose SVG", "b-blocks")} className="dual-color-heading-icon" onChange={(value) => setAttributes({ separator: updateData(separator, value, "icon", "upload"), })}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </PanelBody>

      <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Sub Heading", "b-blocks")} >
        <TinyEditor height={220} value={subHeading.text} onChange={(value) => setAttributes({ subHeading: { ...subHeading, text: value } })} />
      </PanelBody>

      <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Icon", "b-blocks")} >
        <ToggleControl label={__("Show Icon", "b-blocks")} checked={icon.show} onChange={(value) => setAttributes({ icon: { ...icon, show: value } })}
        />

        {icon.show && (
          <>
            <BButtonGroup options={[{ label: "Library", value: "library" }, { label: "Upload", value: "upload" },]} value={icon.iconType} label={__("Icon Type", "b-blocks")} onChange={(value) => setAttributes({ icon: updateData(icon, value, "iconType"), })} />
            {icon.iconType === "library" && (
              <IconLibrary label={__("Icon Library", "b-blocks")} value={icon.icon.library} onChange={(value) => setAttributes({ icon: updateData(icon, value, "icon", "library"), })} />
            )}
            {icon.iconType === "upload" && (
              <>
                <Label>{__("Icon", "b-blocks")}</Label>
                <MediaArea types="image/svg+xml" default={oktaIconSvg} value={icon.icon.upload} label={__("Choose SVG", "b-blocks")} onChange={(value) => setAttributes({ icon: updateData(icon, value, "icon", "upload"), })} />
              </>
            )}
          </>
        )}
      </PanelBody>
    </>
  );
};
export default General;
