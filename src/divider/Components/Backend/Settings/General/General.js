import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { HelpPanel, IconLibrary } from '../../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../../utils/data';
import { ALIGN_OPTIONS, TYPE_OPTIONS, UNITS } from '../../../../utils/options';

const General = ( { attributes, updateObj } ) => {
	const { type = 'line', layout = {}, icon = {}, text = {} } = attributes;

	const isIcon = type === 'icon';
	const isText = type === 'text';

	return <>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Layout', 'b-blocks' ) } initialOpen={ true }>
			<SelectControl
				label={ __( 'Type', 'b-blocks' ) }
				labelPosition='edge'
				value={ type || 'line' }
				options={ TYPE_OPTIONS }
				onChange={ ( val ) => updateObj( 'type', val ) }
				help={ __( 'Icon and Text place a centered element between two line segments.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>

			<SelectControl
				label={ __( 'Alignment', 'b-blocks' ) }
				labelPosition='edge'
				className='mt10'
				value={ layout.alignment || 'center' }
				options={ ALIGN_OPTIONS }
				onChange={ ( val ) => updateObj( 'layout', val, 'alignment' ) }
				help={ __( 'Only visible when Width is less than 100%.', 'b-blocks' ) }
				__nextHasNoMarginBottom
			/>

			<UnitControl
				label={ __( 'Divider Width', 'b-blocks' ) }
				labelPosition='edge'
				units={ UNITS }
				isUnitSelectTabbable
				value={ layout.width || '100%' }
				onChange={ ( val ) => updateObj( 'layout', val, 'width' ) }
			/>
		</PanelBody>

		{ isIcon && (
			<PanelBody className='bPlPanelBody' title={ __( 'Icon', 'b-blocks' ) } initialOpen={ false }>
				<IconLibrary label={ __( 'Icon', 'b-blocks' ) } value={ icon.svg } onChange={ ( val ) => updateObj( 'icon', val, 'svg' ) } />
			</PanelBody>
		) }

		{ isText && (
			<PanelBody className='bPlPanelBody' title={ __( 'Text Label', 'b-blocks' ) } initialOpen={ false }>
				<TextControl
					label={ __( 'Label Text', 'b-blocks' ) }
					value={ text.content || '' }
					onChange={ ( val ) => updateObj( 'text', ( val || '' ).slice( 0, 40 ), 'content' ) }
					placeholder={ __( 'OR', 'b-blocks' ) }
					help={ __( 'Short text shown centered on the line (max 40 chars). Also editable inline in the canvas.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		) }
	</>;
};
export default General;
