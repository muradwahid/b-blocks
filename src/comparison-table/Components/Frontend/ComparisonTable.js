import { useCallback, useState } from 'react';

import { defaultCaption, migrate, P, splitColumns, wrapperClasses } from '../../utils/data';
import { checkIcon, crossIcon } from '../../utils/icons';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const ComparisonTable = ({ attributes, isBackend = false }) => {

	const { content = {}, icons = {}, cta = {}, columns = [], rows = [] } = migrate(attributes);

	const { feature, plans } = splitColumns(columns);

	const ctaPosition = cta.position || 'top';

	const ctaFor = (column) => {
		if (!column?.ctaLabel) return null;

		return (isBackend || !column.ctaUrl)
			? <span className={`${P}-col__cta`} aria-hidden={isBackend ? 'true' : undefined}>{column.ctaLabel}</span>
			: <a className={`${P}-col__cta`} href={column.ctaUrl} rel='noopener'>{column.ctaLabel}</a>;
	};


	const caption = content.caption;
	const featuredLabel = content.featuredLabel;
	const checkStyle = icons.check || 'check';
	const crossStyle = icons.cross || 'times';
	const checkIconSvg = icons.checkSvg || '';
	const crossIconSvg = icons.crossSvg || '';

	const mark = (isYes) => {
		const custom = isYes ? checkIconSvg : crossIconSvg;

		return custom
			? <span className={`${P}-cell-glyph`} dangerouslySetInnerHTML={{ __html: sanitizeHtml( custom ) }} />
			: (isYes ? checkIcon(checkStyle) : crossIcon(crossStyle));
	};

	const [tip, setTip] = useState(null);

	const showTip = useCallback((event, text) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const below = window.innerHeight - rect.bottom > 140;

		setTip({
			text,
			x: rect.left + (rect.width / 2),
			y: below ? rect.bottom + 8 : rect.top - 8,
			flipped: !below
		});
	}, []);

	const hideTip = useCallback(() => setTip(null), []);

	const headContent = (column, isFeatured) => <>
		{isFeatured && (column?.badge || featuredLabel)
			? <span className={`${P}-col__featured-badge`} aria-hidden='true'>{column?.badge || featuredLabel}</span>
			: null}

		{(column?.icon || column?.label) ? <span className={`${P}-col__head`}>
			{column?.icon ? <span className={`${P}-col__icon`} dangerouslySetInnerHTML={{ __html: sanitizeHtml( column.icon ) }} /> : null}

			{column?.label ? <span className={`${P}-col__label`}>{column.label}</span> : null}
		</span> : null}

		{column?.subtitle ? <span className={`${P}-col__subtitle`}>{column.subtitle}</span> : null}

		{'top' === ctaPosition ? ctaFor(column) : null}
	</>;

	const featuredIndex = plans.findIndex((column) => column?.isFeatured);
	const hasData = plans.length > 0 && rows.length > 0;
	const captionText = caption || defaultCaption();

	if (!hasData) {
		return <p className={`${P}-empty`}>
			{'No comparison data to display. Add columns and rows in the block sidebar.'}
		</p>;
	}

	const scrollLabel = 'Scroll horizontally to see all columns.';

	const bubble = tip ? <div
		className={`${P}-tooltip-bubble${tip.flipped ? ' is-flipped' : ''}`}
		style={{ left: `${tip.x}px`, top: `${tip.y}px` }}
		role='tooltip'
	>
		{tip.text}
		<span className={`${P}-tooltip-arrow`} aria-hidden='true' />
	</div> : null;

	return <>
		<div className={`${P}-scroll`} role='region' aria-label={`${captionText}. ${scrollLabel}`} tabIndex={0}>
			<table className={`${P}-table`}>
				<caption className={`${P}-caption screen-reader-text`}>{captionText}</caption>

				<thead>
					<tr>
						<th scope='col' data-col='feature' className={`${P}-feature-col`}>
							{feature?.label || feature?.icon
								? headContent(feature, !!feature?.isFeatured)
								: <span className='screen-reader-text'>Feature</span>}
						</th>

						{plans.map((column, index) => {
							const isFeatured = !!column?.isFeatured;

							return <th key={column?._key || `col-${index}`} scope='col' data-col={index} className={`${P}-col${isFeatured ? ' is-featured' : ''}`}>
							{headContent(column, isFeatured)}
						</th>;
						})}
					</tr>
				</thead>

				<tbody>
					{rows.map((row, rowIndex) => <tr key={row?._key || `row-${rowIndex}`}>
						<th scope='row' className={`${P}-row-label`}>
							{row?.tooltip
								? <span
									className={`${P}-tooltip`}
									tabIndex={0}
									onMouseEnter={(e) => showTip(e, row.tooltip)}
									onMouseLeave={hideTip}
									onFocus={(e) => showTip(e, row.tooltip)}
									onBlur={hideTip}
								>
									{row?.label || <span className='screen-reader-text'>Feature</span>}
	
									<span className='screen-reader-text'>{row.tooltip}</span>
								</span>
								: row?.label || <span className='screen-reader-text'>Feature</span>}
						</th>

						{plans.map((_column, cellIndex) => {
							const cell = row?.cells?.[cellIndex] || { type: 'icon', value: false, text: '' };
							const cellClass = `${P}-cell${cellIndex === featuredIndex ? ' is-featured' : ''}`;

							if ('text' === cell.type) {
								return <td key={cellIndex} data-col={cellIndex} data-label={plans[cellIndex]?.label || ''} className={cellClass}>
									{cell.text || <>
										<span aria-hidden='true'>&mdash;</span>
										<span className='screen-reader-text'>Not specified</span>
									</>}
								</td>;
							}

							return <td key={cellIndex} data-col={cellIndex} data-label={plans[cellIndex]?.label || ''} className={cellClass}>
								<span className={`${P}-cell-icon ${cell.value ? 'is-yes' : 'is-no'}`}>
									{mark(!!cell.value)}
									<span className='screen-reader-text'>{cell.value ? 'Yes' : 'No'}</span>
								</span>
							</td>;
						})}
					</tr>)}
				</tbody>

			{'bottom' === ctaPosition && plans.some((column) => column?.ctaLabel) ? <tfoot>
				<tr>
					<th scope='row' data-col='feature' className={`${P}-row-label`}>
						{ctaFor(feature)}
					</th>

					{plans.map((column, index) => <td
						key={column?._key || `cta-${index}`}
						data-col={index}
						className={`${P}-cell ${P}-cta-cell${index === featuredIndex ? ' is-featured' : ''}`}
					>
						{ctaFor(column)}
					</td>)}
				</tr>
			</tfoot> : null}
			</table>
		</div>

		{bubble}
	</>;
};

export default ComparisonTable;
export { wrapperClasses };
