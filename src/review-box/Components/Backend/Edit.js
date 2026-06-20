import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const StarSvg = ({ fillPct, color, size }) => {
	const id = `bb-rb-edit-star-${Math.random().toString(36).slice(2, 9)}`;
	const pct = clamp(fillPct, 0, 100);
	return (
		<span
			className='bb-review-stars__star'
			aria-hidden='true'
			style={{ '--bb-star-size': `${size}px`, width: `${size}px`, height: `${size}px`, display: 'inline-flex' }}
		>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={size} height={size} focusable='false' aria-hidden='true'>
				<defs>
					<linearGradient id={id} x1='0' x2='1' y1='0' y2='0'>
						<stop offset={`${pct}%`} stopColor={color} />
						<stop offset={`${pct}%`} stopColor='#d8d8d8' />
					</linearGradient>
				</defs>
				<path
					fill={`url(#${id})`}
					stroke='#bfbfbf'
					strokeWidth='0.5'
					d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z'
				/>
			</svg>
		</span>
	);
};

const StarRow = ({ value, max, color, size = 18 }) => {
	const safeMax = Math.max(1, max);
	const safeValue = clamp(value, 0, safeMax);
	const stars = [];
	for (let i = 1; i <= safeMax; i++) {
		const delta = safeValue - (i - 1);
		const pct = clamp(delta, 0, 1) * 100;
		stars.push(<StarSvg key={i} fillPct={pct} color={color} size={size} />);
	}
	return <div className='bb-review-stars' aria-hidden='true'>{stars}</div>;
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		productName,
		reviewSummary,
		ratingMode,
		overallRating,
		maxRating,
		criteria = [],
		pros = [],
		cons = [],
		ctaLabel,
		ctaUrl,
		ctaNewTab,
		styles = {},
		showProsConsColumns,
		showCriteria,
		productImage = {},
	} = attributes;

	const safeMax = clamp(parseInt(maxRating, 10) || 5, 1, 10);

	// Compute the overall rating preview.
	let computedRating = 0;
	if (ratingMode === 'manual') {
		computedRating = clamp(parseFloat(overallRating) || 0, 0, safeMax);
	} else if (Array.isArray(criteria) && criteria.length > 0) {
		const total = criteria.reduce((sum, c) => sum + (clamp(parseInt(c?.score, 10) || 0, 0, safeMax)), 0);
		computedRating = Math.round((total / criteria.length) * 10) / 10;
	}
	computedRating = Math.round(computedRating * 10) / 10;

	const accent = styles.accentColor || '#2271b1';
	const ratingColor = styles.ratingColor || '#f5a623';
	const bg = styles.backgroundColor || '';
	const text = styles.textColor || '';
	const borderRadius = styles.borderRadius || '8px';
	const padding = styles.padding || '24px';

	const wrapperClass = [showProsConsColumns ? 'rb-cols' : ''].filter(Boolean).join(' ');
	const blockProps = useBlockProps({ className: wrapperClass });

	const wrapperStyle = {
		borderRadius,
		padding,
		'--bb-rb-accent': accent,
		'--bb-rb-rating': ratingColor,
	};
	if (bg) wrapperStyle.backgroundColor = bg;
	if (text) wrapperStyle.color = text;

	const visiblePros = pros.filter((p) => (p || '').toString().trim() !== '');
	const visibleCons = cons.filter((c) => (c || '').toString().trim() !== '');

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps} style={wrapperStyle}>
				<div className={prefix}>
					<header className='bb-review-box__header'>
						{productImage?.url && (
							<div className='bb-review-box__media'>
								<img
									src={productImage.url}
									alt={productImage.alt || ''}
								/>
							</div>
						)}

						<div className='bb-review-box__heading'>
							{productName && (
								<h3 className='bb-review-box__title'>{productName}</h3>
							)}

							<div className='bb-review-box__overall'>
								<StarRow value={computedRating} max={safeMax} color={ratingColor} size={20} />
								<span className='bb-review-box__score'>
									{computedRating.toFixed(1)}/{safeMax}
								</span>
							</div>
						</div>
					</header>

					{showCriteria && Array.isArray(criteria) && criteria.length > 0 && (
						<table className='bb-review-box__criteria' aria-label={__('Review criteria', 'b-blocks')}>
							<tbody>
								{criteria.map((c, idx) => {
									const label = c?.label || '';
									const score = clamp(parseInt(c?.score, 10) || 0, 0, safeMax);
									return (
										<tr key={idx}>
											<th scope='row'>{label}</th>
											<td>
												<StarRow value={score} max={safeMax} color={ratingColor} size={14} />
											</td>
											<td className='bb-review-box__criteria-score'>
												{score}/{safeMax}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}

					{reviewSummary && (
						<p className='bb-review-box__summary'>{reviewSummary}</p>
					)}

					{(visiblePros.length > 0 || visibleCons.length > 0) && (
						<div className={`bb-review-box__proscons${showProsConsColumns ? ' bb-review-box__proscons--cols' : ''}`}>
							{visiblePros.length > 0 && (
								<div className='bb-review-box__pros'>
									<strong className='bb-review-box__proscons-title'>{__('Pros', 'b-blocks')}</strong>
									<ul role='list'>
										{visiblePros.map((pro, idx) => (
											<li key={idx}>
												<svg className='bb-review-box__icon bb-review-box__icon--pro' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
													<path fill='currentColor' d='M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
												</svg>
												<span>{pro}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{visibleCons.length > 0 && (
								<div className='bb-review-box__cons'>
									<strong className='bb-review-box__proscons-title'>{__('Cons', 'b-blocks')}</strong>
									<ul role='list'>
										{visibleCons.map((con, idx) => (
											<li key={idx}>
												<svg className='bb-review-box__icon bb-review-box__icon--con' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
													<path fill='currentColor' d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
												</svg>
												<span>{con}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}

					{ctaLabel && ctaUrl && (
						<div className='bb-review-box__cta'>
							<a
								className='bb-review-box__btn'
								href={ctaUrl}
								onClick={(e) => e.preventDefault()}
								target={ctaNewTab ? '_blank' : undefined}
								rel={ctaNewTab ? 'noopener noreferrer' : undefined}
								aria-label={ctaNewTab ? sprintf(
									/* translators: %s: button label */
									__('%s (opens in a new tab)', 'b-blocks'),
									ctaLabel
								) : undefined}
							>
								{ctaLabel}
							</a>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Edit;
