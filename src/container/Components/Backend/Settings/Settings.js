import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';

import { generalStyleTabs } from '../../../../utils/options';
import ProModal from '../../../../backend/ProModal/ProModal';
// import Content from './General/Content';
// import ItemsLayout from './General/ItemsLayout';
import Wrapper from './General/Wrapper';
import Shape from './General/Shape';
import { enabledAdvOptions } from '../../../utils/options';
import Layout from './General/Layout';

const Settings = (props) => {
	const { attributes, setAttributes, id, isPremium } = props;
	const { advanced } = attributes;

	const [isProModalOpen, setIsProModalOpen] = useState(false);

	const premiumProps = {
		isPremium,
		setIsProModalOpen
	};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel bPlRemPrev' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<Wrapper {...props} />

					{/* <Content {...props} />
					<ItemsLayout {...props} /> */}
					<Layout {...props} />
					<Shape {...props} premiumProps={premiumProps} />
				</>}


				{'style' === tab.name && <>
					<Advanced advanced={advanced} onChange={val => setAttributes({ advanced: val })} id={id} isPremium={isPremium} enabled={enabledAdvOptions} />
				</>}
			</>}</TabPanel>
		</InspectorControls>

		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block='Countdown'>
			<li>&emsp;<strong>{__(': ', 'b-blocks')}</strong>{__('', 'b-blocks')}</li>
		</ProModal>
	</>
};

export default Settings;