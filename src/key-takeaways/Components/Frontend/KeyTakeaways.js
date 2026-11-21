import { __ } from '@wordpress/i18n';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const TAG_VALUES = [ 'h2', 'h3', 'h4' ];
const STYLE_VALUES = [ 'check', 'numbered', 'bullet' ];

const plain = ( html ) => ( html || '' ).toString().replace( /<[^>]*>/g, '' ).trim();

/**
 * Shared Key Takeaways markup — the static frontend version rendered by view.js.
 * Edit.js renders its own interactive (RichText) markup.
 */
const KeyTakeaways = ( { attributes } ) => {
	const { heading = {}, list = {}, items = [] } = attributes;

	const listStyle = STYLE_VALUES.includes( list.style ) ? list.style : 'check';
	const HeadingTag = TAG_VALUES.includes( heading.tag ) ? heading.tag : 'h3';
	const ListTag = 'numbered' === listStyle ? 'ol' : 'ul';
	const showIcon = list.showIcon !== false;

	const cleanItems = ( Array.isArray( items ) ? items : [] ).filter( ( it ) => plain( it && it.text ) );

	const wrapperClasses = [
		'bBlocks-key-takeaways-wrapper',
		`bBlocks-key-takeaways-style-${ listStyle }`,
	].filter( Boolean ).join( ' ' );

	const headingHtml = plain( heading.text ) ? heading.text : __( 'Key Takeaways', 'b-blocks' );

	return (
		<div className={ wrapperClasses } role='region' aria-label={ plain( headingHtml ) }>
			<HeadingTag className='bBlocks-key-takeaways-heading' dangerouslySetInnerHTML={ { __html: sanitizeHtml( headingHtml ) } } />

			<div className='bBlocks-key-takeaways-body'>
				{ 0 === cleanItems.length ? (
					<p className='bBlocks-key-takeaways-empty'>{ __( 'No takeaways to display.', 'b-blocks' ) }</p>
				) : (
					<ListTag className='bBlocks-key-takeaways-list' role='list'>
						{ cleanItems.map( ( item, idx ) => (
							<li key={ ( item && item._key ) || idx } className='bBlocks-key-takeaways-item'>
								{ showIcon && 'check' === listStyle && (
									<span
										className='bBlocks-key-takeaways-icon'
										aria-hidden='true'
										dangerouslySetInnerHTML={ { __html: sanitizeHtml( ( item && item.icon ) || '' ) } }
									/>
								) }
								{ showIcon && 'numbered' === listStyle && (
									<span className='bBlocks-key-takeaways-num' aria-hidden='true' />
								) }
								{ showIcon && 'bullet' === listStyle && (
									<span className='bBlocks-key-takeaways-bullet' aria-hidden='true' />
								) }

								<span className='bBlocks-key-takeaways-text' dangerouslySetInnerHTML={ { __html: sanitizeHtml( ( item && item.text ) || '' ) } } />
							</li>
						) ) }
					</ListTag>
				) }
			</div>
		</div>
	);
};
export default KeyTakeaways;
