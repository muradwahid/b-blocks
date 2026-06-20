import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../utils/data';

const LAYOUT_OPTIONS = [
	{ label: __( 'Inline — compact horizontal byline', 'b-blocks' ), value: 'inline' },
	{ label: __( 'Stacked — centered profile, avatar on top', 'b-blocks' ), value: 'stacked' }
];

const THEME_OPTIONS = [
	{ label: __( 'Classic — clean white card, blue accent', 'b-blocks' ), value: 'classic' },
	{ label: __( 'Midnight — dark slate, amber accent', 'b-blocks' ), value: 'midnight' },
	{ label: __( 'Gradient — purple→pink, frosted glass', 'b-blocks' ), value: 'gradient' },
	{ label: __( 'Magazine — cream paper, serif, gold accent', 'b-blocks' ), value: 'magazine' }
];

const NAME_TAG_OPTIONS = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: 'H5', value: 'h5' },
	{ label: 'H6', value: 'h6' },
	{ label: __( 'Paragraph', 'b-blocks' ), value: 'p' }
];

const AVATAR_SHAPE_OPTIONS = [
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
	{ label: __( 'Rounded', 'b-blocks' ), value: 'rounded' },
	{ label: __( 'Square', 'b-blocks' ), value: 'square' }
];

const ALIGNMENT_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

const SOCIAL_DEFS = [
	{ slug: 'twitter', label: 'X (Twitter)' },
	{ slug: 'facebook', label: 'Facebook' },
	{ slug: 'linkedin', label: 'LinkedIn' },
	{ slug: 'instagram', label: 'Instagram' },
	{ slug: 'youtube', label: 'YouTube' },
	{ slug: 'github', label: 'GitHub' },
	{ slug: 'mastodon', label: 'Mastodon' },
	{ slug: 'website', label: __( 'Website', 'b-blocks' ) }
];

const DEFAULT_SOCIAL = {
	twitter: '',
	facebook: '',
	linkedin: '',
	instagram: '',
	youtube: '',
	github: '',
	mastodon: '',
	website: ''
};

