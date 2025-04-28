import { InspectorControls } from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";

import { tabController } from "../../../../../../bpl-tools/utils/functions";

import { generalStyleTabs } from "../../../utils/options";
import General from "./General/General";
import Style from "./Style/Style";
import Advanced from '../../../../../../bpl-tools/Advanced';

const Settings = (props) => {
  const { attributes, setAttributes, updateObj, activeIndex, setActiveIndex } = props;

  return <>
    <InspectorControls>
      <div className="bPlInspectorInfo">
        Need more block like this? Checkout the bundle ➡
        <a href="https://wordpress.org/plugins/b-blocks" target="_blank" rel="noopener noreferrer"> B Blocks </a>
      </div>

      <TabPanel className="bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController} >
        {(tab) => <>
          {"general" === tab.name && (
            <>
              <General {...{ attributes, setAttributes, updateObj, activeIndex, setActiveIndex }} />
            </>
          )}

          {"style" === tab.name && (
            <>
              <Style {...{ attributes, setAttributes, updateObj }} />
            </>
          )}

          {"advanced" === tab.name && (
            <>
              <Advanced advanced={attributes.advanced} onChange={val => setAttributes({ advanced: val })} isPremium={true} />
            </>
          )}
        </>}
      </TabPanel>
    </InspectorControls>
  </>
};
export default Settings;
