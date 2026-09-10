import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { IconLibrary, Label } from '../../../../../../../bpl-tools/Components';

import { iconPositions } from '../../../../utils/options';

/** The glyph on the copy button. Its colours and spacing live in the Style tab. */
const ButtonIcon = ({ attributes, updateObj }) => {
	const { buttonIcon = {}, options = {} } = attributes;

	if (!options.copyButton) return null;

	return <PanelBody className='bPlPanelBody' title={__('Button Icon', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Show Icon', 'b-blocks')} checked={buttonIcon.enable} onChange={(val) => updateObj('buttonIcon', val, 'enable')} __nextHasNoMarginBottom />

		{buttonIcon.enable && <>
			<IconLibrary className='mt10' value={buttonIcon.icon} onChange={(val) => updateObj('buttonIcon', val, 'icon')} />

			<Flex className='mt10'>
				<Label className='mb0 flex1'>{__('Position', 'b-blocks')}</Label>

				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={buttonIcon.position || 'left'} onChange={(val) => updateObj('buttonIcon', val, 'position')}>
					{iconPositions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
				</ToggleGroupControl>
			</Flex>

			<small>{__('Which side of the label the icon sits on.', 'b-blocks')}</small>
		</>}
	</PanelBody>;
};

export default ButtonIcon;
