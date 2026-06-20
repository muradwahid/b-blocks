import { __, sprintf } from '@wordpress/i18n';
import { Button, TextControl, TextareaControl } from '@wordpress/components';

import { ColorControl } from '../../../../../bpl-tools/Components';
import { MAX_ITEMS, newItem } from '../../utils/data';

/**
 * Sidebar repeater for Milestone Timeline items.
 *
 * Each row holds the date label, title, description, a Font Awesome icon class,
 * and an optional per-item accent color that overrides the global node color.
 * Reorder up/down and delete per row. Adding a row appends a blank item, capped
 * at MAX_ITEMS. The stable `_key` is the React key so input focus survives
 * reorders.
 */
const ItemsRepeater = ( { value = [], onChange, showNodeNumbers } ) => {
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
		<div className='bb-mt-repeater'>
			{ items.length === 0 && (
				<p style={ { marginTop: 0, opacity: 0.7 } }>
					{ __( 'No milestones yet. Add one below.', 'b-blocks' ) }
				</p>
			) }

			{ items.map( ( row, idx ) => {
				const label = ( row && ( row.title || row.date ) )
					? ( row.title || row.date )
					: sprintf( /* translators: %d: item number */ __( 'Milestone #%d', 'b-blocks' ), idx + 1 );

				return (
					<div key={ row?._key || idx } className='bb-mt-repeater__row'>
						<div className='bb-mt-repeater__row-head'>
							<strong className='bb-mt-repeater__row-title'>{ label }</strong>
							<div className='bb-mt-repeater__row-actions'>
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
									label={ __( 'Remove milestone', 'b-blocks' ) }
									onClick={ () => removeAt( idx ) }
								/>
							</div>
						</div>

						<TextControl
							label={ __( 'Date / label', 'b-blocks' ) }
							value={ ( row && row.date ) || '' }
							onChange={ ( val ) => updateAt( idx, 'date', val ) }
							placeholder={ __( 'e.g. 2024 or Q3', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Title', 'b-blocks' ) }
							value={ ( row && row.title ) || '' }
							onChange={ ( val ) => updateAt( idx, 'title', val ) }
							placeholder={ __( 'e.g. Series A', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextareaControl
							label={ __( 'Description', 'b-blocks' ) }
							value={ ( row && row.description ) || '' }
							onChange={ ( val ) => updateAt( idx, 'description', val ) }
							help={ __( 'Optional short supporting text.', 'b-blocks' ) }
							rows={ 2 }
							__nextHasNoMarginBottom
						/>

						{ ! showNodeNumbers && (
							<TextControl
								label={ __( 'Icon class (Font Awesome)', 'b-blocks' ) }
								value={ ( row && row.icon ) || '' }
								onChange={ ( val ) => updateAt( idx, 'icon', val ) }
								placeholder={ __( 'e.g. fa-solid fa-rocket', 'b-blocks' ) }
								__nextHasNoMarginBottom
							/>
						) }

						<ColorControl
							label={ __( 'Accent color override:', 'b-blocks' ) }
							value={ ( row && row.accentColor ) || '' }
							onChange={ ( val ) => updateAt( idx, 'accentColor', val ) }
						/>
					</div>
				);
			} ) }

			<Button
				variant='secondary'
				className='bb-mt-add-item'
				onClick={ addRow }
				icon='plus'
				disabled={ atCap }
			>
				{ atCap
					? sprintf( /* translators: %d: maximum number of milestones */ __( 'Maximum %d milestones', 'b-blocks' ), MAX_ITEMS )
					: __( 'Add Milestone', 'b-blocks' ) }
			</Button>
		</div>
	);
};

export default ItemsRepeater;
