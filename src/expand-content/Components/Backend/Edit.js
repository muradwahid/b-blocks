import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const TEMPLATE = [
	[ 'core/heading', { level: 3, placeholder: __( 'Section heading...', 'b-blocks' ) } ],
	[ 'core/paragraph', { placeholder: __( 'Add the content that should always be visible here, then keep writing — anything past the preview height will be hidden behind a Show More button on the frontend.', 'b-blocks' ) } ]
];

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const {
		previewHeight, showMoreText, showLessText, showToggle,
		fadeHeight, fadeColor, buttonAlign,
		buttonBgColor, buttonTextColor, buttonBorderRadius,
		buttonPaddingV, buttonPaddingH, buttonFontSize,
		persistState
	} = attributes;

	const [ editorExpanded, setEditorExpanded ] = useState( false );

	const id = `block-${ clientId }`;

	const safePreview = Math.max( 50, Math.min( 1200, parseInt( previewHeight, 10 ) || 200 ) );
	const safeFade = Math.max( 0, Math.min( 400, parseInt( fadeHeight, 10 ) || 0 ) );
	const safeRadius = Math.max( 0, Math.min( 50, parseInt( buttonBorderRadius, 10 ) || 0 ) );
	const safePadV = Math.max( 4, Math.min( 40, parseInt( buttonPaddingV, 10 ) || 0 ) );
	const safePadH = Math.max( 8, Math.min( 80, parseInt( buttonPaddingH, 10 ) || 0 ) );
	const safeFont = Math.max( 10, Math.min( 28, parseInt( buttonFontSize, 10 ) || 14 ) );

	const safeMoreLabel = ( showMoreText && showMoreText.trim() ) || __( 'Show More', 'b-blocks' );
	const safeLessLabel = ( showLessText && showLessText.trim() ) || __( 'Show Less', 'b-blocks' );

	const css = `
		#${ id } .bb-ec-editor-clamp {
			--bb-ec-editor-preview-height: ${ safePreview }px;
			--bb-ec-editor-fade-height: ${ safeFade }px;
			--bb-ec-editor-fade-color: ${ fadeColor || '#ffffff' };
		}
		#${ id } .bb-ec-toggle {
			background-color: ${ buttonBgColor || '#0073aa' };
			color: ${ buttonTextColor || '#ffffff' };
			border-radius: ${ safeRadius }px;
			padding: ${ safePadV }px ${ safePadH }px;
			font-size: ${ safeFont }px;
		}
	`;

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<div { ...useBlockProps() } id={ id }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-ec-editor-preview-wrap'>
				<div className='bb-ec-editor-preview-header'>
					<span className='bb-ec-editor-preview-label'>
						{ __( 'Expandable area (editor preview)', 'b-blocks' ) }
					</span>
					<span className='bb-ec-editor-preview-hint'>
						{ editorExpanded
							? __( 'Showing full height — frontend visitors will see the clamp.', 'b-blocks' )
							: __( 'Clamped to the preview height. Use the toggle below to inspect full content.', 'b-blocks' ) }
					</span>
				</div>

				<div className={ `bb-ec-editor-clamp${ editorExpanded ? '' : ' is-clamped' }` }>
					<InnerBlocks template={ TEMPLATE } templateLock={ false } />
				</div>

				<div className='bb-ec-editor-toggle-row' data-align={ buttonAlign || 'center' }>
					<button
						type='button'
						className='bb-ec-toggle'
						aria-disabled='true'
						tabIndex={ -1 }
					>
						{ editorExpanded ? safeLessLabel : safeMoreLabel }
					</button>
					<button
						type='button'
						className='bb-ec-editor-state-toggle'
						onClick={ () => setEditorExpanded( ( v ) => ! v ) }
					>
						{ editorExpanded
							? __( 'Preview: collapsed', 'b-blocks' )
							: __( 'Preview: expanded', 'b-blocks' ) }
					</button>
				</div>

				{ persistState && (
					<p className='bb-ec-editor-preview-hint' style={ { marginTop: '8px' } }>
						{ __( 'Session persistence is on: a visitor\'s expanded state will be remembered until the tab closes.', 'b-blocks' ) }
					</p>
				) }

				{ ! showToggle && (
					<p className='bb-ec-editor-preview-hint' style={ { marginTop: '8px' } }>
						{ __( 'Collapse button is disabled — once a visitor expands, the content stays open.', 'b-blocks' ) }
					</p>
				) }
			</div>
		</div>
	</>;
};

export default Edit;
