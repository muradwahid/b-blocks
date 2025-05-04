import { Flex, PanelBody, TabPanel, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { Background, BoxControl, ColorControl, Device, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";

const PasswordStrengthStyles = ({ attributes, updateObj, device }) => {
    const { password, formFields } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Password Strength", "register-form")} initialOpen={false} >
            <TabPanel className="bPlTabPanel small" activeClass="activeTab" tabs={[{ title: "Container", name: "container" }, { title: "Meter", name: "meter" }, { title: "Text", name: "text" }]} onSelect={tabController}>
                {tab => <>
                    {tab.name === "container" && (
                        <Fragment>
                            <div className="mb10">
                                <strong>Container</strong>
                            </div>
                            <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('password', value, "container", "width", device)} isUnitSelectTabbable value={password.container.width[device]} />

                            <UnitControl className='mt10' label={<Flex>{__("Height", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('password', value, "container", "height", device)} isUnitSelectTabbable value={password.container.height[device]} />

                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={password.container.margin[device]} onChange={(value) => updateObj('password', value, 'container', 'margin', device)} />

                            <BoxControl className='mt10' label={<Device>{__("Padding", "register-form")} <Device /></Device>} values={password.container.padding[device]} onChange={(value) => updateObj('password', value, 'container', 'padding', device)} />

                            <Background className='mt10' label={__("Background", "register-form")} value={password.container.bg} onChange={(value) => updateObj('password', value, 'container', 'bg')} />

                            <BorderControl className='mt10' label={__("Border", "register-form")} value={password.container.border} onChange={(value) => updateObj('password', value, 'container', 'border')} />
                        </Fragment>
                    )}
                    {tab.name === "meter" && (
                        <Fragment>
                            <div className="mb10 mt10">
                                <strong>Strength Meter</strong>
                            </div>

                            <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('password', value, "meter", "width", device)} isUnitSelectTabbable value={password.meter.width[device]} />

                            <UnitControl className='mt10' label={<Flex>{__("Height", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('password', value, "meter", "height", device)} isUnitSelectTabbable value={password.meter.height[device]} />

                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={password.meter.margin[device]} onChange={(value) => updateObj('password', value, 'meter', 'margin', device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={password.meter.padding[device]} onChange={(value) => updateObj('password', value, 'meter', 'padding', device)} />

                            <BorderControl className='mt10' label={__("Border", "register-form")} value={password.meter.border} onChange={(value) => updateObj('password', value, 'meter', 'border')} />

                        </Fragment>
                    )}
                    {tab.name === "text" && (
                        <Fragment>
                            <div className="mb10 mt10">
                                <strong>Strength Text</strong>
                            </div>

                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={password.passStrengthTxt.margin[device]} onChange={(value) => updateObj('password', value, "passStrengthTxt", "margin", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={password.passStrengthTxt.padding[device]} onChange={(value) => updateObj('password', value, 'passStrengthTxt', 'padding', device)} />

                            <Typography className='mt10' label={__("Typography", "register-form")} value={password.passStrengthTxt.typography} onChange={(value) => updateObj('password', value, 'passStrengthTxt', 'typography')} />
                        </Fragment>
                    )}
                </>}
            </TabPanel>


            {formFields.showPassStrengthText || formFields.showPassStrengthMeter ?   <Fragment>
                    <hr />
                    <div className="mt10 mb10">
                        <strong>Colors</strong>
                    </div>
                    <ColorControl className='mt10' label={__("Very Weak Password", "register-form")} value={password.colors.veryWeak} onChange={(value) => updateObj('password', value, 'colors', 'veryWeak')} />

                    <ColorControl className='mt10' label={__("Weak Password", "register-form")} value={password.colors.weak} onChange={(value) => updateObj('password', value, 'colors', 'weak')} />

                    <ColorControl className='mt10' label={__("Medium Password", "register-form")} value={password.colors.medium} onChange={(value) => updateObj('password', value, "colors", "medium")} />

                    <ColorControl className='mt10' label={__("Strong Password", "register-form")} value={password.colors.strong} onChange={(value) => updateObj('password', value, "colors", "strong")} />
                </Fragment>  : null}
        </PanelBody>
    );
};
export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(PasswordStrengthStyles);
