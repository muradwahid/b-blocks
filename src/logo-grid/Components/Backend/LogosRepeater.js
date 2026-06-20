import { __ } from '@wordpress/i18n';
import { Button, TextControl, ToggleControl, BaseControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

import { MAX_ITEMS, newItem } from '../../utils/data';

/**
 * Sidebar repeater for Logo Grid items.
 *
 * Each row: image (MediaUpload), alt text, link URL, open-in-new-tab toggle,
 * reorder up/down, and delete. Adding a row appends a blank item. Capped at
 * MAX_ITEMS. The stable `_key` is used as the React key so input focus
 * survives reorders.
 */
const LogosRepeater = ( { value = [], onChange } ) => {
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
		<div className='bb-lg-repeater'>
			{ items.length === 0 && (
				<p style={ { marginTop: 0, opacity: 0.7 } }>
					{ __( 'No logos yet. Add one below.', 'b-blocks' ) }
				</p>
			) }

			{ items.map( ( row, idx ) => (
				<div key={ row?._key || idx } className='bb-lg-repeater__row'>
					<div className='bb-lg-repeater__row-head'>
						<strong className='bb-lg-repeater__row-title'>
							{ __( 'Logo', 'b-blocks' ) } #{ idx + 1 }
						</strong>
						<div className='bb-lg-repeater__row-actions'>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-up-alt2'
								label={ __( 'Move logo up', 'b-blocks' ) }
								onClick={ () => moveItem( idx, idx - 1 ) }
								disabled={ idx === 0 }
							/>
							<Button
								variant='tertiary'
								size='small'
								icon='arrow-down-alt2'
								label={ __( 'Move logo down', 'b-blocks' ) }
								onClick={ () => moveItem( idx, idx + 1 ) }
								disabled={ idx === items.length - 1 }
							/>
							<Button
								variant='tertiary'
								isDestructive
								size='small'
								icon='trash'
								label={ __( 'Remove logo', 'b-blocks' ) }
								onClick={ () => removeAt( idx ) }
							/>
						</div>
					</div>

					<BaseControl label={ __( 'Logo image', 'b-blocks' ) } __nextHasNoMarginBottom>
						<div style={ { display: 'flex', flexDirection: 'column', gap: 6 } }>
							{ ( row && row.imageUrl ) && (
								<img
									className='bb-lg-repeater__thumb'
									src={ row.imageUrl }
									alt={ ( row && row.imageAlt ) || '' }
								/>
							) }
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={ [ 'image' ] }
									value={ ( row && row.imageId ) || undefined }
									onSelect={ ( media ) => {
										if ( ! media ) return;
										onChange( items.map( ( r, i ) => (
											i === idx
												? {
													...( r || {} ),
													imageId: media.id || 0,
													imageUrl: media.url || '',
													imageAlt: ( r && r.imageAlt ) || media.alt || ''
												}
												: r
										) ) );
									} }
									render={ ( { open } ) => (
										<div className='bb-lg-repeater__media-actions'>
											<Button
												variant='secondary'
												size='small'
												onClick={ open }
												icon='format-image'
											>
												{ ( row && row.imageUrl )
													? __( 'Replace image', 'b-blocks' )
													: __( 'Select image', 'b-blocks' ) }
											</Button>
											{ ( row && row.imageUrl ) && (
												<Button
													variant='tertiary'
													size='small'
													isDestructive
													onClick={ () => {
														onChange( items.map( ( r, i ) => (
															i === idx
																? { ...( r || {} ), imageId: 0, imageUrl: '', imageAlt: '' }
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
						label={ __( 'Alt text', 'b-blocks' ) }
						value={ ( row && row.imageAlt ) || '' }
						onChange={ ( val ) => updateAt( idx, 'imageAlt', val ) }
						placeholder={ __( 'e.g. Acme Inc. logo', 'b-blocks' ) }
						help={ __( 'Leave blank to use the media library alt text.', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>

					<TextControl
						label={ __( 'Link URL (optional)', 'b-blocks' ) }
						type='url'
						value={ ( row && row.linkUrl ) || '' }
						onChange={ ( val ) => updateAt( idx, 'linkUrl', val ) }
						placeholder='https://example.com/'
						help={ __( 'When set, the logo becomes a link.', 'b-blocks' ) }
						__nextHasNoMarginBottom
					/>

					{ ( row && row.linkUrl ) && (
						<ToggleControl
							label={ __( 'Open in new tab', 'b-blocks' ) }
							checked={ !! ( row && row.linkNewTab ) }
							onChange={ ( val ) => updateAt( idx, 'linkNewTab', !! val ) }
						/>
					) }
				</div>
			) ) }

			<Button
				variant='secondary'
				className='bb-lg-add-item'
				onClick={ addRow }
				icon='plus'
				disabled={ atCap }
			>
				{ atCap
					? /* translators: %d: maximum number of logos */ __( 'Maximum 40 logos', 'b-blocks' )
					: __( 'Add Logo', 'b-blocks' ) }
			</Button>
		</div>
	);
};

export default LogosRepeater;
