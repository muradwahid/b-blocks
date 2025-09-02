import { useEffect, useState } from "react";

import { Button, SelectControl, TabPanel } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

import CursorEffect from "./ClickEffect/CursorEffect";
import CursorShape from "./General/CursorShape";


// import { InlineMediaUpload } from "../../../../components/InlineMediaUpload";
import { InlineMediaUpload } from "../../../../../../../bpl-tools/Components";
import { cursorSourceOptions } from "../../../../../customCursor/utils/options";
import { useWPAjax } from "../../../../../../../bpl-tools/hooks";
import { shapeAndEffectOptions } from "../utils/options";
import CursorImgShape from "./General/CursorImgShape";
import { BControlPro } from "../../../../../../../bpl-tools/ProControls";

const Settings = ({ info, isProModalOpen, setIsProModalOpen, isPremium }) => {
  const { dirUrl, nonce } = info;
  const [bBlocksCursor, setBBlocksCursor] = useState(null);

  // fetch token from bplugins server using ajax
  const { data, isLoading, saveData } = useWPAjax('bBlocks_cursor_data_settings', { nonce }); //authorize

  useEffect(() => {
    if (!isLoading && data && !bBlocksCursor) {
      setBBlocksCursor(data);
    }
    // console.log({ data });
  }, [isLoading])


  const saveInformation = () => {
    if (!bBlocksCursor?.source === 'predefined' && !bBlocksCursor?.source === 'customUrl' && !isPremium) return;
    saveData({ bBlocksCustomCursor: JSON.stringify(bBlocksCursor), save: true });
  }

  useEffect(() => {
    // saveInformation();
    // console.log(bBlocksCursor)
    if (!bBlocksCursor?.source === 'predefined' && !bBlocksCursor?.source === 'customUrl' && !isPremium) return;
    window.dispatchEvent(new CustomEvent("bBlocksCursorPlayground", {
      detail: {
        data: bBlocksCursor
      }
    }));
    // debounce(saveInformation, 600)();
  }, [JSON.stringify(bBlocksCursor)]);

  return (
    <div className='custom-cursor-settings-container'>
      <h3 className='custom-cursor-title'>Settings</h3>
      <div className='custom-cursor-settings'>
        <TabPanel className="bPlTabPanel" activeClass='activeTab' tabs={shapeAndEffectOptions}>
          {tab => <>

            {tab.name == "shape" && <>
              <SelectControl className="mt10" label={__("Select Cursor Source", "advanced-scrollbar")} labelPosition="edge" options={cursorSourceOptions(isPremium)} value={bBlocksCursor?.source} onChange={value => setBBlocksCursor({ ...bBlocksCursor, source: value })} />
              {bBlocksCursor?.source === "shape" && <CursorShape {...{ bBlocksCursor, setBBlocksCursor, isPremium, isProModalOpen, setIsProModalOpen }} />}
              {bBlocksCursor?.source === "predefined" && <CursorImgShape {...{ bBlocksCursor, setBBlocksCursor, dirUrl, isPremium, isProModalOpen, setIsProModalOpen }} />}
              {bBlocksCursor?.source === "customUrl" && <BControlPro label={__("Choose Cursor Image", "advanced-scrollbar")} value={bBlocksCursor?.shape?.customImg?.url} onChange={value => setBBlocksCursor({ ...bBlocksCursor, shape: { ...bBlocksCursor?.shape, customImg: { ...bBlocksCursor?.shape?.customImg, url: value } } })} Component={InlineMediaUpload} isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} />}

            </>}
            {tab.name == "effect" && <CursorEffect {...{ bBlocksCursor, setBBlocksCursor, isPremium, isProModalOpen, setIsProModalOpen }} />}
          </>}
        </TabPanel>
        <Button onClick={() => saveInformation()} className={`custom-cursor-dashboard-button ${isLoading ? "btnSaving" : ""}`} variant="primary">{isLoading ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
};

export default Settings;