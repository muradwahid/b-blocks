import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { positionOptions, textAlignOptions, fontWeightOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		position, isSticky, message, showButton, buttonText, buttonUrl, buttonOpenNewTab,
		isDismissible, backgroundColor, textColor,
		buttonBgColor, buttonTextColor, buttonBorderRadius,
		paddingVertical, paddingHorizontal, fontSize, fontWeight,
		textAlign, zIndex
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Position:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ position }
					options={ positionOptions }
					onChange={ ( val ) => setAttributes( { position: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Sticky (fixed to viewport)', 'b-blocks' ) }
				checked={ !! isSticky }
				onChange={ ( val ) => setAttributes( { isSticky: val } ) }
				help={ isSticky
					? __( 'The bar is pinned and body content gets a matching padding offset.', 'b-blocks' )
					: __( 'The bar renders in normal document flow.', 'b-blocks' )
				}
			/>

			<PanelRow>
				<Label className=''>{ __( 'Text Align:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ textAlign }
					options={ textAlignOptions }
					onChange={ ( val ) => setAttributes( { textAlign: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ paddingVertical }
				onChange={ ( val ) => setAttributes( { paddingVertical: val } ) }
				min={ 0 }
				max={ 60 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ paddingHorizontal }
				onChange={ ( val ) => setAttributes( { paddingHorizontal: val } ) }
				min={ 0 }
				max={ 100 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<p style={ { fontSize: '12px', color: '#666', marginTop: 0 } }>
				{ __( 'Edit the message text directly in the bar on the canvas. Supports bold, italic, and links.', 'b-blocks' ) }
			</p>

			{ ! message && (
				<TextControl
					label={ __( 'Message (fallback)', 'b-blocks' ) }
					value={ message }
					onChange={ ( val ) => setAttributes( { message: val } ) }
					placeholder={ __( 'Welcome! Free shipping on orders over $50.', 'b-blocks' ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Button', 'b-blocks' ) }
				checked={ !! showButton }
				onChange={ ( val ) => setAttributes( { showButton: val } ) }
			/>

			{ showButton && <>
				<TextControl
					label={ __( 'Button Label', 'b-blocks' ) }
					value={ buttonText }
					onChange={ ( val ) => setAttributes( { buttonText: val } ) }
					placeholder={ __( 'Shop Now', 'b-blocks' ) }
				/>

				<TextControl
					label={ __( 'Button URL', 'b-blocks' ) }
					type='url'
					value={ buttonUrl }
					onChange={ ( val ) => setAttributes( { buttonUrl: val } ) }
					placeholder='https://example.com/'
				/>

				<ToggleControl
					label={ __( 'Open in new tab', 'b-blocks' ) }
					checked={ !! buttonOpenNewTab }
					onChange={ ( val ) => setAttributes( { buttonOpenNewTab: val } ) }
				/>
			</> }

			<ToggleControl
				label={ __( 'Dismissible', 'b-blocks' ) }
				checked={ !! isDismissible }
				onChange={ ( val ) => setAttributes( { isDismissible: val } ) }
				help={ __( 'Show a close button. Dismissed state is remembered per visitor via localStorage.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ backgroundColor }
				onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
				defaultColor='#1a1a2e'
			/>

			<ColorControl
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ textColor }
				onChange={ ( val ) => setAttributes( { textColor: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Font Size (px)', 'b-blocks' ) }
				value={ fontSize }
				onChange={ ( val ) => setAttributes( { fontSize: val } ) }
				min={ 10 }
				max={ 30 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ fontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { fontWeight: val } ) }
				/>
			</PanelRow>

			{ showButton && <>
				<ColorControl
					label={ __( 'Button Background:', 'b-blocks' ) }
					value={ buttonBgColor }
					onChange={ ( val ) => setAttributes( { buttonBgColor: val } ) }
					defaultColor='#e94560'
				/>

				<ColorControl
					label={ __( 'Button Text Color:', 'b-blocks' ) }
					value={ buttonTextColor }
					onChange={ ( val ) => setAttributes( { buttonTextColor: val } ) }
					defaultColor='#ffffff'
				/>

				<RangeControl
					label={ __( 'Button Border Radius (px)', 'b-blocks' ) }
					value={ buttonBorderRadius }
					onChange={ ( val ) => setAttributes( { buttonBorderRadius: val } ) }
					min={ 0 }
					max={ 50 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Advanced', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Z-Index', 'b-blocks' ) }
				value={ zIndex }
				onChange={ ( val ) => setAttributes( { zIndex: val } ) }
				min={ 100 }
				max={ 99999 }
				step={ 1 }
				help={ __( 'Raise if the bar appears behind other fixed elements like a sticky header.', 'b-blocks' ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
