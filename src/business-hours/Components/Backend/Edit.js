import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { formatTime } from '../../utils/data';

const DAY_INDEX_TO_JS_DOW = ( i ) => ( 6 === i ? 0 : i + 1 ); // Mon..Sun → 1..6,0

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		title,
		titleTag,
		viewStyle,
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

	const id = `block-${ clientId }`;
	const VIEW_STYLES = [ 'default', 'minimal', 'card', 'split', 'dark', 'timeline' ];
	const safeViewStyle = VIEW_STYLES.includes( viewStyle ) ? viewStyle : 'default';
	const blockProps = useBlockProps( { className: `bb-business-hours bb-bh-view--${ safeViewStyle }`, id } );

	const TitleTag = [ 'h2', 'h3', 'h4', 'h5', 'h6' ].includes( titleTag ) ? titleTag : 'h3';

	// "Today" relative to the editor user's clock. The frontend re-computes
	// this in the configured timezone, but for the editor preview the
	// editor user's local day is the most intuitive fallback.
	const todayJsDow = new Date().getDay();

	const safeDays = Array.isArray( days ) && 7 === days.length
		? days
		: [
			{ day: 'Monday', open: true, timeFrom: '09:00', timeTo: '17:00' },
			{ day: 'Tuesday', open: true, timeFrom: '09:00', timeTo: '17:00' },
			{ day: 'Wednesday', open: true, timeFrom: '09:00', timeTo: '17:00' },
			{ day: 'Thursday', open: true, timeFrom: '09:00', timeTo: '17:00' },
			{ day: 'Friday', open: true, timeFrom: '09:00', timeTo: '17:00' },
			{ day: 'Saturday', open: false, timeFrom: '10:00', timeTo: '14:00' },
			{ day: 'Sunday', open: false, timeFrom: '10:00', timeTo: '14:00' }
		];

	const wrapperStyle = {
		padding: `${ padding?.top ?? 16 }px ${ padding?.right ?? 16 }px ${ padding?.bottom ?? 16 }px ${ padding?.left ?? 16 }px`,
		borderRadius: `${ borderRadius ?? 8 }px`
	};

	const rowStyle = ( idx, isToday ) => {
		const base = {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: '12px',
			padding: '10px 12px',
			minHeight: '36px'
		};
		if ( isToday && highlightToday && todayBg ) {
			base.backgroundColor = todayBg;
			base.fontWeight = 600;
		} else if ( 1 === idx % 2 && rowBgAlt ) {
			base.backgroundColor = rowBgAlt;
		} else if ( rowBg ) {
			base.backgroundColor = rowBg;
		}
		if ( separatorShow && idx > 0 ) {
			base.borderTop = `1px solid ${ separatorColor || '#e5e7eb' }`;
		}
		return base;
	};

	const badgeStyle = ( variant ) => ( {
		display: 'inline-flex',
		alignItems: 'center',
		gap: '6px',
		padding: '4px 12px',
		borderRadius: '999px',
		fontSize: '13px',
		fontWeight: 600,
		color: badgeTextColor || '#ffffff',
		backgroundColor: 'open' === variant ? ( badgeOpenBg || '#22c55e' ) : ( badgeClosedBg || '#ef4444' )
	} );

	const dotStyle = { width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', opacity: 0.85 };

	return (
		<>
			<Settings attributes={ attributes } setAttributes={ setAttributes } />

			<div { ...blockProps }>
				<section className='bb-bh-editor-wrapper' style={ wrapperStyle } aria-label={ title || __( 'Business Hours', 'b-blocks' ) }>
					{ title && (
						<TitleTag className='bb-bh-title' style={ { margin: '0 0 12px', color: titleColor || undefined } }>
							{ title }
						</TitleTag>
					) }

					{ showBadge && (
						<div className='bb-bh-badges' style={ { margin: '0 0 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' } }>
							<span style={ badgeStyle( 'open' ) }>
								<span style={ dotStyle } aria-hidden='true'></span>
								{ openLabel || __( 'Open Now', 'b-blocks' ) }
							</span>
							<span style={ badgeStyle( 'closed' ) }>
								<span style={ dotStyle } aria-hidden='true'></span>
								{ closedLabel || __( 'Closed', 'b-blocks' ) }
							</span>
							<small style={ { color: '#6b7280', fontSize: '11px' } }>
								{ __( '(Live state shown on frontend)', 'b-blocks' ) }
							</small>
						</div>
					) }

					<dl className='bb-bh-list' style={ { margin: 0, padding: 0 } }>
						{ safeDays.map( ( d, i ) => {
							const isClosed = ! d.open || ! d.timeFrom || ! d.timeTo;
							if ( isClosed && ! showClosedDays ) {
								return null;
							}
							const jsDow = DAY_INDEX_TO_JS_DOW( i );
							const isToday = jsDow === todayJsDow;
							const timeText = isClosed
								? ( closedText || __( 'Closed', 'b-blocks' ) )
								: `${ formatTime( d.timeFrom, timeFormat ) } – ${ formatTime( d.timeTo, timeFormat ) }`;

							return (
								<div key={ i } className='bb-bh-row' style={ rowStyle( i, isToday ) }>
									<dt className='bb-bh-day' style={ { margin: 0, color: dayColor || undefined, fontWeight: 500, backgroundColor: headerBg || undefined } }>{ d.day }</dt>
									<dd className='bb-bh-time' style={ { margin: 0, color: timeColor || undefined } }>{ timeText }</dd>
								</div>
							);
						} ) }
					</dl>
				</section>

				<div>
					<span className='bb-bh-editor-meta'>
						<span aria-hidden='true'>🕒</span>
						{ __( 'Business Hours', 'b-blocks' ) }
						{ timezone ? ` · ${ timezone }` : '' }
					</span>
				</div>
			</div>
		</>
	);
};

export default Edit;
