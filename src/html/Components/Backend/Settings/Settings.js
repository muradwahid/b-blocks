import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";

import { tabController } from "../../../../../../bpl-tools/utils/functions";

import Advanced from "../../../../../../bpl-tools/Advanced";
import { BBlocksAds } from "../../../../../../bpl-tools/Components";
import { generalStyleTabs } from "../../../utils/options";
import General from "./General/General";

const Settings = (props) => {
    const { attributes, setAttributes } = props;
    const { advanced } = attributes;

    return <>
            <InspectorControls>
                <div className="bPlInspectorInfo">
                    <BBlocksAds />
                </div>

                <TabPanel className="bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController}>
                    {(tab) => (
                        <>
                            {"general" === tab.name && (
                                <>
                                    <General {...props} />
                                </>
                            )}

                            {"advanced" === tab.name && (
                                <>
                                    <Advanced advanced={advanced} onChange={(val) => setAttributes({ advanced: val })} />
                                </>
                            )}
                        </>
                    )}
                </TabPanel>
            </InspectorControls>
        </> 
};
export default Settings;
