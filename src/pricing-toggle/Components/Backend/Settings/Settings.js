import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { defaultPeriodOptions, fontWeightOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		monthlyLabel, annualLabel, defaultPeriod, showBadge, badgeText,
		badgeBg, badgeText_color, badgeBorderRadius,
		toggleBg, toggleActiveBg, knobColor, labelColor, activeLabelColor,
		fontSize, fontWeight, gap
	} = attributes;

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) }>
			<TextControl
				label={ __( 'Monthly Label', 'b-blocks' ) }
				value={ monthlyLabel }
				onChange={ ( val ) => setAttributes( { monthlyLabel: val } ) }
				placeholder={ __( 'Monthly', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Annual Label', 'b-blocks' ) }
				value={ annualLabel }
				onChange={ ( val ) => setAttributes( { annualLabel: val } ) }
				placeholder={ __( 'Annually', 'b-blocks' ) }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Default Period:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ defaultPeriod }
					options={ defaultPeriodOptions }
					onChange={ ( val ) => setAttributes( { defaultPeriod: val } ) }
				/>
			</PanelRow>

			<ToggleControl
				label={ __( 'Show Savings Badge', 'b-blocks' ) }
				checked={ !! showBadge }
				onChange={ ( val ) => setAttributes( { showBadge: val } ) }
			/>

			{ showBadge && (
				<TextControl
					label={ __( 'Badge Text', 'b-blocks' ) }
					value={ badgeText }
					onChange={ ( val ) => setAttributes( { badgeText: val } ) }
					placeholder={ __( 'Save 20%', 'b-blocks' ) }
				/>
			) }

			<p style={ { fontSize: '12px', color: '#666', marginBottom: 0 } }>
				{ __( 'Mark your price elements with data-bb-pt-monthly and data-bb-pt-annual attributes so they swap when the toggle is clicked.', 'b-blocks' ) }
			</p>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Track Color (Inactive):', 'b-blocks' ) }
				value={ toggleBg }
				onChange={ ( val ) => setAttributes( { toggleBg: val } ) }
				defaultColor='#e2e8f0'
			/>

			<ColorControl
				label={ __( 'Track Color (Active):', 'b-blocks' ) }
				value={ toggleActiveBg }
				onChange={ ( val ) => setAttributes( { toggleActiveBg: val } ) }
				defaultColor='#2563eb'
			/>

			<ColorControl
				label={ __( 'Knob Color:', 'b-blocks' ) }
				value={ knobColor }
				onChange={ ( val ) => setAttributes( { knobColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Label Color:', 'b-blocks' ) }
				value={ labelColor }
				onChange={ ( val ) => setAttributes( { labelColor: val } ) }
				defaultColor=''
			/>

			<ColorControl
				label={ __( 'Active Label Color:', 'b-blocks' ) }
				value={ activeLabelColor }
				onChange={ ( val ) => setAttributes( { activeLabelColor: val } ) }
				defaultColor='#2563eb'
			/>

			{ showBadge && <>
				<ColorControl
					label={ __( 'Badge Background:', 'b-blocks' ) }
					value={ badgeBg }
					onChange={ ( val ) => setAttributes( { badgeBg: val } ) }
					defaultColor='#16a34a'
				/>

				<ColorControl
					label={ __( 'Badge Text Color:', 'b-blocks' ) }
					value={ badgeText_color }
					onChange={ ( val ) => setAttributes( { badgeText_color: val } ) }
					defaultColor='#ffffff'
				/>

				<RangeControl
					label={ __( 'Badge Border Radius (px)', 'b-blocks' ) }
					value={ badgeBorderRadius }
					onChange={ ( val ) => setAttributes( { badgeBorderRadius: val } ) }
					min={ 0 }
					max={ 50 }
					step={ 1 }
				/>
			</> }

			<RangeControl
				label={ __( 'Font Size (px)', 'b-blocks' ) }
				value={ fontSize }
				onChange={ ( val ) => setAttributes( { fontSize: val } ) }
				min={ 10 }
				max={ 32 }
				step={ 1 }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Font Weight:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ fontWeight }
					options={ fontWeightOptions }
					onChange={ ( val ) => setAttributes( { fontWeight: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Gap Between Label & Knob (px)', 'b-blocks' ) }
				value={ gap }
				onChange={ ( val ) => setAttributes( { gap: val } ) }
				min={ 4 }
				max={ 64 }
				step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
