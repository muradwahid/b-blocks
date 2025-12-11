import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import Advanced from "../../../../../../bpl-tools/Advanced";
import { tabController } from "../../../../../../bpl-tools/utils/functions";
import { generalStyleTabs } from "../../../utils/options";
import General from "./General/General";

const Settings = ({ attributes, updateObj, isPremium, facebookKey }) => {
    const { advanced } = attributes;
    return <InspectorControls>

        <TabPanel className="bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController} >
            {(tab) => <>
                {"general" === tab.name && <General {...{ attributes, updateObj, facebookKey }} />}

                {"advanced" === tab.name && <Advanced advanced={advanced} onChange={(value) => updateObj('advanced', value)} isPremium={isPremium} />}
            </>
            }
        </TabPanel>

    </InspectorControls>
};
export default Settings;
