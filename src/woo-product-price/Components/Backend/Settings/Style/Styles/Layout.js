import { __ } from '@wordpress/i18n';
import {
	Flex,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { justifyCenter, justifyLeft, justifyRight } from '@wordpress/icons';

import { Device, Label } from '../../../../../../../../bpl-tools/Components';

import { UNITS } from '../../../../../utils/options';

const Layout = ( { attributes, updateObj, device } ) => {
	const { layout = {} } = attributes;

	return <>
		<Flex className='mb5'>
			<Flex justify='flex-start'><Label className=''>{ __( 'Alignment', 'b-blocks' ) }</Label><Device /></Flex>
			<ToggleGroupControl
				className='flex1'
				size='small'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				isDeselectable={ 'desktop' !== device }
				label={ __( 'Alignment', 'b-blocks' ) }
				hideLabelFromVision
				value={ layout[ device ]?.alignment || ( 'desktop' === device ? 'left' : undefined ) }
				onChange={ ( val ) => updateObj( 'layout', val || ( 'desktop' === device ? 'left' : '' ), device, 'alignment' ) }
			>
				<ToggleGroupControlOptionIcon label={ __( 'Left', 'b-blocks' ) } value='left' icon={ justifyLeft } />
				<ToggleGroupControlOptionIcon label={ __( 'Center', 'b-blocks' ) } value='center' icon={ justifyCenter } />
				<ToggleGroupControlOptionIcon label={ __( 'Right', 'b-blocks' ) } value='right' icon={ justifyRight } />
			</ToggleGroupControl>
		</Flex>

		<Flex className='mb5 mt10'>
			<Label className=''>{ __( 'Layout', 'b-blocks' ) }<Device position='vertical' /></Label>
			<ToggleGroupControl
				className='flex1'
				size='small'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				isDeselectable={ 'desktop' !== device }
				label={ __( 'Layout', 'b-blocks' ) }
				hideLabelFromVision
				value={ layout[ device ]?.direction || ( 'desktop' === device ? 'row' : undefined ) }
				onChange={ ( val ) => updateObj( 'layout', val || ( 'desktop' === device ? 'row' : '' ), device, 'direction' ) }
			>
				<ToggleGroupControlOption label={ __( 'Inline', 'b-blocks' ) } value='row' />
				<ToggleGroupControlOption label={ __( 'Stacked', 'b-blocks' ) } value='column' />
			</ToggleGroupControl>
		</Flex>

		<UnitControl
			className='mt10'
			__next40pxDefaultSize
			label={ <Flex justify='flex-start'>{ __( 'Gap', 'b-blocks' ) }<Device /></Flex> }
			labelPosition='edge'
			help={ __( 'Between the prefix, the price, the savings and the suffix.', 'b-blocks' ) }
			units={ UNITS }
			value={ layout[ device ]?.gap || '' }
			onChange={ ( val ) => updateObj( 'layout', val || '', device, 'gap' ) }
		/>

		<UnitControl
			className='mt10 mb20'
			__next40pxDefaultSize
			label={ <Flex justify='flex-start'>{ __( 'Price Gap', 'b-blocks' ) }<Device /></Flex> }
			labelPosition='edge'
			help={ __( 'Between the regular and the sale price. Empty: 0.4em.', 'b-blocks' ) }
			units={ UNITS }
			value={ layout[ device ]?.priceGap || '' }
			onChange={ ( val ) => updateObj( 'layout', val || '', device, 'priceGap' ) }
		/>
	</>;
};

export default Layout;
