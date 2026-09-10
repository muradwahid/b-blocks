import { __ } from '@wordpress/i18n';
import { BorderBoxControl, PanelBody, TabPanel } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

import { normalHoverTabs, stateLabel } from '../../../../utils/options';

/**
 * Both the follow link and the pager have the same set of controls, so one panel
 * serves either — `group` names which attribute it writes to.
 */
const Button = ({ attributes, updateObj, group, title, size = 14 }) => {
	const config = attributes?.[group] || {};

	return <PanelBody className='bPlPanelBody' title={title} initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <>
				<ColorControl label={stateLabel(tab.name, __('Color', 'b-blocks'))} value={config?.[tab.name]?.color} onChange={(val) => updateObj(group, val, tab.name, 'color')} />

				<Background className='mt10' label={stateLabel(tab.name, __('Background', 'b-blocks'))} value={config?.[tab.name]?.background} onChange={(val) => updateObj(group, val, tab.name, 'background')} />

				<BorderBoxControl className='mt10' label={stateLabel(tab.name, __('Border', 'b-blocks'))} value={config?.[tab.name]?.border} onChange={(val) => updateObj(group, val, tab.name, 'border')} />
			</>}
		</TabPanel>

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={config.typo} onChange={(val) => updateObj(group, val, 'typo')} defaults={{ fontSize: { desktop: size } }} />

		<BoxControl label={__('Padding', 'b-blocks')} values={config.padding || {}} onChange={(val) => updateObj(group, val, 'padding')} />

		<BoxControl label={__('Border Radius', 'b-blocks')} values={config.radius || {}} onChange={(val) => updateObj(group, val, 'radius')} />
	</PanelBody>;
};

export default Button;
