import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	RangeControl,
	ColorPalette,
	BaseControl,
	Flex,
	FlexItem
} from '@wordpress/components';

import { PLATFORMS, PLATFORM_ORDER } from '../../Common/platforms';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		side,
		offset,
		scrollThreshold,
		platforms,
		iconSize,
		buttonSize,
		buttonRadius,
		gap,
		backgroundColor,
		iconColor,
		hoverBackgroundColor,
		showLabels,
		labelSize,
		labelColor,
		animation,
		animationDuration,
		zIndex,
		shareTitle,
		shareUrl,
		twitterVia,
		emailSubject,
		copyLabel,
		copiedLabel
	} = attributes;

	const enabled = platforms || [];

	// Toggle a platform on/off while preserving the canonical display order.
	const togglePlatform = ( key, isOn ) => {
		const next = PLATFORM_ORDER.filter( ( p ) => {
			if ( p === key ) {
				return isOn;
			}
			return enabled.includes( p );
		} );
		setAttributes( { platforms: next } );
	};

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Layout', 'b-blocks' ) } initialOpen={ true }>
				<SelectControl
					label={ __( 'Viewport side', 'b-blocks' ) }
					value={ side }
					options={ [
						{ label: __( 'Left edge', 'b-blocks' ), value: 'left' },
						{ label: __( 'Right edge', 'b-blocks' ), value: 'right' }
					] }
					onChange={ ( value ) => setAttributes( { side: value } ) }
				/>
				<RangeControl
					label={ __( 'Scroll threshold (px)', 'b-blocks' ) }
					value={ scrollThreshold }
					onChange={ ( value ) => setAttributes( { scrollThreshold: value } ) }
					min={ 0 }
					max={ 2000 }
					step={ 50 }
					help={ __( '0 = always visible.', 'b-blocks' ) }
				/>
				<RangeControl
					label={ __( 'Vertical offset (px)', 'b-blocks' ) }
					value={ offset }
					onChange={ ( value ) => setAttributes( { offset: value } ) }
					min={ 0 }
					max={ 800 }
					help={ __( 'Distance from the vertical center.', 'b-blocks' ) }
				/>
				<RangeControl
					label={ __( 'Gap between buttons (px)', 'b-blocks' ) }
					value={ gap }
					onChange={ ( value ) => setAttributes( { gap: value } ) }
					min={ 0 }
					max={ 32 }
				/>
				<RangeControl
					label={ __( 'Z-index', 'b-blocks' ) }
					value={ zIndex }
					onChange={ ( value ) => setAttributes( { zIndex: value } ) }
					min={ 1 }
					max={ 99999 }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Platforms', 'b-blocks' ) } initialOpen={ false }>
				{ PLATFORM_ORDER.map( ( key ) => {
					const meta = PLATFORMS[ key ];
					return (
						<Flex key={ key } align="center" justify="space-between" style={ { marginBottom: '8px' } }>
							<FlexItem>
								<Flex align="center" gap={ 2 }>
									<span
										aria-hidden="true"
										style={ {
											display: 'inline-flex',
											width: 24,
											height: 24,
											borderRadius: 4,
											alignItems: 'center',
											justifyContent: 'center',
											background: meta.color,
											color: '#fff'
										} }
									>
										<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
											<path d={ meta.path } />
										</svg>
									</span>
									<span>{ meta.label }</span>
								</Flex>
							</FlexItem>
							<FlexItem>
								<ToggleControl
									__nextHasNoMarginBottom
									label=""
									checked={ enabled.includes( key ) }
									onChange={ ( value ) => togglePlatform( key, value ) }
								/>
							</FlexItem>
						</Flex>
					);
				} ) }
			</PanelBody>

			<PanelBody title={ __( 'Button Style', 'b-blocks' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Icon size (px)', 'b-blocks' ) }
					value={ iconSize }
					onChange={ ( value ) => setAttributes( { iconSize: value } ) }
					min={ 12 }
					max={ 40 }
				/>
				<RangeControl
					label={ __( 'Button size (px)', 'b-blocks' ) }
					value={ buttonSize }
					onChange={ ( value ) => setAttributes( { buttonSize: value } ) }
					min={ 30 }
					max={ 80 }
				/>
				<RangeControl
					label={ __( 'Border radius (px)', 'b-blocks' ) }
					value={ buttonRadius }
					onChange={ ( value ) => setAttributes( { buttonRadius: value } ) }
					min={ 0 }
					max={ 9999 }
					help={ __( 'Set to 9999 for circular buttons.', 'b-blocks' ) }
				/>
				<BaseControl label={ __( 'Background color', 'b-blocks' ) } help={ __( 'Leave blank to use per-platform brand colors.', 'b-blocks' ) }>
					<ColorPalette
						value={ backgroundColor }
						onChange={ ( value ) => setAttributes( { backgroundColor: value || '' } ) }
					/>
				</BaseControl>
				<BaseControl label={ __( 'Icon color', 'b-blocks' ) }>
					<ColorPalette
						value={ iconColor }
						onChange={ ( value ) => setAttributes( { iconColor: value || '' } ) }
					/>
				</BaseControl>
				<BaseControl label={ __( 'Hover background', 'b-blocks' ) } help={ __( 'Leave blank to auto-darken the background.', 'b-blocks' ) }>
					<ColorPalette
						value={ hoverBackgroundColor }
						onChange={ ( value ) => setAttributes( { hoverBackgroundColor: value || '' } ) }
					/>
				</BaseControl>
				<ToggleControl
					label={ __( 'Show labels', 'b-blocks' ) }
					checked={ showLabels }
					onChange={ ( value ) => setAttributes( { showLabels: value } ) }
				/>
				<RangeControl
					label={ __( 'Label size (px)', 'b-blocks' ) }
					value={ labelSize }
					onChange={ ( value ) => setAttributes( { labelSize: value } ) }
					min={ 10 }
					max={ 18 }
					disabled={ ! showLabels }
				/>
				<BaseControl label={ __( 'Label color', 'b-blocks' ) }>
					<ColorPalette
						value={ labelColor }
						onChange={ ( value ) => setAttributes( { labelColor: value || '' } ) }
						disable={ ! showLabels }
					/>
				</BaseControl>
			</PanelBody>

			<PanelBody title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
				<TextControl
					label={ __( 'Custom share title', 'b-blocks' ) }
					value={ shareTitle }
					onChange={ ( value ) => setAttributes( { shareTitle: value } ) }
					help={ __( 'Leave blank to use the page title.', 'b-blocks' ) }
				/>
				<TextControl
					label={ __( 'Custom share URL', 'b-blocks' ) }
					type="url"
					value={ shareUrl }
					onChange={ ( value ) => setAttributes( { shareUrl: value } ) }
					placeholder="https://"
					help={ __( 'Leave blank to use the current page URL.', 'b-blocks' ) }
				/>
				<TextControl
					label={ __( 'Twitter @via handle', 'b-blocks' ) }
					value={ twitterVia }
					onChange={ ( value ) => setAttributes( { twitterVia: value } ) }
					placeholder="username"
				/>
				<TextControl
					label={ __( 'Email subject', 'b-blocks' ) }
					value={ emailSubject }
					onChange={ ( value ) => setAttributes( { emailSubject: value } ) }
					help={ __( 'Leave blank to use the page title.', 'b-blocks' ) }
				/>
				<TextControl
					label={ __( 'Copy button label', 'b-blocks' ) }
					value={ copyLabel }
					onChange={ ( value ) => setAttributes( { copyLabel: value } ) }
				/>
				<TextControl
					label={ __( 'Copied confirmation label', 'b-blocks' ) }
					value={ copiedLabel }
					onChange={ ( value ) => setAttributes( { copiedLabel: value } ) }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Behavior', 'b-blocks' ) } initialOpen={ false }>
				<SelectControl
					label={ __( 'Entry animation', 'b-blocks' ) }
					value={ animation }
					options={ [
						{ label: __( 'Fade', 'b-blocks' ), value: 'fade' },
						{ label: __( 'Slide', 'b-blocks' ), value: 'slide' },
						{ label: __( 'None', 'b-blocks' ), value: 'none' }
					] }
					onChange={ ( value ) => setAttributes( { animation: value } ) }
				/>
				{ animation !== 'none' && (
					<RangeControl
						label={ __( 'Animation duration (ms)', 'b-blocks' ) }
						value={ animationDuration }
						onChange={ ( value ) => setAttributes( { animationDuration: value } ) }
						min={ 100 }
						max={ 800 }
					/>
				) }
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
