import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings';
import { buildMarqueeCss } from '../Common/Style';

/**
 * Editor view. The track is rendered static (no animation) so the editor stays
 * calm and performant; the live infinite-scroll is hydrated only on the
 * frontend by view.js. A single, non-duplicated item set is shown — enough to
 * preview content, spacing, colors, and the optional label.
 */
const Edit = ( props ) => {
	const { attributes, clientId } = props;
	const {
		items, itemType, direction,
		labelText, fadeEdges, imageGrayscale, imageGrayscaleHover,
		separatorIcon
	} = attributes;

	const id = `block-${ clientId }`;
	const css = buildMarqueeCss( id, attributes );

	const list = Array.isArray( items ) ? items : [];
	const labelId = `${ id }-label`;
	const hasLabel = '' !== ( labelText || '' ).trim();
	const sepClass = ( separatorIcon || '' ).trim();

	const wrapperClasses = [
		'bb-mq',
		`bb-mq--dir-${ direction || 'left' }`,
		`bb-mq--type-${ itemType || 'mixed' }`,
		fadeEdges ? 'bb-mq--fade' : '',
		imageGrayscale ? 'bb-mq--gray' : '',
		imageGrayscale && imageGrayscaleHover ? 'bb-mq--gray-hover' : '',
		'bb-mq--editor'
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	const renderItemContent = ( item, __idx ) => {
		const type = ( item && item.type ) || 'logo';
		if ( type === 'text' ) {
			return (
				<span className='bb-mq-badge'>
					{ ( item && item.text ) || __( 'Item', 'b-blocks' ) }
				</span>
			);
		}
		if ( item && item.imageUrl ) {
			return (
				<img
					className='bb-mq-img'
					src={ item.imageUrl }
					alt={ item.imageAlt || '' }
				/>
			);
		}
		return (
			<span className='bb-mq-placeholder' aria-hidden='true'>
				{ __( 'Logo', 'b-blocks' ) }
			</span>
		);
	};

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-mq-inner'>
				{ hasLabel && (
					<span className='bb-mq-label' id={ labelId }>
						{ labelText }
					</span>
				) }

				<div className='bb-mq-viewport'>
					{ list.length === 0 ? (
						<p className='bb-mq-empty'>
							{ __( 'Add items from the “Content” panel in the block settings.', 'b-blocks' ) }
						</p>
					) : (
						<div className='bb-mq-track bb-mq-track--static'>
							{ list.map( ( item, idx ) => (
								<div className='bb-mq-item' key={ item?._key || idx }>
									{ renderItemContent( item, idx ) }
									{ sepClass && idx < list.length - 1 && (
										<i className={ `bb-mq-sep ${ sepClass }` } aria-hidden='true'></i>
									) }
								</div>
							) ) }
						</div>
					) }
				</div>
			</div>
		</div>
	</>;
};

export default Edit;
