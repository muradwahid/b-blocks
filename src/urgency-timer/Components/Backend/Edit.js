import { Fragment } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const clamp = ( val, min, max, fallback ) => {
	const n = parseInt( val, 10 );
	if ( isNaN( n ) ) return fallback;
	return Math.max( min, Math.min( max, n ) );
};

const pad = ( n ) => String( n ).padStart( 2, '0' );

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		timerMode,
		evergreenDays, evergreenHours, evergreenMinutes, evergreenSeconds,
		recurringDays, recurringHours, recurringMinutes, recurringSeconds,
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

	const id = `block-${ clientId }`;
	const maxW = clamp( maxWidth, 0, 1800, 600 );

	const css = `
		#${ id }.bb-ut {
			--bb-ut-bg: ${ blockBg || 'transparent' };
			--bb-ut-pad-y: ${ clamp( paddingV, 0, 120, 20 ) }px;
			--bb-ut-pad-x: ${ clamp( paddingH, 0, 120, 20 ) }px;
			--bb-ut-max-w: ${ maxW > 0 ? `${ maxW }px` : 'none' };
			--bb-ut-digit-bg: ${ digitBg || '#146EF5' };
			--bb-ut-digit-color: ${ digitColor || '#ffffff' };
			--bb-ut-label-color: ${ labelColor || '#ffffff' };
			--bb-ut-sep-color: ${ separatorColor || '#146EF5' };
			--bb-ut-box-w: ${ clamp( boxWidth, 32, 240, 80 ) }px;
			--bb-ut-box-h: ${ clamp( boxHeight, 32, 240, 80 ) }px;
			--bb-ut-box-gap: ${ clamp( boxGap, 0, 60, 12 ) }px;
			--bb-ut-box-radius: ${ clamp( boxRadius, 0, 50, 8 ) }px;
			--bb-ut-digit-size: ${ clamp( digitSize, 12, 96, 36 ) }px;
			--bb-ut-label-size: ${ clamp( labelSize, 8, 32, 13 ) }px;
			--bb-ut-prefix-size: ${ clamp( prefixSize, 10, 64, 18 ) }px;
			--bb-ut-prefix-color: ${ prefixColor || '#222222' };
			--bb-ut-suffix-size: ${ clamp( suffixSize, 10, 48, 14 ) }px;
			--bb-ut-suffix-color: ${ suffixColor || '#555555' };
			--bb-ut-expired-size: ${ clamp( expiredSize, 10, 48, 16 ) }px;
			--bb-ut-expired-color: ${ expiredColor || '#cc0000' };
		}
	`;

	const units = [];
	if ( showDays ) units.push( { key: 'days', label: daysLabel } );
	if ( showHours ) units.push( { key: 'hours', label: hoursLabel } );
	if ( showMinutes ) units.push( { key: 'minutes', label: minutesLabel } );
	if ( showSeconds ) units.push( { key: 'seconds', label: secondsLabel } );

	// Static preview: show the configured starting duration.
	const previewValues = ( () => {
		if ( 'recurring' === timerMode ) {
			return {
				days: clamp( recurringDays, 0, 365, 0 ),
				hours: clamp( recurringHours, 0, 168, 24 ) % 24,
				minutes: clamp( recurringMinutes, 0, 59, 0 ),
				seconds: clamp( recurringSeconds, 0, 59, 0 )
			};
		}
		return {
			days: clamp( evergreenDays, 0, 365, 1 ),
			hours: clamp( evergreenHours, 0, 23, 0 ),
			minutes: clamp( evergreenMinutes, 0, 59, 0 ),
			seconds: clamp( evergreenSeconds, 0, 59, 0 )
		};
	} )();

	const wrapperClasses = [
		'bb-ut',
		`bb-ut-layout-${ boxLayout || 'boxed' }`,
		`bb-ut-align-${ alignment || 'center' }`
	].join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<BlockControls>
			<AlignmentToolbar
				value={ alignment }
				onChange={ ( val ) => setAttributes( { alignment: val || 'center' } ) }
			/>
		</BlockControls>

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-ut-inner'>
				{ prefixText && <p className='bb-ut-prefix'>{ prefixText }</p> }

				{ units.length > 0 ? (
					<div className='bb-ut-timer'>
						{ units.map( ( unit, index ) => (
							<Fragment key={ unit.key }>
								{ index > 0 && separatorVisible && (
									<span className='bb-ut-sep' aria-hidden='true'>:</span>
								) }
								<span className={ `bb-ut-unit bb-ut-unit-${ unit.key }` }>
									<span className='bb-ut-box'>
										<span className='bb-ut-digit'>{ pad( previewValues[ unit.key ] ) }</span>
									</span>
									<span className='bb-ut-unit-label'>{ unit.label }</span>
								</span>
							</Fragment>
						) ) }
					</div>
				) : (
					<div className='bb-ut-editor-hint'>
						{ __( 'Enable at least one unit (Days / Hours / Minutes / Seconds) to show the timer.', 'b-blocks' ) }
					</div>
				) }

				{ 'message' === expiredAction && expiredMessage && (
					<div className='bb-ut-expired-preview' style={ { fontSize: '11px', color: '#888' } }>
						{ __( 'On expiry:', 'b-blocks' ) } { expiredMessage }
					</div>
				) }

				{ suffixText && <p className='bb-ut-suffix'>{ suffixText }</p> }
			</div>
		</div>
	</>;
};

export default Edit;