const Settings = ( { attributes, setAttributes } ) => {
	const {
		authorId,
		layout,
		theme,
		showAvatar,
		avatarSize,
		avatarShape,
		showName,
		nameTag,
		showBio,
		bioCharLimit,
		showPostCount,
		showAllPostsLink,
		allPostsLinkLabel,
		showWebsite,
		showSocial,
		socialLinks,
		socialIconSize,
		socialIconColor,
		socialIconHoverColor,
		alignment,
		gap,
		backgroundColor,
		textColor,
		nameColor,
		bioColor,
		linkColor,
		borderColor,
		borderWidth,
		borderRadius,
		padding
	} = attributes;

	const safeSocial = socialLinks && 'object' === typeof socialLinks ? { ...DEFAULT_SOCIAL, ...socialLinks } : { ...DEFAULT_SOCIAL };

	// Pull the list of users for the author select. We use core/data's
	// getUsers selector; users are loaded lazily when the inspector opens.
	const users = useSelect( ( select ) => {
		const core = select( 'core' );
		if ( ! core ) {
			return [];
		}
		// Limit to 100 users — enough for most sites, avoids huge dropdowns.
		return core.getUsers( { per_page: 100, who: 'authors' } ) || [];
	}, [] );

	const userOptions = [
		{ label: __( 'Post Author (auto)', 'b-blocks' ), value: '0' }
	].concat(
		( users || [] ).map( ( u ) => ( {
			label: u.name + ( u.slug ? ` (${ u.slug })` : '' ),
			value: String( u.id )
		} ) )
	);

	const updatePadding = ( key, value ) => {
		const clamped = Math.max( 0, Math.min( 96, parseInt( value, 10 ) || 0 ) );
		setAttributes( {
			padding: {
				top: padding?.top ?? 24,
				right: padding?.right ?? 24,
				bottom: padding?.bottom ?? 24,
				left: padding?.left ?? 24,
				[ key ]: clamped
			}
		} );
	};

	const updateSocial = ( slug, url ) => {
		setAttributes( {
			socialLinks: { ...safeSocial, [ slug ]: url }
		} );
	};

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody className='bPlPanelBody' title={ __( 'Author', 'b-blocks' ) } initialOpen={ true }>
				<PanelRow>
					<Label className=''>{ __( 'Author:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ String( authorId || 0 ) }
						options={ userOptions }
						onChange={ ( val ) => setAttributes( { authorId: parseInt( val, 10 ) || 0 } ) }
					/>
				</PanelRow>
				<p style={ { margin: '8px 0 0', fontSize: 12, color: '#666' } }>
					{ __( 'Leave on "Post Author (auto)" to follow the current post. Pick a specific user to override.', 'b-blocks' ) }
				</p>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Layout & Theme', 'b-blocks' ) } initialOpen={ true }>
				<PanelRow>
					<Label className=''>{ __( 'Layout:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ layout || 'inline' }
						options={ LAYOUT_OPTIONS }
						onChange={ ( val ) => setAttributes( { layout: val } ) }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Theme:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ theme || 'classic' }
						options={ THEME_OPTIONS }
						onChange={ ( val ) => setAttributes( { theme: val } ) }
					/>
				</PanelRow>
				<p style={ { margin: '4px 0 12px', fontSize: 12, color: '#666' } }>
					{ __( 'Themes set the color & feel. Color controls in the Style panel below can override per-instance.', 'b-blocks' ) }
				</p>

				<PanelRow>
					<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ alignment || 'left' }
						options={ ALIGNMENT_OPTIONS }
						onChange={ ( val ) => setAttributes( { alignment: val } ) }
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Gap between avatar & content (px)', 'b-blocks' ) }
					value={ parseInt( gap, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { gap: parseInt( val, 10 ) || 0 } ) }
					min={ 0 }
					max={ 80 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Avatar', 'b-blocks' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Avatar', 'b-blocks' ) }
					checked={ !! showAvatar }
					onChange={ ( val ) => setAttributes( { showAvatar: val } ) }
				/>

				{ showAvatar && (
					<>
						<RangeControl
							label={ __( 'Avatar Size (px)', 'b-blocks' ) }
							value={ parseInt( avatarSize, 10 ) || 96 }
							onChange={ ( val ) => setAttributes( { avatarSize: parseInt( val, 10 ) || 96 } ) }
							min={ 32 }
							max={ 256 }
							step={ 4 }
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{ __( 'Avatar Shape:', 'b-blocks' ) }</Label>
							<SelectControl
								value={ avatarShape || 'circle' }
								options={ AVATAR_SHAPE_OPTIONS }
								onChange={ ( val ) => setAttributes( { avatarShape: val } ) }
							/>
						</PanelRow>
					</>
				) }
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Name', 'b-blocks' ) }
					checked={ !! showName }
					onChange={ ( val ) => setAttributes( { showName: val } ) }
				/>

				{ showName && (
					<PanelRow>
						<Label className=''>{ __( 'Name HTML Tag:', 'b-blocks' ) }</Label>
						<SelectControl
							value={ nameTag || 'h3' }
							options={ NAME_TAG_OPTIONS }
							onChange={ ( val ) => setAttributes( { nameTag: val } ) }
						/>
					</PanelRow>
				) }

				<ToggleControl
					label={ __( 'Show Bio', 'b-blocks' ) }
					checked={ !! showBio }
					onChange={ ( val ) => setAttributes( { showBio: val } ) }
				/>

				{ showBio && (
					<RangeControl
						label={ __( 'Bio Character Limit (0 = no limit)', 'b-blocks' ) }
						value={ parseInt( bioCharLimit, 10 ) || 0 }
						onChange={ ( val ) => setAttributes( { bioCharLimit: parseInt( val, 10 ) || 0 } ) }
						min={ 0 }
						max={ 1000 }
						step={ 10 }
						__nextHasNoMarginBottom
					/>
				) }

				<ToggleControl
					label={ __( 'Show Website Link', 'b-blocks' ) }
					checked={ !! showWebsite }
					onChange={ ( val ) => setAttributes( { showWebsite: val } ) }
					help={ __( 'When on, the author\'s website from their WP profile appears in the meta row.', 'b-blocks' ) }
				/>

				<ToggleControl
					label={ __( 'Show Post Count', 'b-blocks' ) }
					checked={ !! showPostCount }
					onChange={ ( val ) => setAttributes( { showPostCount: val } ) }
					help={ __( 'Shows "N posts" linked to the author archive.', 'b-blocks' ) }
				/>

				<ToggleControl
					label={ __( 'Show "All Posts" Link', 'b-blocks' ) }
					checked={ !! showAllPostsLink }
					onChange={ ( val ) => setAttributes( { showAllPostsLink: val } ) }
					help={ __( 'Adds a "View all posts" link to the author archive when post count is hidden.', 'b-blocks' ) }
				/>

				{ showAllPostsLink && ! showPostCount && (
					<TextControl
						label={ __( '"All Posts" Link Label', 'b-blocks' ) }
						value={ allPostsLinkLabel || '' }
						placeholder={ __( 'View all posts', 'b-blocks' ) }
						onChange={ ( val ) => setAttributes( { allPostsLinkLabel: val } ) }
						__nextHasNoMarginBottom
					/>
				) }
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Social Links', 'b-blocks' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Social Icons', 'b-blocks' ) }
					checked={ !! showSocial }
					onChange={ ( val ) => setAttributes( { showSocial: val } ) }
				/>

				{ showSocial && (
					<>
						{ SOCIAL_DEFS.map( ( def ) => (
							<TextControl
								key={ def.slug }
								label={ def.label }
								type='url'
								value={ safeSocial[ def.slug ] || '' }
								onChange={ ( val ) => updateSocial( def.slug, val ) }
								placeholder='https://'
								__nextHasNoMarginBottom
							/>
						) ) }

						<RangeControl
							label={ __( 'Icon Size (px)', 'b-blocks' ) }
							value={ parseInt( socialIconSize, 10 ) || 18 }
							onChange={ ( val ) => setAttributes( { socialIconSize: parseInt( val, 10 ) || 18 } ) }
							min={ 12 }
							max={ 40 }
							step={ 1 }
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{ __( 'Icon Color:', 'b-blocks' ) }</Label>
							<ColorControl
								value={ socialIconColor || '#555555' }
								onChange={ ( val ) => setAttributes( { socialIconColor: val } ) }
								defaultColor='#555555'
							/>
						</PanelRow>

						<PanelRow>
							<Label className=''>{ __( 'Icon Hover Color:', 'b-blocks' ) }</Label>
							<ColorControl
								value={ socialIconHoverColor || '#0073aa' }
								onChange={ ( val ) => setAttributes( { socialIconHoverColor: val } ) }
								defaultColor='#0073aa'
							/>
						</PanelRow>
					</>
				) }
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
				<PanelRow>
					<Label className=''>{ __( 'Background Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ backgroundColor || '#f9fafb' }
						onChange={ ( val ) => setAttributes( { backgroundColor: val } ) }
						defaultColor='#f9fafb'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Text Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ textColor || '#111827' }
						onChange={ ( val ) => setAttributes( { textColor: val } ) }
						defaultColor='#111827'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Name Color (override):', 'b-blocks' ) }</Label>
					<ColorControl
						value={ nameColor || '' }
						onChange={ ( val ) => setAttributes( { nameColor: val } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Bio Color (override):', 'b-blocks' ) }</Label>
					<ColorControl
						value={ bioColor || '' }
						onChange={ ( val ) => setAttributes( { bioColor: val } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Link Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ linkColor || '#0073aa' }
						onChange={ ( val ) => setAttributes( { linkColor: val } ) }
						defaultColor='#0073aa'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Border Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ borderColor || '#e5e7eb' }
						onChange={ ( val ) => setAttributes( { borderColor: val } ) }
						defaultColor='#e5e7eb'
					/>
				</PanelRow>

				<RangeControl
					label={ __( 'Border Width (px)', 'b-blocks' ) }
					value={ parseInt( borderWidth, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { borderWidth: parseInt( val, 10 ) || 0 } ) }
					min={ 0 }
					max={ 12 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ parseInt( borderRadius, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { borderRadius: parseInt( val, 10 ) || 0 } ) }
					min={ 0 }
					max={ 64 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Padding', 'b-blocks' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Top (px)', 'b-blocks' ) }
					value={ padding?.top ?? 24 }
					onChange={ ( val ) => updatePadding( 'top', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Right (px)', 'b-blocks' ) }
					value={ padding?.right ?? 24 }
					onChange={ ( val ) => updatePadding( 'right', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Bottom (px)', 'b-blocks' ) }
					value={ padding?.bottom ?? 24 }
					onChange={ ( val ) => updatePadding( 'bottom', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Left (px)', 'b-blocks' ) }
					value={ padding?.left ?? 24 }
					onChange={ ( val ) => updatePadding( 'left', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
