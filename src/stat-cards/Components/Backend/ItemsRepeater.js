import { __, sprintf } from '@wordpress/i18n';
import { Button, TextControl, SelectControl, ToggleControl, PanelRow } from '@wordpress/components';

import { Label, ColorControl } from '../../../../../bpl-tools/Components';
import { MAX_ITEMS, newItem, trendDirectionOptions } from '../../utils/data';

/**
 * Sidebar repeater for Stat Cards items.
 *
 * Each row holds the icon class, number (free text), prefix/suffix, label,
 * description, trend value + direction + color override, and an optional link
 * URL with a new-tab toggle. Reorder up/down and delete per row. Adding a row
 * appends a blank item. Capped at MAX_ITEMS. The stable `_key` is the React key
 * so input focus survives reorders.
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
		<div className='bb-sc-repeater'>
			{ items.length === 0 && (
				<p style={ { marginTop: 0, opacity: 0.7 } }>
					{ __( 'No stat cards yet. Add one below.', 'b-blocks' ) }
				</p>
			) }

			{ items.map( ( row, idx ) => {
				const label = ( row && ( row.label || row.number ) )
					? ( row.label || row.number )
					: sprintf( /* translators: %d: item number */ __( 'Stat #%d', 'b-blocks' ), idx + 1 );

				return (
					<div key={ row?._key || idx } className='bb-sc-repeater__row'>
						<div className='bb-sc-repeater__row-head'>
							<strong className='bb-sc-repeater__row-title'>{ label }</strong>
							<div className='bb-sc-repeater__row-actions'>
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
									label={ __( 'Remove stat', 'b-blocks' ) }
									onClick={ () => removeAt( idx ) }
								/>
							</div>
						</div>

						<TextControl
							label={ __( 'Icon class (Font Awesome)', 'b-blocks' ) }
							value={ ( row && row.icon ) || '' }
							onChange={ ( val ) => updateAt( idx, 'icon', val ) }
							placeholder={ __( 'e.g. fa-solid fa-users', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<div className='bb-sc-repeater__cols'>
							<TextControl
								label={ __( 'Prefix', 'b-blocks' ) }
								value={ ( row && row.prefix ) || '' }
								onChange={ ( val ) => updateAt( idx, 'prefix', val ) }
								placeholder={ __( '$', 'b-blocks' ) }
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={ __( 'Number', 'b-blocks' ) }
								value={ ( row && row.number ) || '' }
								onChange={ ( val ) => updateAt( idx, 'number', val ) }
								placeholder={ __( '500', 'b-blocks' ) }
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={ __( 'Suffix', 'b-blocks' ) }
								value={ ( row && row.suffix ) || '' }
								onChange={ ( val ) => updateAt( idx, 'suffix', val ) }
								placeholder={ __( '+', 'b-blocks' ) }
								__nextHasNoMarginBottom
							/>
						</div>

						<TextControl
							label={ __( 'Label', 'b-blocks' ) }
							value={ ( row && row.label ) || '' }
							onChange={ ( val ) => updateAt( idx, 'label', val ) }
							placeholder={ __( 'e.g. Customers', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Description', 'b-blocks' ) }
							value={ ( row && row.description ) || '' }
							onChange={ ( val ) => updateAt( idx, 'description', val ) }
							help={ __( 'Optional one-line supporting text.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={ __( 'Trend value', 'b-blocks' ) }
							value={ ( row && row.trendValue ) || '' }
							onChange={ ( val ) => updateAt( idx, 'trendValue', val ) }
							placeholder={ __( 'e.g. 34%', 'b-blocks' ) }
							help={ __( 'Leave blank to hide the trend badge for this card.', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{ __( 'Trend direction:', 'b-blocks' ) }</Label>
							<SelectControl
								value={ ( row && row.trendDirection ) || 'up' }
								options={ trendDirectionOptions }
								onChange={ ( val ) => updateAt( idx, 'trendDirection', val ) }
							/>
						</PanelRow>

						<ColorControl
							label={ __( 'Trend color override:', 'b-blocks' ) }
							value={ ( row && row.trendColor ) || '' }
							onChange={ ( val ) => updateAt( idx, 'trendColor', val ) }
						/>

						<TextControl
							label={ __( 'Link URL', 'b-blocks' ) }
							type='url'
							value={ ( row && row.linkUrl ) || '' }
							onChange={ ( val ) => updateAt( idx, 'linkUrl', val ) }
							placeholder='https://'
							__nextHasNoMarginBottom
						/>

						{ ( row && row.linkUrl ) && (
							<ToggleControl
								label={ __( 'Open link in new tab', 'b-blocks' ) }
								checked={ !! ( row && row.linkTarget ) }
								onChange={ ( val ) => updateAt( idx, 'linkTarget', val ) }
							/>
						) }
					</div>
				);
			} ) }

			<Button
				variant='secondary'
				className='bb-sc-add-item'
				onClick={ addRow }
				icon='plus'
				disabled={ atCap }
			>
				{ atCap
					? sprintf( /* translators: %d: maximum number of stat cards */ __( 'Maximum %d cards', 'b-blocks' ), MAX_ITEMS )
					: __( 'Add Stat Card', 'b-blocks' ) }
			</Button>
		</div>
	);
};

export default ItemsRepeater;
