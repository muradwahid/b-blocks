import { Flex, PanelBody, RangeControl, SelectControl, TabPanel, ToggleControl, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { Background, BButtonGroup, BoxControl, BtnGroup, ColorControl, Device, Label, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import { alignCenter, alignLeft, alignRight } from "../../../../utils/icons";
import { animationOptions, justifyContent } from "../../../../utils/options";

const ButtonStyles = ({ attributes, updateObj, device }) => {
    const { button } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Button", "register-form")} initialOpen={false} >

            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")}<Device /></Flex>} values={button.signup.margin[device]} onChange={(value) => updateObj('button', value, "signup", "margin", device)} />

            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={button.signup.padding[device]} onChange={(value) => updateObj('button', value, "signup", "padding", device)} />

            <Typography className='mt10' label={__("Typography", "register-form")} value={button.signup.typography} onChange={(value) => updateObj('button', value, "signup", "typography")} />

            <SelectControl className='mt10' label={<Flex>{__("Display as", "register-form")} <Device /></Flex>} labelPosition="edge" options={[{ label: "Inline", value: "row" }, { label: "Block", value: "column" },]} value={button.signup.displayAs[device]} onChange={(value) => updateObj('button', value, "signup", "displayAs", device)} />

            {button.signup.displayAs[device] === "row" && <SelectControl className='mt10' label={<Flex>{__("Justify Content", "register-form")} <Device /> </Flex>} labelPosition='edge' options={justifyContent} value={button.signup.justifyContent[device]} onChange={(value) => updateObj('button', value, "signup", "justifyContent", device)} />}

            {button.signup.displayAs[device] === "column" &&  <BtnGroup label={<Flex>{__("Alignment", "register-form")} <Device/></Flex>} className="mb10 mt10" value={button.signup.alignment[device]} options={[{ label: "Left", value: "left", icon: alignLeft }, { label: "Center", value: "center", icon: alignCenter }, { label: "Right", value: "right", icon: alignRight }]} onChange={(value) => updateObj('button', value, "signup", "alignment", device)} isIcon={true} /> 
            }

            <UnitControl className='mt10' label={<Flex>{__("Button Width", "register-form")} <Device /></Flex>} labelPosition='edge' value={button.signup.width[device]} min={0} onChange={(value) => updateObj('button', value, "signup", "width", device)} />

            <UnitControl className='mt10' label={__("Button Height", "register-form")} labelPosition='edge' min={0} value={button.signup.height[device]} onChange={(value) => updateObj('button', value, "signup", "height", device)} />

            <ToggleControl className='mt10' label={__("Show Spinner", "register-form")} checked={button.signup.spinner.show} value={button.signup.spinner.show} onChange={(value) => updateObj('button', value, "signup", "spinner", "show")} />

            {button.signup.spinner.show && <Fragment>
                <small>
                    Spinner is only visible after clicking on the button.
                </small>
                <RangeControl className='mt10' label={__("Position", "register-form")} value={button.signup.spinner.position} onChange={(value) => updateObj('button', value, "signup", "spinner", "position")} />

                <ColorControl className='mt10' label={__("Color", "register-form")} value={button.signup.spinner.color} onChange={(value) => updateObj(button, value, "signup", "spinner", "color")} />

            </Fragment>}
            <TabPanel className="bPlTabPanel small" activeClass="activeTab" tabs={normalHoverTabs} onSelect={tabController}>
                {
                    tab => <>
                        <ColorControl className='mt10' label={__("Color", "register-form")} value={button.signup.color[tab.name].color} onChange={(value) => updateObj('button', value, "signup", "color", tab.name, "color")} />

                        <Background  className='mt10'label={__("Background", "register-form")} value={button.signup.color[tab.name].bg} onChange={(value) => updateObj('button', value, "signup", "color", tab.name, "bg")} />

                        <BorderControl className='mt10' label={__("Border", "register-form")} value={button.signup.border[tab.name]} onChange={(value) => updateObj(button, value, "signup", "border", tab.name)} />
                        
                        {tab.name == "hover" && <SelectControl className='mt10' label={__("Animation", "b-blocks")} labelPosition='edge' value={button.signup.animation} options={animationOptions} onChange={(value) => updateObj('button', value, "signup", "animation") } /> }
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
})(ButtonStyles);
