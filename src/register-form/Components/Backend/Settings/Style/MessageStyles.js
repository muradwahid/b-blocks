import { PanelBody, TabPanel, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import React, { Fragment } from "react";
import { Background, BoxControl, ColorControl, Typography } from "../../../../../../../bpl-tools/Components";
import { BorderControl } from "../../../../../../../bpl-tools/Components/Deprecated";
import { tabController } from "../../../../../../../bpl-tools/utils/functions";

const MessageStyles = ({ attributes, updateObj }) => {
    const { validation } = attributes;
    return (
        <PanelBody className="bPlPanelBody" title={__("Messages", "register-form")} initialOpen={false} >

            <TabPanel className="bPlTabPanel small" activeClass="activeTab" tabs={[{ title: "Success", name: "success" }, { title: "Error", name: "error" }]} onSelect={tabController}>
                {
                    tab => <>
                        {tab.name === "success" && <Fragment>
                            <ToggleControl className='mt10' label={__("Show success message", "register-form")} checked={validation.success.styles.isShow} value={validation.success.styles.isShow} onChange={(val) => updateObj('validation', val, 'success', 'styles', 'isShow')} />

                            {validation.success.styles.isShow && <Fragment>
                                <BoxControl label={__("Padding", "register-form")} values={validation.success.styles.padding} onChange={(val) => updateObj('validation', val, "success", "styles", "padding")} />

                                <BoxControl label={__("Margin", "register-form")} values={validation.success.styles.margin} onChange={(val) => updateObj('validation', val, "success", "styles", "margin")} />

                                <ColorControl label={__("Color", "register-form")} value={validation.success.styles.color.text} onChange={(val) => updateObj('validation', val, "success", "styles", "color", "text")} />

                                <Background label={__("Background", "register-form")} isImage={false} value={validation.success.styles.color.bg} onChange={(val) => updateObj('validation', val, "success", "styles", "color", "bg")} />

                                <Typography label={__("Typography", "register-form")} value={validation.success.styles.typo} onChange={(val) => updateObj('validation', val, "success", "styles", "typo")} />

                                <BorderControl label={__("Border", "register-form")} value={validation.success.styles.border} onChange={(val) => updateObj('validation', val, 'success', 'styles', 'border')} />

                            </Fragment>}
                        </Fragment>}
                        {tab.name === "error" && <Fragment>
                            <BoxControl label={__("Margin", "register-form")} values={validation.error.styles.margin} onChange={(val) => updateObj('validation', val, 'error', 'styles', 'margin')} />

                            <ColorControl label={__("Color", "register-form")} value={validation.error.styles.color} onChange={(val) => updateObj('validation', val, 'error', 'styles', 'color')} />

                            <Typography label={__("Typography", "register-form")} value={validation.error.styles.typo} onChange={(val) => updateObj('validation', val, 'error', 'styles', 'typo')} />
                        </Fragment>}
                    </>
                }
            </TabPanel>

        </PanelBody>
    );
};

export default MessageStyles;
