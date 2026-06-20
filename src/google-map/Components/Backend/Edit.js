import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { isValidEmbedUrl } from '../../utils/data';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		embedUrl,
		mapHeight,
		useAspectRatio,
		aspectRatio,
		mapAlign,
		caption,
		captionAlign,
		borderRadius,
		boxShadow,
		maxWidth,
		captionColor,
		captionFontSize
	} = attributes;

	const id = `block-${ clientId }`;
	const hasValidUrl = isValidEmbedUrl( embedUrl );

	const wrapperClasses = `bb-google-map bb-gmap-align-${ mapAlign || 'center' }`;
	const blockProps = useBlockProps( { className: wrapperClasses, id } );

	// Build the inline preview styles to mirror what render.php will emit.
	const wrapperStyle = {
		position: 'relative',
		width: '100%',
		overflow: 'hidden',
		borderRadius: `${ parseInt( borderRadius, 10 ) || 0 }px`,
		boxShadow: boxShadow ? '0 4px 24px rgba(0, 0, 0, 0.12)' : 'none',
		background: '#f0f0f0'
	};

	if ( maxWidth && String( maxWidth ).trim() ) {
		wrapperStyle.maxWidth = String( maxWidth ).trim();
	}
	if ( 'left' === mapAlign ) {
		wrapperStyle.margin = '0 auto 0 0';
	} else if ( 'right' === mapAlign ) {
		wrapperStyle.margin = '0 0 0 auto';
	} else {
		wrapperStyle.margin = '0 auto';
	}

	if ( useAspectRatio ) {
		wrapperStyle.aspectRatio = ( aspectRatio || '16/9' ).replace( '/', ' / ' );
		wrapperStyle.height = 'auto';
	} else {
		// In the editor canvas we approximate with the desktop height to
		// give an immediate sense of size. Per-breakpoint heights apply
		// on the frontend via inline media queries.
		const px = Math.max( 100, Math.min( 1200, parseInt( mapHeight, 10 ) || 450 ) );
		wrapperStyle.height = `${ px }px`;
	}

	const iframeStyle = useAspectRatio
		? { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }
		: { width: '100%', height: '100%', border: 0, display: 'block' };

	const figureStyle = { margin: 0, padding: 0 };

	const captionStyle = {
		textAlign: captionAlign || 'center',
		fontSize: `${ Math.max( 10, Math.min( 48, parseInt( captionFontSize, 10 ) || 14 ) ) }px`,
		marginTop: '8px',
		color: captionColor && String( captionColor ).trim() ? captionColor : undefined
	};

	const showWarning = embedUrl && ! hasValidUrl;

	return (
		<>
			<Settings attributes={ attributes } setAttributes={ setAttributes } />

			<div { ...blockProps }>
				{ hasValidUrl ? (
					<figure className='bb-gmap-figure' style={ figureStyle }>
						<div className='bb-gmap-editor-iframe-wrap' style={ wrapperStyle }>
							<iframe
								title={ __( 'Google Map preview', 'b-blocks' ) }
								src={ embedUrl }
								style={ iframeStyle }
								loading='lazy'
								referrerPolicy='no-referrer-when-downgrade'
								allowFullScreen
							/>
						</div>
						{ caption && (
							<figcaption className='bb-gmap-caption' style={ captionStyle }>
								{ caption }
							</figcaption>
						) }
					</figure>
				) : (
					<div
						className='bb-gmap-editor-placeholder'
						style={ { borderRadius: `${ parseInt( borderRadius, 10 ) || 6 }px` } }
					>
						<svg
							className='bb-gmap-editor-icon'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='1.5'
							aria-hidden='true'
						>
							<path d='M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z' />
							<circle cx='12' cy='10' r='3' />
						</svg>
						<div>{ __( 'Google Map', 'b-blocks' ) }</div>
						<div className='bb-gmap-editor-hint'>
							{ __(
								'In Google Maps, click Share → Embed a map → Copy HTML. Paste the full iframe code (or just the src URL) into the sidebar.',
								'b-blocks'
							) }
						</div>
						{ showWarning && (
							<div className='bb-gmap-editor-warning' role='alert'>
								{ __(
									'That URL is not recognized as a Google Maps embed. Only https://www.google.com/maps/embed URLs are allowed.',
									'b-blocks'
								) }
							</div>
						) }
					</div>
				) }

				<div>
					<span className='bb-gmap-editor-meta'>
						<span aria-hidden='true'>{ hasValidUrl ? '📍' : '⚠️' }</span>
						{ hasValidUrl
							? __( 'Google Map', 'b-blocks' )
							: __( 'Add an embed URL', 'b-blocks' ) }
					</span>
				</div>
			</div>
		</>
	);
};

export default Edit;
