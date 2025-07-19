import { PanelBody, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import { collapseIcons, expandIcons } from "../../../../utils/commonOptions";
import IconPicker from "../../Panel/IconPicker/IconPicker";

const DefaultSettings = ({ attributes, setAttributes }) => {
    const { minimize } = attributes;

    return <PanelBody className="bPlPanelBody" title={__("Settings", "b-blocks")} initialOpen={false}>
        <ToggleControl label={__("Minimize Box", "b-blocks")} checked={minimize.toggle} onChange={(value) => setAttributes({ minimize: { ...minimize, toggle: value } })} />
        {minimize.toggle && <>
            <IconPicker
                icons={expandIcons}
                default={"fa-solid fa-chevron-down"}
                label={__("Expand Icon", "b-blocks")}
                value={minimize.expandIcon}
                renderFunction={(value) =>
                    setAttributes({
                        minimize: { ...minimize, expandIcon: value },
                    })
                }
            />
            <div className="mt10">
                <IconPicker
                    icons={collapseIcons}
                    default={"fa-solid fa-chevron-up"}
                    label={__("Collapse Icon", "b-blocks")}
                    value={minimize.collapseIcon}
                    renderFunction={(value) =>
                        setAttributes({
                            minimize: {
                                ...minimize,
                                collapseIcon: value,
                            },
                        })
                    }
                />
            </div>
        </>}
    </PanelBody>
};
export default DefaultSettings;
