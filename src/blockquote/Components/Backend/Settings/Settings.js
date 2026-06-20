import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	TabPanel
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const LAYOUT_OPTIONS = [
	{ label: __( 'Border — left accent bar', 'b-blocks' ), value: 'border' },
	{ label: __( 'Quotation — large decorative mark', 'b-blocks' ), value: 'quotation' }
];

const ALIGN_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

const SHAPE_OPTIONS = [
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
	{ label: __( 'Rounded', 'b-blocks' ), value: 'rounded' },
	{ label: __( 'Square', 'b-blocks' ), value: 'square' }
];

const FONT_WEIGHT_OPTIONS = [
	{ label: __( '300 — Light', 'b-blocks' ), value: '300' },
	{ label: __( '400 — Normal', 'b-blocks' ), value: '400' },
	{ label: __( '500 — Medium', 'b-blocks' ), value: '500' },
	{ label: __( '600 — Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( '700 — Bold', 'b-blocks' ), value: '700' }
];

// Pull an integer out of "20px" → 20; falls back when unparseable.
const parsePx = ( value, fallback ) => {
	const m = ( value || '' ).toString().match( /^(\d+(?:\.\d+)?)/ );
	return m ? parseFloat( m[ 1 ] ) : fallback;
};

const clampPx = ( value, min, max, fallback ) => {
	const num = parseInt( value, 10 );
	if ( Number.isNaN( num ) ) {
		return `${ fallback }px`;
	}
	return `${ Math.max( min, Math.min( max, num ) ) }px`;
};

const Settings = ( { attributes, setAttributes } ) => {
	const {
		authorName,
		authorRole,
		authorAvatarId,
		authorAvatarUrl,
		authorAvatarAlt,
		layout,
		alignment,
		showAvatar,
		avatarSize,
		avatarShape,
		showAuthorRole,
		quoteIconSize,
		quoteIconColor,
		accentColor,
		accentWidth,
		quoteTextColor,
		authorNameColor,
		authorRoleColor,
		backgroundColor,
		quoteFontSize = {},
		quoteFontWeight,
		quoteLineHeight,
		authorFontSize,
		padding = {},
		borderRadius
	} = attributes;

	const setQuoteFontSize = ( device, val ) => {
		setAttributes( {
			quoteFontSize: {
				desktop: quoteFontSize.desktop || '20px',
				tablet: quoteFontSize.tablet || '18px',
				mobile: quoteFontSize.mobile || '16px',
				[ device ]: val
			}
		} );
	};

	const setPadding = ( side, val ) => {
		setAttributes( {
			padding: {
				top: padding.top || '24px',
				right: padding.right || '24px',
				bottom: padding.bottom || '24px',
				left: padding.left || '24px',
				[ side ]: val
			}
		} );
	};

	const isBorderLayout = layout === 'border';
	const isQuotationLayout = layout === 'quotation';

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Layout', 'b-blocks' ) }
				initialOpen={ true }
			>
				<SelectControl
					label={ __( 'Layout', 'b-blocks' ) }
					value={ layout || 'border' }
					options={ LAYOUT_OPTIONS }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
					help={ __( 'Border = left accent bar. Quotation = large decorative quote mark.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<SelectControl
					label={ __( 'Alignment', 'b-blocks' ) }
					value={ alignment || 'left' }
					options={ ALIGN_OPTIONS }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Author', 'b-blocks' ) }
				initialOpen={ true }
			>
				<TextControl
					label={ __( 'Author Name', 'b-blocks' ) }
					value={ authorName || '' }
					onChange={ ( val ) => setAttributes( { authorName: val } ) }
					placeholder={ __( 'Jane Doe', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={ __( 'Show Role / Company', 'b-blocks' ) }
					checked={ !! showAuthorRole }
					onChange={ ( val ) => setAttributes( { showAuthorRole: val } ) }
				/>

				{ showAuthorRole && (
					<TextControl
						label={ __( 'Role / Company', 'b-blocks' ) }
						value={ authorRole || '' }
						onChange={ ( val ) => setAttributes( { authorRole: val } ) }
						placeholder={ __( 'CEO, Acme', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>
				) }

				<ToggleControl
					label={ __( 'Show Author Photo', 'b-blocks' ) }
					checked={ !! showAvatar }
					onChange={ ( val ) => setAttributes( { showAvatar: val } ) }
				/>

				{ showAvatar && (
					<>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								value={ authorAvatarId }
								onSelect={ ( media ) => setAttributes( {
									authorAvatarId: media?.id || 0,
									authorAvatarUrl: media?.url || '',
									authorAvatarAlt: media?.alt || authorAvatarAlt || ''
								} ) }
								render={ ( { open } ) => (
									<Button
										variant='secondary'
										onClick={ open }
									>
										{ authorAvatarUrl ? __( 'Replace Photo', 'b-blocks' ) : __( 'Select Photo', 'b-blocks' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>

						{ authorAvatarUrl && (
							<Button
								variant='link'
								isDestructive
								onClick={ () => setAttributes( {
									authorAvatarId: 0,
									authorAvatarUrl: '',
									authorAvatarAlt: ''
								} ) }
								style={ { marginTop: 8 } }
							>
								{ __( 'Remove Photo', 'b-blocks' ) }
							</Button>
						) }

						{ authorAvatarUrl && (
							<TextControl
								label={ __( 'Image Alt Text', 'b-blocks' ) }
								value={ authorAvatarAlt || '' }
								onChange={ ( val ) => setAttributes( { authorAvatarAlt: val } ) }
								placeholder={ __( 'Photo of Jane Doe', 'b-blocks' ) }
								help={ __( 'Defaults to "Photo of <author name>" when empty.', 'b-blocks' ) }
								__nextHasNoMarginBottom
							/>
						) }

						<RangeControl
							label={ __( 'Avatar Size (px)', 'b-blocks' ) }
							value={ avatarSize ?? 48 }
							onChange={ ( val ) => setAttributes( { avatarSize: val } ) }
							min={ 24 }
							max={ 128 }
							step={ 4 }
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={ __( 'Avatar Shape', 'b-blocks' ) }
							value={ avatarShape || 'circle' }
							options={ SHAPE_OPTIONS }
							onChange={ ( val ) => setAttributes( { avatarShape: val } ) }
							__nextHasNoMarginBottom
						/>
					</>
				) }
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Style', 'b-blocks' ) }
				initialOpen={ false }
			>
				<PanelRow>
					<Label className=''>{ __( 'Accent Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ accentColor || '#6366f1' }
						onChange={ ( val ) => setAttributes( { accentColor: val } ) }
						defaultColor='#6366f1'
					/>
				</PanelRow>
				<p style={ { margin: '4px 0 12px', fontSize: 11, color: '#777' } }>
					{ __( 'Drives the left bar (Border layout) or quote-mark color (Quotation layout). Pick a color with at least 3:1 contrast against the background for WCAG AA.', 'b-blocks' ) }
				</p>

				{ isBorderLayout && (
					<RangeControl
						label={ __( 'Accent Bar Width (px)', 'b-blocks' ) }
						value={ accentWidth ?? 4 }
						onChange={ ( val ) => setAttributes( { accentWidth: val } ) }
						min={ 1 }
						max={ 12 }
						step={ 1 }
						__nextHasNoMarginBottom
					/>
				) }

				{ isQuotationLayout && (
					<>
						<RangeControl
							label={ __( 'Quote Icon Size (px)', 'b-blocks' ) }
							value={ quoteIconSize ?? 48 }
							onChange={ ( val ) => setAttributes( { quoteIconSize: val } ) }
							min={ 24 }
							max={ 120 }
							step={ 2 }
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{ __( 'Quote Icon Color:', 'b-blocks' ) }</Label>
							<ColorControl
								value={ quoteIconColor || '#6366f1' }
								onChange={ ( val ) => setAttributes( { quoteIconColor: val } ) }
								defaultColor='#6366f1'
							/>
						</PanelRow>
					</>
				) }

				<PanelRow>
					<Label className=''>{ __( 'Background:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ backgroundColor || '' }
						onChange={ ( val ) => setAttributes( { backgroundColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Quote Text Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ quoteTextColor || '' }
						onChange={ ( val ) => setAttributes( { quoteTextColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Author Name Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ authorNameColor || '' }
						onChange={ ( val ) => setAttributes( { authorNameColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Author Role Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ authorRoleColor || '' }
						onChange={ ( val ) => setAttributes( { authorRoleColor: val || '' } ) }
						defaultColor=''
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ borderRadius ?? 8 }
					onChange={ ( val ) => setAttributes( { borderRadius: val } ) }
					min={ 0 }
					max={ 32 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Typography', 'b-blocks' ) }
				initialOpen={ false }
			>
				<TabPanel
					className='bb-bq-device-tabs'
					activeClass='is-active'
					tabs={ [
						{ name: 'desktop', title: __( 'Desktop', 'b-blocks' ) },
						{ name: 'tablet', title: __( 'Tablet', 'b-blocks' ) },
						{ name: 'mobile', title: __( 'Mobile', 'b-blocks' ) }
					] }
				>
					{ ( tab ) => (
						<RangeControl
							label={ __( 'Quote Font Size (px)', 'b-blocks' ) }
							value={ parsePx( quoteFontSize[ tab.name ] || ( tab.name === 'desktop' ? '20px' : tab.name === 'tablet' ? '18px' : '16px' ), 16 ) }
							onChange={ ( val ) => setQuoteFontSize( tab.name, clampPx( val, 12, 48, 16 ) ) }
							min={ 12 }
							max={ 48 }
							step={ 1 }
							__nextHasNoMarginBottom
						/>
					) }
				</TabPanel>

				<SelectControl
					label={ __( 'Quote Font Weight', 'b-blocks' ) }
					value={ quoteFontWeight || '400' }
					options={ FONT_WEIGHT_OPTIONS }
					onChange={ ( val ) => setAttributes( { quoteFontWeight: val } ) }
					__nextHasNoMarginBottom
				/>

				<TextControl
					label={ __( 'Quote Line Height', 'b-blocks' ) }
					value={ quoteLineHeight || '1.6' }
					onChange={ ( val ) => setAttributes( { quoteLineHeight: val } ) }
					placeholder='1.6'
					help={ __( 'Unitless decimal (e.g. 1.4, 1.6, 1.8).', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Author Font Size (px)', 'b-blocks' ) }
					value={ authorFontSize ?? 14 }
					onChange={ ( val ) => setAttributes( { authorFontSize: val } ) }
					min={ 10 }
					max={ 28 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={ __( 'Spacing', 'b-blocks' ) }
				initialOpen={ false }
			>
				<RangeControl
					label={ __( 'Padding Top (px)', 'b-blocks' ) }
					value={ parsePx( padding.top || '24px', 24 ) }
					onChange={ ( val ) => setPadding( 'top', clampPx( val, 0, 96, 24 ) ) }
					min={ 0 }
					max={ 96 }
					step={ 4 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding Right (px)', 'b-blocks' ) }
					value={ parsePx( padding.right || '24px', 24 ) }
					onChange={ ( val ) => setPadding( 'right', clampPx( val, 0, 96, 24 ) ) }
					min={ 0 }
					max={ 96 }
					step={ 4 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding Bottom (px)', 'b-blocks' ) }
					value={ parsePx( padding.bottom || '24px', 24 ) }
					onChange={ ( val ) => setPadding( 'bottom', clampPx( val, 0, 96, 24 ) ) }
					min={ 0 }
					max={ 96 }
					step={ 4 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Padding Left (px)', 'b-blocks' ) }
					value={ parsePx( padding.left || '24px', 24 ) }
					onChange={ ( val ) => setPadding( 'left', clampPx( val, 0, 96, 24 ) ) }
					min={ 0 }
					max={ 96 }
					step={ 4 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
