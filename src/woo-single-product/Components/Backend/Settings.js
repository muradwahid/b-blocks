import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../utils/data';
import { layoutOptions, blockAlignOptions, mobileStackOptions } from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		productId, layout, gallerySplit, showGallery, showSummary,
		showAfterSummary, columnGap, maxWidth, blockAlign, paddingVertical,
		paddingHorizontal, blockBG, blockBorderRadius, mobileStackOrder,
		mobileBreakpoint, noProductMessage
	} = attributes;

	const [ product, setProduct ] = useState( null );
	const [ fetchError, setFetchError ] = useState( false );

	// Resolve the selected product for an editor-side preview chip.
	useEffect( () => {
		const id = parseInt( productId, 10 ) || 0;
		if ( ! id ) {
			setProduct( null );
			setFetchError( false );
			return;
		}

		let active = true;
		apiFetch( { path: `/wc/store/v1/products/${ id }` } )
			.then( ( res ) => {
				if ( ! active ) return;
				setProduct( res );
				setFetchError( false );
			} )
			.catch( () => {
				if ( ! active ) return;
				setProduct( null );
				setFetchError( true );
			} );

		return () => { active = false; };
	}, [ productId ] );

	const previewImage = product && product.images && product.images[ 0 ] ? product.images[ 0 ].src : '';

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Product', 'b-blocks' ) }>
			<TextControl
				label={ __( 'Product ID', 'b-blocks' ) }
				type='number'
				min={ 0 }
				value={ productId || 0 }
				onChange={ ( val ) => setAttributes( { productId: parseInt( val, 10 ) || 0 } ) }
				help={ __( 'Enter the numeric ID of the WooCommerce product to render.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>

			{ product && (
				<div className='bb-wsp-product-preview'>
					{ previewImage && <img src={ previewImage } alt='' /> }
					<span className='bb-wsp-product-preview-name'>{ product.name }</span>
				</div>
			) }

			{ fetchError && !! productId && (
				<p className='bb-wsp-product-preview-error'>
					{ __( 'No product found for this ID.', 'b-blocks' ) }
				</p>
			) }

			<TextControl
				label={ __( 'No Product Message', 'b-blocks' ) }
				value={ noProductMessage }
				onChange={ ( val ) => setAttributes( { noProductMessage: val } ) }
				help={ __( 'Shown when no product is selected on the frontend.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ layout }
					options={ layoutOptions }
					onChange={ ( val ) => setAttributes( { layout: val } ) }
				/>
			</PanelRow>

			{ 'horizontal' === layout && (
				<RangeControl
					label={ __( 'Gallery Width (%)', 'b-blocks' ) }
					value={ gallerySplit }
					onChange={ ( val ) => setAttributes( { gallerySplit: val } ) }
					min={ 20 }
					max={ 70 }
					step={ 5 }
				/>
			) }

			<RangeControl
				label={ __( 'Column Gap (px)', 'b-blocks' ) }
				value={ columnGap }
				onChange={ ( val ) => setAttributes( { columnGap: val } ) }
				min={ 0 }
				max={ 80 }
				step={ 1 }
			/>

			<RangeControl
				label={ __( 'Max Width (px, 0 = unlimited)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 }
				max={ 1600 }
				step={ 10 }
			/>

			{ maxWidth > 0 && (
				<PanelRow>
					<Label className=''>{ __( 'Block Alignment:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ blockAlign }
						options={ blockAlignOptions }
						onChange={ ( val ) => setAttributes( { blockAlign: val } ) }
					/>
				</PanelRow>
			) }

			<PanelRow>
				<Label className=''>{ __( 'Mobile Stack Order:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ mobileStackOrder }
					options={ mobileStackOptions }
					onChange={ ( val ) => setAttributes( { mobileStackOrder: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Mobile Breakpoint (px)', 'b-blocks' ) }
				value={ mobileBreakpoint }
				onChange={ ( val ) => setAttributes( { mobileBreakpoint: val } ) }
				min={ 480 }
				max={ 960 }
				step={ 1 }
				help={ __( 'Below this width the gallery and summary stack.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Gallery', 'b-blocks' ) }
				checked={ !! showGallery }
				onChange={ ( val ) => setAttributes( { showGallery: val } ) }
			/>
			<ToggleControl
				label={ __( 'Show Summary', 'b-blocks' ) }
				checked={ !! showSummary }
				onChange={ ( val ) => setAttributes( { showSummary: val } ) }
				help={ __( 'The summary holds the title, price, add-to-cart form (with variations) and meta.', 'b-blocks' ) }
			/>
			<ToggleControl
				label={ __( 'Show Product Tabs & Upsells', 'b-blocks' ) }
				checked={ !! showAfterSummary }
				onChange={ ( val ) => setAttributes( { showAfterSummary: val } ) }
				help={ __( 'Fires WooCommerce after-summary hooks — includes Description tab, Reviews, Upsells. May add significant markup.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Padding Vertical (px)', 'b-blocks' ) }
				value={ paddingVertical }
				onChange={ ( val ) => setAttributes( { paddingVertical: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Padding Horizontal (px)', 'b-blocks' ) }
				value={ paddingHorizontal }
				onChange={ ( val ) => setAttributes( { paddingHorizontal: val } ) }
				min={ 0 }
				max={ 120 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Background Color:', 'b-blocks' ) }
				value={ blockBG }
				onChange={ ( val ) => setAttributes( { blockBG: val } ) }
			/>
			<RangeControl
				label={ __( 'Border Radius (px)', 'b-blocks' ) }
				value={ blockBorderRadius }
				onChange={ ( val ) => setAttributes( { blockBorderRadius: val } ) }
				min={ 0 }
				max={ 48 }
				step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
