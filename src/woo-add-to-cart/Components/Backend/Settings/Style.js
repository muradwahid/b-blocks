import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	BorderBoxControl, BorderControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl
} from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../bpl-tools/Components';

import { UNITS } from '../../../utils/data';

const DeviceLabel = ( { label } ) => <Flex className='mb5'><span className='bPlLabel'>{ label }</span><Device /></Flex>;

const Length = ( { label, value, onChange, className = 'mt10', responsive = false } ) => <div className={ className }>
	{ responsive && <DeviceLabel label={ label } /> }
	<UnitControl
		__next40pxDefaultSize
		label={ label }
		hideLabelFromVision={ responsive }
		labelPosition='edge'
		units={ UNITS }
		value={ value || '' }
		onChange={ ( val ) => onChange( val || '' ) }
	/>
</div>;

const Box = ( { label, ...props } ) => <div className='mt10'>
	<DeviceLabel label={ label } />
	<BoxControl { ...props } />
</div>;

const CLEAR = '__clear__';
const Color = ( { value, defaultColor, onChange, ...props } ) => <ColorControl
	{ ...props }
	value={ value }
	defaultColor={ defaultColor || ( value ? CLEAR : undefined ) }
	onChange={ ( val ) => onChange( CLEAR === val ? '' : val ) }
/>;

/** One border — width, style and colour — for an element. */
const Border = ( { label, value, onChange } ) => <BorderControl
	className='mt10'
	__next40pxDefaultSize
	withSlider
	label={ label }
	value={ value }
	onChange={ ( val ) => onChange( val || {} ) }
/>;

const States = ( { name, children } ) => {
	const [ state, setState ] = useState( 'normal' );
	const isHover = 'hover' === state;

	return <>
		<ToggleGroupControl className='mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock label={ name } hideLabelFromVision value={ state } onChange={ ( val ) => setState( val || 'normal' ) }>
			<ToggleGroupControlOption label={ __( 'Normal', 'b-blocks' ) } value='normal' />
			<ToggleGroupControlOption label={ __( 'Hover', 'b-blocks' ) } value='hover' />
		</ToggleGroupControl>
		{ children( isHover ? [ 'hover' ] : [], isHover ) }
	</>;
};

/** The node at `path` under `node`, or {}. */
const at = ( node, path ) => path.reduce( ( n, key ) => n?.[ key ] || {}, node || {} );

