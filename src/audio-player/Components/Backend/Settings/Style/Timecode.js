import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { Label, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const Timecode = ({ timecode = {}, updateObj }) => (
	<PanelBody className='bPlPanelBody' title={__('Timecode', 'b-blocks')} initialOpen={false}>
		<Flex>
		<Label className='flex2'>{__('Position', 'b-blocks')}</Label>
		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={timecode.position} onChange={(val) => updateObj('timecode', val, 'position')}>
			<ToggleGroupControlOption label={__('Left', 'b-blocks')} value='left' />
			<ToggleGroupControlOption label={__('Right', 'b-blocks')} value='right' />
		</ToggleGroupControl>
		</Flex>

		<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={timecode.color} onChange={(val) => updateObj('timecode', val, 'color')} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={timecode.typo} onChange={(val) => updateObj('timecode', val, 'typo')} />

	</PanelBody>
);

export default Timecode;
