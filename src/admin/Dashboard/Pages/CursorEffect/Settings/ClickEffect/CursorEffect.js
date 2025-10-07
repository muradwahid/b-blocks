import { TabPanel} from "@wordpress/components";
import ClickEffectStyles from "./ClickEffectStyles";
import ClickEffectOptions from "./ClickEffectOptions";

const CursorEffect = ({ bBlocksCursor, setBBlocksCursor, isPremium, setIsProModalOpen }) => {

  return (
    <>
      <TabPanel className='bPlTabPanel mini mt10' activeClass='activeTab' tabs={[
        { name: 'effect', title: 'Effect Type' },
        { name: 'style', title: 'Effect Style' },
      ]}
      >
        {tab => <>
          {tab.name == 'effect' && <ClickEffectOptions {...{ isPremium, setIsProModalOpen }} value={bBlocksCursor?.effect || {}} onChange={value => setBBlocksCursor({ ...bBlocksCursor, effect: value })} />}
          {tab.name == 'style' && <ClickEffectStyles value={bBlocksCursor?.effect || {}} onChange={value => setBBlocksCursor({ ...bBlocksCursor, effect: value })} />}
        </>}
      </TabPanel>
    </>
  );
};

export default CursorEffect;