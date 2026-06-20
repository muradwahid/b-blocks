import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody, PanelRow, TextControl, ToggleControl,
	RangeControl, SelectControl
} from '@wordpress/components';

import { Label, ColorControl } from '../../../../../bpl-tools/Components';

import {
	triggerModeOptions, dropdownPositionOptions, shadowOptions,
	alignmentOptions, fontWeightOptions
} from '../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		triggerMode, dropdownPosition, showEmptyCart, emptyMessage,
		iconClass, iconSize, iconColor, iconHoverColor,
		showCount, badgeBG, badgeTextColor, badgeFontSize,
		showTotal, totalColor, totalFontSize,
		showItemList, showItemPrice, showSubtotal,
		showViewCartBtn, viewCartLabel, showCheckoutBtn, checkoutLabel,
		dropdownBG, dropdownWidth, dropdownBorderRadius, dropdownShadow,
		itemNameColor, itemPriceColor, subtotalLabelColor, subtotalValueColor,
		primaryBtnColor, primaryBtnBG, primaryBtnHovColor, primaryBtnHovBG,
		secondaryBtnColor, secondaryBtnBG, secondaryBtnHovColor, secondaryBtnHovBG,
		btnBorderRadius, btnFontSize, btnFontWeight,
		alignment
	} = attributes;

	const isDropdown = triggerMode === 'dropdown';

	return <InspectorControls>
		<PanelBody className='bPlPanelBody' title={ __( 'Behavior', 'b-blocks' ) }>
			<SelectControl
				label={ __( 'Trigger Mode', 'b-blocks' ) }
				value={ triggerMode }
				options={ triggerModeOptions }
				onChange={ ( val ) => setAttributes( { triggerMode: val } ) }
			/>
			{ isDropdown && (
				<SelectControl
					label={ __( 'Dropdown Position', 'b-blocks' ) }
					value={ dropdownPosition }
					options={ dropdownPositionOptions }
					onChange={ ( val ) => setAttributes( { dropdownPosition: val } ) }
				/>
			) }
			<ToggleControl
				className='mt20'
				label={ __( 'Show When Empty', 'b-blocks' ) }
				checked={ !! showEmptyCart }
				onChange={ ( val ) => setAttributes( { showEmptyCart: val } ) }
			/>
			{ showEmptyCart && (
				<TextControl
					label={ __( 'Empty Cart Message', 'b-blocks' ) }
					value={ emptyMessage }
					onChange={ ( val ) => setAttributes( { emptyMessage: val } ) }
					__nextHasNoMarginBottom
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Icon & Badge', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'Icon Class', 'b-blocks' ) }
				placeholder='fa-solid fa-cart-shopping'
				value={ iconClass }
				onChange={ ( val ) => setAttributes( { iconClass: val } ) }
				__nextHasNoMarginBottom
			/>
			<RangeControl
				label={ __( 'Icon Size (px)', 'b-blocks' ) }
				value={ iconSize }
				onChange={ ( val ) => setAttributes( { iconSize: val } ) }
				min={ 14 }
				max={ 48 }
				step={ 1 }
			/>
			<ColorControl
				label={ __( 'Icon Color:', 'b-blocks' ) }
				value={ iconColor }
				onChange={ ( val ) => setAttributes( { iconColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Icon Hover Color:', 'b-blocks' ) }
				value={ iconHoverColor }
				onChange={ ( val ) => setAttributes( { iconHoverColor: val } ) }
			/>
			<ToggleControl
				className='mt20'
				label={ __( 'Show Item Count Badge', 'b-blocks' ) }
				checked={ !! showCount }
				onChange={ ( val ) => setAttributes( { showCount: val } ) }
			/>
			{ showCount && <>
				<ColorControl
					label={ __( 'Badge Background:', 'b-blocks' ) }
					value={ badgeBG }
					onChange={ ( val ) => setAttributes( { badgeBG: val } ) }
				/>
				<ColorControl
					label={ __( 'Badge Text Color:', 'b-blocks' ) }
					value={ badgeTextColor }
					onChange={ ( val ) => setAttributes( { badgeTextColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Badge Font Size (px)', 'b-blocks' ) }
					value={ badgeFontSize }
					onChange={ ( val ) => setAttributes( { badgeFontSize: val } ) }
					min={ 8 }
					max={ 16 }
					step={ 1 }
				/>
			</> }
			<ToggleControl
				className='mt20'
				label={ __( 'Show Cart Total', 'b-blocks' ) }
				checked={ !! showTotal }
				onChange={ ( val ) => setAttributes( { showTotal: val } ) }
			/>
			{ showTotal && <>
				<ColorControl
					label={ __( 'Total Text Color:', 'b-blocks' ) }
					value={ totalColor }
					onChange={ ( val ) => setAttributes( { totalColor: val } ) }
				/>
				<RangeControl
					label={ __( 'Total Font Size (px)', 'b-blocks' ) }
					value={ totalFontSize }
					onChange={ ( val ) => setAttributes( { totalFontSize: val } ) }
					min={ 10 }
					max={ 24 }
					step={ 1 }
				/>
			</> }
		</PanelBody>

		{ isDropdown && (
			<PanelBody className='bPlPanelBody' title={ __( 'Dropdown Content', 'b-blocks' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Item List', 'b-blocks' ) }
					checked={ !! showItemList }
					onChange={ ( val ) => setAttributes( { showItemList: val } ) }
				/>
				{ showItemList && (
					<ToggleControl
						label={ __( 'Show Item Price', 'b-blocks' ) }
						checked={ !! showItemPrice }
						onChange={ ( val ) => setAttributes( { showItemPrice: val } ) }
					/>
				) }
				<ToggleControl
					label={ __( 'Show Subtotal', 'b-blocks' ) }
					checked={ !! showSubtotal }
					onChange={ ( val ) => setAttributes( { showSubtotal: val } ) }
				/>
				<ToggleControl
					label={ __( 'Show "View Cart" Button', 'b-blocks' ) }
					checked={ !! showViewCartBtn }
					onChange={ ( val ) => setAttributes( { showViewCartBtn: val } ) }
				/>
				{ showViewCartBtn && (
					<TextControl
						label={ __( 'View Cart Label', 'b-blocks' ) }
						value={ viewCartLabel }
						onChange={ ( val ) => setAttributes( { viewCartLabel: val } ) }
						__nextHasNoMarginBottom
					/>
				) }
				<ToggleControl
					label={ __( 'Show "Checkout" Button', 'b-blocks' ) }
					checked={ !! showCheckoutBtn }
					onChange={ ( val ) => setAttributes( { showCheckoutBtn: val } ) }
				/>
				{ showCheckoutBtn && (
					<TextControl
						label={ __( 'Checkout Label', 'b-blocks' ) }
						value={ checkoutLabel }
						onChange={ ( val ) => setAttributes( { checkoutLabel: val } ) }
						__nextHasNoMarginBottom
					/>
				) }
				<RangeControl
					label={ __( 'Dropdown Width (px)', 'b-blocks' ) }
					value={ dropdownWidth }
					onChange={ ( val ) => setAttributes( { dropdownWidth: val } ) }
					min={ 240 }
					max={ 480 }
					step={ 8 }
				/>
				<RangeControl
					label={ __( 'Dropdown Border Radius (px)', 'b-blocks' ) }
					value={ dropdownBorderRadius }
					onChange={ ( val ) => setAttributes( { dropdownBorderRadius: val } ) }
					min={ 0 }
					max={ 24 }
					step={ 1 }
				/>
				<SelectControl
					label={ __( 'Dropdown Shadow', 'b-blocks' ) }
					value={ dropdownShadow }
					options={ shadowOptions }
					onChange={ ( val ) => setAttributes( { dropdownShadow: val } ) }
				/>
			</PanelBody>
		) }

		<PanelBody className='bPlPanelBody' title={ __( 'Colors', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Dropdown Background:', 'b-blocks' ) }
				value={ dropdownBG }
				onChange={ ( val ) => setAttributes( { dropdownBG: val } ) }
			/>
			<ColorControl
				label={ __( 'Item Name Color:', 'b-blocks' ) }
				value={ itemNameColor }
				onChange={ ( val ) => setAttributes( { itemNameColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Item Price Color:', 'b-blocks' ) }
				value={ itemPriceColor }
				onChange={ ( val ) => setAttributes( { itemPriceColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Subtotal Label Color:', 'b-blocks' ) }
				value={ subtotalLabelColor }
				onChange={ ( val ) => setAttributes( { subtotalLabelColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Subtotal Value Color:', 'b-blocks' ) }
				value={ subtotalValueColor }
				onChange={ ( val ) => setAttributes( { subtotalValueColor: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Buttons', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Button Border Radius (px)', 'b-blocks' ) }
				value={ btnBorderRadius }
				onChange={ ( val ) => setAttributes( { btnBorderRadius: val } ) }
				min={ 0 }
				max={ 50 }
				step={ 1 }
			/>
			<RangeControl
				label={ __( 'Button Font Size (px)', 'b-blocks' ) }
				value={ btnFontSize }
				onChange={ ( val ) => setAttributes( { btnFontSize: val } ) }
				min={ 11 }
				max={ 20 }
				step={ 1 }
			/>
			<PanelRow>
				<Label className=''>{ __( 'Button Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ btnFontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { btnFontWeight: parseInt( val, 10 ) || 600 } ) }
				/>
			</PanelRow>
			<ColorControl
				label={ __( 'Checkout Text Color:', 'b-blocks' ) }
				value={ primaryBtnColor }
				onChange={ ( val ) => setAttributes( { primaryBtnColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Checkout Background:', 'b-blocks' ) }
				value={ primaryBtnBG }
				onChange={ ( val ) => setAttributes( { primaryBtnBG: val } ) }
			/>
			<ColorControl
				label={ __( 'Checkout Hover Text Color:', 'b-blocks' ) }
				value={ primaryBtnHovColor }
				onChange={ ( val ) => setAttributes( { primaryBtnHovColor: val } ) }
			/>
			<ColorControl
				label={ __( 'Checkout Hover Background:', 'b-blocks' ) }
				value={ primaryBtnHovBG }
				onChange={ ( val ) => setAttributes( { primaryBtnHovBG: val } ) }
			/>
			<ColorControl
				label={ __( 'View Cart Text Color:', 'b-blocks' ) }
				value={ secondaryBtnColor }
				onChange={ ( val ) => setAttributes( { secondaryBtnColor: val } ) }
			/>
			<ColorControl
				label={ __( 'View Cart Background:', 'b-blocks' ) }
				value={ secondaryBtnBG }
				onChange={ ( val ) => setAttributes( { secondaryBtnBG: val } ) }
			/>
			<ColorControl
				label={ __( 'View Cart Hover Text Color:', 'b-blocks' ) }
				value={ secondaryBtnHovColor }
				onChange={ ( val ) => setAttributes( { secondaryBtnHovColor: val } ) }
			/>
			<ColorControl
				label={ __( 'View Cart Hover Background:', 'b-blocks' ) }
				value={ secondaryBtnHovBG }
				onChange={ ( val ) => setAttributes( { secondaryBtnHovBG: val } ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
