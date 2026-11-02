import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

import { textsOf } from '../../../../utils/data';

const General = ( { attributes, updateObj } ) => {
	const { options = {} } = attributes;
	const texts = textsOf( options );
	const showCount = false !== options.showCount;

	const textField = ( key, label, className = 'mt20' ) => <TextControl
		className={ className }
		__next40pxDefaultSize
		__nextHasNoMarginBottom
		label={ label }
		value={ texts[ key ] }
		onChange={ ( val ) => updateObj( 'options', val, key ) }
	/>;

	return <PanelBody className='bPlPanelBody' title={ __( 'Settings', 'b-blocks' ) } initialOpen={ true }>
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Show Empty Rating', 'b-blocks' ) }
			help={ __( 'For a product without ratings. Off: the block shows nothing. On: empty stars and the text below.', 'b-blocks' ) }
			checked={ !! options.showEmpty }
			onChange={ ( val ) => updateObj( 'options', val, 'showEmpty' ) }
		/>

		{ options.showEmpty && showCount && textField( 'emptyText', __( 'Empty Rating Text', 'b-blocks' ) ) }

		<ToggleControl
			className='mt20'
			__nextHasNoMarginBottom
			label={ __( 'Show Review Count', 'b-blocks' ) }
			help={ __( 'A link to the product’s reviews next to the stars.', 'b-blocks' ) }
			checked={ showCount }
			onChange={ ( val ) => updateObj( 'options', val, 'showCount' ) }
		/>

		{ showCount && <>
			{ textField( 'singular', __( 'Singular Caption', 'b-blocks' ) ) }
			{ textField( 'plural', __( 'Plural Caption', 'b-blocks' ) ) }
			{ textField( 'before', __( 'Before Caption', 'b-blocks' ) ) }
			{ textField( 'after', __( 'After Caption', 'b-blocks' ) ) }
		</> }
	</PanelBody>;
};

export default General;
