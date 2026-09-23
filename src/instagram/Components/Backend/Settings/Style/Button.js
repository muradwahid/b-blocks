import { __ } from '@wordpress/i18n';
import { BorderBoxControl, PanelBody, TabPanel } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

import { normalHoverTabs, stateLabel } from '../../../../utils/options';

/**
 * Both the follow link and the pager have the same set of controls, so one panel
 * serves either — `group` names which attribute it writes to.
 */
const Button = ({ attributes, updateObj, group, title, size = 14, device = 'desktop' }) => {
	const config = attributes?.[group] || {};

	const getVal = (stateName, key) => {
		const stateObj = config?.[stateName] || {};
		const field = stateObj?.[key] ?? ('normal' === stateName ? config?.[key] : undefined);
		if (field?.[device] !== undefined) {
			return field[device];
		}
		if ('desktop' === device && field && (field.top !== undefined || field.right !== undefined)) {
			return field;
		}
		return {};
	};

	const handleBoxChange = (stateName, key, val) => {
		const cur = config?.[stateName]?.[key] || ('normal' === stateName ? config?.[key] : undefined);
		if (cur && cur.desktop === undefined && (cur.top !== undefined || cur.right !== undefined)) {
			updateObj(group, {
				desktop: 'desktop' === device ? val : cur,
				tablet: 'tablet' === device ? val : { top: '', right: '', bottom: '', left: '' },
				mobile: 'mobile' === device ? val : { top: '', right: '', bottom: '', left: '' }
			}, stateName, key);
		} else {
			updateObj(group, val, stateName, key, device);
		}
	};

	return <PanelBody className='bPlPanelBody' title={title} initialOpen={false}>
		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={config.typo} onChange={(val) => updateObj(group, val, 'typo')} defaults={{ fontSize: { desktop: size } }} />

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <>

				<ColorControl label={stateLabel(tab.name, __('Color', 'b-blocks'))} value={config?.[tab.name]?.color} onChange={(val) => updateObj(group, val, tab.name, 'color')} />

				<Background className='mt10' label={stateLabel(tab.name, __('Background', 'b-blocks'))} value={config?.[tab.name]?.background} onChange={(val) => updateObj(group, val, tab.name, 'background')} />

				<BorderBoxControl className='mt10' label={stateLabel(tab.name, __('Border', 'b-blocks'))} value={config?.[tab.name]?.border} onChange={(val) => updateObj(group, val, tab.name, 'border')} />

				<BoxControl
					label={<>{stateLabel(tab.name, __('Padding', 'b-blocks'))} <Device /></>}
					values={getVal(tab.name, 'padding')}
					onChange={(val) => handleBoxChange(tab.name, 'padding', val)}
				/>

				<BoxControl
					label={<>{stateLabel(tab.name, __('Border Radius', 'b-blocks'))} <Device /></>}
					values={getVal(tab.name, 'radius')}
					onChange={(val) => handleBoxChange(tab.name, 'radius', val)}
				/>

				<ShadowControl
					className='mt10'
					label={stateLabel(tab.name, __('Box Shadow', 'b-blocks'))}
					value={config?.[tab.name]?.shadow || ('normal' === tab.name ? config?.shadow : []) || []}
					onChange={(val) => updateObj(group, val, tab.name, 'shadow')}
				/>

			</>}
		</TabPanel>
	</PanelBody>;
};

export default Button;
