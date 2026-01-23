import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

//bpl-tools
import Advanced from '../../../../../../bpl-tools/Advanced';
import { HelpPanel } from '../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { pluginSlug, rowDocs } from '../../../../utils/data';
import { generalStyleTabs } from '../../../../utils/options';

import General from './General/General';
import { enabledAdvOptions } from '../../../utils/options';

const Settings = (props) => {
    const { attributes, setAttributes,isPremium } = props;
    const { advanced } = attributes;

    return <InspectorControls>
        <HelpPanel slug={pluginSlug} docsLink={rowDocs} />

        <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
            {(tab) => <>
                {'general' === tab.name && <>
                    <General {...props} />
                </>} 

                {/* {'style' === tab.name && <>
                    <Style {...props} />
                </>} */}

                {'style' === tab.name && <>
                    <Advanced advanced={advanced} onChange={val => setAttributes({ advanced: val })} enabled={enabledAdvOptions} isPremium={isPremium} />
                </>}
            </>}
        </TabPanel>

    </InspectorControls>;
};
export default Settings;