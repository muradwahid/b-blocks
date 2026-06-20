import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const BUSINESS_TYPE_OPTIONS = [
	{ label: __( 'Local Business (generic)', 'b-blocks' ), value: 'LocalBusiness' },
	{ label: __( 'Restaurant', 'b-blocks' ), value: 'Restaurant' },
	{ label: __( 'Medical Business', 'b-blocks' ), value: 'MedicalBusiness' },
	{ label: __( 'Lodging / Hotel', 'b-blocks' ), value: 'LodgingBusiness' },
	{ label: __( 'Health & Beauty', 'b-blocks' ), value: 'HealthAndBeautyBusiness' },
	{ label: __( 'Home & Construction', 'b-blocks' ), value: 'HomeAndConstructionBusiness' },
	{ label: __( 'Financial Service', 'b-blocks' ), value: 'FinancialService' },
	{ label: __( 'Legal Service', 'b-blocks' ), value: 'LegalService' },
	{ label: __( 'Professional Service', 'b-blocks' ), value: 'ProfessionalService' },
	{ label: __( 'Sports / Activity Location', 'b-blocks' ), value: 'SportsActivityLocation' },
	{ label: __( 'Store / Retail', 'b-blocks' ), value: 'Store' },
	{ label: __( 'Food Establishment', 'b-blocks' ), value: 'FoodEstablishment' },
];

const HEADING_TAG_OPTIONS = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: 'H5', value: 'h5' },
	{ label: 'H6', value: 'h6' },
];

const LAYOUT_OPTIONS = [
	{ label: __( 'Card (stacked)', 'b-blocks' ), value: 'card' },
	{ label: __( 'Horizontal (logo left)', 'b-blocks' ), value: 'horizontal' },
];

const THEME_OPTIONS = [
	{ label: __( 'Classic — clean white card, blue accent', 'b-blocks' ), value: 'classic' },
	{ label: __( 'Corporate — navy header, gold accent', 'b-blocks' ), value: 'corporate' },
	{ label: __( 'Gradient — purple→pink header strip', 'b-blocks' ), value: 'gradient' },
	{ label: __( 'Elegant — cream paper, serif name, gold', 'b-blocks' ), value: 'elegant' },
	{ label: __( 'Bold — thick border, uppercase name', 'b-blocks' ), value: 'bold' },
];

const ALIGNMENT_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
];

const LOGO_SHAPE_OPTIONS = [
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
	{ label: __( 'Rounded', 'b-blocks' ), value: 'rounded' },
	{ label: __( 'Square', 'b-blocks' ), value: 'square' },
];

const FONT_WEIGHT_OPTIONS = [
	{ label: '400', value: '400' },
	{ label: '500', value: '500' },
	{ label: '600', value: '600' },
	{ label: '700', value: '700' },
	{ label: '800', value: '800' },
];

