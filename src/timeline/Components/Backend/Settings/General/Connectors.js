import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { Device } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { dashLineStyles, lineExtentOptions, lineStyleOptions } from '../../../../utils/options';


const Connectors = ( { attributes, device, updateObj } ) => {
	const { layout, connector } = attributes;
	const { line, arrow } = connector;

	const isHorizontal = 'horizontal' === ( (
		'desktop' === device
			? layout.desktop.direction
			: 'tablet' === device
				? layout.tablet.direction || layout.desktop.direction
				: layout.mobile.direction || layout.tablet.direction || layout.desktop.direction
	) || 'vertical' );

	const isDashLine = dashLineStyles.includes( line.style );

	const arrowAlignOptions = [
		{ label: isHorizontal ? __( 'Left', 'b-blocks' ) : __( 'Top', 'b-blocks' ), value: 'start' },
		{ label: __( 'Center', 'b-blocks' ), value: 'center' },
		{ label: isHorizontal ? __( 'Right', 'b-blocks' ) : __( 'Bottom', 'b-blocks' ), value: 'end' }
	];

	return <PanelBody className='bPlPanelBody' initialOpen={ false } title={ __( 'Connectors', 'b-blocks' ) }>
		<ToggleControl
			label={ __( 'Show Line', 'b-blocks' ) }
			checked={ !! line.show }
			onChange={ ( value ) => updateObj( 'connector', value, 'line', 'show' ) }
			__nextHasNoMarginBottom
		/>

		{ line.show && <>
			<SelectControl
				className='mt10'
				labelPosition='edge'
				label={ __( 'Line Style', 'b-blocks' ) }
				value={ line.style }
				options={ lineStyleOptions }
				onChange={ ( value ) => updateObj( 'connector', value, 'line', 'style' ) }
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>

			<SelectControl
				className='mt10'
				label={__('Line Length', 'b-blocks')}
				labelPosition='edge'
				help={ __( 'Between markers stops the line at the first and last marker; full length runs it edge to edge.', 'b-blocks' ) }
				value={ line.extent }
				options={ lineExtentOptions }
				onChange={ ( value ) => updateObj( 'connector', value, 'line', 'extent' ) }
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>

			<UnitControl
				label={ <Flex>{ __( 'Line Thickness', 'b-blocks' ) } <Device /></Flex> }
				labelPosition='edge'
				className='mt10'
				units={ [ pxUnit(), emUnit() ] }
				isUnitSelectTabbable
				value={ line[ device ].width }
				onChange={ ( value ) => updateObj( 'connector', value, 'line', device, 'width' ) }
			/>

			{ isDashLine && <>
				{ 'dashed' === line.style && <UnitControl label={ <Flex>{ __( 'Dash Length', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable value={ line[ device ].dash } onChange={ ( value ) => updateObj( 'connector', value, 'line', device, 'dash' ) } /> }

				<UnitControl label={ <Flex>{ __( 'Gap', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable help={ 'dotted' === line.style ? __( 'Space between dots. The dot size follows the line thickness.', 'b-blocks' ) : __( 'Space between dashes.', 'b-blocks' ) } value={ line[ device ].gap } onChange={ ( value ) => updateObj( 'connector', value, 'line', device, 'gap' ) } />
			</> }


			<ToggleControl
				className='mt20'
				label={ __( 'Progress', 'b-blocks' ) }
				help={ __( 'Fills the line as the reader scrolls down it. Works with any line style — the fill follows the same shape.', 'b-blocks' ) }
				checked={ !! line.progress }
				onChange={ ( value ) => updateObj( 'connector', value, 'line', 'progress' ) }
				__nextHasNoMarginBottom
			/>

			{ line.progress && <ToggleControl
				className='mt10'
				label={ __( 'Fade Trailing End', 'b-blocks' ) }
				help={ __( 'Dissolves the far end of the fill into the track, so it reads as a beam following the reader rather than a filled bar.', 'b-blocks' ) }
				checked={ !! line.progressFade }
				onChange={ ( value ) => updateObj( 'connector', value, 'line', 'progressFade' ) }
				__nextHasNoMarginBottom
			/> }

		</> }

		<ToggleControl
			className='mt20'
			label={ __( 'Show Arrow', 'b-blocks' ) }
			help={ __( 'The small arrow that points from a card back to the line.', 'b-blocks' ) }
			checked={ !! arrow.show }
			onChange={ ( value ) => updateObj( 'connector', value, 'arrow', 'show' ) }
			__nextHasNoMarginBottom
		/>
		<br />
		{ arrow.show && <>
			<ToggleGroupControl
				label={ __( 'Arrow Alignment', 'b-blocks' ) }
				value={ arrow.align }
				onChange={ ( value ) => updateObj( 'connector', value, 'arrow', 'align' ) }
				isBlock
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			>
				{ arrowAlignOptions.map( ( option ) => (
					<ToggleGroupControlOption key={ option.value } label={ option.label } value={ option.value } />
				) ) }
			</ToggleGroupControl>

			<UnitControl label={ <Flex>{ __( 'Arrow Size', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ pxUnit(), emUnit() ] } isUnitSelectTabbable value={ arrow[ device ].size } onChange={ ( value ) => updateObj( 'connector', value, 'arrow', device, 'size' ) } />

			{ 'center' !== arrow.align && <UnitControl label={ <Flex>{ __( 'Arrow Offset', 'b-blocks' ) } <Device /></Flex> } labelPosition='edge' className='mt10' units={ [ pxUnit(), emUnit(), perUnit() ] } isUnitSelectTabbable help={ __( 'Distance from the edge the arrow is aligned to.', 'b-blocks' ) } value={ arrow[ device ].offset } onChange={ ( value ) => updateObj( 'connector', value, 'arrow', device, 'offset' ) } /> }
		</> }
	</PanelBody>;
};

export default withSelect( ( select ) => {
	const { getDeviceType } = select( 'core/editor' );

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
} )( Connectors );
