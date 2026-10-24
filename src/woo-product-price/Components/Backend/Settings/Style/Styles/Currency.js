import { __ } from '@wordpress/i18n';
import {
	SelectControl, TabPanel,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { ColorControl, Label } from '../../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../../bpl-tools/utils/functions';

import { SIZE_UNITS, priceTabs, verticalAlignOptions } from '../../../../../utils/options';

const Currency = ( { attributes, updateObj } ) => {
	const { currency = {} } = attributes;

	return <>
		<Label className='bBlocksWooPriceHeading mt20 mb5'>{ __( 'Currency Sign', 'b-blocks' ) }</Label>
		<ColorControl label={ __( 'Color', 'b-blocks' ) } value={ currency.color } defaultColor={ currency.color ? '__clear__' : undefined } onChange={ ( val ) => updateObj( 'currency', '__clear__' === val ? '' : val, 'color' ) } />
		<UnitControl
			className='mt20'
			__next40pxDefaultSize
			label={ __( 'Size', 'b-blocks' ) }
			labelPosition='edge'
			help={ __( 'Empty: 25px.', 'b-blocks' ) }
			units={ SIZE_UNITS }
			value={ currency.size || '' }
			onChange={ ( val ) => updateObj( 'currency', val || '', 'size' ) }
		/>

		<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={ priceTabs } onSelect={ tabController }>
			{ ( { name: which } ) => <>
				<ColorControl className='mt10' label={ __( 'Color', 'b-blocks' ) } value={ currency[ which ]?.color } defaultColor={ currency[ which ]?.color ? '__clear__' : undefined } onChange={ ( val ) => updateObj( 'currency', '__clear__' === val ? '' : val, which, 'color' ) } />
				<UnitControl
					className='mt20'
					__next40pxDefaultSize
					label={ __( 'Size', 'b-blocks' ) }
					labelPosition='edge'
					help={ 'regular' === which ? __( 'Empty: the Currency Sign size, for the regular price.', 'b-blocks' ) : __( 'Empty: the Currency Sign size, for the sale price.', 'b-blocks' ) }
					units={ SIZE_UNITS }
					value={ currency[ which ]?.size || '' }
					onChange={ ( val ) => updateObj( 'currency', val || '', which, 'size' ) }
				/>
			</> }
		</TabPanel>

		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Alignment', 'b-blocks' ) }
			labelPosition='edge'
			help={ __( 'The currency sign’s vertical alignment beside the amount.', 'b-blocks' ) }
			value={ verticalAlignOptions.some( ( { value } ) => value === currency.align ) ? currency.align : 'baseline' }
			options={ verticalAlignOptions }
			onChange={ ( val ) => updateObj( 'currency', val, 'align' ) }
		/>
	</>;
};

export default Currency;
