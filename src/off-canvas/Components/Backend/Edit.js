import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const TEMPLATE = [
	[ 'core/heading', { level: 3, placeholder: 'Drawer heading...' } ],
	[ 'core/paragraph', { placeholder: 'Add the drawer content here. You can drop any blocks inside — navigation, filters, mini-cart, etc.' } ]
];

const renderTriggerIcon = ( iconSlug ) => {
	if ( ! iconSlug || 'none' === iconSlug ) {
		return null;
	}
	if ( 'menu' === iconSlug ) {
		return <svg className='bb-oc-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false' width='18' height='18'>
			<path fill='currentColor' d='M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z' />
		</svg>;
	}
	if ( 'arrow-right' === iconSlug ) {
		return <svg className='bb-oc-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false' width='18' height='18'>
			<path fill='currentColor' d='M5 11h11.17l-4.88-4.88L13 5l7 7-7 7-1.41-1.41L16.17 13H5z' />
		</svg>;
	}
	if ( 'arrow-left' === iconSlug ) {
		return <svg className='bb-oc-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false' width='18' height='18'>
			<path fill='currentColor' d='M19 11H7.83l4.88-4.88L11 5l-7 7 7 7 1.41-1.41L7.83 13H19z' />
		</svg>;
	}
	return null;
};

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const {
		drawerSide, drawerWidth, showOverlay, overlayColor,
		triggerLabel, triggerIcon, triggerAlign,
		closeLabel, drawerBgColor, drawerPadding,
		triggerBgColor, triggerTextColor, triggerBorderRadius
	} = attributes;

	const id = `block-${ clientId }`;
	const safeWidth = Math.max( 200, Math.min( 600, parseInt( drawerWidth, 10 ) || 320 ) );
	const safeRadius = Math.max( 0, Math.min( 50, parseInt( triggerBorderRadius, 10 ) || 0 ) );
	const safePadding = Math.max( 0, Math.min( 80, parseInt( drawerPadding, 10 ) || 0 ) );

	const css = `
		#${ id } { text-align: ${ triggerAlign || 'left' }; }
		#${ id } .bb-oc-trigger {
			background-color: ${ triggerBgColor || '#1e1e1e' };
			color: ${ triggerTextColor || '#ffffff' };
			border-radius: ${ safeRadius }px;
		}
		#${ id } .bb-oc-editor-preview {
			background-color: ${ drawerBgColor || '#ffffff' };
			padding: ${ safePadding }px;
			width: ${ safeWidth }px;
			max-width: 100%;
		}
		#${ id } .bb-oc-editor-preview-wrap {
			--bb-oc-overlay: ${ showOverlay ? overlayColor || 'rgba(0,0,0,0.5)' : 'transparent' };
		}
	`;

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<div { ...useBlockProps() }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<button type='button' className='bb-oc-trigger' aria-disabled='true' tabIndex={ -1 }>
				{ renderTriggerIcon( triggerIcon ) }
				{ triggerLabel && <span>{ triggerLabel }</span> }
			</button>

			<div className='bb-oc-editor-preview-wrap' data-side={ drawerSide || 'left' }>
				<div className='bb-oc-editor-preview-header'>
					<span className='bb-oc-editor-preview-label'>
						{ __( 'Drawer content (editor preview)', 'b-blocks' ) }
					</span>
					<span className='bb-oc-editor-preview-hint'>
						{ __( 'Hidden until the trigger is clicked on the frontend.', 'b-blocks' ) }
					</span>
				</div>
				<div className='bb-oc-editor-preview'>
					<button
						type='button'
						className='bb-oc-editor-close'
						aria-label={ closeLabel || __( 'Close', 'b-blocks' ) }
						tabIndex={ -1 }
					>
						<span aria-hidden='true'>&times;</span>
					</button>
					<div className='bb-oc-editor-content'>
						<InnerBlocks template={ TEMPLATE } templateLock={ false } />
					</div>
				</div>
			</div>
		</div>
	</>;
};

export default Edit;
