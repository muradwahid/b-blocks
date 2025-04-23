import { Flex, GradientPicker, PanelBody, PanelRow, RangeControl, TabPanel, __experimentalUnitControl as UnitControl } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { BoxControl, BtnGroup, ColorControl, Device, Label, SolidBackground, Typography } from "../../../../../../../bpl-tools/Components";
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { bgTypes, gradients } from "../../../../../../../bpl-tools/utils/options";
import { aligns, borderRadiusResetValues, leftRightOptions, marginResetValues } from "../../../../utils/options";

const Style = ({ attributes, setAttributes, device }) => {
    const { alignment, icon, heading, subHeading, separator } = attributes;

    return (
        <>
            <Fragment>
                <PanelBody initialOpen={true} title={__("Wrapper/Container", "dual-color-heading")} className="bPlPanelBody" >

                    <BtnGroup label={<Flex>{__("Alignment", "dual-color-heading")}<Device /></Flex>} value={alignment[device]} onChange={(val) => setAttributes({ alignment: { ...alignment, [device]: val } })} options={aligns} isIcon={true} />
                </PanelBody>

                <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Heading", "dual-color-heading")} >

                    <Typography className="mb10" value={heading.typography} onChange={(value) => setAttributes({ heading: { ...heading, typography: value }, })} />

                    {["first", "last"].map((part) => (
                        <>
                            <PanelRow className="mt20">

                                <BtnGroup label={__(`${part[0].toUpperCase() + part.substring(1)} Color Type:`, "dual-color-heading")} value={heading[part].colorType} onChange={(val) => setAttributes({ heading: { ...heading, [part]: { ...heading[part], colorType: val }, }, })} options={bgTypes} size="small" />
                            </PanelRow>

                            {"gradient" === heading[part].colorType ? (
                                <Fragment>
                                    <GradientPicker value={heading[part].gradient} onChange={(val) => setAttributes({ heading: { ...heading, [part]: { ...heading[part], gradient: val }, }, })} gradients={gradients} />
                                </Fragment>
                            ) : (
                                <ColorControl
                                    label={__(
                                        `${part[0].toUpperCase() + part.substring(1)} Color:`,
                                        "dual-color-heading"
                                    )}
                                    value={heading[part].color}
                                    onChange={(val) =>
                                        setAttributes({
                                            heading: {
                                                ...heading,
                                                [part]: { ...heading[part], color: val },
                                            },
                                        })
                                    }
                                    defaultColor={"first" === part ? "#4527a4" : ""}
                                />
                            )}
                        </>
                    ))}
                </PanelBody>

                <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Sub Heading", "dual-color-heading")} >

                    <Typography className="mb10" value={subHeading.typography} onChange={(value) => setAttributes({ subHeading: { ...subHeading, typography: value }, })} />

                    <ColorControl color={subHeading.color} value={subHeading.color} label={__("Color", "dual-color-heading")} onChange={(value) => setAttributes({ subHeading: { ...subHeading, color: value } })} />
                </PanelBody>

                <PanelBody
                    className="bPlPanelBody"
                    initialOpen={false}
                    title={__("Separator", "dual-color-heading")}
                >
                    <PanelRow>
                        <Label className="">{__("Alignment:", "dual-color-heading")}</Label>
                        <BtnGroup value={separator.alignment} onChange={(val) => setAttributes({ separator: { ...separator, alignment: val }, })} options={aligns} isIcon={true} />
                    </PanelRow>

                    <BoxControl className="mt20" label="Margin" resetValues={marginResetValues} values={separator.margin} onChange={(value) => setAttributes({ separator: { ...separator, margin: value }, })} />

                    {separator.type === "line" && (
                        <>
                            <UnitControl className="mt20" label={__("Distance Between Lines", "dual-color-heading")} labelPosition="left" min={0} max={1000} step={5} value={separator.distance} onChange={(value) => setAttributes({ separator: { ...separator, distance: value }, })} />
                            <br />

                            <TabPanel className="bPlTabPanel mini" activeClass="activeTab" tabs={leftRightOptions} onSelect={tabController} >
                                {(tab) => <>
                                    <UnitControl className='mt10' label={__("Width", "dual-color-heading")} labelPosition="left" min={0} max={separator[tab.name].width.includes("%") ? 100 : 1000} step={1} value={separator[tab.name].width} onChange={(value) => setAttributes({ separator: { ...separator, [tab.name]: { ...separator[tab.name], width: value }, }, })} />

                                    <UnitControl className="mt20" label={__("Height", "dual-color-heading")} labelPosition="left" min={0} max={separator[tab.name].height.includes("%") ? 100 : 1000} step={1} value={separator[tab.name].height} onChange={(value) => setAttributes({ separator: { ...separator, [tab.name]: { ...separator[tab.name], height: value }, }, })} />

                                    <SolidBackground className="mt20" label="Color" value={separator[tab.name].color} onChange={(value) => setAttributes({ separator: { ...separator, [tab.name]: { ...separator[tab.name], color: value }, }, })} />

                                    <BoxControl className="mt20" label={__("Border Radius", "dual-color-heading")} values={separator[tab.name].bRadius} resetValues={borderRadiusResetValues} onChange={(value) => setAttributes({ separator: { ...separator, [tab.name]: { ...separator[tab.name], bRadius: value }, }, })} />
                                </>}
                            </TabPanel>

                        </>
                    )}

                    {separator.type === "icon" && (
                        <>
                            <RangeControl className="mt20" value={separator.iconSize} label={__("Icon Size", "dual-color-heading")} min={0} max={300} step={1} onChange={(value) => setAttributes({ separator: { ...separator, iconSize: value }, })}
                            />

                            <ColorControl label="Icon Color" color={separator.iconColor} value={separator.iconColor} onChange={(value) => setAttributes({ separator: { ...separator, iconColor: value }, })} />
                        </>
                    )}
                </PanelBody>

                {icon.show && (
                    <PanelBody className="bPlPanelBody" initialOpen={false} title={__("Icon Style", "dual-color-heading")} >
                        <RangeControl label={__("Icon Size", "dual-color-heading")} value={icon.size} min={10} max={550} onChange={(value) => setAttributes({ icon: { ...icon, size: value } })} />

                        <ColorControl label="Icon Color" color={icon.color} value={icon.color} onChange={(value) => setAttributes({ icon: { ...icon, color: value } })} />
                    </PanelBody>
                )}
            </Fragment>
        </>
    );
};
export default compose(
    withSelect((select) => {
        const { getDeviceType } = select("core/editor");
        return {
            device: getDeviceType()?.toLowerCase(),
        };
    })
)(Style);
