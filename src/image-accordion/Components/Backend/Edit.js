import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings';
import { buildImageAccordionCss } from '../Common/Style';

/**
 * Editor canvas for the Image Accordion block.
 *
 * Shows a static, non-interactive preview of the panel strip: the panel at
 * `activeIndex` is rendered expanded and the rest collapsed, so authors can see
 * the overlay content (title / description / button) without the hover/click
 * runtime that only the frontend `view.js` provides.
 */
const Edit = ( props ) => {
	const { attributes, clientId } = props;
	const {
		panels, orientation, overlayPosition, activeIndex,
		showTitle, showDescription, showButton, titleTag, btnLabel
	} = attributes;

	const id = `block-${ clientId }`;
	const css = buildImageAccordionCss( id, attributes );

	const items = Array.isArray( panels ) ? panels : [];
	const TitleTag = [ 'h2', 'h3', 'h4' ].includes( titleTag ) ? titleTag : 'h3';

	const wrapperClasses = [
		'bb-ia',
		`bb-ia--${ orientation === 'vertical' ? 'vertical' : 'horizontal' }`,
		`bb-ia--overlay-${ overlayPosition || 'bottom' }`,
		'bb-ia--editor'
	].join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			{ items.length === 0 ? (
				<p className='bb-ia-empty'>
					{ __( 'Add panels from the “Manage Panels” section in the block settings.', 'b-blocks' ) }
				</p>
			) : (
				<div className='bb-ia-strip'>
					{ items.map( ( panel, idx ) => {
						const isActive = idx === activeIndex;
						const label = ( panel && panel.btnLabel ) || btnLabel || __( 'Learn More', 'b-blocks' );
						const overlay = ( panel && panel.overlayColor ) || '';
						const bg = panel && panel.imageUrl ? `url("${ panel.imageUrl }")` : 'none';
						const pos = ( panel && panel.objectPosition ) || '50% 50%';

						return (
							<div
								key={ panel?.id || idx }
								className={ `bb-ia-panel ${ isActive ? 'is-active' : 'is-collapsed' }` }
								style={ {
									backgroundImage: bg,
									backgroundPosition: pos
								} }
							>
								<span
									className='bb-ia-overlay'
									aria-hidden='true'
									style={ overlay ? { background: overlay } : undefined }
								/>
								{ ! ( panel && panel.imageUrl ) && (
									<span className='bb-ia-placeholder' aria-hidden='true'>
										{ __( 'No image', 'b-blocks' ) }
									</span>
								) }
								<div className='bb-ia-content'>
									{ showTitle && panel && panel.title && (
										<TitleTag className='bb-ia-title'>{ panel.title }</TitleTag>
									) }
									{ showDescription && panel && panel.description && (
										<p className='bb-ia-desc'>{ panel.description }</p>
									) }
									{ showButton && (
										<span className='bb-ia-btn'>{ label }</span>
									) }
								</div>
							</div>
						);
					} ) }
				</div>
			) }
		</div>
	</>;
};

export default Edit;
