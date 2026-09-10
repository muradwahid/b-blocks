import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { allTabs } from '../../../../utils/options';
import Animation from './General/Animation';
import Button from './General/Button';
import Defaults from './General/Defaults';
import Elements from './General/Layout';
import General from './General/General';
import Icon from './General/Icon';
import Items from './General/Items';
import Wheel from './General/Wheel';
import Style from './Style/Style';

const Settings = (props) => {
	// Without the fallback an undefined device writes to a key named "undefined".
	const { attributes, setAttributes, updateObj, isPremium, device = 'desktop' } = props;
	const { general = {}, advanced } = attributes;

	return <>
		<BlockControls>
			{/* Clearing writes an empty value rather than 'center': on tablet or
			    mobile that hands the breakpoint back to desktop, which an
			    explicit 'center' would pin over. */}
			<AlignmentToolbar value={general?.[device]?.alignment} onChange={(val) => updateObj('general', val || '', device, 'alignment')} />
		</BlockControls>

		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={allTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <>
						<General {...props} />

						<Defaults {...props} />

						<Items {...props} />

						<Wheel {...props} />

						<Button {...props} />

						<Elements {...props} />

						<Animation {...props} />

						<Icon {...props} />
					</>}

					{'style' === tab.name && <Style {...props} />}

					{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(val) => setAttributes({ advanced: val })} isPremium={isPremium} />}
				</>}
			</TabPanel>
		</InspectorControls>
	</>;
};

export default Settings;