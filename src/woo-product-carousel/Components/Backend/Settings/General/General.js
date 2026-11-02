import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, TextControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { BButtonGroup, HelpPanel, Label } from '../../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../../utils/data';
import { sideOptions, titleTagOptions } from '../../../../utils/options';
import { CENTERED_PRESETS, FEATURED_PRESETS, PRESET_HIDDEN } from '../../../../utils/data';
import Carousel from './Carousel';
import Layout from './Layout';
import ProductQuery from './ProductQuery';

const General = ( props ) => {
	const { attributes, updateObj } = props;
	const { button = {}, viewButton = {}, badge = {}, heading = {}, elements = {} } = attributes;

	return <>
		<HelpPanel slug={ pluginSlug } />

		<Carousel { ...props } />
		<Layout { ...props } />
		<ProductQuery { ...props } />

		{ FEATURED_PRESETS.includes( attributes.preset ) && <PanelBody className='bPlPanelBody' title={ __( 'Heading', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Text', 'b-blocks' ) }
				help={ __( 'Above the carousel. The first product is shown large beside it.', 'b-blocks' ) }
				value={ heading.text }
				onChange={ ( val ) => updateObj( 'heading', val, 'text' ) }
			/>

			<Label>{ __( 'Tag', 'b-blocks' ) }</Label>
			<BButtonGroup
				label=''
				options={ titleTagOptions }
				value={ heading.tag }
				onChange={ ( val ) => updateObj( 'heading', val, 'tag' ) }
			/>
		</PanelBody> }

		{ /* The View Product button; some presets leave it out. */ }
		{ ! PRESET_HIDDEN[ attributes.preset ]?.includes( 'view' ) && <PanelBody className='bPlPanelBody' title={ __( 'View Product Button', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Text', 'b-blocks' ) }
				help={ __( 'Links to the product. Empty hides the button.', 'b-blocks' ) }
				value={ viewButton.text }
				onChange={ ( val ) => updateObj( 'viewButton', val, 'text' ) }
			/>
		</PanelBody> }

		{ /* The cart button's text per kind of product; empty keeps WooCommerce's own. */ }
		{ elements.cart && <PanelBody className='bPlPanelBody' title={ __( 'Cart Button', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Add to Cart Text', 'b-blocks' ) }
				help={ __( 'Products added straight to the cart.', 'b-blocks' ) }
				placeholder={ __( 'Add to cart', 'b-blocks' ) }
				value={ button.cartText?.add }
				onChange={ ( val ) => updateObj( 'button', val, 'cartText', 'add' ) }
			/>
			<TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Select Options Text', 'b-blocks' ) }
				help={ __( 'Products with variations.', 'b-blocks' ) }
				placeholder={ __( 'Select options', 'b-blocks' ) }
				value={ button.cartText?.options }
				onChange={ ( val ) => updateObj( 'button', val, 'cartText', 'options' ) }
			/>
			<TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Read More Text', 'b-blocks' ) }
				help={ __( 'Products that can’t be bought right now. Empty: WooCommerce’s text.', 'b-blocks' ) }
				placeholder={ __( 'Read more', 'b-blocks' ) }
				value={ button.cartText?.read }
				onChange={ ( val ) => updateObj( 'button', val, 'cartText', 'read' ) }
			/>
		</PanelBody> }

		<PanelBody className='bPlPanelBody' title={ __( 'Sale Badge', 'b-blocks' ) } initialOpen={ false }>
			{ /* Centred presets put the badge at the top middle of the oval image. */ }
			{ ! CENTERED_PRESETS.includes( attributes.preset ) && <Flex>
				<Label className='flex2'>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={ badge.align } onChange={ ( val ) => updateObj( 'badge', val || 'left', 'align' ) }>
					{ sideOptions.map( ( o ) => <ToggleGroupControlOption key={ o.value } label={ o.label } value={ o.value } /> ) }
				</ToggleGroupControl>
			</Flex> }

			<TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Sale Text', 'b-blocks' ) }
				help={ __( 'Shown on products that are on sale.', 'b-blocks' ) }
				value={ badge.text }
				onChange={ ( val ) => updateObj( 'badge', val, 'text' ) }
			/>
		</PanelBody>
	</>;
};

export default General;
