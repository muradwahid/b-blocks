import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import { BButtonGroup, Label } from '../../../../../../../bpl-tools/Components';
import { imageSizeOptions, presetOptions, titleTagOptions } from '../../../../utils/options';
import { PRESET_HIDDEN } from '../../../../utils/data';
import { PRESET_STYLES } from '../../../../utils/presets';

const Layout = ( { attributes, setAttributes, updateObj } ) => {
	const { layout = {}, elements = {} } = attributes;
	// A preset that leaves an element out would make its toggle do nothing.
	const has = ( element ) => ! PRESET_HIDDEN[ attributes.preset ]?.includes( element );

	// The sizes WordPress registers (the theme's too), as the Image block lists them.
	const registered = useSelect( ( select ) => select( 'core/block-editor' ).getSettings()?.imageSizes, [] );
	const sizeOptions = Array.isArray( registered ) && registered.length
		? registered.map( ( { slug, name } ) => ( { label: name, value: slug } ) )
		: imageSizeOptions;

	const toggle = ( key, label ) => <ToggleControl
		className='mt10'
		__nextHasNoMarginBottom
		label={ label }
		checked={ !! elements[ key ] }
		onChange={ ( val ) => updateObj( 'elements', val, key ) }
	/>;

	return <PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Preset', 'b-blocks' ) }
			value={ attributes.preset }
			options={ presetOptions }
			help={ __( 'Restyles the block to the preset’s design.', 'b-blocks' ) }
			onChange={ ( val ) => setAttributes( {
				...PRESET_STYLES[ val ],
				preset: val,
				// The design changes; what the author wrote stays.
				button: { ...PRESET_STYLES[ val ].button, cartText: attributes.button?.cartText },
				viewButton: { ...PRESET_STYLES[ val ].viewButton, text: attributes.viewButton?.text },
				heading: { ...PRESET_STYLES[ val ].heading, text: attributes.heading?.text, tag: attributes.heading?.tag },
				options: { ...attributes.options, ...PRESET_STYLES[ val ].options }
			} ) }
		/>

		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Image Size', 'b-blocks')}
			labelPosition='edge'
			value={ layout.imageSize }
			options={ sizeOptions }
			onChange={ ( val ) => updateObj( 'layout', val, 'imageSize' ) }
		/>

		<Label>{ __( 'Title Tag', 'b-blocks' ) }</Label>
		<BButtonGroup
			label=''
			options={ titleTagOptions }
			value={ layout.titleTag }
			onChange={ ( val ) => updateObj( 'layout', val, 'titleTag' ) }
		/>

		<div className='mt10'>
			{ has( 'rating' ) && toggle( 'rating', __( 'Show Rating', 'b-blocks' ) ) }
			{ toggle( 'price', __( 'Show Price', 'b-blocks' ) ) }
			{ toggle( 'saleBadge', __( 'Show Sale Badge', 'b-blocks' ) ) }
			{ has( 'category' ) && toggle( 'category', __( 'Show Category', 'b-blocks' ) ) }
			{ toggle( 'cart', __( 'Show Add to Cart', 'b-blocks' ) ) }
		</div>
	</PanelBody>;
};

export default Layout;