import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';

import { generalStyleTabs } from '../../../../utils/options';
import ProModal from '../../../../backend/ProModal/ProModal';
import Content from './General/Content';
import Wrapper from './General/Wrapper';
import Shape from './General/Shape';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	const [isProModal, setIsProModal] = useState(false);

	const premiumProps = {
		isPremium,
		setOpen: setIsProModal
	};

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
				{'general' === tab.name && <>
					<Wrapper {...props} />

					<Content {...props} />
					<Shape {...props} premiumProps={premiumProps} />
				</>}


				{'style' === tab.name && <>
					<Advanced advanced={advanced} onChange={val => setAttributes({ advanced: val })} isBGVideo={isPremium} />
				</>}
			</>}</TabPanel>
		</InspectorControls>


		<ProModal isProModal={isProModal} setIsProModal={setIsProModal} block='Countdown'>
			<li>&emsp;<strong>{__(': ', 'b-blocks')}</strong>{__('', 'b-blocks')}</li>
		</ProModal>
	</>
};

export default Settings;