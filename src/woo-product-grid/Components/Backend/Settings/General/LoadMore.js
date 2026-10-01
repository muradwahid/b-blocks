import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RadioControl, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';
import { alignOptions, morePostsTypeOptions } from '../../../../utils/options';

const LoadMore = ( { attributes, updateObj } ) => {
	const { pager = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Load More Settings', 'b-blocks' ) } initialOpen={ false }>
		<ToggleControl
			className='mt10'
			label={ __( 'Enable Load More Option?', 'b-blocks' ) }
			checked={ !! pager.enable }
			onChange={ ( val ) => updateObj( 'pager', val, 'enable' ) }
		/>

		{ pager.enable && <>
			<RadioControl
				className='mt10'
				label={ __( 'More Posts Type', 'b-blocks' ) }
				selected={ pager.type }
				options={ morePostsTypeOptions }
				onChange={ ( val ) => updateObj( 'pager', val, 'type' ) }
			/>

			{ 'button' === pager.type && <TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Button Text', 'b-blocks' ) }
				value={ pager.text }
				onChange={ ( val ) => updateObj( 'pager', val, 'text' ) }
			/> }

			<Flex className='mt20'>
				<Label className='flex2'>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ pager.align } onChange={ ( val ) => updateObj( 'pager', val || 'center', 'align' ) }>
					{ alignOptions.map( ( o ) => <ToggleGroupControlOptionIcon key={ o.value } label={ o.label } value={ o.value } icon={ o.icon } /> ) }
				</ToggleGroupControl>
			</Flex>
		</> }
	</PanelBody>;
};

export default LoadMore;
