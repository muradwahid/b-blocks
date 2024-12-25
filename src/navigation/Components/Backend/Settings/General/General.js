import { __ } from "@wordpress/i18n";
import { Flex, PanelBody, PanelRow, SelectControl, ToggleControl, } from "@wordpress/components";

import { BtnGroup, HelpPanel, Label } from "../../../../../../../bpl-tools/Components";
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import { alignCenterIcon, alignJustifyIcon, alignLeftIcon, alignRightIcon } from "../../../../utils/icons";

const General = (props) => {
    const { attributes, setAttributes, updateObj } = props;
    const { layout, hamburger } = attributes;

    return <>
        <HelpPanel slug="b-blocks" />

        <PanelBody className="bPlPanelBody" title={__("Layout", "b-blocks")} initialOpen={true}>

            <SelectControl label={__("Orientation", "b-blocks")} labelPosition='left'
                options={[
                    { label: "Horizontal", value: "is-horizontal" },
                    { label: "Vertical", value: "is-vertical" },
                ]}
                value={layout.orientation}
                onChange={(val) => updateObj('layout', val, 'orientation')}
            />

            <Flex className='mt10' align="center" gap={4}>
                <Label className="">{__("Preset", "b-blocks")}</Label>

                <SelectControl
                    options={[
                        { label: "Preset 1", value: "preset-1" },
                        { label: "Preset 2", value: "preset-2" },
                        { label: "Preset 3", value: "preset-3" },
                    ]}
                    value={layout.preset}
                    onChange={(val) => updateObj('layout', val, 'preset')}
                />
            </Flex>

            {layout.orientation === "is-horizontal" && <>
                <ToggleControl label={__("Allow to wrap to multiple lines", "b-blocks")} checked={layout.wrapMultipleLine} onChange={(val) => updateObj('layout', val, 'wrapMultipleLine')} />

                <BtnGroup label={__("Alignment", "b-blocks")}
                    options={[
                        { label: "Left", value: "left", icon: alignLeftIcon },
                        { label: "Center", value: "center", icon: alignCenterIcon },
                        { label: "Right", value: "right", icon: alignRightIcon },
                        { label: "Justify", value: "justify", icon: alignJustifyIcon },
                    ]}
                    value={layout.alignment}
                    onChange={(val) => updateObj('layout', val, 'alignment')} isIcon={true} size='small' />

            </>}

            {layout.orientation === "is-horizontal" && <BtnGroup label={__("Alignment", "b-blocks")}
                options={[
                    { label: "Left", value: "left", icon: alignLeftIcon },
                    { label: "Center", value: "center", icon: alignCenterIcon },
                    { label: "Right", value: "right", icon: alignRightIcon }
                ]}
                value={layout.verticalAlignment}
                onChange={(val) => updateObj('layout', val, 'verticalAlignment')} isIcon={true} />}
        </PanelBody>


        <PanelBody
            className="bPlPanelBody"
            title={__("Dropdown Menu", "b-blocks")}
            initialOpen={false}
        >
            <ToggleControl
                label={__("Open on Click", "b-blocks")}
                checked={layout.isOpenOnClick}
                onChange={(val) => updateObj('layout', val, 'isOpenOnClick')}
            />
            <ToggleControl
                label={__("Show dropdown menu icon?", "b-blocks")}
                checked={layout.isMenuIcon}
                onChange={(val) => updateObj('layout', val, 'isMenuIcon')}
            />
        </PanelBody>


        <PanelBody
            className="bPlPanelBody"
            title={__("Hamburger Menu", "b-blocks")}
            initialOpen={false}
        >
            <BtnGroup label={__("Button Type", "b-blocks")}
                options={[
                    { label: "Text", value: "text", icon: 'Text' },
                    { label: "Icon", value: "icon", icon: 'Icon' }
                ]}
                value={hamburger.buttonType}
                onChange={(val) =>
                    setAttributes({
                        hamburger: updateData(hamburger, val, "buttonType"),
                    })
                } isTextIcon={true} />


            <Label>{__("Display Hamburger Menu", "b-blocks")}</Label>
            <BtnGroup options={[
                { value: "never", label: "OFF", icon: "OFF" },
                { value: "mobile", label: "MOBILE", icon: "MOBILE" },
                { value: "always", label: "ALWAYS", icon: "ALWAYS" },
            ]}
                value={hamburger.displayMenu}
                onChange={(val) =>
                    setAttributes({
                        hamburger: updateData(hamburger, val, "displayMenu"),
                    })
                } isTextIcon={true} />
        </PanelBody>
    </>
};
export default General;