import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
	RangeControl,
	Notice,
	BaseControl
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';
import { timezoneOptions, titleTagOptions, timeFormatOptions } from '../../../utils/data';

const DEFAULT_DAYS = [
	{ day: 'Monday', open: true, timeFrom: '09:00', timeTo: '17:00' },
	{ day: 'Tuesday', open: true, timeFrom: '09:00', timeTo: '17:00' },
	{ day: 'Wednesday', open: true, timeFrom: '09:00', timeTo: '17:00' },
	{ day: 'Thursday', open: true, timeFrom: '09:00', timeTo: '17:00' },
	{ day: 'Friday', open: true, timeFrom: '09:00', timeTo: '17:00' },
	{ day: 'Saturday', open: false, timeFrom: '10:00', timeTo: '14:00' },
	{ day: 'Sunday', open: false, timeFrom: '10:00', timeTo: '14:00' }
];

const VIEW_STYLE_OPTIONS = [
	{ label: 'Default — clean rows with subtle borders', value: 'default' },
	{ label: 'Minimal — borderless, generous whitespace', value: 'minimal' },
	{ label: 'Card — elevated card with soft shadow', value: 'card' },
	{ label: 'Split — colored left column for day names', value: 'split' },
	{ label: 'Dark — high-contrast dark panel', value: 'dark' },
	{ label: 'Timeline — vertical dot/line per day', value: 'timeline' },
];

