import { Flex, PanelBody, TabPanel, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { Background, BoxControl, BtnGroup, Device, Label, ShadowControl } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController, updateData } from "../../../../../../../bpl-tools/utils/functions";
import { containerAlignOptions, containerStyleOptions } from '../../../../utils/options';

const GeneralStyles = ({ attributes, setAttributes, updateObj, device }) => {
    const { general } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Wrapper/Container", "register-form")} initialOpen={true} >
            <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={containerStyleOptions} onSelect={tabController}>
                {tab => <>
                    {tab.name === "containerbox" && <Fragment>
                        <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('general', value, 'containerBox', 'width', device)} isUnitSelectTabbable value={general.containerBox.width[device]} />

                        <Label className='mt10'>{<Flex>{__("Alignment", "register-form")} <Device /></Flex>}</Label>
                        <BtnGroup options={containerAlignOptions} value={general.containerBox.alignment[device]} onChange={(value) => updateObj('general', value, 'containerBox', 'alignment', device)} isIcon={false} />
                    </Fragment>}

                    {tab.name === "formwrapper" && <Fragment>
                        <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('general', value, "formWrapper", "width", device)} isUnitSelectTabbable value={general.formWrapper.width[device]} />

                        <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={general.formWrapper.margin[device]} onChange={(value) => updateObj('general', value, "formWrapper", "margin", device)} />

                        <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={general.formWrapper.padding[device]} onChange={(value) => updateObj("general", value, "formWrapper", "padding", device)} />

                        <BorderControl className='mt10' label={__("Border", "register-form")} value={general.formWrapper.border} onChange={(value) => updateObj("general", value, "formWrapper", "border")} />

                        <Background className='mt10' label={__("Background", "register-form")} value={general.formWrapper.bg} onChange={(value) => updateObj("general", value, "formWrapper", "bg")} />

                        <ShadowControl className='mt10' label={__("Shadow", "register-form")} value={general.formWrapper.shadow} onChange={(value) => updateObj("general", value, "formWrapper", "shadow")} />
                    </Fragment>
                    }

                    {tab.name === "form" && <Fragment>
                        <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('general', value, "form", "width", device)} isUnitSelectTabbable value={general.form.width[device]} />

                        <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={general.form.margin[device]} onChange={(value) => setAttributes({ general: updateData(general, value, "form", "margin", device), })} />

                        <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={general.form.padding[device]} onChange={(value) => updateObj('general', value, 'form', 'padding', device)} />

                        <BorderControl className='mt10' label={__("Border", "register-form")} value={general.form.border} onChange={(value) => updateObj('general', value, "form", "border")} />

                        <Background className='mt10' label={__("Background", "register-form")} value={general.form.bg} onChange={(value) => updateObj('general', value, "form", "bg")} />

                        <ShadowControl className='mt10' label={__("Shadow", "register-form")} value={general.form.shadow} onChange={(value) => updateObj("general", value, "form", "shadow")} />
                    </Fragment>}

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
})(GeneralStyles);
