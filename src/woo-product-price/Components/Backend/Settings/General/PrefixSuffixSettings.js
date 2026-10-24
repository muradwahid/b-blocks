import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

import AffixSettings from './AffixSettings';

const PrefixSuffixSettings = ( props ) => {
	const { attributes, updateObj } = props;
	const { options = {} } = attributes;

	return <>
		<AffixSettings { ...props } which='prefix' />

		<AffixSettings { ...props } which='suffix' />

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={ __( 'Only When On Sale', 'b-blocks' ) }
			help={ __( 'Off: the prefix and the suffix show with every price. On: only with a sale price.', 'b-blocks' ) }
			checked={ !! options.onSaleOnly }
			onChange={ ( val ) => updateObj( 'options', val, 'onSaleOnly' ) }
		/>
	</>;
};

export default PrefixSuffixSettings;
