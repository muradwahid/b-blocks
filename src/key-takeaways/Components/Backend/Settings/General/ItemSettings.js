import { __ } from '@wordpress/i18n';
import { TextareaControl } from '@wordpress/components';

import { IconLibrary } from '../../../../../../../bpl-tools/Components';

const ItemSettings = ( props ) => {
	const { attributes, updateObj, index } = props;
	const item = attributes.items[ index ] || {};

	return <>
		<TextareaControl
			label={ __( 'Takeaway text', 'b-blocks' ) }
			value={ item.text || '' }
			onChange={ ( val ) => updateObj( 'items', val, index, 'text' ) }
			placeholder={ __( 'Summarize a key point…', 'b-blocks' ) }
			rows={ 2 }
			__nextHasNoMarginBottom
		/>

		<IconLibrary
			className='mt10'
			label={ __( 'Icon', 'b-blocks' ) }
			value={ item.icon }
			onChange={ ( val ) => updateObj( 'items', val, index, 'icon' ) }
		/>
	</>;
};
export default ItemSettings;
