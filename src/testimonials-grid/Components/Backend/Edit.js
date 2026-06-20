import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings';
import { buildTestimonialsGridCss } from '../Common/Style';

const QuoteIcon = () => (
	<svg className='bb-tg-quote-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
		<path fill='currentColor' d='M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6z' />
	</svg>
);

const Star = ( { state, idx } ) => {
	const path = 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z';
	if ( state === 'half' ) {
		const gradId = `bb-tg-edit-half-${ idx }-${ Math.random().toString( 36 ).slice( 2, 6 ) }`;
		return (
			<svg className='bb-tg-star bb-tg-star--half' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
				<defs>
					<linearGradient id={ gradId }>
						<stop offset='50%' stopColor='var(--bb-tg-rating-color, #f59e0b)' />
						<stop offset='50%' stopColor='#d1d5db' />
					</linearGradient>
				</defs>
				<path d={ path } fill={ `url(#${ gradId })` } />
			</svg>
		);
	}
	return (
		<svg
			className={ `bb-tg-star ${ state === 'full' ? 'bb-tg-star--on' : 'bb-tg-star--off' }` }
			viewBox='0 0 24 24'
			aria-hidden='true'
			focusable='false'
		>
			<path d={ path } fill={ state === 'full' ? 'var(--bb-tg-rating-color, #f59e0b)' : '#d1d5db' } />
		</svg>
	);
};

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		items, style, textAlign, alignment, showAvatar, showRating, quoteIconVisible
	} = attributes;

	const id = `block-${ clientId }`;
	const css = buildTestimonialsGridCss( id, attributes );

	const list = Array.isArray( items ) ? items : [];

	const wrapperClasses = [
		'bb-tg',
		`bb-tg--${ style || 'card' }`,
		`bb-tg--align-${ alignment || 'left' }`,
		`bb-tg--text-${ textAlign || 'left' }`,
		( attributes.borderWidth > 0 ) ? 'bb-tg--has-border' : ''
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( { id, className: wrapperClasses } );

	return <>
		<Settings { ...props } />

		<BlockControls>
			<AlignmentToolbar
				value={ textAlign }
				onChange={ ( val ) => setAttributes( { textAlign: val === 'center' ? 'center' : 'left' } ) }
				alignmentControls={ [
					{ icon: 'editor-alignleft', title: __( 'Align left', 'b-blocks' ), align: 'left' },
					{ icon: 'editor-aligncenter', title: __( 'Align center', 'b-blocks' ), align: 'center' }
				] }
			/>
		</BlockControls>

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			{ list.length === 0 ? (
				<p className='bb-tg-empty'>
					{ __( 'Add testimonials from the “Testimonials” panel in the block settings.', 'b-blocks' ) }
				</p>
			) : (
				<ul className='bb-tg-grid'>
					{ list.map( ( item, idx ) => {
						const safe = item || {};
						const rating = typeof safe.rating === 'number' ? Math.max( 0, Math.min( 5, safe.rating ) ) : 0;
						const ratingHalf = Math.round( rating * 2 ) / 2;

						const metaItems = [];
						if ( safe.authorRole ) metaItems.push( safe.authorRole );
						if ( safe.authorCompany ) metaItems.push( safe.authorCompany );
						const hasAttribution = safe.authorName || metaItems.length > 0;

						const stars = [ 1, 2, 3, 4, 5 ].map( ( i ) => {
							if ( ratingHalf >= i ) return 'full';
							if ( ratingHalf >= i - 0.5 ) return 'half';
							return 'empty';
						} );

						return (
							<li className='bb-tg-item' key={ safe._key || idx }>
								<figure className='bb-tg-card'>
									{ style === 'minimal' && quoteIconVisible && <QuoteIcon /> }

									{ showRating && ratingHalf > 0 && (
										<span
											className='bb-tg-stars'
											role='img'
											aria-label={ sprintf(
												/* translators: %s: rating value out of 5 */
												__( 'Rating: %s out of 5 stars', 'b-blocks' ),
												String( ratingHalf )
											) }
										>
											{ stars.map( ( s, i ) => (
												<Star key={ i } state={ s } idx={ `${ idx }-${ i }` } />
											) ) }
										</span>
									) }

									{ safe.quote && (
										<blockquote className='bb-tg-quote'>{ safe.quote }</blockquote>
									) }

									{ ( ( showAvatar && safe.avatarUrl ) || hasAttribution ) && (
										<figcaption className='bb-tg-caption'>
											{ showAvatar && safe.avatarUrl && (
												<img
													className='bb-tg-avatar'
													src={ safe.avatarUrl }
													alt={ safe.avatarAlt || safe.authorName || '' }
												/>
											) }
											{ hasAttribution && (
												<cite className='bb-tg-cite'>
													{ safe.authorName && (
														<span className='bb-tg-name'>{ safe.authorName }</span>
													) }
													{ metaItems.length > 0 && (
														<span className='bb-tg-meta'>{ metaItems.join( ', ' ) }</span>
													) }
												</cite>
											) }
										</figcaption>
									) }
								</figure>
							</li>
						);
					} ) }
				</ul>
			) }
		</div>
	</>;
};

export default Edit;
