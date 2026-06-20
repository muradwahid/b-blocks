import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	ColorPalette,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import {
	LAYOUT_OPTIONS,
	VARIANT_OPTIONS,
	THEME_COLORS,
} from '../../utils/options';

/**
 * Settings panel rendered inside InspectorControls.
 *
 * Kept separate from Edit.js so the inspector layout can evolve without
 * complicating the in-canvas item editor.
 */
const Settings = ( { attributes, setAttributes } ) => {
	const { layout, variant, lineColor, showIcons } = attributes;

	return (
		<Fragment>
			<PanelBody title={ __( 'Layout', 'b-blocks' ) } initialOpen={ true }>
				<SelectControl
					label={ __( 'Layout', 'b-blocks' ) }
					value={ layout }
					options={ LAYOUT_OPTIONS }
					onChange={ ( value ) => setAttributes( { layout: value } ) }
					help={ __(
						'Mobile devices always collapse to a single column.',
						'b-blocks'
					) }
				/>
				<SelectControl
					label={ __( 'Style variant', 'b-blocks' ) }
					value={ variant }
					options={ VARIANT_OPTIONS }
					onChange={ ( value ) => setAttributes( { variant: value } ) }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Appearance', 'b-blocks' ) } initialOpen={ false }>
				<p>
					<strong>{ __( 'Timeline line color', 'b-blocks' ) }</strong>
				</p>
				<ColorPalette
					colors={ THEME_COLORS }
					value={ lineColor }
					onChange={ ( value ) =>
						setAttributes( { lineColor: value || '#dee2e6' } )
					}
				/>
				<ToggleControl
					label={ __( 'Show icons in markers', 'b-blocks' ) }
					checked={ !! showIcons }
					onChange={ ( value ) => setAttributes( { showIcons: value } ) }
					help={ __(
						'When off, item icons are hidden and only the colored dot is shown.',
						'b-blocks'
					) }
				/>
			</PanelBody>
		</Fragment>
	);
};

export default Settings;
