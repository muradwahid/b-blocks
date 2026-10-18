import { __ } from '@wordpress/i18n';
import {
	Flex, PanelBody, ToggleControl,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Device, Label, SelectTokenField } from '../../../../../../../bpl-tools/Components';

import { UNITS, deviceOptions } from '../../../../utils/options';

const StickySettings = ({ attributes, updateObj, device }) => {
	const { sticky = {} } = attributes;
	const offOn = Array.isArray(sticky.offOn) ? sticky.offOn : [];

	return <PanelBody className='bPlPanelBody' title={__('Sticky Gallery', 'b-blocks')} initialOpen={false}>
		<ToggleControl
			__nextHasNoMarginBottom
			label={__('Enable Sticky Gallery', 'b-blocks')}
			help={__('Beside a long product summary, the gallery stays in view while the page scrolls. On the page only.', 'b-blocks')}
			checked={!!sticky.enabled}
			onChange={(val) => updateObj('sticky', val, 'enabled')}
		/>

		{sticky.enabled && <>
			<UnitControl className='mt20' __next40pxDefaultSize label={<Flex className='mb5'><span className='bPlLabel'>{__('Top Offset', 'b-blocks')}</span><Device /></Flex>} labelPosition='edge' units={UNITS} value={sticky[device]?.top || ''} onChange={(val) => updateObj('sticky', val || '', device, 'top')}
				help={__('The space above it as it stays: room for a sticky header or the admin bar.', 'b-blocks')}
			/>

			<div className='mt20'>
				<Label className='mb5'>{__('Turn Off On', 'b-blocks')}</Label>
				<SelectTokenField
					multiple
					options={deviceOptions}
					value={offOn}
					onChange={(val) => updateObj('sticky', Array.isArray(val) ? val : [], 'offOn')}
				/>
			</div>
		</>}
	</PanelBody>;
};

export default StickySettings;
