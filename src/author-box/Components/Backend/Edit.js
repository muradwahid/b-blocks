import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const ALLOWED_NAME_TAGS = [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ];
const ALLOWED_LAYOUTS = [ 'inline', 'stacked' ];
const ALLOWED_ALIGN = [ 'left', 'center', 'right' ];
const ALLOWED_THEMES = [ 'classic', 'midnight', 'gradient', 'magazine' ];

const SOCIAL_DEFS = [
	{ slug: 'twitter', icon: 'fa-brands fa-x-twitter', label: 'X (Twitter)' },
	{ slug: 'facebook', icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
	{ slug: 'linkedin', icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
	{ slug: 'instagram', icon: 'fa-brands fa-instagram', label: 'Instagram' },
	{ slug: 'youtube', icon: 'fa-brands fa-youtube', label: 'YouTube' },
	{ slug: 'github', icon: 'fa-brands fa-github', label: 'GitHub' },
	{ slug: 'mastodon', icon: 'fa-brands fa-mastodon', label: 'Mastodon' },
	{ slug: 'website', icon: 'fa-solid fa-globe', label: __( 'Website', 'b-blocks' ) }
];

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
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
		showPostCount,
		showAllPostsLink,
		allPostsLinkLabel,
		showWebsite,
		showSocial,
		socialLinks,
		socialIconSize,
		socialIconColor,
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

	const id = `block-${ clientId }`;
	const safeLayout = ALLOWED_LAYOUTS.includes( layout ) ? layout : 'inline';
	const safeAlign = ALLOWED_ALIGN.includes( alignment ) ? alignment : 'left';
	const safeNameTag = ALLOWED_NAME_TAGS.includes( nameTag ) ? nameTag : 'h3';
	const safeTheme = ALLOWED_THEMES.includes( theme ) ? theme : 'classic';
	const NameTag = safeNameTag;

	const blockProps = useBlockProps( {
		className: `bb-author-box bb-ab-layout--${ safeLayout } bb-ab-theme--${ safeTheme } bb-ab-align--${ safeAlign }`,
		id
	} );

	// Always Auto mode — fetch the resolved WP user (post author or the
	// override picked in the Author panel).
	const resolvedUser = useSelect( ( select ) => {
		const coreData = select( 'core' );
		const editorData = select( 'core/editor' );
		let lookupId = parseInt( authorId, 10 ) || 0;
		if ( ! lookupId && editorData && 'function' === typeof editorData.getEditedPostAttribute ) {
			const postAuthor = editorData.getEditedPostAttribute( 'author' );
			if ( postAuthor ) {
				lookupId = parseInt( postAuthor, 10 ) || 0;
			}
		}
		if ( ! lookupId || ! coreData ) {
			return null;
		}
		return coreData.getUser( lookupId, { context: 'view' } ) || null;
	}, [ authorId ] );

	const displayName = resolvedUser?.name || __( 'Author Name', 'b-blocks' );
	const bioForEditor = resolvedUser?.description || `<em>${ __( 'Author bio will appear here on the frontend.', 'b-blocks' ) }</em>`;
	const websiteForEditor = resolvedUser?.url || '';

	const avatarForEditor = ( () => {
		if ( resolvedUser && resolvedUser.avatar_urls ) {
			const sizes = Object.keys( resolvedUser.avatar_urls ).map( ( n ) => parseInt( n, 10 ) ).sort( ( a, b ) => a - b );
			const target = avatarSize;
			let chosen = sizes[ sizes.length - 1 ];
			for ( const s of sizes ) {
				if ( s >= target ) {
					chosen = s;
					break;
				}
			}
			return resolvedUser.avatar_urls[ String( chosen ) ];
		}
		return '';
	} )();

	const cardStyle = {
		backgroundColor: backgroundColor || undefined,
		color: textColor || undefined,
		border: `${ borderWidth || 0 }px solid ${ borderColor || 'transparent' }`,
		borderRadius: `${ borderRadius || 0 }px`,
		padding: `${ padding?.top ?? 24 }px ${ padding?.right ?? 24 }px ${ padding?.bottom ?? 24 }px ${ padding?.left ?? 24 }px`,
		textAlign: safeAlign
	};

	const avatarBorderRadius = 'circle' === avatarShape ? '50%' : ( 'rounded' === avatarShape ? '12px' : '0' );

	const avatarStyle = {
		width: `${ avatarSize }px`,
		height: `${ avatarSize }px`,
		flex: '0 0 auto',
		overflow: 'hidden',
		borderRadius: avatarBorderRadius,
		background: '#e5e7eb'
	};

	const nameStyle = {
		margin: '0 0 8px',
		color: nameColor || undefined,
		fontSize: '1.25rem',
		lineHeight: 1.3,
		fontWeight: 600
	};

	const bioStyle = {
		margin: '0 0 10px',
		color: bioColor || undefined,
		fontSize: '0.95rem',
		lineHeight: 1.55
	};

	const socialAnchorSize = ( socialIconSize ?? 18 ) + 14;
	const socialEntries = SOCIAL_DEFS.map( ( def ) => {
		const raw = ( socialLinks && socialLinks[ def.slug ] ) || '';
		const url = ( 'website' === def.slug && ! raw && websiteForEditor ) ? websiteForEditor : raw;
		return { ...def, url };
	} ).filter( ( e ) => !! e.url );

	return (
		<>
			<Settings attributes={ attributes } setAttributes={ setAttributes } />

			<div { ...blockProps }>
				<aside className='bb-ab-card' style={ cardStyle } aria-label={ sprintf( /* translators: %s: author name */ __( 'About the author: %s', 'b-blocks' ), displayName ) }>
					<div className='bb-ab-row' style={ { gap: `${ gap ?? 20 }px` } }>
						{ showAvatar && (
							<div className='bb-ab-avatar' style={ avatarStyle }>
								{ avatarForEditor ? (
									<img
										src={ avatarForEditor }
										alt={ sprintf( /* translators: %s: author display name */ __( 'Avatar of %s', 'b-blocks' ), displayName ) }
										width={ avatarSize }
										height={ avatarSize }
										style={ { width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: avatarBorderRadius } }
									/>
								) : (
									<div style={ { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '11px', textAlign: 'center', padding: '4px' } }>
										{ __( 'Avatar', 'b-blocks' ) }
									</div>
								) }
							</div>
						) }

						<div className='bb-ab-content' style={ { flex: '1 1 0', minWidth: 0 } }>
							{ showName && (
								<NameTag className='bb-ab-name' style={ nameStyle }>{ displayName }</NameTag>
							) }

							{ showBio && (
								<div
									className='bb-ab-bio'
									style={ bioStyle }
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={ { __html: sanitizeHtml( bioForEditor ) } }
								/>
							) }

							{ ( showWebsite && websiteForEditor ) && (
								<div className='bb-ab-meta' style={ { margin: '0 0 8px', fontSize: '0.85rem' } }>
									<a href={ websiteForEditor } onClick={ ( e ) => e.preventDefault() } style={ { color: linkColor || undefined } }>
										{ __( 'Website', 'b-blocks' ) }
									</a>
								</div>
							) }

							{ showSocial && socialEntries.length > 0 && (
								<ul className='bb-ab-social' style={ { display: 'inline-flex', flexWrap: 'wrap', gap: '10px', margin: '12px 0 0', padding: 0, listStyle: 'none' } }>
									{ socialEntries.map( ( entry ) => (
										<li key={ entry.slug } style={ { margin: 0, padding: 0 } }>
											<a
												href={ entry.url }
												onClick={ ( e ) => e.preventDefault() }
												aria-label={ sprintf( /* translators: 1: author name, 2: social network */ __( '%1$s on %2$s', 'b-blocks' ), displayName, entry.label ) }
												style={ {
													display: 'inline-flex',
													alignItems: 'center',
													justifyContent: 'center',
													width: `${ socialAnchorSize }px`,
													height: `${ socialAnchorSize }px`,
													borderRadius: '50%',
													color: socialIconColor || '#555',
													textDecoration: 'none'
												} }
											>
												<i className={ entry.icon } aria-hidden='true' style={ { fontSize: `${ socialIconSize ?? 18 }px`, lineHeight: 1 } }></i>
											</a>
										</li>
									) ) }
								</ul>
							) }

							{ showAllPostsLink && ! showPostCount && resolvedUser && (
								<p style={ { margin: '8px 0 0', fontSize: '0.9rem' } }>
									<a
										href='#'
										onClick={ ( e ) => e.preventDefault() }
										style={ { color: linkColor || undefined, textDecoration: 'none', fontWeight: 500 } }
									>
										{ allPostsLinkLabel || __( 'View all posts', 'b-blocks' ) }
									</a>
								</p>
							) }

							{ showPostCount && (
								<div className='bb-ab-meta' style={ { margin: '8px 0 0', fontSize: '0.85rem' } }>
									<span style={ { color: linkColor || undefined } }>
										{ __( 'Post count will appear here on the frontend.', 'b-blocks' ) }
									</span>
								</div>
							) }
						</div>
					</div>
				</aside>

				<span className='bb-ab-editor-meta'>
					<span aria-hidden='true'>👤</span>
					{ __( 'Author Box', 'b-blocks' ) }
					{ ' · ' }
					{ resolvedUser ? resolvedUser.name : __( 'Resolves on save', 'b-blocks' ) }
				</span>
			</div>
		</>
	);
};

export default Edit;
