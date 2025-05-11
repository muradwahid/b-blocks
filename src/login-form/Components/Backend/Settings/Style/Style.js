import { __experimentalBorderBoxControl as BorderBoxControl, PanelBody, RangeControl, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { Background, BoxControl, ColorControl, ShadowControl, Typography } from "../../../../../../../bpl-tools/Components";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";
import { emUnit, normalHoverTabs, perUnit, pxUnit } from "../../../../../../../bpl-tools/utils/options";
import { animationOptions } from "../../../../utils/functions";
import MessageStyles from "./MessageStyles";

const Style = ({ attributes, setAttributes, updateObj }) => {
    const { form, formInput, labels, button, errorMessage } = attributes;
    return <>
        <PanelBody className="bPlPanelBody" title={__("Form", "b-blocks")} initialOpen={true} >

            <UnitControl label={__("Field Gap", "b-blocks")} labelPosition="left" value={form.fieldGap} onChange={(value) => updateObj('form', value, "fieldGap")} units={[pxUnit(), emUnit(), perUnit()]} />

            <ColorControl label={__("Links Color", "b-blocks")} value={form.linkColor} onChange={(value) => updateObj('form', value, "linkColor")} />

            <ColorControl label={__("Links Hover Color", "b-blocks")} value={form.linkHovColor} onChange={(value) => updateObj('form', value, "linkHovColor")} />
        </PanelBody>

        <PanelBody className="bPlPanelBody" title={__("Label", "b-blocks")} initialOpen={false} >
            <UnitControl label={__("Spacing", "b-blocks")} labelPosition="left" value={labels.space} onChange={(value) => updateObj('labels', value, "space")} units={[pxUnit(), emUnit()]} />

            <ColorControl label={__("Text Color", "b-blocks")} value={labels.color} onChange={(value) => updateObj('labels', value, "color")} />

            <Typography label={__("Typography", "b-blocks")} value={labels.typography} onChange={(value) => updateObj('labels', value, "typography")} />
        </PanelBody>

        <PanelBody className="bPlPanelBody" title={__("Input Fields", "b-blocks")} initialOpen={false} >

            <ColorControl label={__("Text Color", "b-blocks")} value={formInput.color} onChange={(value) => updateObj('formInput', value, "color")} />

            <Typography label={__("Typography", "b-blocks")} value={formInput.typography} onChange={(value) => updateObj('formInput', value, "typography")} />

            <ColorControl label={__("Background", "b-blocks")} value={formInput.bgColor} onChange={(value) => updateObj('formInput', value, "bgColor")} />

            <BorderBoxControl className="mt10" label={__("Border", "b-blocks")} value={formInput.border} onChange={(val) => updateObj('formInput', val, "border")} />

            <BoxControl className="mt10" label={__("Border Radius", 'b-blocks')} values={formInput.radius} onChange={value => updateObj('formInput', value, 'radius')} />

            {formInput.icon.show && (
                <Fragment>
                    <RangeControl label={__("Icon Position", "form-input")} min={0} max={200} value={formInput.icon.position} onChange={(value) => updateObj('formInput', value, "icon", "position")} />

                    <RangeControl label={__("Icon Size", "b-blocks")} value={formInput.icon.size} onChange={(value) => updateObj('formInput', value, "icon", "size")} />

                    <ColorControl label={__("Icon Color", "b-blocks")} value={formInput.icon.color} onChange={(value) => updateObj('formInput', value, "icon", "color")} />
                </Fragment>
            )}
        </PanelBody>

        <PanelBody className="bPlPanelBody" title={__("Input Error Message", "b-blocks")} initialOpen={false} >

            <Typography label={__("Typography", "b-blocks")} value={errorMessage.typography} onChange={(value) => updateObj('errorMessage', value, "typography")} />

            <ColorControl label={__("Text Color", "b-blocks")} value={errorMessage.color} onChange={(value) => updateObj('errorMessage', value, "color")} />
        </PanelBody>

        <PanelBody className="bPlPanelBody" title={__("Button", "b-blocks")} initialOpen={false} >

            <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={normalHoverTabs} onSelect={tabController} >
                {tab => <>
                    {tab.name === 'normal' && <>
                        <BoxControl label={__("Padding", "b-blocks")} values={button.padding} resetValues={{ top: "12px", left: "30px", bottom: "12px", right: "30px" }} onChange={(value) => updateObj('button', value, "padding")} />

                        <Typography label={__("Typography", "b-blocks")} value={button.typography} onChange={(value) => updateObj('button', value, "typography")} />
                    </>}


                    <ColorControl label={__('Text Color', 'b-blocks')} value={button[tab.name].colors.text} onChange={value => updateObj('button', value, tab.name, 'colors', 'text')} />

                    <Background label={__('Background', 'b-blocks')} value={button[tab.name].colors.bg} onChange={value => updateObj('button', value, tab.name, 'colors', 'bg')} isImage={false} />

                    <BorderBoxControl className="mt20" label={__("Border", "b-blocks")} value={button[tab.name].border} onChange={(val) => updateObj('button', val, tab.name, "border")} />

                    {/* <BorderControl className="mt20" label={__("Border", "b-blocks")} value={button[tab.name].border} onChange={(val) => setAttributes({ button: updateData(button, val, tab.name, "border") })} defaults={{ radius: "3px" }} /> */}

                    <ShadowControl className="mt20" label={__("Shadow:", "b-blocks")} value={button[tab.name].shadow} onChange={(value) => updateObj('button', value, tab.name, "shadow")} />

                    {tab.name === "hover" && <SelectControl className="mt20" label={__("Animation", "b-blocks")} labelPosition='edge' value={button.animation} options={animationOptions} onChange={(value) => updateObj('button', value, "animation")} />}
                </>}
            </TabPanel>
        </PanelBody>

        <MessageStyles {...{ attributes, setAttributes, updateObj }} />
    </>
};

export default Style;
