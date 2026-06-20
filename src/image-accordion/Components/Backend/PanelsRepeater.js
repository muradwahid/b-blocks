import { __ } from '@wordpress/i18n';
import {
	Button, TextControl, TextareaControl, ToggleControl, SelectControl, BaseControl
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

import { ColorControl } from '../../../../../bpl-tools/Components';
import { MAX_PANELS, newPanel, objectPositionOptions } from '../../utils/data';

/**
 * Sidebar repeater for Image Accordion panels.
 *
 * Each row: background image (MediaUpload), alt text, background position,
 * per-panel overlay color, title, description, CTA label/URL/new-tab, plus
 * reorder up/down and delete. Adding a row appends a blank panel. Capped at
 * MAX_PANELS. The stable `id` is used as the React key so input focus survives
 * reorders.
 */
const PanelsRepeater = ( { value = [], onChange } ) => {
	const panels = Array.isArray( value ) ? value : [];

	const updateAt = ( index, key, next ) => {
		onChange( panels.map( ( row, i ) => (
			i === index ? { ...( row || {} ), [ key ]: next } : row
		) ) );
	};

	const removeAt = ( index ) => {
		onChange( panels.filter( ( _, i ) => i !== index ) );
	};

	const moveItem = ( from, to ) => {
		if ( to < 0 || to >= panels.length ) return;
		const copy = panels.slice();
		const [ moved ] = copy.splice( from, 1 );
		copy.splice( to, 0, moved );
		onChange( copy );
	};

	const addRow = () => {
		if ( panels.length >= MAX_PANELS ) return;
		onChange( [ ...panels, newPanel() ] );
	};

	const atCap = panels.length >= MAX_PANELS;

	return (
		<div className='bb-ia-repeater'>
			{ panels.length === 0 && (
				<p style={ { marginTop: 0, opacity: 0.7 } }>
					{ __( 'No panels yet. Add one below.', 'b-blocks' ) }
				</p>
			) }

			{ panels.map( ( row, idx ) => {
				const isCustomPos = row && row.objectPosition
					&& ! objectPositionOptions.some(
						( opt ) => opt.value !== 'custom' && opt.value === row.objectPosition
					);
				const posSelectValue = isCustomPos ? 'custom' : ( ( row && row.objectPosition ) || '50% 50%' );

				return (
					<div key={ row?.id || idx } className='bb-ia-repeater__row'>
						<div className='bb-ia-repeater__row-head'>
							<strong className='bb-ia-repeater__row-title'>
								{ __( 'Panel', 'b-blocks' ) } #{ idx + 1 }
							</strong>
							<div className='bb-ia-repeater__row-actions'>
								<Button
									variant='tertiary'
									size='small'
									icon='arrow-up-alt2'
									label={ __( 'Move panel up', 'b-blocks' ) }
									onClick={ () => moveItem( idx, idx - 1 ) }
									disabled={ idx === 0 }
								/>
								<Button
									variant='tertiary'
									size='small'
									icon='arrow-down-alt2'
									label={ __( 'Move panel down', 'b-blocks' ) }
									onClick={ () => moveItem( idx, idx + 1 ) }
									disabled={ idx === panels.length - 1 }
								/>
								<Button
									variant='tertiary'
									isDestructive
									size='small'
									icon='trash'
									label={ __( 'Remove panel', 'b-blocks' ) }
									onClick={ () => removeAt( idx ) }
								/>
							</div>
						</div>

						<BaseControl label={ __( 'Background image', 'b-blocks' ) } __nextHasNoMarginBottom>
							<div style={ { display: 'flex', flexDirection: 'column', gap: 6 } }>
								{ ( row && row.imageUrl ) && (
									<img
										className='bb-ia-repeater__thumb'
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
											onChange( panels.map( ( r, i ) => (
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
											<div className='bb-ia-repeater__media-actions'>
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
															onChange( panels.map( ( r, i ) => (
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
							label={ __( 'Image alt text', 'b-blocks' ) }
							value={ ( row && row.imageAlt ) || '' }
							onChange={ ( val ) => updateAt( idx, 'imageAlt', val ) }
							placeholder={ __( 'Describe the image (decorative if blank)', 'b-blocks' ) }
							help={ __( 'Used by screen readers. Leave blank to use the media library alt text.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={ __( 'Background position', 'b-blocks' ) }
							value={ posSelectValue }
							options={ objectPositionOptions }
							onChange={ ( val ) => updateAt( idx, 'objectPosition', val === 'custom' ? '50% 50%' : val ) }
							__nextHasNoMarginBottom
						/>

						{ posSelectValue === 'custom' && (
							<TextControl
								label={ __( 'Custom position value', 'b-blocks' ) }
								value={ ( row && row.objectPosition ) || '' }
								onChange={ ( val ) => updateAt( idx, 'objectPosition', val ) }
								placeholder='50% 25%'
								help={ __( 'Any valid CSS background-position value.', 'b-blocks' ) }
								__nextHasNoMarginBottom
							/>
						) }

						<ColorControl
							label={ __( 'Overlay color (optional):', 'b-blocks' ) }
							value={ ( row && row.overlayColor ) || '' }
							onChange={ ( val ) => updateAt( idx, 'overlayColor', val ) }
						/>

						<TextControl
							label={ __( 'Title', 'b-blocks' ) }
							value={ ( row && row.title ) || '' }
							onChange={ ( val ) => updateAt( idx, 'title', val ) }
							placeholder={ __( 'Panel title', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextareaControl
							label={ __( 'Description', 'b-blocks' ) }
							value={ ( row && row.description ) || '' }
							onChange={ ( val ) => updateAt( idx, 'description', val ) }
							placeholder={ __( 'Short supporting text', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Button label', 'b-blocks' ) }
							value={ ( row && row.btnLabel ) || '' }
							onChange={ ( val ) => updateAt( idx, 'btnLabel', val ) }
							placeholder={ __( 'Falls back to the global label', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Button URL', 'b-blocks' ) }
							type='url'
							value={ ( row && row.btnUrl ) || '' }
							onChange={ ( val ) => updateAt( idx, 'btnUrl', val ) }
							placeholder='https://example.com/'
							__nextHasNoMarginBottom
						/>

						{ ( row && row.btnUrl ) && (
							<ToggleControl
								label={ __( 'Open in new tab', 'b-blocks' ) }
								checked={ !! ( row && row.btnNewTab ) }
								onChange={ ( val ) => updateAt( idx, 'btnNewTab', !! val ) }
							/>
						) }
					</div>
				);
			} ) }

			<Button
				variant='secondary'
				className='bb-ia-add-item'
				onClick={ addRow }
				icon='plus'
				disabled={ atCap }
			>
				{ atCap
					? __( 'Maximum 8 panels', 'b-blocks' )
					: __( 'Add Panel', 'b-blocks' ) }
			</Button>
		</div>
	);
};

export default PanelsRepeater;
