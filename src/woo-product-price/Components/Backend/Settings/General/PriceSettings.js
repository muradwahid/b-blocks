import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import PrefixSuffixSettings from './PrefixSuffixSettings';
import { salePositionOptions } from '../../../../utils/options';

const PriceSettings = ( props ) => {
	const { attributes, updateObj } = props;
	const { options = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Settings', 'b-blocks' ) } initialOpen={ true }>
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Sale Price Position', 'b-blocks' ) }
			labelPosition='edge'
			help={ __( 'For a product on sale: the sale price after the struck-through regular price, or before it. A product not on sale shows one price.', 'b-blocks' ) }
			value={ 'before' === options.salePosition ? 'before' : 'after' }
			options={ salePositionOptions }
			onChange={ ( val ) => updateObj( 'options', val, 'salePosition' ) }
		/>

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={ __( 'Show Regular Price', 'b-blocks' ) }
			help={ __( 'Off: a product on sale shows only its sale price.', 'b-blocks' ) }
			checked={ false !== options.showRegular }
			onChange={ ( val ) => updateObj( 'options', val, 'showRegular' ) }
		/>

		<div className='mt20'>
			<PrefixSuffixSettings { ...props } />
		</div>
	</PanelBody>;
};

export default PriceSettings;
