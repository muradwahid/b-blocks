import { __, sprintf } from '@wordpress/i18n';
import { Button, TextControl, TextareaControl, RangeControl, BaseControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

import { MAX_ITEMS, newItem } from '../../utils/data';

/**
 * Sidebar repeater for Testimonials Grid items.
 *
 * Each row: quote (textarea), author name/role/company, avatar (MediaUpload),
 * per-item rating (0–5, step 0.5; 0 hides the rating for that item), reorder
 * up/down, and delete. Adding a row appends a blank item. Capped at MAX_ITEMS.
 * The stable `_key` is the React key so input focus survives reorders.
 */
const ItemsRepeater = ( { value = [], onChange } ) => {
	const items = Array.isArray( value ) ? value : [];

	const updateAt = ( index, key, next ) => {
		onChange( items.map( ( row, i ) => (
			i === index ? { ...( row || {} ), [ key ]: next } : row
		) ) );
	};

	const removeAt = ( index ) => {
		onChange( items.filter( ( _, i ) => i !== index ) );
	};

	const moveItem = ( from, to ) => {
		if ( to < 0 || to >= items.length ) return;
		const copy = items.slice();
		const [ moved ] = copy.splice( from, 1 );
		copy.splice( to, 0, moved );
		onChange( copy );
	};

	const addRow = () => {
		if ( items.length >= MAX_ITEMS ) return;
		onChange( [ ...items, newItem() ] );
	};

	const atCap = items.length >= MAX_ITEMS;

	return (
		<div className='bb-tg-repeater'>
			{ items.length === 0 && (
				<p style={ { marginTop: 0, opacity: 0.7 } }>
					{ __( 'No testimonials yet. Add one below.', 'b-blocks' ) }
				</p>
			) }

			{ items.map( ( row, idx ) => {
				const label = ( row && row.authorName )
					? row.authorName
					: sprintf( /* translators: %d: item number */ __( 'Testimonial #%d', 'b-blocks' ), idx + 1 );

				return (
					<div key={ row?._key || idx } className='bb-tg-repeater__row'>
						<div className='bb-tg-repeater__row-head'>
							<strong className='bb-tg-repeater__row-title'>{ label }</strong>
							<div className='bb-tg-repeater__row-actions'>
								<Button
									variant='tertiary'
									size='small'
									icon='arrow-up-alt2'
									label={ __( 'Move up', 'b-blocks' ) }
									onClick={ () => moveItem( idx, idx - 1 ) }
									disabled={ idx === 0 }
								/>
								<Button
									variant='tertiary'
									size='small'
									icon='arrow-down-alt2'
									label={ __( 'Move down', 'b-blocks' ) }
									onClick={ () => moveItem( idx, idx + 1 ) }
									disabled={ idx === items.length - 1 }
								/>
								<Button
									variant='tertiary'
									isDestructive
									size='small'
									icon='trash'
									label={ __( 'Remove testimonial', 'b-blocks' ) }
									onClick={ () => removeAt( idx ) }
								/>
							</div>
						</div>

						<TextareaControl
							label={ __( 'Quote', 'b-blocks' ) }
							value={ ( row && row.quote ) || '' }
							onChange={ ( val ) => updateAt( idx, 'quote', val ) }
							placeholder={ __( 'What did the customer say?', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Author Name', 'b-blocks' ) }
							value={ ( row && row.authorName ) || '' }
							onChange={ ( val ) => updateAt( idx, 'authorName', val ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Author Role', 'b-blocks' ) }
							value={ ( row && row.authorRole ) || '' }
							onChange={ ( val ) => updateAt( idx, 'authorRole', val ) }
							placeholder={ __( 'e.g. Product Manager', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Author Company', 'b-blocks' ) }
							value={ ( row && row.authorCompany ) || '' }
							onChange={ ( val ) => updateAt( idx, 'authorCompany', val ) }
							placeholder={ __( 'e.g. Acme Inc.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<BaseControl label={ __( 'Avatar image', 'b-blocks' ) } __nextHasNoMarginBottom>
							<div style={ { display: 'flex', flexDirection: 'column', gap: 6 } }>
								{ ( row && row.avatarUrl ) && (
									<img
										className='bb-tg-repeater__thumb'
										src={ row.avatarUrl }
										alt={ ( row && row.avatarAlt ) || '' }
									/>
								) }
								<MediaUploadCheck>
									<MediaUpload
										allowedTypes={ [ 'image' ] }
										value={ ( row && row.avatarId ) || undefined }
										onSelect={ ( media ) => {
											if ( ! media ) return;
											onChange( items.map( ( r, i ) => (
												i === idx
													? {
														...( r || {} ),
														avatarId: media.id || 0,
														avatarUrl: media.url || '',
														avatarAlt: ( r && r.avatarAlt ) || media.alt || ''
													}
													: r
											) ) );
										} }
										render={ ( { open } ) => (
											<div className='bb-tg-repeater__media-actions'>
												<Button
													variant='secondary'
													size='small'
													onClick={ open }
													icon='format-image'
												>
													{ ( row && row.avatarUrl )
														? __( 'Replace image', 'b-blocks' )
														: __( 'Select image', 'b-blocks' ) }
												</Button>
												{ ( row && row.avatarUrl ) && (
													<Button
														variant='tertiary'
														size='small'
														isDestructive
														onClick={ () => {
															onChange( items.map( ( r, i ) => (
																i === idx
																	? { ...( r || {} ), avatarId: 0, avatarUrl: '', avatarAlt: '' }
																	: r
															) ) );
														} }
													>
														{ __( 'Remove image', 'b-blocks' ) }
													</Button>
												) }
											</div>
										) }
									/>
								</MediaUploadCheck>
							</div>
						</BaseControl>

						<TextControl
							label={ __( 'Avatar Alt Text', 'b-blocks' ) }
							value={ ( row && row.avatarAlt ) || '' }
							onChange={ ( val ) => updateAt( idx, 'avatarAlt', val ) }
							help={ __( 'Leave blank to use the media library alt text or the author name.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={ __( 'Rating', 'b-blocks' ) }
							value={ typeof ( row && row.rating ) === 'number' ? row.rating : 5 }
							onChange={ ( val ) => updateAt( idx, 'rating', val ) }
							min={ 0 }
							max={ 5 }
							step={ 0.5 }
							help={ __( '0 hides the rating for this testimonial.', 'b-blocks' ) }
						/>
					</div>
				);
			} ) }

			<Button
				variant='secondary'
				className='bb-tg-add-item'
				onClick={ addRow }
				icon='plus'
				disabled={ atCap }
			>
				{ atCap
					? sprintf( /* translators: %d: maximum number of testimonials */ __( 'Maximum %d testimonials', 'b-blocks' ), MAX_ITEMS )
					: __( 'Add Testimonial', 'b-blocks' ) }
			</Button>
		</div>
	);
};

export default ItemsRepeater;
