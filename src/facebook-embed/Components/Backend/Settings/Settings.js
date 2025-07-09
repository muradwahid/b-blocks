import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import Advanced from "../../../../../../bpl-tools/Advanced";
import { tabController } from "../../../../../../bpl-tools/utils/functions";
import { generalStyleTabs } from "../../../utils/options";
import General from "./General/General";

const Settings = ({ attributes, updateObj, isPremium }) => {
    const { advanced } = attributes;
    return <InspectorControls>
        <div className="bPlInspectorInfo">
            Need more block like this? Checkout the bundle ➡
            <a href="https://wordpress.org/plugins/b-blocks" target="_blank" rel="noopener noreferrer" >
                B Blocks
            </a>
        </div>

        <TabPanel className="bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController} >
            {(tab) => <>
                {"general" === tab.name && <General {...{ attributes, updateObj }} />}

                {"advanced" === tab.name && <Advanced advanced={advanced} onChange={(value) => updateObj('advanced', value)} isPremium={isPremium} />}
            </>
            }
        </TabPanel>

    </InspectorControls>
};
export default Settings;
