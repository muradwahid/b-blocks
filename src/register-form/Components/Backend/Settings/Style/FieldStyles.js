import { Flex, PanelBody, TabPanel } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { BoxControl, BtnGroup, ColorControl, Device, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController, updateData } from "../../../../../../../bpl-tools/utils/functions";
import { alignCenter, alignLeft, alignRight } from "../../../../utils/icons";
const FieldStyles = ({ attributes, setAttributes, updateObj, device }) => {
    const { formFields } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Form Fields", "register-form")} initialOpen={false} >

            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /> </Flex>} values={formFields.input.margin[device]} onChange={(value) => updateObj('formFields', value, 'input', 'margin', device)} />

            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={formFields.input.padding[device]} onChange={(value) => setAttributes({ formFields: updateData(formFields, value, "input", "padding", device), })} />

            <Typography className='mt10' label={__("Typography", "register-form")} value={formFields.input.typography} onChange={(value) => updateObj('formFields', value, "input", "typography")} />

            <BtnGroup className='mt10 mb10' label={__("Text Align", "register-form")} value={formFields.input.txtAlign} options={[{ label: "Left", value: "left", icon: alignLeft }, { label: "Center", value: "center", icon: alignCenter }, { label: "Right", value: "right", icon: alignRight },]} onChange={(value) => updateObj('formFields', value, "input", "txtAlign")} />

            <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={[{ title: "Normal", name: "normal" }, { title: "Focus", name: "focus" },]} onSelect={tabController}>
                {tab => <>
                    {tab.name === "normal" && <ColorControl className='mt10' label={__("Color", "register-form")} value={formFields.input.color.normal.text} onChange={(value) => updateObj('formFields', value, "input", "color", "normal", "text")} />}

                    <ColorControl className='mt10' label={__("Placeholder Color", "register-form")} value={formFields.input.color[tab.name].placeholder} onChange={(value) => updateObj('formFields', value, "input", "color", tab.name, "placeholder")} />

                    <ColorControl className='mt10' label={__("Background", "register-form")} value={formFields.input.color[tab.name].bg} onChange={(value) => updateObj('formFields', value, "input", "color", tab.name, "bg")} />

                    <BorderControl className='mt10' label={__("Border", "register-form")} value={formFields.input.border[tab.name]} onChange={(value) => updateObj('formFields', value, "input", "border", tab.name)} />
                </>}

            </TabPanel>

        </PanelBody>
    );
};
export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(FieldStyles);
