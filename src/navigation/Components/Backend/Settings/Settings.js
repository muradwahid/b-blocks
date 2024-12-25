import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { AboutProModal } from '../../../../../../bpl-tools/ProControls';
import { tabController } from '../../../../../../bpl-tools/utils/functions';
import Advanced from '../../../../../../bpl-tools/Advanced';

import General from './General/General';
import Style from './Style/Style';
import { generalStyleTabs } from '../../../../utils/options';
import { updateData } from '../../../../../../bpl-tools/utils/functions';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;
	const [isProModalOpen, setIsProModalOpen] = useState(false);

	const premiumProps = { isPremium, setIsProModalOpen };

	const updateObj = (object, val, ...props) => {
		setAttributes({ [object]: updateData(attributes[object], val, ...props) });
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <General {...props} premiumProps={premiumProps} updateObj={updateObj} />}

					{'style' === tab.name && <Style {...props} updateObj={updateObj} />}

					{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(advanced) => setAttributes({ advanced })} />}
				</>}
			</TabPanel>
		</InspectorControls>


		<AboutProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} link='https://bplugins.com/products/advanced-post-block/#pricing'>
			<li>
				&emsp;<strong>{__('Feature: ', 'b-blocks')}</strong>
				{__('Feature details.', 'b-blocks')}
			</li>
		</AboutProModal>
	</>
};
export default Settings;