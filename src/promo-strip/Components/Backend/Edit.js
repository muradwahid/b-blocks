import { Fragment } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

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
		headlineText, headlineTag, subText, destDate,
		showDays, showHours, showMinutes, showSeconds,
		daysLabel, hoursLabel, minutesLabel, secondsLabel,
		showButton, buttonLabel, buttonUrl, layout,
		backgroundColor, textColor, fontSize, fontWeight,
		timerDigitColor, timerLabelColor, timerSeparatorColor, timerDigitSize, timerLabelSize,
		buttonBg, buttonTextColor, buttonHoverBg, buttonHoverTextColor,
		buttonBorderRadius, buttonPaddingV, buttonPaddingH,
		paddingV, paddingH, contentMaxWidth, zIndex
	} = attributes;

	const id = `block-${ clientId }`;
	const HeadlineTag = [ 'p', 'h2', 'h3', 'h4' ].includes( headlineTag ) ? headlineTag : 'p';

	const maxW = clamp( contentMaxWidth, 0, 1800, 1200 );

	const css = `
		#${ id }.bb-ps {
			--bb-ps-bg: ${ backgroundColor || '#1a1a2e' };
			--bb-ps-color: ${ textColor || '#ffffff' };
			--bb-ps-pad-y: ${ clamp( paddingV, 0, 96, 16 ) }px;
			--bb-ps-pad-x: ${ clamp( paddingH, 0, 120, 24 ) }px;
			--bb-ps-max-w: ${ maxW > 0 ? `${ maxW }px` : 'none' };
			--bb-ps-z: ${ clamp( zIndex, 1, 9999, 10 ) };
			--bb-ps-font-size: ${ clamp( fontSize, 12, 48, 16 ) }px;
			--bb-ps-font-weight: ${ fontWeight || '700' };
			--bb-ps-digit-color: ${ timerDigitColor || '#ffffff' };
			--bb-ps-label-color: ${ timerLabelColor || '#cccccc' };
			--bb-ps-sep-color: ${ timerSeparatorColor || '#ffffff' };
			--bb-ps-digit-size: ${ clamp( timerDigitSize, 16, 64, 32 ) }px;
			--bb-ps-label-size: ${ clamp( timerLabelSize, 8, 24, 12 ) }px;
			--bb-ps-btn-bg: ${ buttonBg || '#e63946' };
			--bb-ps-btn-text: ${ buttonTextColor || '#ffffff' };
			--bb-ps-btn-hover-bg: ${ buttonHoverBg || '#c1121f' };
			--bb-ps-btn-hover-text: ${ buttonHoverTextColor || '#ffffff' };
			--bb-ps-btn-radius: ${ clamp( buttonBorderRadius, 0, 9999, 4 ) }px;
			--bb-ps-btn-pad-y: ${ clamp( buttonPaddingV, 0, 48, 10 ) }px;
			--bb-ps-btn-pad-x: ${ clamp( buttonPaddingH, 0, 80, 24 ) }px;
		}
	`;

	// Build the active unit list and a static preview of remaining time.
	const units = [];
	if ( showDays ) units.push( { key: 'days', label: daysLabel } );
	if ( showHours ) units.push( { key: 'hours', label: hoursLabel } );
	if ( showMinutes ) units.push( { key: 'minutes', label: minutesLabel } );
	if ( showSeconds ) units.push( { key: 'seconds', label: secondsLabel } );

	const previewValues = ( () => {
		const out = { days: 0, hours: 0, minutes: 0, seconds: 0 };
		if ( ! destDate ) return out;
		const dest = new Date( destDate ).getTime();
		if ( isNaN( dest ) ) return out;
		const totalSeconds = Math.max( 0, Math.floor( ( dest - Date.now() ) / 1000 ) );
		out.days = Math.floor( totalSeconds / 86400 );
		out.hours = Math.floor( ( totalSeconds % 86400 ) / 3600 );
		out.minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
		out.seconds = totalSeconds % 60;
		return out;
	} )();

	const wrapperClasses = [ 'bb-ps', `bb-ps-layout-${ layout || 'horizontal' }` ].join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<section { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-ps-inner'>
				<div className='bb-ps-text'>
					<RichText
						tagName={ HeadlineTag }
						className='bb-ps-headline'
						value={ headlineText }
						onChange={ ( val ) => setAttributes( { headlineText: val } ) }
						placeholder={ __( 'Limited Time Offer', 'b-blocks' ) }
						allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
						inlineToolbar
					/>

					{ subText && <p className='bb-ps-subtext'>{ subText }</p> }
				</div>

				{ units.length > 0 && (
					<div className='bb-ps-timer'>
						{ units.map( ( unit, index ) => (
							<Fragment key={ unit.key }>
								{ index > 0 && <span className='bb-ps-sep' aria-hidden='true'>:</span> }
								<span className={ `bb-ps-unit bb-ps-unit-${ unit.key }` }>
									<span className='bb-ps-digit'>{ pad( previewValues[ unit.key ] ) }</span>
									<span className='bb-ps-unit-label'>{ unit.label }</span>
								</span>
							</Fragment>
						) ) }
					</div>
				) }

				{ showButton && (
					<a
						className='bb-ps-button'
						href={ buttonUrl || '#' }
						onClick={ ( e ) => e.preventDefault() }
					>
						{ buttonLabel || __( 'Shop Now', 'b-blocks' ) }
					</a>
				) }
			</div>

			{ ! destDate && (
				<div className='bb-ps-editor-hint'>
					{ __( 'Set an end date in the Countdown Timer panel to start the timer.', 'b-blocks' ) }
				</div>
			) }
		</section>
	</>;
};

export default Edit;
