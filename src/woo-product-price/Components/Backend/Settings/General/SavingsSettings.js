import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const SavingsSettings = ( { attributes, updateObj, texts = {} } ) => {
	const { savings = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={ __( 'Savings', 'b-blocks' ) } initialOpen={ false }>
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Show Savings', 'b-blocks' ) }
			help={ __( 'What a shopper saves, beside a sale price. Variable and grouped products: the biggest saving.', 'b-blocks' ) }
			checked={ !! savings.show }
			onChange={ ( val ) => updateObj( 'savings', val, 'show' ) }
		/>

		{ savings.show && <TextControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Savings Text', 'b-blocks' ) }
			help={ __( '{percent} is the saving in percent (38%), {amount} in money ($30.00).', 'b-blocks' ) }
			value={ texts.savings ?? '' }
			onChange={ ( val ) => updateObj( 'savings', val, 'text' ) }
		/> }
	</PanelBody>;
};

export default SavingsSettings;
