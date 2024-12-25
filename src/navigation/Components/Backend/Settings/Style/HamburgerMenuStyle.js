import { __ } from "@wordpress/i18n";
import { __experimentalBorderBoxControl as BorderBoxControl, PanelBody, RangeControl, TabPanel, } from "@wordpress/components";

import { Background, BoxControl, BtnGroup, ColorControl, Device, Typography, } from "../../../../../../../bpl-tools/Components";

import { alignCenterIcon, alignLeftIcon, alignRightIcon, } from "../../../../utils/icons";
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

function HamburgerMenuStyle({ attributes, setAttributes, device }) {
    const { hamburger } = attributes;

    return (
        <PanelBody className="bPlPanelBody" title={__("Hamburger Menu", "b-blocks")} initialOpen={false}>



            <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
                { title: "Button", name: "button" },
                { title: "Container", name: "container" },
                { title: "Items", name: "items" },
                { title: "Close Icon", name: "close" }
            ]}>{({ name }) => <>
                {name === "container" && <>
                    <div className="bPl-device-position-wrapper">
                        <Device className="bPl-device" />
                        <BoxControl
                            label={__("Padding", "b-blocks")}
                            values={hamburger.container.padding[device]}
                            // onChange={(val) =>
                            //   setAttributes({
                            //     hamburger: updateData(
                            //       hamburger,
                            //       val,
                            //       "container",
                            //       "padding",
                            //       device
                            //     ),
                            //   })
                            // }
                            onChange={(val) =>
                                setAttributes({
                                    hamburger: {
                                        ...hamburger,
                                        container: {
                                            ...hamburger.container,
                                            padding: {
                                                ...hamburger.container.padding,
                                                [device]: val,
                                            },
                                        },
                                    },
                                })
                            }
                        />
                    </div>
                    <Background
                        value={hamburger.container.background}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(
                                    hamburger,
                                    val,
                                    "container",
                                    "background"
                                ),
                            })
                        }
                    />
                </>}

                {name === "items" && <>
                    <div className="bPl-device-position-wrapper">
                        <Device className="bPl-device" />
                        <BoxControl
                            label={__("Padding", "b-blocks")}
                            values={hamburger.items.padding[device]}
                            onChange={(val) =>
                                setAttributes({
                                    hamburger: {
                                        ...hamburger,
                                        items: {
                                            ...hamburger.items,
                                            padding: {
                                                ...hamburger.items.padding,
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
                        value={hamburger.items.border}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(hamburger, val, "items", "border"),
                            })
                        }
                    />
                    <BoxControl
                        label={__("Border Radius", "b-blocks")}
                        values={hamburger.items.borderRadius}
                        resetValues={{
                            left: "0px",
                            right: "0px",
                            top: "0px",
                            bottom: "0px",
                        }}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(hamburger, val, "items", "borderRadius"),
                            })
                        }
                    />
                    <Typography
                        value={hamburger.items.typo}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(hamburger, val, "items", "typo"),
                            })
                        }
                    />

                    <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
                        { title: "Normal", name: "normal" },
                        { title: "Hover", name: "hover" },
                    ]}>{({ name }) => <>
                        <ColorControl
                            label={__("Text Color", "b-blocks")}
                            value={hamburger.items.colors[name].text}
                            onChange={(val) =>
                                setAttributes({
                                    hamburger: updateData(
                                        hamburger,
                                        val,
                                        "items",
                                        "colors",
                                        name,
                                        "text"
                                    ),
                                })
                            }
                        />
                        <ColorControl
                            label={__("Background Color", "b-blocks")}
                            value={hamburger.items.colors[name].bg}
                            onChange={(val) =>
                                setAttributes({
                                    hamburger: updateData(
                                        hamburger,
                                        val,
                                        "items",
                                        "colors",
                                        name,
                                        "bg"
                                    ),
                                })
                            }
                        />
                    </>}</TabPanel>
                </>}

                {name === "button" && <>
                    <div className="bPl-device-position-wrapper">
                        <Device className="bPl-device" />
                        <RangeControl
                            label={__("Size", "b-blocks")}
                            value={hamburger.button.size[device]}
                            onChange={(val) =>
                                setAttributes({
                                    hamburger: updateData(
                                        hamburger,
                                        val,
                                        "button",
                                        "size",
                                        device
                                    ),
                                })
                            }
                        />
                    </div>
                    <div className="bPl-device-position-wrapper">
                        <Device className="bPl-device" />
                        <BoxControl
                            label={__("Padding", "b-blocks")}
                            values={hamburger.button.padding[device]}
                            onChange={(val) =>
                                setAttributes({
                                    hamburger: {
                                        ...hamburger,
                                        button: {
                                            ...hamburger.button,
                                            padding: {
                                                ...hamburger.button.padding,
                                                [device]: val,
                                            },
                                        },
                                    },
                                })
                            }
                        />
                    </div>
                    <ColorControl
                        label={__("Color", "b-blocks")}
                        value={hamburger.button.color}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(hamburger, val, "button", "color"),
                            })
                        }
                    />
                </>}

                {name === "close" && <>
                    <ColorControl
                        label={__("Color", "b-blocks")}
                        value={hamburger.closeButton.color}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(hamburger, val, "closeButton", "color"),
                            })
                        }
                    />
                    <BtnGroup label={__("Alignment", "b-blocks")}
                        options={[
                            { label: "Left", value: "left", icon: alignLeftIcon },
                            { label: "Center", value: "center", icon: alignCenterIcon },
                            { label: "Right", value: "right", icon: alignRightIcon }
                        ]}
                        value={hamburger.closeButton.alignment}
                        onChange={(val) =>
                            setAttributes({
                                hamburger: updateData(
                                    hamburger,
                                    val,
                                    "closeButton",
                                    "alignment"
                                ),
                            })
                        } isIcon={true} />
                </>}
            </>}</TabPanel>
        </PanelBody>
    );
}

export default HamburgerMenuStyle;