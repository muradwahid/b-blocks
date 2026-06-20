import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { drawerSideOptions, triggerIconOptions, triggerAlignOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		drawerSide, drawerWidth, showOverlay, overlayColor,
		triggerLabel, triggerIcon, triggerAlign,
		closeLabel, drawerBgColor, drawerPadding,
		triggerBgColor, triggerTextColor, triggerBorderRadius,
		animationDuration
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Drawer Side:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ drawerSide }
					options={ drawerSideOptions }
					onChange={ ( val ) => setAttributes( { drawerSide: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Drawer Width (px)', 'b-blocks' ) }
				value={ drawerWidth }
				onChange={ ( val ) => setAttributes( { drawerWidth: val } ) }
				min={ 200 }
				max={ 600 }
				step={ 10 }
				help={ __( 'Applies on desktop. On mobile screens the drawer takes 85vw.', 'b-blocks' ) }
			/>

			<ToggleControl
				label={ __( 'Show Overlay', 'b-blocks' ) }
				checked={ !! showOverlay }
				onChange={ ( val ) => setAttributes( { showOverlay: val } ) }
			/>

			{ showOverlay && <ColorControl
				label={ __( 'Overlay Color:', 'b-blocks' ) }
				value={ overlayColor }
				onChange={ ( val ) => setAttributes( { overlayColor: val } ) }
				defaultColor='rgba(0,0,0,0.5)'
			/> }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Trigger Button', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'Trigger Label', 'b-blocks' ) }
				value={ triggerLabel }
				onChange={ ( val ) => setAttributes( { triggerLabel: val } ) }
				placeholder={ __( 'Open Menu', 'b-blocks' ) }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Trigger Icon:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ triggerIcon }
					options={ triggerIconOptions }
					onChange={ ( val ) => setAttributes( { triggerIcon: val } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Trigger Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ triggerAlign }
					options={ triggerAlignOptions }
					onChange={ ( val ) => setAttributes( { triggerAlign: val } ) }
				/>
			</PanelRow>

			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ triggerBgColor }
				onChange={ ( val ) => setAttributes( { triggerBgColor: val } ) }
				defaultColor='#1e1e1e'
			/>

			<ColorControl
				label={ __( 'Text / Icon Color:', 'b-blocks' ) }
				value={ triggerTextColor }
				onChange={ ( val ) => setAttributes( { triggerTextColor: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ triggerBorderRadius }
				onChange={ ( val ) => setAttributes( { triggerBorderRadius: val } ) }
				min={ 0 }
				max={ 50 }
				step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Drawer Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ drawerBgColor }
				onChange={ ( val ) => setAttributes( { drawerBgColor: val } ) }
				defaultColor='#ffffff'
			/>

			<RangeControl
				label={ __( 'Inner Padding (px)', 'b-blocks' ) }
				value={ drawerPadding }
				onChange={ ( val ) => setAttributes( { drawerPadding: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 4 }
			/>

			<TextControl
				label={ __( 'Close Button Label', 'b-blocks' ) }
				help={ __( 'Used as the close button’s screen-reader label.', 'b-blocks' ) }
				value={ closeLabel }
				onChange={ ( val ) => setAttributes( { closeLabel: val } ) }
				placeholder={ __( 'Close', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Behavior', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Animation Duration (ms)', 'b-blocks' ) }
				value={ animationDuration }
				onChange={ ( val ) => setAttributes( { animationDuration: val } ) }
				min={ 100 }
				max={ 600 }
				step={ 50 }
				help={ __( 'Animation is automatically disabled when the visitor has prefers-reduced-motion enabled.', 'b-blocks' ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
