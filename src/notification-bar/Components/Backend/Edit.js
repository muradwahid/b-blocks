import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		position, isSticky, message, showButton, buttonText, buttonUrl,
		isDismissible, dismissStorageKey, backgroundColor, textColor,
		buttonBgColor, buttonTextColor, buttonBorderRadius,
		paddingVertical, paddingHorizontal, fontSize, fontWeight,
		textAlign, zIndex
	} = attributes;

	const id = `block-${ clientId }`;

	// Ensure each block instance has a stable, unique dismiss-storage key so
	// multiple bars on a single site can be dismissed independently and the
	// dismissed state is remembered across page loads.
	useEffect( () => {
		if ( ! dismissStorageKey ) {
			setAttributes( { dismissStorageKey: clientId } );
		}
	}, [ dismissStorageKey, clientId, setAttributes ] );

	const safeRadius = Math.max( 0, Math.min( 50, parseInt( buttonBorderRadius, 10 ) || 0 ) );
	const safePadY   = Math.max( 0, Math.min( 60, parseInt( paddingVertical, 10 ) || 0 ) );
	const safePadX   = Math.max( 0, Math.min( 100, parseInt( paddingHorizontal, 10 ) || 0 ) );
	const safeFont   = Math.max( 10, Math.min( 30, parseInt( fontSize, 10 ) || 15 ) );

	const css = `
		#${ id }.bb-nb-wrap {
			--bb-nb-bg: ${ backgroundColor || '#1a1a2e' };
			--bb-nb-color: ${ textColor || '#ffffff' };
			--bb-nb-padding-y: ${ safePadY }px;
			--bb-nb-padding-x: ${ safePadX }px;
			--bb-nb-font-size: ${ safeFont }px;
			--bb-nb-font-weight: ${ fontWeight || '500' };
			--bb-nb-z: ${ parseInt( zIndex, 10 ) || 9999 };
			--bb-nb-btn-bg: ${ buttonBgColor || '#e94560' };
			--bb-nb-btn-color: ${ buttonTextColor || '#ffffff' };
			--bb-nb-btn-radius: ${ safeRadius }px;
		}
	`;

	const wrapperClasses = [
		'bb-nb-wrap',
		`bb-nb-position-${ position || 'top' }`,
		isSticky ? 'bb-nb-sticky' : 'bb-nb-static',
		`bb-nb-align-${ textAlign || 'center' }`
	].join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses,
		role: 'region',
		'aria-label': __( 'Notification bar', 'b-blocks' )
	} );

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-nb-inner'>
				<RichText
					className='bb-nb-message bb-nb-editor-message-rich'
					tagName='span'
					value={ message }
					onChange={ ( val ) => setAttributes( { message: val } ) }
					placeholder={ __( 'Write your notification message…', 'b-blocks' ) }
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
					inlineToolbar
				/>

				{ showButton && (
					<a
						className='bb-nb-button'
						href={ buttonUrl || '#' }
						onClick={ ( e ) => e.preventDefault() }
					>
						{ buttonText || __( 'Shop Now', 'b-blocks' ) }
					</a>
				) }
			</div>

			{ isDismissible && (
				<button
					type='button'
					className='bb-nb-close'
					aria-label={ __( 'Close notification bar', 'b-blocks' ) }
					tabIndex={ -1 }
				>
					<span aria-hidden='true'>&times;</span>
				</button>
			) }
		</div>

		{ isSticky && (
			<div className='bb-nb-editor-hint'>
				{ position === 'bottom'
					? __( 'Sticky preview — on the frontend this bar will be fixed to the bottom of the viewport.', 'b-blocks' )
					: __( 'Sticky preview — on the frontend this bar will be fixed to the top of the viewport.', 'b-blocks' )
				}
			</div>
		) }
	</>;
};

export default Edit;