const Style = ( { attributes, updateObj, device = 'desktop', previewType: type = 'simple' } ) => {
	const {
		layout = {}, options = {}, button = {}, quantity = {}, stepper = {}, variations = {}, grouped = {}, messages = {}, viewCart = {}
	} = attributes;

	const isExternal = 'external' === type;

	// Editing modes, not attributes: nothing on the frontend reads them. An
	// external product's button is never "Added", so that state falls back.
	const [ picked, setState ] = useState( 'normal' );
	const state = isExternal && 'added' === picked ? 'normal' : picked;
	const current = button[ state ] || {};
	const [ stepperState, setStepperState ] = useState( 'normal' );
	const stepperNode = 'hover' === stepperState ? ( stepper.hover || {} ) : stepper;
	const stepperPath = 'hover' === stepperState ? [ 'hover' ] : [];

	// With Show Quantity off, even a grouped product's quantities are hidden.
	const hasQuantity = 'external' !== type && !! options.showQuantity;

	return <>
		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
			<Length
				className=''
				label={ __( 'Gap', 'b-blocks' ) } responsive
				value={ layout[ device ]?.gap }
				onChange={ ( val ) => updateObj( 'layout', val, device, 'gap' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Button', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography', 'b-blocks' ) }
				value={ button.typo }
				onChange={ ( val ) => updateObj( 'button', val, 'typo' ) }
			/>

			<Box
				label={ __( 'Padding', 'b-blocks' ) }
				values={ button[ device ]?.padding }
				onChange={ ( val ) => updateObj( 'button', val, device, 'padding' ) }
			/>

			<Box
				label={ __( 'Border Radius', 'b-blocks' ) }
				values={ button[ device ]?.radius }
				onChange={ ( val ) => updateObj( 'button', val, device, 'radius' ) }
			/>

			<Length
				label={ __( 'Width', 'b-blocks' ) } responsive
				value={ button[ device ]?.width }
				onChange={ ( val ) => updateObj( 'button', val, device, 'width' ) }
			/>

			{ button.icon?.svg && <>
				<Length label={ __( 'Icon Size', 'b-blocks' ) } value={ button.icon?.size } onChange={ ( val ) => updateObj( 'button', val, 'icon', 'size' ) } />
				<Length label={ __( 'Icon Gap', 'b-blocks' ) } value={ button.icon?.gap } onChange={ ( val ) => updateObj( 'button', val, 'icon', 'gap' ) } />
				{ /* Hover: while the button is hovered. Left empty, the icon takes the button's text colour. */ }
				<States name={ __( 'Icon state', 'b-blocks' ) }>
					{ ( path ) => <Color
						label={ __( 'Icon Color:', 'b-blocks' ) }
						value={ at( button.icon, path ).color?.text }
						onChange={ ( val ) => updateObj( 'button', val, 'icon', ...path, 'color', 'text' ) }
					/> }
				</States>
			</> }

			<ToggleGroupControl className='mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock label={ __( 'Button state', 'b-blocks' ) } hideLabelFromVision value={ state } onChange={ ( val ) => setState( val || 'normal' ) }>
				<ToggleGroupControlOption label={ __( 'Normal', 'b-blocks' ) } value='normal' />
				<ToggleGroupControlOption label={ __( 'Hover', 'b-blocks' ) } value='hover' />
				{ ! isExternal && <ToggleGroupControlOption label={ __( 'Added', 'b-blocks' ) } value='added' /> }
			</ToggleGroupControl>

			{ 'added' === state && <p className='b-blocks-woo-add-to-cart-control-note'>{ __( 'For a moment after adding. Left empty, the hover colours are used.', 'b-blocks' ) }</p> }

			<Color
				label={ __( 'Text Color:', 'b-blocks' ) }
				value={ current.color?.text }
				defaultColor={ 'added' === state ? '' : '#ffffff' }
				onChange={ ( val ) => updateObj( 'button', val, state, 'color', 'text' ) }
			/>
			<Background
				label={ __( 'Background:', 'b-blocks' ) }
				value={ current.bg }
				defaults={ { color: { normal: '#146EF5', hover: '#070127', added: '' }[ state ] } }
				onChange={ ( val ) => updateObj( 'button', val, state, 'bg' ) }
			/>
			{ 'added' !== state && <BorderBoxControl
				className='mt10'
				__next40pxDefaultSize
				label={ __( 'Border', 'b-blocks' ) }
				value={ current.border }
				onChange={ ( val ) => updateObj( 'button', val, state, 'border' ) }
			/> }

			{ 'normal' === state && <ShadowControl
				className='mt10'
				label={ __( 'Box Shadow', 'b-blocks' ) }
				value={ button.shadow || [] }
				onChange={ ( val ) => updateObj( 'button', val, 'shadow' ) }
			/> }
		</PanelBody>

		{ hasQuantity && <PanelBody className='bPlPanelBody' title={ __( 'Quantity', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography', 'b-blocks' ) }
				value={ quantity.typo }
				onChange={ ( val ) => updateObj( 'quantity', val, 'typo' ) }
			/>
			<Length label={ __( 'Input Width', 'b-blocks' ) } responsive value={ quantity[ device ]?.width } onChange={ ( val ) => updateObj( 'quantity', val, device, 'width' ) } />
			<Length label={ __( 'Height', 'b-blocks' ) } responsive value={ quantity[ device ]?.height } onChange={ ( val ) => updateObj( 'quantity', val, device, 'height' ) } />
			<Box
				label={ __( 'Border Radius', 'b-blocks' ) }
				values={ quantity[ device ]?.radius }
				onChange={ ( val ) => updateObj( 'quantity', val, device, 'radius' ) }
			/>
			<States name={ __( 'Quantity input state', 'b-blocks' ) }>
				{ ( path ) => <>
					<Color label={ __( 'Text Color:', 'b-blocks' ) } value={ at( quantity, path ).color?.text } onChange={ ( val ) => updateObj( 'quantity', val, ...path, 'color', 'text' ) } />
					<Background label={ __( 'Input Background:', 'b-blocks' ) } value={ at( quantity, path ).bg } onChange={ ( val ) => updateObj( 'quantity', val, ...path, 'bg' ) } />
					<Border label={ __( 'Border', 'b-blocks' ) } value={ at( quantity, path ).border } onChange={ ( val ) => updateObj( 'quantity', val, ...path, 'border' ) } />
				</> }
			</States>
			{ /* The − and + buttons: the Stepper's only, not the plain Input's. */ }
			{ 'simple' === type && 'input' !== options.quantityStyle && <>
				<Length
					label={ __( 'Stepper Button Width', 'b-blocks' ) } responsive
					value={ stepper[ device ]?.width }
					onChange={ ( val ) => updateObj( 'stepper', val, device, 'width' ) }
				/>
				<ToggleGroupControl className='mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock label={ __( 'Stepper state', 'b-blocks' ) } hideLabelFromVision value={ stepperState } onChange={ ( val ) => setStepperState( val || 'normal' ) }>
					<ToggleGroupControlOption label={ __( 'Normal', 'b-blocks' ) } value='normal' />
					<ToggleGroupControlOption label={ __( 'Hover', 'b-blocks' ) } value='hover' />
				</ToggleGroupControl>
				<Color
					label={ __( 'Stepper Text Color:', 'b-blocks' ) }
					value={ stepperNode.color?.text }
					defaultColor={ 'hover' === stepperState ? '' : '#333333' }
					onChange={ ( val ) => updateObj( 'stepper', val, ...stepperPath, 'color', 'text' ) }
				/>
				<Background
					label={ __( 'Stepper Background:', 'b-blocks' ) }
					value={ stepperNode.bg }
					defaults={ { color: 'hover' === stepperState ? '' : '#f0f0f0' } }
					onChange={ ( val ) => updateObj( 'stepper', val, ...stepperPath, 'bg' ) }
				/>
			</> }
		</PanelBody> }

		{ 'variable' === type && <>
			<PanelBody className='bPlPanelBody' title={ __( 'Variation Table', 'b-blocks' ) } initialOpen={ false }>
				<Length
					className=''
					label={ __( 'Row Spacing', 'b-blocks' ) } responsive
					value={ variations.table?.[ device ]?.rowGap }
					onChange={ ( val ) => updateObj( 'variations', val, 'table', device, 'rowGap' ) }
				/>
				<Length
					label={ __( 'Label Column Width', 'b-blocks' ) } responsive
					value={ variations.table?.[ device ]?.labelWidth }
					onChange={ ( val ) => updateObj( 'variations', val, 'table', device, 'labelWidth' ) }
				/>
				<Length
					label={ __( 'Bottom Spacing', 'b-blocks' ) } responsive
					value={ variations.table?.[ device ]?.bottomGap }
					onChange={ ( val ) => updateObj( 'variations', val, 'table', device, 'bottomGap' ) }
				/>
				<Typography
					className='mt10'
					label={ __( 'Label Typography', 'b-blocks' ) }
					value={ variations.label?.typo }
					onChange={ ( val ) => updateObj( 'variations', val, 'label', 'typo' ) }
				/>
				<States name={ __( 'Label state', 'b-blocks' ) }>
					{ ( path ) => <Color label={ __( 'Label Color:', 'b-blocks' ) } value={ at( variations.label, path ).color?.text } onChange={ ( val ) => updateObj( 'variations', val, 'label', ...path, 'color', 'text' ) } /> }
				</States>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Variation Select', 'b-blocks' ) } initialOpen={ false }>
				<Typography
					label={ __( 'Typography', 'b-blocks' ) }
					value={ variations.select?.typo }
					onChange={ ( val ) => updateObj( 'variations', val, 'select', 'typo' ) }
				/>
				<States name={ __( 'Select state', 'b-blocks' ) }>
					{ ( path ) => <>
						<Color label={ __( 'Text Color:', 'b-blocks' ) } value={ at( variations.select, path ).color?.text } onChange={ ( val ) => updateObj( 'variations', val, 'select', ...path, 'color', 'text' ) } />
						<Background label={ __( 'Background:', 'b-blocks' ) } value={ at( variations.select, path ).bg } onChange={ ( val ) => updateObj( 'variations', val, 'select', ...path, 'bg' ) } />
						<Border label={ __( 'Border', 'b-blocks' ) } value={ at( variations.select, path ).border } onChange={ ( val ) => updateObj( 'variations', val, 'select', ...path, 'border' ) } />
					</> }
				</States>
				<Box
					label={ __( 'Border Radius', 'b-blocks' ) }
					values={ variations.select?.[ device ]?.radius }
					onChange={ ( val ) => updateObj( 'variations', val, 'select', device, 'radius' ) }
				/>
				<Box
					label={ __( 'Padding', 'b-blocks' ) }
					values={ variations.select?.[ device ]?.padding }
					onChange={ ( val ) => updateObj( 'variations', val, 'select', device, 'padding' ) }
				/>
				<Length
					label={ __( 'Width', 'b-blocks' ) } responsive
					value={ variations.select?.[ device ]?.width }
					onChange={ ( val ) => updateObj( 'variations', val, 'select', device, 'width' ) }
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Clear Link', 'b-blocks' ) } initialOpen={ false }>
				<Typography
					label={ __( 'Typography', 'b-blocks' ) }
					value={ variations.clear?.typo }
					onChange={ ( val ) => updateObj( 'variations', val, 'clear', 'typo' ) }
				/>
				<States name={ __( 'Clear link state', 'b-blocks' ) }>
					{ ( path ) => <Color label={ __( 'Color:', 'b-blocks' ) } value={ at( variations.clear, path ).color?.text } onChange={ ( val ) => updateObj( 'variations', val, 'clear', ...path, 'color', 'text' ) } /> }
				</States>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Variation Price', 'b-blocks' ) } initialOpen={ false }>
				<Typography
					label={ __( 'Typography', 'b-blocks' ) }
					value={ variations.price?.typo }
					onChange={ ( val ) => updateObj( 'variations', val, 'price', 'typo' ) }
				/>
				<Color label={ __( 'Color:', 'b-blocks' ) } value={ variations.price?.color?.text } onChange={ ( val ) => updateObj( 'variations', val, 'price', 'color', 'text' ) } />
			</PanelBody>
		</> }

		{ 'grouped' === type && <PanelBody className='bPlPanelBody' title={ __( 'Grouped Table', 'b-blocks' ) } initialOpen={ false }>
			<Length className='' label={ __( 'Row Spacing', 'b-blocks' ) } responsive value={ grouped.table?.[ device ]?.rowGap } onChange={ ( val ) => updateObj( 'grouped', val, 'table', device, 'rowGap' ) } />
			<Border label={ __( 'Row Border', 'b-blocks' ) } value={ grouped.table?.border } onChange={ ( val ) => updateObj( 'grouped', val, 'table', 'border' ) } />
			<Background label={ __( 'Row Background:', 'b-blocks' ) } value={ grouped.table?.bg } onChange={ ( val ) => updateObj( 'grouped', val, 'table', 'bg' ) } />
			<Box
				label={ __( 'Cell Padding', 'b-blocks' ) }
				values={ grouped.table?.[ device ]?.padding }
				onChange={ ( val ) => updateObj( 'grouped', val, 'table', device, 'padding' ) }
			/>
			<Typography
				className='mt10'
				label={ __( 'Name Typography', 'b-blocks' ) }
				value={ grouped.name?.typo }
				onChange={ ( val ) => updateObj( 'grouped', val, 'name', 'typo' ) }
			/>
			<States name={ __( 'Product name state', 'b-blocks' ) }>
				{ ( path ) => <Color label={ __( 'Name Color:', 'b-blocks' ) } value={ at( grouped.name, path ).color?.text } onChange={ ( val ) => updateObj( 'grouped', val, 'name', ...path, 'color', 'text' ) } /> }
			</States>
			<Typography
				className='mt10'
				label={ __( 'Price Typography', 'b-blocks' ) }
				value={ grouped.price?.typo }
				onChange={ ( val ) => updateObj( 'grouped', val, 'price', 'typo' ) }
			/>
			<Color label={ __( 'Price Color:', 'b-blocks' ) } value={ grouped.price?.color?.text } onChange={ ( val ) => updateObj( 'grouped', val, 'price', 'color', 'text' ) } />
		</PanelBody> }

		<PanelBody className='bPlPanelBody' title={ __( 'Messages', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography', 'b-blocks' ) }
				value={ messages.typo }
				onChange={ ( val ) => updateObj( 'messages', val, 'typo' ) }
			/>
			<Color label={ __( 'Text Color:', 'b-blocks' ) } value={ messages.color?.text } onChange={ ( val ) => updateObj( 'messages', val, 'color', 'text' ) } />
			<Color label={ __( 'In Stock Color:', 'b-blocks' ) } value={ messages.color?.inStock } onChange={ ( val ) => updateObj( 'messages', val, 'color', 'inStock' ) } />
			<Color label={ __( 'Out of Stock Color:', 'b-blocks' ) } value={ messages.color?.outOfStock } onChange={ ( val ) => updateObj( 'messages', val, 'color', 'outOfStock' ) } />
		</PanelBody>

		{ options.viewCart && ! options.redirectToCart && ! isExternal && <PanelBody className='bPlPanelBody' title={ __( 'View Cart Link', 'b-blocks' ) } initialOpen={ false }>
			<Typography
				label={ __( 'Typography', 'b-blocks' ) }
				value={ viewCart.typo }
				onChange={ ( val ) => updateObj( 'viewCart', val, 'typo' ) }
			/>
			<States name={ __( 'View Cart link state', 'b-blocks' ) }>
				{ ( path ) => <Color label={ __( 'Color:', 'b-blocks' ) } value={ at( viewCart, path ).color?.text } onChange={ ( val ) => updateObj( 'viewCart', val, ...path, 'color', 'text' ) } /> }
			</States>
		</PanelBody> }
	</>;
};

export default Style;
