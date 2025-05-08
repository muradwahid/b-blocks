import { Flex, PanelBody, RangeControl, SelectControl, TabPanel, ToggleControl, __experimentalUnitControl as UnitControl, __experimentalBorderBoxControl as BorderBoxControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { Background, BoxControl, BtnGroup, ColorControl, Device, Typography } from "../../../../../../../bpl-tools/Components";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import { alignCenter, alignLeft, alignRight } from "../../../../utils/icons";
import { animationOptions, justifyContent } from "../../../../utils/options";

const ButtonStyles = ({ attributes, updateObj, device }) => {
    const { button } = attributes;
    return <PanelBody className="bPlPanelBody" title={__("Button", 'b-blocks')} initialOpen={false} >

            <BoxControl className='mt10' label={<Flex>{__("Margin", 'b-blocks')}<Device /></Flex>} values={button.signup[device].margin} onChange={(value) => updateObj('button', value, "signup", device, "margin")} />

            <BoxControl className='mt10' label={<Flex>{__("Padding", 'b-blocks')} <Device /></Flex>} values={button.signup[device].padding} onChange={(value) => updateObj('button', value, "signup", device, "padding")} />

            <Typography className='mt10' label={__("Typography", 'b-blocks')} value={button.signup.typography} onChange={(value) => updateObj('button', value, "signup", "typography")} />

            <SelectControl className='mt10' label={<Flex>{__("Display as", 'b-blocks')} <Device /></Flex>} labelPosition="edge" options={[{ label: "Inline", value: "row" }, { label: "Block", value: "column" },]} value={button.signup[device].displayAs} onChange={(value) => updateObj('button', value, "signup", device, "displayAs")} />

            {button.signup[device].displayAs === "row" && <SelectControl className='mt10' label={<Flex>{__("Justify Content", 'b-blocks')} <Device /> </Flex>} labelPosition='edge' options={justifyContent} value={button.signup[device].justify} onChange={(value) => updateObj('button', value, "signup", device, "justify")} />}

            {button.signup[device].displayAs === "column" &&  <BtnGroup label={<Flex>{__("Alignment", 'b-blocks')} <Device/></Flex>} className="mb10 mt10" value={button.signup[device].alignment} options={[{ label: "Left", value: "left", icon: alignLeft }, { label: "Center", value: "center", icon: alignCenter }, { label: "Right", value: "right", icon: alignRight }]} onChange={(value) => updateObj('button', value, "signup", device, "alignment")} isIcon={true} /> 
            }

            <UnitControl className='mt10' label={<Flex>{__("Button Width", 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={button.signup[device].width} min={0} onChange={(value) => updateObj('button', value, "signup", device, "width")} />

            <UnitControl className='mt10' label={__("Button Height", 'b-blocks')} labelPosition='edge' min={0} value={button.signup[device].height} onChange={(value) => updateObj('button', value, "signup", device, "height")} />

            <ToggleControl className='mt10' label={__("Show Spinner", 'b-blocks')} checked={button.signup.spinner.show} value={button.signup.spinner.show} onChange={(value) => updateObj('button', value, "signup", "spinner", "show")} />

            {button.signup.spinner.show && <Fragment>
                <small>
                    Spinner is only visible after clicking on the button.
                </small>
                <RangeControl className='mt10' label={__("Position", 'b-blocks')} value={button.signup.spinner.position} onChange={(value) => updateObj('button', value, "signup", "spinner", "position")} />

                <ColorControl className='mt10' label={__("Color", 'b-blocks')} value={button.signup.spinner.color} onChange={(value) => updateObj('button', value, "signup", "spinner", "color")} />

            </Fragment>}
            <TabPanel className="bPlTabPanel small" activeClass="activeTab" tabs={normalHoverTabs} onSelect={tabController}>
                {
                    tab => <>
                        <ColorControl className='mt10' label={__("Color", 'b-blocks')} value={button.signup[tab.name].color} onChange={(value) => updateObj('button', value, "signup", tab.name, "color")} />

                        <Background className='mt10' label={__("Background", 'b-blocks')} value={button.signup[tab.name].bg} onChange={(value) => updateObj('button', value, "signup", tab.name, "bg")} />
                        
                        <BorderBoxControl className='mt10' label={__("Border", 'b-blocks')} value={button.signup[tab.name].border} onChange={(value) => updateObj('button', value, "signup", tab.name, "border")} />
                        
                        <BoxControl label={__('Border Radius','b-blocks')} values={button.signup[tab.name].radius} onChange={value=>updateObj('button',value,'signup',tab.name,'radius')} />

                        {/* <BorderControl className='mt10' label={__("Border", 'b-blocks')} value={button.signup.border[tab.name]} onChange={(value) => updateObj(button, value, "signup", "border", tab.name)} /> */}
                        
                        {tab.name == "hover" && <SelectControl className='mt10' label={__("Animation", "b-blocks")} labelPosition='edge' value={button.signup.animation} options={animationOptions} onChange={(value) => updateObj('button', value, "signup", "animation") } /> }
                    </>
                }
            </TabPanel>
        </PanelBody>
};
export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");
    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(ButtonStyles);
