import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, RichText, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const LAYOUT_VALUES = [ 'border', 'quotation' ];
const ALIGN_VALUES = [ 'left', 'center', 'right' ];

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const {
		quoteText,
		authorName,
		authorRole,
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

	const safeLayout = LAYOUT_VALUES.includes( layout ) ? layout : 'border';
	const safeAlign = ALIGN_VALUES.includes( alignment ) ? alignment : 'left';

	const wrapperClasses = [
		'bb-blockquote',
		`bb-bq-layout--${ safeLayout }`,
		`bb-bq-align--${ safeAlign }`
	].join( ' ' );

	const avatarRadius = avatarShape === 'circle'
		? '50%'
		: ( avatarShape === 'rounded' ? '12px' : '0' );

	const wrapperStyle = {
		'--bb-bq-accent': accentColor || '#6366f1',
		'--bb-bq-accent-width': `${ accentWidth ?? 4 }px`,
		'--bb-bq-radius': `${ borderRadius ?? 8 }px`,
		'--bb-bq-pad-top': padding.top || '24px',
		'--bb-bq-pad-right': padding.right || '24px',
		'--bb-bq-pad-bottom': padding.bottom || '24px',
		'--bb-bq-pad-left': padding.left || '24px',
		'--bb-bq-quote-size-desktop': quoteFontSize.desktop || '20px',
		'--bb-bq-quote-size-tablet': quoteFontSize.tablet || '18px',
		'--bb-bq-quote-size-mobile': quoteFontSize.mobile || '16px',
		'--bb-bq-quote-weight': quoteFontWeight || '400',
		'--bb-bq-quote-line-height': quoteLineHeight || '1.6',
		'--bb-bq-author-size': `${ authorFontSize ?? 14 }px`,
		'--bb-bq-avatar-size': `${ avatarSize ?? 48 }px`,
		'--bb-bq-avatar-radius': avatarRadius,
		'--bb-bq-quote-icon-size': `${ quoteIconSize ?? 48 }px`,
		'--bb-bq-quote-icon-color': quoteIconColor || '#6366f1',
		...( backgroundColor ? { '--bb-bq-bg': backgroundColor } : {} ),
		...( quoteTextColor ? { '--bb-bq-text': quoteTextColor } : {} ),
		...( authorNameColor ? { '--bb-bq-name': authorNameColor } : {} ),
		...( authorRoleColor ? { '--bb-bq-role': authorRoleColor } : {} )
	};

	const blockProps = useBlockProps( {
		className: wrapperClasses,
		style: wrapperStyle
	} );

	const hasAvatar = showAvatar && !! authorAvatarUrl;
	const hasName = !! ( authorName && authorName.trim() );
	const hasRole = showAuthorRole && !! ( authorRole && authorRole.trim() );
	const hasCite = hasAvatar || hasName || hasRole;

	const avatarAltText = authorAvatarAlt
		|| ( hasName
			? sprintf( /* translators: %s: author display name */ __( 'Photo of %s', 'b-blocks' ), authorName )
			: '' );

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ safeAlign }
					onChange={ ( val ) => setAttributes( { alignment: val || 'left' } ) }
				/>
			</BlockControls>

			<Settings attributes={ attributes } setAttributes={ setAttributes } />

			<div { ...blockProps }>
				<figure className='bb-bq'>
					{ safeLayout === 'quotation' && (
						<span className='bb-bq__icon' aria-hidden='true'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' focusable='false'>
								<path d='M9.17 6.5H4.5C3.4 6.5 2.5 7.4 2.5 8.5v4.67c0 1.1.9 2 2 2h2.83c0 2.21-1.62 4-3.83 4v2.83c4.05 0 7.33-3.28 7.33-7.33V8.5c0-1.1-.9-2-1.66-2zm12 0H16.5c-1.1 0-2 .9-2 2v4.67c0 1.1.9 2 2 2h2.83c0 2.21-1.62 4-3.83 4v2.83c4.05 0 7.33-3.28 7.33-7.33V8.5c0-1.1-.9-2-1.66-2z' />
							</svg>
						</span>
					) }

					<blockquote className='bb-bq__quote'>
						<RichText
							tagName='p'
							className='bb-bq__quote-text'
							value={ quoteText || '' }
							onChange={ ( val ) => setAttributes( { quoteText: val } ) }
							placeholder={ __( 'Type the quote…', 'b-blocks' ) }
							allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
						/>
					</blockquote>

					{ hasCite && (
						<figcaption className='bb-bq__caption'>
							{ hasAvatar && (
								<img
									className='bb-bq__avatar'
									src={ authorAvatarUrl }
									alt={ avatarAltText }
									width={ avatarSize ?? 48 }
									height={ avatarSize ?? 48 }
								/>
							) }
							{ ( hasName || hasRole ) && (
								<cite className='bb-bq__cite'>
									{ hasName && (
										<span className='bb-bq__author'>{ authorName }</span>
									) }
									{ hasRole && (
										<span className='bb-bq__role'>{ authorRole }</span>
									) }
								</cite>
							) }
						</figcaption>
					) }
				</figure>
			</div>
		</>
	);
};

export default Edit;
