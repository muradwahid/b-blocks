import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { badgeAlignOptions, badgeContentOptions } from '../../../../utils/options';

const SaleBadge = ( { attributes, updateObj } ) => {
	const { badge = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Sale Badge', 'b-blocks' ) } initialOpen={ false }>
		<Flex>
			<Label className='flex2'>{ __( 'Alignment:', 'b-blocks' ) }</Label>
			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ badge.align } onChange={ ( val ) => updateObj( 'badge', val || 'top', 'align' ) }>
				{ badgeAlignOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
			</ToggleGroupControl>
		</Flex>

		<SelectControl
			className='mt10'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Show', 'b-blocks' ) }
			labelPosition='edge'
			value={ badge.content || 'text' }
			options={ badgeContentOptions }
			onChange={ ( val ) => updateObj( 'badge', val, 'content' ) }
		/>

		<TextControl
			className='mt10'
			help={ 'text' === ( badge.content || 'text' ) ? '' : __( 'Used for products with no saving to show, such as grouped products.', 'b-blocks' ) }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Sale Text', 'b-blocks' ) }
			value={ badge.text }
			onChange={ ( val ) => updateObj( 'badge', val, 'text' ) }
		/>
	</PanelBody>;
};

export default SaleBadge;
