import { Flex, PanelBody, TabPanel, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import React, { Fragment } from "react";
import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";
import { headerStyleOptions, headerTitleSubOptions } from '../../../../utils/options';

const HeaderStyles = ({ attributes, updateObj, device }) => {
    const { formHeader } = attributes;

    return (
        <Fragment>
            <PanelBody className="bPlPanelBody" title={__("Form Header", "register-form")} initialOpen={false}>
                <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={headerStyleOptions} onSelect={tabController} >
                    {tab => <>
                        {tab.name === "headercontent" && <Fragment>

                            <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' units={[{ label: "%", value: "%", default: "100" }, { label: "px", value: "px" }, { label: "rem", value: "rem" },]} value={formHeader.header.width[device]} min={0} max={formHeader.header.width[device] && formHeader.header.width[device]?.includes("%") ? 100 : 1200} onChange={(value) => updateObj('formHeader', value, "header", "width", device)} />

                            <UnitControl className='mt10' label={<Flex>{__("Height", "register-form")} <Device /></Flex>} units={[{ label: "px", value: "px" }, { label: "%", value: "%" }, { label: "rem", value: "rem" },]} labelPosition='edge' value={formHeader.header.height[device]} onChange={(value) => updateObj('formHeader', value, "header", "height", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={formHeader.header.margin[device]} onChange={(value) => updateObj('formHeader', value, "header", "margin", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={formHeader.header.padding[device]} onChange={(value) => updateObj('formHeader', value, "header", "padding", device)} />

                            <BorderControl className='mt10' label={__("Border", "register-form")} value={formHeader.header.border} onChange={(value) => updateObj('formHeader', value, "header", "border")} />

                            <Background className='mt10' label={__("Background", "register-form")} value={formHeader.header.bg} onChange={(value) => updateObj('formHeader', value, "header", "bg")} />

                        </Fragment>}

                        {tab.name === "logo" && <Fragment>
                            <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")}<Device /></Flex>} labelPosition='edge' units={[{ label: "%", value: "%", default: "100" }, { label: "px", value: "px" }, { label: "rem", value: "rem" },]} value={formHeader.header.logo.width[device]} min={0} max={formHeader.header.logo.width[device].includes("%") ? 100 : 1200} onChange={(value) => updateObj('formHeader', value, "header",
                                "logo", "width", device)} />

                            <UnitControl className='mt10' label={<Flex>{__("Height", "register-form")} <Device /></Flex>} labelPosition='edge' units={[{ label: "px", value: "px" }, { label: "%", value: "%" }, { label: "rem", value: "rem" },]} value={formHeader.header.logo.height[device]} onChange={(value) => updateObj('formHeader', value, "header", "logo", "height", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={formHeader.header.logo.margin[device]} onChange={(value) => updateObj('formHeader', value, "header", "logo", "margin", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={formHeader.header.logo.padding[device]} onChange={(value) => updateObj('formHeader', value, 'header', 'logo', 'padding', device)} />

                            <BorderControl className='mt10' label={__("Border", "register-form")} value={formHeader.header.logo.border} onChange={(value) => updateObj(formHeader, value, "header", "logo", "border")} />

                            <ShadowControl className='mt10' label={__("Shadow", "register-form")} value={formHeader.header.logo.shadow} onChange={(value) => updateObj("formHeader", value, "header", "logo", "shadow")} />

                        </Fragment>}

                        {tab.name === "image" && <Fragment>
                            <UnitControl className='mt10' label={<Flex>{__("Width", "register-form")} <Device /></Flex>} labelPosition='edge' units={[{ label: "em", value: "em", default: "100" }, { label: "px", value: "px" }, { label: "rem", value: "rem" },]} value={formHeader.image.width[device]} min={0} max={formHeader.image.width[device].includes("%") ? 100 : 1200} onChange={(value) => updateObj(formHeader, value, "image", "width", device)} />

                            <UnitControl className='mt10' label={<Flex>{__("Height", "register-form")}<Device /></Flex>} labelPosition='edge' units={[{ label: "px", value: "px" }, { label: "%", value: "%" }, { label: "rem", value: "rem" },]} value={formHeader.image.height[device]} onChange={(value) => updateObj(formHeader, value, "image", "height", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={formHeader.image.margin[device]} onChange={(value) => updateObj('formHeader', value, "image", "margin", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={formHeader.image.padding[device]} onChange={(value) => updateObj('formHeader', value, "image", "padding", device)} />

                            <BorderControl className='mt10' label={__("Border", "register-form")} value={formHeader.image.border} onChange={(value) => updateObj('formHeader', value, "image", "border")} />

                        </Fragment>}
                    </>}
                </TabPanel>

                <hr />

                <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={headerTitleSubOptions} onSelect={tabController} >
                    {tab => <>
                        {tab.name === "title" && <Fragment>
                            <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={formHeader.header.title.margin[device]} onChange={(value) => updateObj('formHeader', value, "header", "title", "margin", device)} />

                            <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")}<Device /></Flex>} values={formHeader.header.title.padding[device]} onChange={(value) => updateObj('formHeader', value, "header", 'title', "padding", device)} />

                            <ColorControl className='mt10' label={__("Color", "register-form")} value={formHeader.header.title.color} onChange={(value) => updateObj('formHeader', value, "header", "title", "color")} />

                            <Background className='mt10' label={__("Background", "register-form")} isImage={false} value={formHeader.header.title.bg} onChange={(value) => updateObj('formHeader', value, 'header', 'title', 'bg')} />

                            <BorderControl className='mt10' label={__("Border", "register-form")} value={formHeader.header.title.border} onChange={(value) => updateObj('formHeader', value, "header", "title", "border")} />

                            <Typography className='mt10' label={__("Typography", "register-form")} value={formHeader.header.title.typography} onChange={(value) => updateObj('formHeader', value, 'header', 'title', 'typography')} />
                        </Fragment>}

                        {tab.name === "subtitle" && (
                            <Fragment>
                                <BoxControl className='mt10' label={<Flex>{__("Margin", "register-form")} <Device /></Flex>} values={formHeader.header.subTitle.margin[device]} onChange={(value) => updateObj('formHeader', value, "header", "subTitle", "margin", device)} />

                                <BoxControl className='mt10' label={<Flex>{__("Padding", "register-form")} <Device /></Flex>} values={formHeader.header.subTitle.padding[device]} onChange={(value) => updateObj('formHeader', value, "header", "subTitle", "padding", device)} />

                                <ColorControl className='mt10' label={__("Color", "register-form")} value={formHeader.header.subTitle.color} onChange={(value) => updateObj('formHeader', value, "header", "subTitle", "color")} />

                                <Background className='mt10' label={__("Background", "register-form")} isImage={false} value={formHeader.header.subTitle.bg} onChange={(value) => updateObj('formHeader', value, "header", "subTitle", "bg")} />

                                <BorderControl className='mt10' label={__("Border", "register-form")} value={formHeader.header.subTitle.border} onChange={(value) => updateObj('formHeader', value, "header", "subTitle", "border")} />

                                <Typography className='mt10' label={__("Typography", "register-form")} value={formHeader.header.subTitle.typography} onChange={(value) => updateObj('formHeader', value, 'header', 'subTitle', "typography")} />

                            </Fragment>
                        )}
                    </>}
                </TabPanel>
            </PanelBody>
        </Fragment>
    );
};
export default withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(HeaderStyles);
