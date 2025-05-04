import { Flex, PanelBody, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Background, BoxControl, ColorControl, Device, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import { alignItems, justifyContent } from "../../../../utils/options";

const LoginLink = ({ attributes, updateObj, device }) => {
    const { button } = attributes;

    return (
        <PanelBody className="bPlPanelBody" title={__("Login Link", "register-form")} initialOpen={false}  >

            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={button.signin.margin[device]} onChange={(value) => updateObj('button', value, "signin", "margin", device)} />

            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")}<Device /></Flex>} values={button.signin.padding[device]} onChange={(value) => updateObj('button', value, "signin", "padding", device)} />

            <Typography className='mt10' label={__("Typography", "register-form")} value={button.signin.typography} onChange={(value) => updateObj('button', value, "signin", "typography")} />

            <SelectControl className='mt10' label={<Flex>{__("Display as", "register-form")}<Device /></Flex>} labelPosition="left" options={[{ label: "Inline", value: "row" }, { label: "Block", value: "column" },]} value={button.signin.displayAs[device]} onChange={(value) => updateObj('button', value, "signin", "displayAs", device)} />

            {button.signin.displayAs[device] === "row" &&
                <SelectControl className='mt10' label={<Flex>{__("Justify Content", "register-form")} <Device /></Flex>} labelPosition="left" options={justifyContent} value={button.signin.justifyContent[device]} onChange={(value) => updateObj('button', value, "signin", "justifyContent", device)} />}

            {button.signin.displayAs[device] === "column" && <SelectControl className='mt10' label={<Flex> {__("Align Items", "register-form")}<Device /></Flex>} labelPosition='edge' options={alignItems} value={button.signin.alignItems[device]} onChange={(value) => updateObj('button', value, "signin", "alignItems", device)} />}

            <UnitControl className='mt10' label={__("Link Container Width", "register-form")} labelPosition='edge' value={button.signin.width.container[device]} min={0} onChange={(value) => updateObj('button', value, "signin", "width", "container", device)} />

            <UnitControl className='mt10' label={__("Link Width", "register-form")} labelPosition='edge' value={button.signin.width.width[device]} min={0} onChange={(value) => updateObj('button', value, "signin", "width", "width", device)} />

            <UnitControl className='mt10' label={__("Link Height", "register-form")} labelPosition='edge' min={0} value={button.signin.height[device]} onChange={(value) => updateObj('button', value, "signin", "height", device)} />

            <TabPanel className="bPlTabPanel small mt10" activeClass="activeTab" tabs={normalHoverTabs} onSelect={tabController}>
                {
                    tab => <>
                        <ColorControl className='mt10' label={__("Color", "register-form")} value={button.signin.color[tab.name].color} onChange={(value) => updateObj('button', value, "signin", "color", tab.name, "color")} />

                        <Background className='mt10' label={__("Background", "register-form")} value={button.signin.color[tab.name].bg} onChange={(value) => updateObj(button, value, "signin", "color", tab.name, "bg")} />

                        <BorderControl className='mt10' label={__("Border", "register-form")} value={button.signin.border[tab.name]} onChange={(value) => updateObj('button', value, "signin", "border", tab.name)} />
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
})(LoginLink);