const Settings = ( { attributes, setAttributes } ) => {
	const {
		businessName,
		businessType,
		tagline,
		headingTag,
		logoId,
		logoUrl,
		logoAlt,
		phone,
		email,
		website,
		addressStreet,
		addressCity,
		addressState,
		addressPostal,
		addressCountry,
		mapUrl,
		showDirectionsBtn,
		directionsLabel,
		layout,
		theme,
		alignment,
		showSchema,
		showLogo,
		showTagline,
		showAddress,
		showPhone,
		showEmail,
		showWebsite,
		accentColor,
		backgroundColor,
		textColor,
		nameColor,
		linkColor,
		iconColor,
		borderRadius,
		borderWidth,
		borderColor,
		padding,
		logoSize,
		logoShape,
		nameFontSize,
		nameFontWeight,
		labelFontSize,
		rowIconSize,
	} = attributes;

	const pad = padding || { top: 32, right: 32, bottom: 32, left: 32 };
	const setPad = ( side, value ) => {
		setAttributes( {
			padding: {
				...pad,
				[ side ]: Math.max( 0, Math.min( 96, parseInt( value, 10 ) || 0 ) ),
			},
		} );
	};

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Content', 'b-blocks' ) }
				initialOpen={ true }
			>
				<TextControl
					label={ __( 'Business Name', 'b-blocks' ) }
					value={ businessName || '' }
					onChange={ ( val ) => setAttributes( { businessName: val } ) }
					help={ __( 'Required for the LocalBusiness schema. Also used as the visible heading.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={ __( 'Tagline (optional)', 'b-blocks' ) }
					value={ tagline || '' }
					onChange={ ( val ) => setAttributes( { tagline: val } ) }
					placeholder={ __( 'Brief one-liner about the business', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Business Type (schema)', 'b-blocks' ) }
					value={ businessType || 'LocalBusiness' }
					options={ BUSINESS_TYPE_OPTIONS }
					onChange={ ( val ) => setAttributes( { businessType: val } ) }
					help={ __( 'Picks the schema.org @type emitted in the JSON-LD payload.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Business name heading tag', 'b-blocks' ) }
					value={ headingTag || 'h3' }
					options={ HEADING_TAG_OPTIONS }
					onChange={ ( val ) => setAttributes( { headingTag: val } ) }
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={ __( 'Show logo / photo', 'b-blocks' ) }
					checked={ !! showLogo }
					onChange={ ( val ) => setAttributes( { showLogo: val } ) }
				/>

				<ToggleControl
					label={ __( 'Show tagline', 'b-blocks' ) }
					checked={ !! showTagline }
					onChange={ ( val ) => setAttributes( { showTagline: val } ) }
				/>

				<div style={ { marginTop: 16 } }>
					<Label>{ __( 'Logo / Photo', 'b-blocks' ) }</Label>
					{ logoUrl && (
						<div style={ { marginTop: 8 } }>
							<img
								src={ logoUrl }
								alt={ logoAlt || '' }
								style={ { maxWidth: '100%', height: 'auto', borderRadius: 6 } }
							/>
						</div>
					) }
					<div style={ { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' } }>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								value={ logoId || 0 }
								onSelect={ ( media ) => setAttributes( {
									logoId: media?.id || 0,
									logoUrl: media?.url || '',
									logoAlt: media?.alt || '',
								} ) }
								render={ ( { open } ) => (
									<Button variant='secondary' onClick={ open }>
										{ logoUrl ? __( 'Replace Image', 'b-blocks' ) : __( 'Select Image', 'b-blocks' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						{ logoUrl && (
							<Button
								variant='link'
								isDestructive
								onClick={ () => setAttributes( { logoId: 0, logoUrl: '', logoAlt: '' } ) }
							>
								{ __( 'Remove Image', 'b-blocks' ) }
							</Button>
						) }
					</div>
					{ logoUrl && (
						<TextControl
							label={ __( 'Logo alt text', 'b-blocks' ) }
							value={ logoAlt || '' }
							onChange={ ( val ) => setAttributes( { logoAlt: val } ) }
							help={ __( 'Falls back to the business name if left blank.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>
					) }
				</div>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Contact Details', 'b-blocks' ) }
				initialOpen={ false }
			>
				<ToggleControl
					label={ __( 'Show phone', 'b-blocks' ) }
					checked={ !! showPhone }
					onChange={ ( val ) => setAttributes( { showPhone: val } ) }
				/>
				<TextControl
					label={ __( 'Phone', 'b-blocks' ) }
					value={ phone || '' }
					onChange={ ( val ) => setAttributes( { phone: val } ) }
					placeholder='+1 (555) 000-0000'
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={ __( 'Show email', 'b-blocks' ) }
					checked={ !! showEmail }
					onChange={ ( val ) => setAttributes( { showEmail: val } ) }
				/>
				<TextControl
					label={ __( 'Email', 'b-blocks' ) }
					value={ email || '' }
					onChange={ ( val ) => setAttributes( { email: val } ) }
					type='email'
					placeholder='hello@example.com'
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={ __( 'Show website', 'b-blocks' ) }
					checked={ !! showWebsite }
					onChange={ ( val ) => setAttributes( { showWebsite: val } ) }
				/>
				<TextControl
					label={ __( 'Website', 'b-blocks' ) }
					value={ website || '' }
					onChange={ ( val ) => setAttributes( { website: val } ) }
					type='url'
					placeholder='https://example.com'
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={ __( 'Show address', 'b-blocks' ) }
					checked={ !! showAddress }
					onChange={ ( val ) => setAttributes( { showAddress: val } ) }
				/>
				<TextControl
					label={ __( 'Street Address', 'b-blocks' ) }
					value={ addressStreet || '' }
					onChange={ ( val ) => setAttributes( { addressStreet: val } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'City / Locality', 'b-blocks' ) }
					value={ addressCity || '' }
					onChange={ ( val ) => setAttributes( { addressCity: val } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'State / Region', 'b-blocks' ) }
					value={ addressState || '' }
					onChange={ ( val ) => setAttributes( { addressState: val } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Postal / ZIP Code', 'b-blocks' ) }
					value={ addressPostal || '' }
					onChange={ ( val ) => setAttributes( { addressPostal: val } ) }
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Country (ISO code)', 'b-blocks' ) }
					value={ addressCountry || '' }
					onChange={ ( val ) => setAttributes( { addressCountry: val } ) }
					placeholder='US'
					help={ __( 'Two-letter ISO 3166-1 code (e.g. US, GB, DE, JP).', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Map & Directions', 'b-blocks' ) }
				initialOpen={ false }
			>
				<TextControl
					label={ __( 'Google Maps URL (optional)', 'b-blocks' ) }
					value={ mapUrl || '' }
					onChange={ ( val ) => setAttributes( { mapUrl: val } ) }
					placeholder='https://maps.google.com/?q=...'
					help={ __( 'Leave blank to auto-build a Google Maps search URL from the address.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
				<ToggleControl
					label={ __( 'Show Directions button', 'b-blocks' ) }
					checked={ !! showDirectionsBtn }
					onChange={ ( val ) => setAttributes( { showDirectionsBtn: val } ) }
				/>
				<TextControl
					label={ __( 'Directions button label', 'b-blocks' ) }
					value={ directionsLabel || '' }
					onChange={ ( val ) => setAttributes( { directionsLabel: val } ) }
					placeholder={ __( 'Get Directions', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Layout', 'b-blocks' ) }
				initialOpen={ false }
			>
				<SelectControl
					label={ __( 'Layout', 'b-blocks' ) }
					value={ layout || 'card' }
					options={ LAYOUT_OPTIONS }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Theme', 'b-blocks' ) }
					value={ theme || 'classic' }
					options={ THEME_OPTIONS }
					onChange={ ( val ) => setAttributes( { theme: val } ) }
					help={ __( 'Picks the overall color scheme and typography. Style panel colors can still override per instance.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Alignment', 'b-blocks' ) }
					value={ alignment || 'left' }
					options={ ALIGNMENT_OPTIONS }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Logo size (px)', 'b-blocks' ) }
					value={ parseInt( logoSize, 10 ) || 80 }
					onChange={ ( val ) => setAttributes( { logoSize: val } ) }
					min={ 32 }
					max={ 200 }
					step={ 2 }
					__nextHasNoMarginBottom
				/>
				<SelectControl
					label={ __( 'Logo shape', 'b-blocks' ) }
					value={ logoShape || 'rounded' }
					options={ LOGO_SHAPE_OPTIONS }
					onChange={ ( val ) => setAttributes( { logoShape: val } ) }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Row icon size (px)', 'b-blocks' ) }
					value={ parseInt( rowIconSize, 10 ) || 16 }
					onChange={ ( val ) => setAttributes( { rowIconSize: val } ) }
					min={ 10 }
					max={ 28 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Style', 'b-blocks' ) }
				initialOpen={ false }
			>
				<PanelRow>
					<Label>{ __( 'Accent color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ accentColor || '#146EF5' }
						onChange={ ( val ) => setAttributes( { accentColor: val } ) }
						defaultColor='#146EF5'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{ __( 'Background color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ backgroundColor || '#ffffff' }
						onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{ __( 'Text color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ textColor || '#1a1a1a' }
						onChange={ ( val ) => setAttributes( { textColor: val } ) }
						defaultColor='#1a1a1a'
					/>
				</PanelRow>

				<PanelRow>
					<Label>{ __( 'Business name color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ nameColor || '' }
						onChange={ ( val ) => setAttributes( { nameColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label>{ __( 'Link color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ linkColor || '' }
						onChange={ ( val ) => setAttributes( { linkColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label>{ __( 'Icon color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ iconColor || '' }
						onChange={ ( val ) => setAttributes( { iconColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Border radius (px)', 'b-blocks' ) }
					value={ parseInt( borderRadius, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
					min={ 0 }
					max={ 64 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Border width (px)', 'b-blocks' ) }
					value={ parseInt( borderWidth, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { borderWidth: val } ) }
					min={ 0 }
					max={ 8 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label>{ __( 'Border color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ borderColor || '#e5e7eb' }
						onChange={ ( val ) => setAttributes( { borderColor: val } ) }
						defaultColor='#e5e7eb'
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Padding top (px)', 'b-blocks' ) }
					value={ parseInt( pad.top, 10 ) || 0 }
					onChange={ ( val ) => setPad( 'top', val ) }
					min={ 0 }
					max={ 96 }
					step={ 2 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding right (px)', 'b-blocks' ) }
					value={ parseInt( pad.right, 10 ) || 0 }
					onChange={ ( val ) => setPad( 'right', val ) }
					min={ 0 }
					max={ 96 }
					step={ 2 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding bottom (px)', 'b-blocks' ) }
					value={ parseInt( pad.bottom, 10 ) || 0 }
					onChange={ ( val ) => setPad( 'bottom', val ) }
					min={ 0 }
					max={ 96 }
					step={ 2 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding left (px)', 'b-blocks' ) }
					value={ parseInt( pad.left, 10 ) || 0 }
					onChange={ ( val ) => setPad( 'left', val ) }
					min={ 0 }
					max={ 96 }
					step={ 2 }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Business name font size (px)', 'b-blocks' ) }
					value={ parseInt( nameFontSize, 10 ) || 22 }
					onChange={ ( val ) => setAttributes( { nameFontSize: val } ) }
					min={ 14 }
					max={ 48 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Business name font weight', 'b-blocks' ) }
					value={ nameFontWeight || '700' }
					options={ FONT_WEIGHT_OPTIONS }
					onChange={ ( val ) => setAttributes( { nameFontWeight: val } ) }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Row text font size (px)', 'b-blocks' ) }
					value={ parseInt( labelFontSize, 10 ) || 14 }
					onChange={ ( val ) => setAttributes( { labelFontSize: val } ) }
					min={ 10 }
					max={ 24 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Schema', 'b-blocks' ) }
				initialOpen={ false }
			>
				<ToggleControl
					label={ __( 'Emit LocalBusiness JSON-LD', 'b-blocks' ) }
					checked={ !! showSchema }
					onChange={ ( val ) => setAttributes( { showSchema: val } ) }
					help={ __( 'Enables Google rich results for business contact info. Requires a Business Name. Disable if your SEO plugin already outputs LocalBusiness schema.', 'b-blocks' ) }
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
