import { __ } from "@wordpress/i18n";
import { withSelect } from "@wordpress/data";
import { TabPanel, PanelBody, RangeControl } from "@wordpress/components";

import { ColorControl, Typography, BoxControl, Device } from "../../../../../../../bpl-tools/Components";
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import DropdownMenuStyle from "./DropdownMenuStyle";
import HamburgerMenuStyle from "./HamburgerMenuStyle";

const Style = (props) => {
    const { attributes, setAttributes, device, updateObj } = props;
    const { navigationStyle, caret } = attributes;

    return (
        <>
            <PanelBody
                className="bPlPanelBody"
                title={__("Navigation", "b-blocks")}
                initialOpen={true}
            >
                <div className="bPl-device-position-wrapper">
                    <Device className="bPl-device" />
                    <BoxControl
                        label={__("Padding", "b-blocks")}
                        values={navigationStyle.padding[device]}
                        onChange={(val) => updateObj('navigationStyle', val, 'padding', device)}
                    />
                </div>
                <div className="bPl-device-position-wrapper">
                    <Device className="bPl-device" />
                    <BoxControl
                        label={__("Margin", "b-blocks")}
                        values={navigationStyle.margin[device]}
                        onChange={(val) =>
                            setAttributes({
                                navigationStyle: updateData(
                                    navigationStyle,
                                    val,
                                    "margin",
                                    device
                                ),
                            })
                        }
                    />
                </div>
                <Typography
                    value={navigationStyle.typo}
                    onChange={(val) =>
                        setAttributes({
                            navigationStyle: updateData(navigationStyle, val, "typo"),
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
                            value={navigationStyle.colors[active][hover]}
                            onChange={(val) =>
                                setAttributes({
                                    navigationStyle: updateData(
                                        navigationStyle,
                                        val,
                                        "colors",
                                        active,
                                        hover
                                    )
                                })
                            }
                        />
                    </>}</TabPanel>
                </>}</TabPanel>


            </PanelBody>
            <DropdownMenuStyle attributes={attributes} setAttributes={setAttributes} device={device} />
            {/* caret Style */}
            <PanelBody className="bPlPanelBody" title={__("Caret", "b-blocks")} initialOpen={false}>
                <div className="bPl-device-position-wrapper">
                    <Device className="bPl-device" />
                    <RangeControl
                        label={__("Size", "b-blocks")}
                        min={0}
                        max={100}
                        value={caret.size[device]}
                        onChange={(val) =>
                            setAttributes({ caret: updateData(caret, val, "size", device) })
                        }
                    />
                </div>

                <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
                    { title: "Normal", name: "normal" },
                    { title: "Hover", name: "hover" },
                ]}>
                    {({ name }) => <ColorControl
                        label={__("Color", "b-blocks")}
                        value={caret.color[name]}
                        onChange={(val) =>
                            setAttributes({ caret: updateData(caret, val, "color", name) })
                        }
                    />}
                </TabPanel>
            </PanelBody>
            <HamburgerMenuStyle {...props} />
        </>
    );
};
export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(Style);
