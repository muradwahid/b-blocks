import { InspectorControls } from '@wordpress/block-editor'
import General from './General/General'
import { tabController } from '../../../../../../bpl-tools/utils/functions'
import Style from './Style/Style'
import { generalStyleTabs } from '../../../utils/options'
import { TabPanel } from '@wordpress/components'

const Settings = (props) => {

    return <InspectorControls>
        <TabPanel className="bPlTabPanel" activeClass="activeTab" tabs={generalStyleTabs} onSelect={tabController} >
            {(tab) => <>
                {"general" === tab.name && <>
                    <General {...props} />
                </>}
                {"style" === tab.name && <>
                    <Style {...props} />
                </>}
            </>}
        </TabPanel>
    </InspectorControls>
}
export default Settings