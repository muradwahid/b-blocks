import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, Notice } from '@wordpress/components';

import { Label, ColorControl, HelpPanel, InlineMediaUpload } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { playerStyleOptions, alignmentOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		audioUrl, trackTitle, artistName, albumArt,
		playerStyle, autoPlay, loop, showDownload, showTimecode, showVolume,
		playerBg, controlColor, accentColor,
		borderRadius, paddingV, paddingH, titleSize, artistSize,
		alignment, maxWidth
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Audio', 'b-blocks' ) } initialOpen={ true }>
			<Label className=''>{ __( 'Audio File:', 'b-blocks' ) }</Label>
			<InlineMediaUpload
				value={ audioUrl }
				types={ [ 'audio' ] }
				onChange={ ( val ) => setAttributes( { audioUrl: val || '', audioId: 0 } ) }
				placeholder={ __( 'Audio file URL', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Track Title', 'b-blocks' ) }
				value={ trackTitle }
				onChange={ ( val ) => setAttributes( { trackTitle: val } ) }
				placeholder={ __( 'Episode title or leave empty', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Artist / Speaker', 'b-blocks' ) }
				value={ artistName }
				onChange={ ( val ) => setAttributes( { artistName: val } ) }
				placeholder={ __( 'Author or speaker name', 'b-blocks' ) }
			/>

			<Label className=''>{ __( 'Album Art (card layout):', 'b-blocks' ) }</Label>
			<InlineMediaUpload
				value={ albumArt?.url }
				types={ [ 'image' ] }
				onChange={ ( val ) => setAttributes( { albumArt: { url: val || '', id: 0 } } ) }
				placeholder={ __( 'Album art image URL', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Player Style', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ playerStyle }
					options={ playerStyleOptions }
					onChange={ ( val ) => setAttributes( { playerStyle: val } ) }
				/>
			</PanelRow>

			<PanelRow>
				<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 } max={ 1200 } step={ 10 }
				help={ __( '0 = full width.', 'b-blocks' ) }
			/>

			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ borderRadius }
				onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
				min={ 0 } max={ 60 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ paddingV }
				onChange={ ( val ) => setAttributes( { paddingV: val } ) }
				min={ 0 } max={ 80 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ paddingH }
				onChange={ ( val ) => setAttributes( { paddingH: val } ) }
				min={ 0 } max={ 80 } step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Background:', 'b-blocks' ) }
				value={ playerBg }
				onChange={ ( val ) => setAttributes( { playerBg: val } ) }
				defaultColor='#1e1e1e'
			/>

			<ColorControl
				label={ __( 'Controls & Text:', 'b-blocks' ) }
				value={ controlColor }
				onChange={ ( val ) => setAttributes( { controlColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Accent (scrubber fill):', 'b-blocks' ) }
				value={ accentColor }
				onChange={ ( val ) => setAttributes( { accentColor: val } ) }
				defaultColor='#146EF5'
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Track Title Size (px)', 'b-blocks' ) }
				value={ titleSize }
				onChange={ ( val ) => setAttributes( { titleSize: val } ) }
				min={ 10 } max={ 40 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Artist Name Size (px)', 'b-blocks' ) }
				value={ artistSize }
				onChange={ ( val ) => setAttributes( { artistSize: val } ) }
				min={ 8 } max={ 32 } step={ 1 }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Behavior', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Autoplay', 'b-blocks' ) }
				checked={ !! autoPlay }
				onChange={ ( val ) => setAttributes( { autoPlay: val } ) }
			/>
			{ autoPlay && (
				<Notice status='warning' isDismissible={ false }>
					{ __( 'Most browsers block autoplay with sound; the player will start muted. The visitor must unmute or interact to hear audio.', 'b-blocks' ) }
				</Notice>
			) }

			<ToggleControl
				className='mt20'
				label={ __( 'Loop', 'b-blocks' ) }
				checked={ !! loop }
				onChange={ ( val ) => setAttributes( { loop: val } ) }
			/>

			<ToggleControl
				className='mt20'
				label={ __( 'Show Timecode', 'b-blocks' ) }
				checked={ !! showTimecode }
				onChange={ ( val ) => setAttributes( { showTimecode: val } ) }
			/>

			<ToggleControl
				className='mt20'
				label={ __( 'Show Volume Slider', 'b-blocks' ) }
				checked={ !! showVolume }
				onChange={ ( val ) => setAttributes( { showVolume: val } ) }
			/>

			<ToggleControl
				className='mt20'
				label={ __( 'Show Download Link', 'b-blocks' ) }
				checked={ !! showDownload }
				onChange={ ( val ) => setAttributes( { showDownload: val } ) }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
