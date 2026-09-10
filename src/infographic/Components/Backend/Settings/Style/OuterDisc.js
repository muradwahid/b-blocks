import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, ColorControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { normalHoverTabs } from '../../../../../utils/options';
import { msUnit, ringStyles, sUnit, stateLabel } from '../../../../utils/options';

// The block's own circle. Its border is the outer ring, and the segments ride
// that border's centre line.
const OuterDisc = ({ attributes, updateObj, device = 'desktop' }) => {
	const { outerDisc = {} } = attributes;


	return <PanelBody className='bPlPanelBody' title={__('Outer Disc', 'b-blocks')} initialOpen={true}>
		<Flex>
			<Label className='mb0 flex2'>{__('Size', 'b-blocks')} <Device /></Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={outerDisc?.[device]?.size || ''} onChange={(val) => updateObj('outerDisc', val, device, 'size')} units={[pxUnit()]} max={1000} />
		</Flex>


		<Background className='mt10' label={__('Background', 'b-blocks')} value={outerDisc.background} onChange={(val) => updateObj('outerDisc', val, 'background')} />

		<ColorControl className='mt10' label={__('Border Color', 'b-blocks')} value={outerDisc.borderColor} onChange={(val) => updateObj('outerDisc', val, 'borderColor')} defaultColor='#7E57C2' />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Border Width', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={outerDisc.borderWidth || ''} onChange={(val) => updateObj('outerDisc', val, 'borderWidth')} units={[pxUnit()]} max={20} />
		</Flex>

		<SelectControl className='mt10' label={__('Border Style', 'b-blocks')} labelPosition='edge' value={outerDisc.borderStyle} options={ringStyles} onChange={(val) => updateObj('outerDisc', val, 'borderStyle')} __nextHasNoMarginBottom />

		<small>{__('This border is the outer ring — the segments sit centred on it.', 'b-blocks')}</small>

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Ring Gap', 'b-blocks')} <Device /></Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={outerDisc?.[device]?.ringGap || ''} onChange={(val) => updateObj('outerDisc', val, device, 'ringGap')} units={[pxUnit()]} />
		</Flex>


		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Transition', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={outerDisc.transition || ''} onChange={(val) => updateObj('outerDisc', val, 'transition')} units={[msUnit(), sUnit()]} />
		</Flex>

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <ShadowControl label={stateLabel(tab.name, __('Box Shadow', 'b-blocks'))} value={outerDisc.shadow?.[tab.name]} onChange={(val) => updateObj('outerDisc', val, 'shadow', tab.name)} />}
		</TabPanel>
	</PanelBody>;
};

export default OuterDisc;
