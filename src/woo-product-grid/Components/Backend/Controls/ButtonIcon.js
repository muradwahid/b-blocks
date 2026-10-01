import { __ } from '@wordpress/i18n';
import { Flex, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Device, IconLibrary, Label } from '../../../../../../bpl-tools/Components';
import { iconPositionOptions, UNITS } from '../../../utils/options';
import { at } from '../../../utils/functions';

const ButtonIcon = ( { group, value = {}, updateObj, device = 'desktop' } ) => <>
	<ToggleControl
		className='mt10'
		label={ __( 'Show Icon', 'b-blocks' ) }
		checked={ false !== value.showIcon }
		onChange={ ( val ) => updateObj( group, val, 'showIcon' ) }
	/>

	{ false !== value.showIcon && <>
		<IconLibrary
			className='mt10'
			label={ __( 'Icon', 'b-blocks' ) }
			value={ value.icon }
			onChange={ ( val ) => updateObj( group, val, 'icon' ) }
		/>

		<ColorControl
			className='mt10'
			label={ __( 'Icon Color:', 'b-blocks' ) }
			value={ value.iconColor }
			onChange={ ( val ) => updateObj( group, val, 'iconColor' ) }
		/>

		<UnitControl
			className='mt10'
			__next40pxDefaultSize
			label={ <Flex>{ __( 'Icon Size', 'b-blocks' ) } <Device /></Flex> }
			labelPosition='edge'
			units={ UNITS }
			isUnitSelectTabbable
			value={ at( value, device, 'iconSize' ) }
			onChange={(val) => updateObj(group, val || '', device, 'iconSize')}
		/>

		<Flex className='mt10'>
			<Label className='flex2'>{ __( 'Icon Position:', 'b-blocks' ) }</Label>
			<ToggleGroupControl
				className='flex1'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				value={ value.iconPosition }
				onChange={ ( val ) => updateObj( group, val || 'left', 'iconPosition' ) }
			>
				{ iconPositionOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>
		</Flex>
	</> }
</>;

export default ButtonIcon;
