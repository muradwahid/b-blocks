import { __ } from "@wordpress/i18n";
import { __experimentalBorderBoxControl as BorderBoxControl, PanelBody, RangeControl, TabPanel, } from "@wordpress/components";

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from "../../../../../../../bpl-tools/Components";
import { updateData } from "../../../../../../../bpl-tools/utils/functions";

function DropdownMenuStyle(props) {
    const { attributes, setAttributes, device } = props;
    const { dropdownMenuStyle } = attributes;

    return <PanelBody className="bPlPanelBody" title={__("Dropdown Menu", "b-blocks")} initialOpen={false}>
        <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
            { title: "Container", name: "container" },
            { title: "Items", name: "items" },
        ]}>{(tab) => <>
            {tab.name === "container" && <>
                <div className="bPl-device-position-wrapper">
                    <Device className="bPl-device" />
                    <RangeControl
                        label={__("Min Width (PX)", "b-blocks")}
                        min={100}
                        max={600}
                        value={dropdownMenuStyle.container.width[device]}
                        onChange={(val) =>
                            setAttributes({
                                dropdownMenuStyle: updateData(
                                    dropdownMenuStyle,
                                    val,
                                    "container",
                                    "width",
                                    device
                                ),
                            })
                        }
                    />
                </div>

                <Background
                    isImage={false}
                    value={dropdownMenuStyle.container.background}
                    onChange={(val) =>
                        setAttributes({
                            dropdownMenuStyle: updateData(
                                dropdownMenuStyle,
                                val,
                                "container",
                                "background"
                            ),
                        })
                    }
                />
                <div className="bPl-device-position-wrapper">
                    <Device className="bPl-device" />
                    <BoxControl
                        label={__("Padding", "b-blocks")}
                        values={dropdownMenuStyle.container.padding[device]}
                        onChange={(val) =>
                            setAttributes({
                                dropdownMenuStyle: {
                                    ...dropdownMenuStyle,
                                    container: {
                                        ...dropdownMenuStyle.container,
                                        padding: {
                                            ...dropdownMenuStyle.container.padding,
                                            [device]: val,
                                        },
                                    },
                                },
                            })
                        }
                    />
                </div>

                <BorderBoxControl
                    label={__("Border", "b-blocks")}
                    value={dropdownMenuStyle.container.border}
                    onChange={(val) =>
                        setAttributes({
                            dropdownMenuStyle: updateData(
                                dropdownMenuStyle,
                                val,
                                "container",
                                "border"
                            ),
                        })
                    }
                />
                <BoxControl
                    label={__("Border Radius", "b-blocks")}
                    values={dropdownMenuStyle.container.borderRadius}
                    onChange={(val) =>
                        setAttributes({
                            dropdownMenuStyle: updateData(
                                dropdownMenuStyle,
                                val,
                                "container",
                                "borderRadius"
                            ),
                        })
                    }
                />

                <ShadowControl
                    label={__("Shadow", "b-blocks")}
                    value={dropdownMenuStyle.container.shadow}
                    onChange={(val) =>
                        setAttributes({
                            dropdownMenuStyle: updateData(
                                dropdownMenuStyle,
                                val,
                                "container",
                                "shadow"
                            ),
                        })
                    }
                />
            </>}

            {tab.name === "items" && <>
                <div className="bPl-device-position-wrapper">
                    <Device className="bPl-device" />
                    <BoxControl
                        label={__("Padding", "b-blocks")}
                        values={dropdownMenuStyle.menuItems.padding[device]}
                        onChange={(val) =>
                            setAttributes({
                                dropdownMenuStyle: {
                                    ...dropdownMenuStyle,
                                    menuItems: {
                                        ...dropdownMenuStyle.menuItems,
                                        padding: {
                                            ...dropdownMenuStyle.menuItems.padding,
                                            [device]: val,
                                        },
                                    },
                                },
                            })
                        }
                    />
                </div>
                <Typography
                    value={dropdownMenuStyle.menuItems.typo}
                    onChange={(val) =>
                        setAttributes({
                            dropdownMenuStyle: updateData(
                                dropdownMenuStyle,
                                val,
                                "menuItems",
                                "typo"
                            ),
                        })
                    }
                />


                <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
                    { title: "Normal", name: "normal" },
                    { title: "Active", name: "active" },
                ]}>{({ name: active }) => <>
                    <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
                        { title: "Normal", name: "normal" },
                        { title: "Hover", name: "hover" },
                    ]}>{({ name: hover }) => <>
                        <ColorControl
                            label={__("Text", "b-blocks")}
                            value={dropdownMenuStyle.menuItems.colors[active][hover]}
                            onChange={(val) =>
                                setAttributes({
                                    dropdownMenuStyle: updateData(
                                        dropdownMenuStyle,
                                        val,
                                        "menuItems",
                                        "colors",
                                        active,
                                        hover
                                    ),
                                })
                            }
                        />

                        {active === "normal" && hover === "hover" && <RangeControl
                            label={__("Transition", "b-blocks")}
                            min={0}
                            max={5}
                            step={0.1}
                        />}
                    </>}</TabPanel>
                </>}</TabPanel>
            </>}</>}
        </TabPanel>
    </PanelBody>
}

export default DropdownMenuStyle;
