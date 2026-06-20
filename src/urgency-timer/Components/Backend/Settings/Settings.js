import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, TextControl, ToggleControl, RangeControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { timerModeOptions, resetDayOptions, expiredActionOptions, boxLayoutOptions, alignmentOptions } from '../../../utils/data';

const Settings = ( { attributes, setAttributes } ) => {
	const {
		timerMode,
		evergreenDays, evergreenHours, evergreenMinutes, evergreenSeconds,
		recurringResetDay, recurringResetHour,
		recurringDays, recurringHours, recurringMinutes, recurringSeconds,
		storageKey,
		showDays, showHours, showMinutes, showSeconds,
		daysLabel, hoursLabel, minutesLabel, secondsLabel,
		expiredAction, expiredMessage,
		prefixText, suffixText, alignment, maxWidth,
		boxLayout, boxWidth, boxHeight, boxGap, boxRadius,
		digitBg, digitColor, labelColor, separatorVisible, separatorColor,
		digitSize, labelSize, prefixSize, prefixColor, suffixSize, suffixColor,
		expiredSize, expiredColor,
		paddingV, paddingH, blockBg
	} = attributes;

	const setNum = ( key, min, max ) => ( val ) => {
		const n = parseInt( val, 10 );
		setAttributes( { [ key ]: isNaN( n ) ? min : Math.max( min, Math.min( max, n ) ) } );
	};

	return <InspectorControls>
		<HelpPanel slug={ pluginSlug } />

		<PanelBody className='bPlPanelBody' title={ __( 'Timer Mode', 'b-blocks' ) }>
			<PanelRow>
				<Label className=''>{ __( 'Mode:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ timerMode }
					options={ timerModeOptions }
					onChange={ ( val ) => setAttributes( { timerMode: val } ) }
				/>
			</PanelRow>

			{ 'evergreen' === timerMode && <>
				<p style={ { fontSize: '12px', color: '#666', marginTop: 0 } }>
					{ __( 'Each visitor gets this much time, counted from their first visit and stored in their browser.', 'b-blocks' ) }
				</p>
				<NumberControl
					label={ __( 'Days', 'b-blocks' ) }
					value={ evergreenDays }
					min={ 0 } max={ 365 }
					onChange={ setNum( 'evergreenDays', 0, 365 ) }
				/>
				<NumberControl
					label={ __( 'Hours', 'b-blocks' ) }
					value={ evergreenHours }
					min={ 0 } max={ 23 }
					onChange={ setNum( 'evergreenHours', 0, 23 ) }
				/>
				<NumberControl
					label={ __( 'Minutes', 'b-blocks' ) }
					value={ evergreenMinutes }
					min={ 0 } max={ 59 }
					onChange={ setNum( 'evergreenMinutes', 0, 59 ) }
				/>
				<NumberControl
					label={ __( 'Seconds', 'b-blocks' ) }
					value={ evergreenSeconds }
					min={ 0 } max={ 59 }
					onChange={ setNum( 'evergreenSeconds', 0, 59 ) }
				/>
			</> }

			{ 'recurring' === timerMode && <>
				<p style={ { fontSize: '12px', color: '#666', marginTop: 0 } }>
					{ __( 'The timer counts down to the next reset, then automatically restarts the window. Uses the visitor’s local time.', 'b-blocks' ) }
				</p>
				<PanelRow>
					<Label className=''>{ __( 'Reset Day:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ recurringResetDay }
						options={ resetDayOptions }
						onChange={ ( val ) => setAttributes( { recurringResetDay: val } ) }
					/>
				</PanelRow>
				<RangeControl
					label={ __( 'Reset Hour (0–23)', 'b-blocks' ) }
					value={ recurringResetHour }
					onChange={ ( val ) => setAttributes( { recurringResetHour: val } ) }
					min={ 0 } max={ 23 } step={ 1 }
				/>
				<p style={ { fontSize: '12px', color: '#666' } }>
					{ __( 'Window duration (how long the offer stays open after each reset):', 'b-blocks' ) }
				</p>
				<NumberControl
					label={ __( 'Days', 'b-blocks' ) }
					value={ recurringDays }
					min={ 0 } max={ 365 }
					onChange={ setNum( 'recurringDays', 0, 365 ) }
				/>
				<NumberControl
					label={ __( 'Hours', 'b-blocks' ) }
					value={ recurringHours }
					min={ 0 } max={ 168 }
					onChange={ setNum( 'recurringHours', 0, 168 ) }
				/>
				<NumberControl
					label={ __( 'Minutes', 'b-blocks' ) }
					value={ recurringMinutes }
					min={ 0 } max={ 59 }
					onChange={ setNum( 'recurringMinutes', 0, 59 ) }
				/>
				<NumberControl
					label={ __( 'Seconds', 'b-blocks' ) }
					value={ recurringSeconds }
					min={ 0 } max={ 59 }
					onChange={ setNum( 'recurringSeconds', 0, 59 ) }
				/>
			</> }

			<TextControl
				label={ __( 'Storage Key (advanced)', 'b-blocks' ) }
				value={ storageKey }
				onChange={ ( val ) => setAttributes( { storageKey: val.replace( /[^A-Za-z0-9_-]/g, '' ) } ) }
				placeholder={ __( '(auto)', 'b-blocks' ) }
				help={ __( 'Override the localStorage key for evergreen mode. Leave blank to auto-generate a unique key per timer.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Units & Labels', 'b-blocks' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Show Days', 'b-blocks' ) }
				checked={ !! showDays }
				onChange={ ( val ) => setAttributes( { showDays: val } ) }
			/>
			{ showDays && (
				<TextControl
					label={ __( 'Days Label', 'b-blocks' ) }
					value={ daysLabel }
					onChange={ ( val ) => setAttributes( { daysLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Hours', 'b-blocks' ) }
				checked={ !! showHours }
				onChange={ ( val ) => setAttributes( { showHours: val } ) }
			/>
			{ showHours && (
				<TextControl
					label={ __( 'Hours Label', 'b-blocks' ) }
					value={ hoursLabel }
					onChange={ ( val ) => setAttributes( { hoursLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Minutes', 'b-blocks' ) }
				checked={ !! showMinutes }
				onChange={ ( val ) => setAttributes( { showMinutes: val } ) }
			/>
			{ showMinutes && (
				<TextControl
					label={ __( 'Minutes Label', 'b-blocks' ) }
					value={ minutesLabel }
					onChange={ ( val ) => setAttributes( { minutesLabel: val } ) }
				/>
			) }

			<ToggleControl
				label={ __( 'Show Seconds', 'b-blocks' ) }
				checked={ !! showSeconds }
				onChange={ ( val ) => setAttributes( { showSeconds: val } ) }
			/>
			{ showSeconds && (
				<TextControl
					label={ __( 'Seconds Label', 'b-blocks' ) }
					value={ secondsLabel }
					onChange={ ( val ) => setAttributes( { secondsLabel: val } ) }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'On Expiry', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Expired Action:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ expiredAction }
					options={ expiredActionOptions }
					onChange={ ( val ) => setAttributes( { expiredAction: val } ) }
				/>
			</PanelRow>

			{ 'message' === expiredAction && (
				<TextControl
					label={ __( 'Expired Message', 'b-blocks' ) }
					value={ expiredMessage }
					onChange={ ( val ) => setAttributes( { expiredMessage: val } ) }
					placeholder={ __( 'This offer has expired.', 'b-blocks' ) }
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Content', 'b-blocks' ) } initialOpen={ false }>
			<TextControl
				label={ __( 'Prefix Text', 'b-blocks' ) }
				value={ prefixText }
				onChange={ ( val ) => setAttributes( { prefixText: val } ) }
				placeholder={ __( 'Sale ends in:', 'b-blocks' ) }
			/>

			<TextControl
				label={ __( 'Suffix Text', 'b-blocks' ) }
				value={ suffixText }
				onChange={ ( val ) => setAttributes( { suffixText: val } ) }
				placeholder={ __( 'Don’t miss out!', 'b-blocks' ) }
			/>

			<PanelRow>
				<Label className=''>{ __( 'Alignment:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ alignment }
					options={ alignmentOptions }
					onChange={ ( val ) => setAttributes( { alignment: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Max Width (px)', 'b-blocks' ) }
				value={ maxWidth }
				onChange={ ( val ) => setAttributes( { maxWidth: val } ) }
				min={ 0 } max={ 1800 } step={ 10 }
				help={ __( '0 = no max width.', 'b-blocks' ) }
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Digit Style', 'b-blocks' ) } initialOpen={ false }>
			<PanelRow>
				<Label className=''>{ __( 'Box Layout:', 'b-blocks' ) }</Label>
				<SelectControl
					value={ boxLayout }
					options={ boxLayoutOptions }
					onChange={ ( val ) => setAttributes( { boxLayout: val } ) }
				/>
			</PanelRow>

			<RangeControl
				label={ __( 'Box Width (px)', 'b-blocks' ) }
				value={ boxWidth }
				onChange={ ( val ) => setAttributes( { boxWidth: val } ) }
				min={ 32 } max={ 240 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Box Height (px)', 'b-blocks' ) }
				value={ boxHeight }
				onChange={ ( val ) => setAttributes( { boxHeight: val } ) }
				min={ 32 } max={ 240 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Box Gap (px)', 'b-blocks' ) }
				value={ boxGap }
				onChange={ ( val ) => setAttributes( { boxGap: val } ) }
				min={ 0 } max={ 60 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Box Radius (px)', 'b-blocks' ) }
				value={ boxRadius }
				onChange={ ( val ) => setAttributes( { boxRadius: val } ) }
				min={ 0 } max={ 50 } step={ 1 }
			/>

			<ColorControl
				label={ __( 'Digit Background:', 'b-blocks' ) }
				value={ digitBg }
				onChange={ ( val ) => setAttributes( { digitBg: val } ) }
				defaultColor='#146EF5'
			/>

			<ColorControl
				label={ __( 'Digit Color:', 'b-blocks' ) }
				value={ digitColor }
				onChange={ ( val ) => setAttributes( { digitColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ColorControl
				label={ __( 'Label Color:', 'b-blocks' ) }
				value={ labelColor }
				onChange={ ( val ) => setAttributes( { labelColor: val } ) }
				defaultColor='#ffffff'
			/>

			<ToggleControl
				label={ __( 'Show Separators', 'b-blocks' ) }
				checked={ !! separatorVisible }
				onChange={ ( val ) => setAttributes( { separatorVisible: val } ) }
			/>

			{ separatorVisible && (
				<ColorControl
					label={ __( 'Separator Color:', 'b-blocks' ) }
					value={ separatorColor }
					onChange={ ( val ) => setAttributes( { separatorColor: val } ) }
					defaultColor='#146EF5'
				/>
			) }
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
			<RangeControl
				label={ __( 'Digit Font Size (px)', 'b-blocks' ) }
				value={ digitSize }
				onChange={ ( val ) => setAttributes( { digitSize: val } ) }
				min={ 12 } max={ 96 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Label Font Size (px)', 'b-blocks' ) }
				value={ labelSize }
				onChange={ ( val ) => setAttributes( { labelSize: val } ) }
				min={ 8 } max={ 32 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Prefix Font Size (px)', 'b-blocks' ) }
				value={ prefixSize }
				onChange={ ( val ) => setAttributes( { prefixSize: val } ) }
				min={ 10 } max={ 64 } step={ 1 }
			/>

			<ColorControl
				label={ __( 'Prefix Color:', 'b-blocks' ) }
				value={ prefixColor }
				onChange={ ( val ) => setAttributes( { prefixColor: val } ) }
				defaultColor='#222222'
			/>

			<RangeControl
				label={ __( 'Suffix Font Size (px)', 'b-blocks' ) }
				value={ suffixSize }
				onChange={ ( val ) => setAttributes( { suffixSize: val } ) }
				min={ 10 } max={ 48 } step={ 1 }
			/>

			<ColorControl
				label={ __( 'Suffix Color:', 'b-blocks' ) }
				value={ suffixColor }
				onChange={ ( val ) => setAttributes( { suffixColor: val } ) }
				defaultColor='#555555'
			/>

			<RangeControl
				label={ __( 'Expired Message Font Size (px)', 'b-blocks' ) }
				value={ expiredSize }
				onChange={ ( val ) => setAttributes( { expiredSize: val } ) }
				min={ 10 } max={ 48 } step={ 1 }
			/>

			<ColorControl
				label={ __( 'Expired Message Color:', 'b-blocks' ) }
				value={ expiredColor }
				onChange={ ( val ) => setAttributes( { expiredColor: val } ) }
				defaultColor='#cc0000'
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={ __( 'Block Background & Spacing', 'b-blocks' ) } initialOpen={ false }>
			<ColorControl
				label={ __( 'Block Background:', 'b-blocks' ) }
				value={ blockBg }
				onChange={ ( val ) => setAttributes( { blockBg: val } ) }
				defaultColor=''
			/>

			<RangeControl
				label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
				value={ paddingV }
				onChange={ ( val ) => setAttributes( { paddingV: val } ) }
				min={ 0 } max={ 120 } step={ 1 }
			/>

			<RangeControl
				label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
				value={ paddingH }
				onChange={ ( val ) => setAttributes( { paddingH: val } ) }
				min={ 0 } max={ 120 } step={ 1 }
			/>
		</PanelBody>
	</InspectorControls>;
};

export default Settings;