const Settings = ( { attributes, setAttributes } ) => {
	const {
		viewStyle,
		title,
		titleTag,
		timezone,
		timeFormat,
		showBadge,
		openLabel,
		closedLabel,
		highlightToday,
		showClosedDays,
		closedText,
		separatorShow,
		days,
		badgeOpenBg,
		badgeClosedBg,
		badgeTextColor,
		titleColor,
		headerBg,
		rowBg,
		rowBgAlt,
		todayBg,
		dayColor,
		timeColor,
		separatorColor,
		borderRadius,
		padding
	} = attributes;

	const safeDays = Array.isArray( days ) && 7 === days.length ? days : DEFAULT_DAYS;

	const updateDay = ( index, patch ) => {
		const next = safeDays.map( ( d, i ) => ( i === index ? { ...d, ...patch } : { ...d } ) );
		setAttributes( { days: next } );
	};

	const updatePadding = ( key, value ) => {
		const clamped = Math.max( 0, Math.min( 96, parseInt( value, 10 ) || 0 ) );
		setAttributes( {
			padding: {
				top: padding?.top ?? 16,
				right: padding?.right ?? 16,
				bottom: padding?.bottom ?? 16,
				left: padding?.left ?? 16,
				[ key ]: clamped
			}
		} );
	};

	const isLowContrastOpen = ( '#ffffff' === ( badgeTextColor || '' ).toLowerCase() ) && ( badgeOpenBg || '' ).toLowerCase() === '#ffff00';

	return (
		<InspectorControls>
			<HelpPanel slug={ pluginSlug } />

			<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ true }>
				<PanelRow>
					<Label className=''>{ __( 'View:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ viewStyle || 'default' }
						options={ VIEW_STYLE_OPTIONS }
						onChange={ ( val ) => setAttributes( { viewStyle: val } ) }
					/>
				</PanelRow>
				<p style={ { margin: '8px 0 0', fontSize: 12, color: '#666' } }>
					{ __( 'Pick a visual preset. Color, padding, and badge controls below still apply.', 'b-blocks' ) }
				</p>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'General', 'b-blocks' ) } initialOpen={ true }>
				<TextControl
					label={ __( 'Title', 'b-blocks' ) }
					value={ title || '' }
					onChange={ ( val ) => setAttributes( { title: val } ) }
					help={ __( 'Leave empty to hide the heading.', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>

				<PanelRow>
					<Label className=''>{ __( 'Title Tag:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ titleTag || 'h3' }
						options={ titleTagOptions }
						onChange={ ( val ) => setAttributes( { titleTag: val } ) }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Timezone:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ timezone || 'UTC' }
						options={ timezoneOptions }
						onChange={ ( val ) => setAttributes( { timezone: val } ) }
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Time Format:', 'b-blocks' ) }</Label>
					<SelectControl
						value={ timeFormat || '12h' }
						options={ timeFormatOptions }
						onChange={ ( val ) => setAttributes( { timeFormat: val } ) }
					/>
				</PanelRow>

				<ToggleControl
					label={ __( 'Highlight today\'s row', 'b-blocks' ) }
					checked={ !! highlightToday }
					onChange={ ( val ) => setAttributes( { highlightToday: val } ) }
				/>

				<ToggleControl
					label={ __( 'Show closed days', 'b-blocks' ) }
					checked={ !! showClosedDays }
					onChange={ ( val ) => setAttributes( { showClosedDays: val } ) }
					help={ __( 'When off, days marked as Closed are omitted from the list entirely.', 'b-blocks' ) }
				/>

				<TextControl
					label={ __( 'Closed day text', 'b-blocks' ) }
					value={ closedText || '' }
					onChange={ ( val ) => setAttributes( { closedText: val } ) }
					placeholder={ __( 'Closed', 'b-blocks' ) }
					help={ __( 'What to show on days marked as closed (when not hidden).', 'b-blocks' ) }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Open Now Badge', 'b-blocks' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Open/Closed badge', 'b-blocks' ) }
					checked={ !! showBadge }
					onChange={ ( val ) => setAttributes( { showBadge: val } ) }
					help={ __( 'Displays a live badge that updates every minute based on the configured timezone.', 'b-blocks' ) }
				/>

				{ showBadge && (
					<>
						<TextControl
							label={ __( 'Open Label', 'b-blocks' ) }
							value={ openLabel || '' }
							onChange={ ( val ) => setAttributes( { openLabel: val } ) }
							placeholder={ __( 'Open Now', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={ __( 'Closed Label', 'b-blocks' ) }
							value={ closedLabel || '' }
							onChange={ ( val ) => setAttributes( { closedLabel: val } ) }
							placeholder={ __( 'Closed', 'b-blocks' ) }
							__nextHasNoMarginBottom
						/>

						<PanelRow>
							<Label className=''>{ __( 'Open Badge Color:', 'b-blocks' ) }</Label>
							<ColorControl
								value={ badgeOpenBg || '#22c55e' }
								onChange={ ( val ) => setAttributes( { badgeOpenBg: val } ) }
								defaultColor='#22c55e'
							/>
						</PanelRow>

						<PanelRow>
							<Label className=''>{ __( 'Closed Badge Color:', 'b-blocks' ) }</Label>
							<ColorControl
								value={ badgeClosedBg || '#ef4444' }
								onChange={ ( val ) => setAttributes( { badgeClosedBg: val } ) }
								defaultColor='#ef4444'
							/>
						</PanelRow>

						<PanelRow>
							<Label className=''>{ __( 'Badge Text Color:', 'b-blocks' ) }</Label>
							<ColorControl
								value={ badgeTextColor || '#ffffff' }
								onChange={ ( val ) => setAttributes( { badgeTextColor: val } ) }
								defaultColor='#ffffff'
							/>
						</PanelRow>

						{ isLowContrastOpen && (
							<Notice status='warning' isDismissible={ false }>
								{ __( 'Badge text color may not contrast sufficiently with the chosen badge background.', 'b-blocks' ) }
							</Notice>
						) }
					</>
				) }
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Schedule', 'b-blocks' ) } initialOpen={ false }>
				{ safeDays.map( ( d, i ) => (
					<BaseControl key={ i } className='bb-bh-editor-day-row' __nextHasNoMarginBottom>
						<div className='bb-bh-editor-day-row__name'>
							<TextControl
								label={ __( 'Day Label', 'b-blocks' ) }
								value={ d.day || '' }
								onChange={ ( val ) => updateDay( i, { day: val } ) }
								__nextHasNoMarginBottom
							/>
						</div>
						<div className='bb-bh-editor-day-row__toggle'>
							<ToggleControl
								label={ __( 'Open this day', 'b-blocks' ) }
								checked={ !! d.open }
								onChange={ ( val ) => updateDay( i, { open: val } ) }
							/>
						</div>
						<div className='bb-bh-editor-day-row__times'>
							<TextControl
								type='time'
								label={ __( 'Opens', 'b-blocks' ) }
								value={ d.timeFrom || '' }
								onChange={ ( val ) => updateDay( i, { timeFrom: val } ) }
								disabled={ ! d.open }
								__nextHasNoMarginBottom
							/>
							<TextControl
								type='time'
								label={ __( 'Closes', 'b-blocks' ) }
								value={ d.timeTo || '' }
								onChange={ ( val ) => updateDay( i, { timeTo: val } ) }
								disabled={ ! d.open }
								__nextHasNoMarginBottom
							/>
						</div>
					</BaseControl>
				) ) }
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Style', 'b-blocks' ) } initialOpen={ false }>
				<PanelRow>
					<Label className=''>{ __( 'Title Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ titleColor || '#111827' }
						onChange={ ( val ) => setAttributes( { titleColor: val } ) }
						defaultColor='#111827'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Day Name Background:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ headerBg || '' }
						onChange={ ( val ) => setAttributes( { headerBg: val } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Day Name Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ dayColor || '#111827' }
						onChange={ ( val ) => setAttributes( { dayColor: val } ) }
						defaultColor='#111827'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Time Color:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ timeColor || '#374151' }
						onChange={ ( val ) => setAttributes( { timeColor: val } ) }
						defaultColor='#374151'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Row Background:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ rowBg || '' }
						onChange={ ( val ) => setAttributes( { rowBg: val } ) }
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{ __( 'Alt Row Background:', 'b-blocks' ) }</Label>
					<ColorControl
						value={ rowBgAlt || '' }
						onChange={ ( val ) => setAttributes( { rowBgAlt: val } ) }
						defaultColor=''
					/>
				</PanelRow>

				{ highlightToday && (
					<PanelRow>
						<Label className=''>{ __( 'Today Highlight Color:', 'b-blocks' ) }</Label>
						<ColorControl
							value={ todayBg || '#eff6ff' }
							onChange={ ( val ) => setAttributes( { todayBg: val } ) }
							defaultColor='#eff6ff'
						/>
					</PanelRow>
				) }

				<ToggleControl
					label={ __( 'Row Separator', 'b-blocks' ) }
					checked={ !! separatorShow }
					onChange={ ( val ) => setAttributes( { separatorShow: val } ) }
				/>

				{ separatorShow && (
					<PanelRow>
						<Label className=''>{ __( 'Separator Color:', 'b-blocks' ) }</Label>
						<ColorControl
							value={ separatorColor || '#e5e7eb' }
							onChange={ ( val ) => setAttributes( { separatorColor: val } ) }
							defaultColor='#e5e7eb'
						/>
					</PanelRow>
				) }

				<RangeControl
					label={ __( 'Border Radius (px)', 'b-blocks' ) }
					value={ parseInt( borderRadius, 10 ) || 0 }
					onChange={ ( val ) => setAttributes( { borderRadius: parseInt( val, 10 ) || 0 } ) }
					min={ 0 }
					max={ 64 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={ __( 'Padding', 'b-blocks' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Top (px)', 'b-blocks' ) }
					value={ padding?.top ?? 16 }
					onChange={ ( val ) => updatePadding( 'top', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Right (px)', 'b-blocks' ) }
					value={ padding?.right ?? 16 }
					onChange={ ( val ) => updatePadding( 'right', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Bottom (px)', 'b-blocks' ) }
					value={ padding?.bottom ?? 16 }
					onChange={ ( val ) => updatePadding( 'bottom', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
				<RangeControl
					label={ __( 'Left (px)', 'b-blocks' ) }
					value={ padding?.left ?? 16 }
					onChange={ ( val ) => updatePadding( 'left', val ) }
					min={ 0 }
					max={ 96 }
					step={ 1 }
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
