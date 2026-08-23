import { __ } from '@wordpress/i18n';
import { TextControl } from '@wordpress/components';

const ItemSettings = ( props ) => {
	const { attributes, updateObj, index } = props;
	const item = attributes.items[ index ] || {};

	return <>
		<TextControl
			label={ __( 'Label', 'b-blocks' ) }
			value={ item.label || '' }
			onChange={ ( val ) => updateObj( 'items', val, index, 'label' ) }
			placeholder={ __( 'Checklist item', 'b-blocks' ) }
			__nextHasNoMarginBottom
		/>
	</>;
};
export default ItemSettings;
