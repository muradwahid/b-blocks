import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const clamp = ( val, min, max, fallback ) => {
	const n = parseInt( val, 10 );
	if ( isNaN( n ) ) return fallback;
	return Math.max( min, Math.min( max, n ) );
};

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		position, message, acceptLabel, declineLabel, showDecline,
		maxWidth, alignment, layout,
		barBg, barText, barPaddingV, barPaddingH, fontSize, fontWeight,
		acceptBg, acceptText, acceptHoverBg, acceptHoverText,
		declineBg, declineText, declineHoverBg, declineHoverText,
		btnFontSize, btnFontWeight, btnPaddingV, btnPaddingH, btnRadius, btnGap
	} = attributes;

	const id = `block-${ clientId }`;
	const maxW = clamp( maxWidth, 0, 1600, 0 );
	const hasDecline = !! showDecline && '' !== ( declineLabel || '' ).trim();

	const css = `
		#${ id }.bb-ccb {
			--bb-ccb-bg: ${ barBg || '#1a1a1a' };
			--bb-ccb-color: ${ barText || '#ffffff' };
			--bb-ccb-pad-y: ${ clamp( barPaddingV, 4, 80, 16 ) }px;
			--bb-ccb-pad-x: ${ clamp( barPaddingH, 4, 120, 24 ) }px;
			--bb-ccb-max-w: ${ maxW > 0 ? `${ maxW }px` : 'none' };
			--bb-ccb-font-size: ${ clamp( fontSize, 10, 28, 14 ) }px;
			--bb-ccb-font-weight: ${ fontWeight || '400' };
			--bb-ccb-anim: 0ms;
			--bb-ccb-accept-bg: ${ acceptBg || '#ffffff' };
			--bb-ccb-accept-text: ${ acceptText || '#1a1a1a' };
			--bb-ccb-accept-hover-bg: ${ acceptHoverBg || '#e6e6e6' };
			--bb-ccb-accept-hover-text: ${ acceptHoverText || '#1a1a1a' };
			--bb-ccb-decline-bg: ${ declineBg || 'transparent' };
			--bb-ccb-decline-text: ${ declineText || '#ffffff' };
			--bb-ccb-decline-hover-bg: ${ declineHoverBg || 'rgba(255,255,255,0.1)' };
			--bb-ccb-decline-hover-text: ${ declineHoverText || '#ffffff' };
			--bb-ccb-btn-font-size: ${ clamp( btnFontSize, 10, 24, 14 ) }px;
			--bb-ccb-btn-font-weight: ${ btnFontWeight || '600' };
			--bb-ccb-btn-pad-y: ${ clamp( btnPaddingV, 2, 40, 8 ) }px;
			--bb-ccb-btn-pad-x: ${ clamp( btnPaddingH, 4, 80, 20 ) }px;
			--bb-ccb-btn-radius: ${ clamp( btnRadius, 0, 9999, 4 ) }px;
			--bb-ccb-btn-gap: ${ clamp( btnGap, 0, 48, 8 ) }px;
		}
	`;

	const wrapperClasses = [
		'bb-ccb',
		`bb-ccb-pos-${ position || 'bottom' }`,
		`bb-ccb-layout-${ layout || 'inline' }`,
		`bb-ccb-align-${ alignment || 'center' }`
	].join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-ccb-inner'>
				<RichText
					tagName='div'
					className='bb-ccb-message'
					value={ message }
					onChange={ ( val ) => setAttributes( { message: val } ) }
					placeholder={ __( 'We use cookies to improve your experience…', 'b-blocks' ) }
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
					inlineToolbar
				/>

				<div className='bb-ccb-actions'>
					{ hasDecline && (
						<button type='button' className='bb-ccb-button bb-ccb-decline'>
							{ declineLabel || __( 'Decline', 'b-blocks' ) }
						</button>
					) }

					<button type='button' className='bb-ccb-button bb-ccb-accept'>
						{ acceptLabel || __( 'Accept', 'b-blocks' ) }
					</button>
				</div>
			</div>

			<div className='bb-ccb-editor-hint'>
				{ __( 'Shown fixed to the viewport edge on the frontend. Records consent only — does not block third-party scripts.', 'b-blocks' ) }
			</div>
		</div>
	</>;
};

export default Edit;
