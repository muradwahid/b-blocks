import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { Button, ColorPalette, PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import '../../editor.scss';

import Settings from './Settings';
import {
	buildItemStyle,
	getLayoutClass,
	getVariantClass,
	moveItem,
} from '../Common/Utilities';
import { THEME_COLORS, DEFAULT_ITEM } from '../../utils/options';

/**
 * Editor (Backend) component for the Timeline block.
 *
 * Provides:
 *  - In-place editing of date, title, and description per item.
 *  - Move-up / move-down controls to reorder items.
 *  - Per-item accent color picker.
 *  - Add/remove item controls.
 *
 * All settings (layout, variant, line color, etc.) live in the
 * InspectorControls sidebar via the Settings component.
 */
const Edit = ( { attributes, setAttributes } ) => {
	const {
		items = [],
		layout = 'alternating',
		variant = 'modern',
		lineColor = '#dee2e6',
		showIcons = true,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `timeline-block ${ getVariantClass( variant ) } ${ getLayoutClass( layout ) }`,
		style: {
			'--bBlocks-timeline-line-color': lineColor,
		},
	} );

	const updateItem = ( index, field, value ) => {
		const next = items.map( ( item, i ) =>
			i === index ? { ...item, [ field ]: value } : item
		);
		setAttributes( { items: next } );
	};

	const addItem = () => {
		setAttributes( {
			items: [
				...items,
				{
					...DEFAULT_ITEM,
					title: __( 'New Timeline Item', 'b-blocks' ),
					description: __( 'Add a short description for this milestone.', 'b-blocks' ),
				},
			],
		} );
	};

	const removeItem = ( index ) => {
		const next = items.filter( ( _, i ) => i !== index );
		setAttributes( { items: next } );
	};

	const handleMove = ( index, direction ) => {
		const next = moveItem( items, index, direction );
		if ( next !== items ) {
			setAttributes( { items: next } );
		}
	};

	return (
		<Fragment>
			<InspectorControls>
				<Settings attributes={ attributes } setAttributes={ setAttributes } />
			</InspectorControls>

			<div { ...blockProps }>
				{ items.length === 0 ? (
					<div className="timeline-empty">
						<p>
							{ __(
								'No timeline items yet. Click "Add Item" to get started.',
								'b-blocks'
							) }
						</p>
						<Button variant="primary" onClick={ addItem }>
							{ __( 'Add Item', 'b-blocks' ) }
						</Button>
					</div>
				) : (
					<ol className="timeline-items">
						{ items.map( ( item, index ) => {
							const hasIcon = showIcons && !! item.icon;

							return (
								<li
									key={ index }
									className="timeline-item"
									style={ buildItemStyle( item ) }
								>
									<div className="timeline-item-controls">
										<Button
											size="small"
											variant="secondary"
											disabled={ index === 0 }
											onClick={ () => handleMove( index, -1 ) }
											aria-label={ __( 'Move item up', 'b-blocks' ) }
										>
											{ '↑' }
										</Button>
										<Button
											size="small"
											variant="secondary"
											disabled={ index === items.length - 1 }
											onClick={ () => handleMove( index, 1 ) }
											aria-label={ __( 'Move item down', 'b-blocks' ) }
										>
											{ '↓' }
										</Button>
										<Button
											size="small"
											isDestructive
											onClick={ () => removeItem( index ) }
											aria-label={ __( 'Remove item', 'b-blocks' ) }
										>
											{ __( 'Remove', 'b-blocks' ) }
										</Button>
									</div>

									<span
										className={ `timeline-marker${ hasIcon ? ' has-icon' : '' }` }
										aria-hidden="true"
									>
										{ hasIcon ? item.icon : '' }
									</span>

									<div className="timeline-card">
										<RichText
											tagName="div"
											className="timeline-date"
											value={ item.date }
											allowedFormats={ [] }
											onChange={ ( value ) => updateItem( index, 'date', value ) }
											placeholder={ __( 'Date or label (e.g. 2024)', 'b-blocks' ) }
										/>
										<RichText
											tagName="h3"
											className="timeline-title"
											value={ item.title }
											onChange={ ( value ) => updateItem( index, 'title', value ) }
											placeholder={ __( 'Item title…', 'b-blocks' ) }
										/>
										<RichText
											tagName="div"
											className="timeline-description"
											value={ item.description }
											onChange={ ( value ) =>
												updateItem( index, 'description', value )
											}
											placeholder={ __( 'Add a short description…', 'b-blocks' ) }
										/>

										<PanelBody
											title={ __( 'Item Options', 'b-blocks' ) }
											initialOpen={ false }
											className="timeline-item-options"
										>
											<RichText
												tagName="div"
												className="timeline-item-icon-input"
												value={ item.icon }
												allowedFormats={ [] }
												onChange={ ( value ) => updateItem( index, 'icon', value ) }
												placeholder={ __( 'Optional icon (e.g. ★, 01, 🚀)', 'b-blocks' ) }
											/>
											<p>
												<strong>{ __( 'Accent color', 'b-blocks' ) }</strong>
											</p>
											<ColorPalette
												colors={ THEME_COLORS }
												value={ item.accentColor }
												onChange={ ( value ) =>
													updateItem( index, 'accentColor', value || '#0d6efd' )
												}
											/>
										</PanelBody>
									</div>
								</li>
							);
						} ) }
					</ol>
				) }

				{ items.length > 0 && (
					<div className="timeline-add-item">
						<Button variant="primary" onClick={ addItem }>
							{ __( 'Add Item', 'b-blocks' ) }
						</Button>
					</div>
				) }
			</div>
		</Fragment>
	);
};

export default Edit;
