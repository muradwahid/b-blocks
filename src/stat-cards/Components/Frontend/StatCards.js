import { __, sprintf } from '@wordpress/i18n';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const TrendIcon = ( { direction } ) => {
	let path = 'M18 15l-6-6-6 6';
	if ( 'down' === direction ) path = 'M6 9l6 6 6-6';
	else if ( 'neutral' === direction ) path = 'M5 12h14';
	return <svg className='bBlocks-stat-cards-trend-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
		<path d={ path } fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
	</svg>;
};

const ALIGN = [ 'left', 'center', 'right' ];
const STYLES = [ 'flat', 'outlined', 'accent-top' ];

/**
 * Shared Stat Cards markup — the static frontend version rendered by view.js
 * and reused by Edit.js.
 */
const StatCards = ( { attributes } ) => {
	const { layout = {}, card = {}, icon = {}, description = {}, trend = {}, items = [] } = attributes;

	const align = ALIGN.includes( layout.align ) ? layout.align : 'center';
	const cardStyle = STYLES.includes( card.style ) ? card.style : 'flat';
	const cardOrientation = card.orientation || 'vertical';
	const showIcon = icon.show !== false;
	const showDesc = description.show !== false;
	const showTrend = trend.show !== false;

	const list = Array.isArray( items ) ? items : [];
	const renderable = list.filter( ( it ) => {
		const s = it || {};
		return ( s.number || '' ) || ( s.label || '' ) || ( s.prefix || '' ) || ( s.suffix || '' );
	} );

	const wrapperClasses = [
		'bBlocks-stat-cards-wrapper',
		`bBlocks-stat-cards-style-${ cardStyle }`,
		`bBlocks-stat-cards-align-${ align }`,
	].join( ' ' );

	if ( 0 === renderable.length ) {
		return <div className={ wrapperClasses }>
			<p className='bBlocks-stat-cards-empty'>{ __( 'Add stat cards from the block settings.', 'b-blocks' ) }</p>
		</div>;
	}

	return (
		<div className={ wrapperClasses }>
			<dl className='bBlocks-stat-cards-grid' aria-label={ __( 'Key statistics', 'b-blocks' ) }>
				{ renderable.map( ( item, idx ) => {
					const safe = item || {};
					const valueText = `${ safe.prefix || '' }${ safe.number || '' }${ safe.suffix || '' }`;
					const hasTrend = showTrend && safe.trendValue;
					const trendDir = safe.trendDirection || 'up';
					const trendStyle = safe.trendColor ? { backgroundColor: safe.trendColor, color: '#ffffff' } : undefined;
					const linkLabel = safe.label
						? sprintf( /* translators: 1: label, 2: value */ __( '%1$s: %2$s', 'b-blocks' ), safe.label, valueText )
						: valueText;

					const numberInner = <>
						{ safe.prefix && <span className='bBlocks-stat-cards-prefix'>{ safe.prefix }</span> }
						<span className='bBlocks-stat-cards-value'>{ safe.number }</span>
						{ safe.suffix && <span className='bBlocks-stat-cards-suffix'>{ safe.suffix }</span> }
					</>;

					const orientation = safe.orientation || cardOrientation;

					return (
						<div className={ `bBlocks-stat-cards-item bBlocks-stat-cards-item-${ orientation }` } key={ safe._key || idx }>
							{ showIcon && safe.icon && (
								<span className='bBlocks-stat-cards-icon' aria-hidden='true' dangerouslySetInnerHTML={ { __html: sanitizeHtml( safe.icon ) } } />
							) }

							{ safe.linkUrl ? (
								<a
									className='bBlocks-stat-cards-link'
									href={ safe.linkUrl }
									aria-label={ linkLabel }
									{ ...( safe.linkTarget ? { target: '_blank', rel: 'noopener noreferrer' } : {} ) }
								>
									{ '' !== valueText && <span className='bBlocks-stat-cards-number'>{ numberInner }</span> }
									{ safe.label && <span className='bBlocks-stat-cards-label'>{ safe.label }</span> }
								</a>
							) : (
								<>
									{ '' !== valueText && <dd className='bBlocks-stat-cards-number'>{ numberInner }</dd> }
									{ safe.label && <dt className='bBlocks-stat-cards-label'>{ safe.label }</dt> }
								</>
							) }

							{ hasTrend && (
								<span
									className={ `bBlocks-stat-cards-trend bBlocks-stat-cards-trend-${ trendDir }` }
									style={ trendStyle }
									aria-label={ sprintf( /* translators: 1: direction, 2: value */ __( 'Trend: %1$s %2$s', 'b-blocks' ), trendDir, safe.trendValue ) }
								>
									<TrendIcon direction={ trendDir } />
									<span className='bBlocks-stat-cards-trend-text'>{ safe.trendValue }</span>
								</span>
							) }

							{ showDesc && safe.description && (
								<p className='bBlocks-stat-cards-desc'>{ safe.description }</p>
							) }
						</div>
					);
				} ) }
			</dl>
		</div>
	);
};
export default StatCards;
