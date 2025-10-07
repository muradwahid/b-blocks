import { __ } from '@wordpress/i18n';
import { TabPanel, ToggleControl } from '@wordpress/components';

import ShapeStyle from '../Style/ShapeStyle';
import ShapeType from './ShapeType';

import { shapeStyleTabs } from '../../utils/options';

const CursorShape = ({ bBlocksCursor, setBBlocksCursor, isPremium, isProModalOpen, setIsProModalOpen }) => {
  const { enableCursor = true } = bBlocksCursor || {};
  return (
    <>
      <TabPanel className="bPlTabPanel small mt10" activeClass='activeTab' tabs={shapeStyleTabs}>
        {
          tab => <>
            {tab.name == 'type' && <>
              <ToggleControl className="mt10" defaultValue={true} label={__("Enable Default Cursor", 'b-blocks')} checked={enableCursor} onChange={value => setBBlocksCursor({ ...bBlocksCursor, enableCursor: value })} />
              <ShapeType value={bBlocksCursor?.shape || {}} onChange={value => setBBlocksCursor({ ...bBlocksCursor, shape: value })}  {...{ isProModalOpen, setIsProModalOpen, isPremium }} />
            </>}
            {tab.name == 'style' && <ShapeStyle value={bBlocksCursor?.shape || {}} onChange={value => setBBlocksCursor({ ...bBlocksCursor, shape: value })} />}
          </>
        }
      </TabPanel>


    </>
  );
};

export default CursorShape;