import { __ } from '@wordpress/i18n';
import { BorderBoxControl, PanelBody, TabPanel } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

import { copyStateTabs, stateLabel } from '../../../../utils/options';

const CopyButton = ({ attributes, updateObj }) => {
	const { copyBtn = {}, options = {} } = attributes;

	if (!options.copyButton) return null;

	return <PanelBody className='bPlPanelBody' title={__('Copy Button', 'b-blocks')} initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={copyStateTabs}>
			{(tab) => <>
				<ColorControl label={stateLabel(tab.name, __('Color', 'b-blocks'))} value={copyBtn?.[tab.name]?.color} onChange={(val) => updateObj('copyBtn', val, tab.name, 'color')} />

				<Background className='mt10' label={stateLabel(tab.name, __('Background', 'b-blocks'))} value={copyBtn?.[tab.name]?.background} onChange={(val) => updateObj('copyBtn', val, tab.name, 'background')} />

				<BorderBoxControl className='mt10' label={stateLabel(tab.name, __('Border', 'b-blocks'))} value={copyBtn?.[tab.name]?.border} onChange={(val) => updateObj('copyBtn', val, tab.name, 'border')} />

				{/* Copied lasts the two seconds after a click, so it is easy to
				    miss while styling it. */}
				{'copied' === tab.name && <small>{__('Shown for two seconds after the button is clicked. Left empty, it keeps the Normal styling.', 'b-blocks')}</small>}
			</>}
		</TabPanel>

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={copyBtn.typo} onChange={(val) => updateObj('copyBtn', val, 'typo')} defaults={{ fontSize: { desktop: 12 } }} />

		<BoxControl label={__('Padding', 'b-blocks')} values={copyBtn.padding || {}} onChange={(val) => updateObj('copyBtn', val, 'padding')} />

		<BoxControl label={__('Border Radius', 'b-blocks')} values={copyBtn.radius || {}} onChange={(val) => updateObj('copyBtn', val, 'radius')} />
	</PanelBody>;
};

export default CopyButton;
