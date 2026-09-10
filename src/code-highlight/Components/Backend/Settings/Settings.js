import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { allTabs } from '../../../utils/options';
import ButtonIcon from './General/ButtonIcon';
import Caption from './General/Caption';
import Code from './General/Code';
import CopyButton from './General/CopyButton';
import Header from './General/Header';
import LineNumbers from './General/LineNumbers';
import Overflow from './General/Overflow';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	return <InspectorControls>
		<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={allTabs} onSelect={tabController}>
			{(tab) => <>
				{'general' === tab.name && <>
					<Code {...props} />

					<Header {...props} />

					<LineNumbers {...props} />

					<CopyButton {...props} />

					<ButtonIcon {...props} />

					<Overflow {...props} />

					<Caption {...props} />
				</>}

				{'style' === tab.name && <Style {...props} />}

				{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(val) => setAttributes({ advanced: val })} isPremium={isPremium} />}
			</>}
		</TabPanel>
	</InspectorControls>;
};

export default Settings;
