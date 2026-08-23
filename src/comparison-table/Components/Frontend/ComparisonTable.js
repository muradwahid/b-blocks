import { useCallback, useState } from 'react';

import { defaultCaption, migrate, P, wrapperClasses } from '../../utils/data';
import { checkIcon, crossIcon } from '../../utils/icons';

const ComparisonTable = ({ attributes }) => {
	// One shape regardless of when the block was saved — see utils/data.js.
	const { content = {}, icons = {}, columns = [], rows = [] } = migrate(attributes);


	const caption = content.caption;
	const featuredLabel = content.featuredLabel;
	const featureColumnLabel = content.featureColumnLabel || '';
	const checkStyle = icons.check || 'check';
	const crossStyle = icons.cross || 'times';
	const checkIconSvg = icons.checkSvg || '';
	const crossIconSvg = icons.crossSvg || '';

	const mark = (isYes) => {
		const custom = isYes ? checkIconSvg : crossIconSvg;

		return custom
			? <span className={`${P}-cell-glyph`} dangerouslySetInnerHTML={{ __html: custom }} />
			: (isYes ? checkIcon(checkStyle) : crossIcon(crossStyle));
	};

	// The bubble is rendered outside the table and positioned with fixed
	// coordinates. A CSS-only tooltip cannot work here: .…-scroll sets
	// overflow-x: auto, which forces overflow-y to compute to auto, so an
	// absolutely-positioned bubble is clipped by the scroll box on every row.
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

	const featuredIndex = columns.findIndex((column) => column?.isFeatured);
	const hasData = columns.length > 0 && rows.length > 0;
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
						{/* The feature-name column. Its heading is optional — left empty
					    it stays screen-reader-only, which is how the block shipped. */}
						<th scope='col' className={`${P}-feature-col`}>
							{featureColumnLabel
								? <span className={`${P}-col__label`}>{featureColumnLabel}</span>
								: <span className='screen-reader-text'>Feature</span>}
						</th>

						{columns.map((column, index) => {
							const isFeatured = !!column?.isFeatured;

							return <th key={column?._key || `col-${index}`} scope='col' data-col={index} className={`${P}-col${isFeatured ? ' is-featured' : ''}`}>
								{isFeatured && (column?.badge || featuredLabel)
									? <span className={`${P}-col__featured-badge`} aria-hidden='true'>{column?.badge || featuredLabel}</span>
									: null}

								{/* Icon and label share a flex box so the icon can be placed
							    on any of its four sides per breakpoint, while the
							    subtitle and CTA stay below regardless. */}
							{(column?.icon || column?.label) ? <span className={`${P}-col__head`}>
								{column?.icon ? <span className={`${P}-col__icon`} dangerouslySetInnerHTML={{ __html: column.icon }} /> : null}

								{column?.label ? <span className={`${P}-col__label`}>{column.label}</span> : null}
							</span> : null}

								{column?.subtitle ? <span className={`${P}-col__subtitle`}>{column.subtitle}</span> : null}

								{column?.ctaUrl && column?.ctaLabel
									? <a className={`${P}-col__cta`} href={column.ctaUrl} rel='noopener'>{column.ctaLabel}</a>
									: null}
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
									{/* data-tooltip is CSS-only, so the text needs a real
								    node for assistive tech to reach it. */}
									<span className='screen-reader-text'>{row.tooltip}</span>
								</span>
								: row?.label || <span className='screen-reader-text'>Feature</span>}
						</th>

						{columns.map((_column, cellIndex) => {
							const cell = row?.cells?.[cellIndex] || { type: 'icon', value: false, text: '' };
							const cellClass = `${P}-cell${cellIndex === featuredIndex ? ' is-featured' : ''}`;

							if ('text' === cell.type) {
								return <td key={cellIndex} data-col={cellIndex} data-label={columns[cellIndex]?.label || ''} className={cellClass}>
									{cell.text || <>
										<span aria-hidden='true'>&mdash;</span>
										<span className='screen-reader-text'>Not specified</span>
									</>}
								</td>;
							}

							return <td key={cellIndex} data-col={cellIndex} data-label={columns[cellIndex]?.label || ''} className={cellClass}>
								<span className={`${P}-cell-icon ${cell.value ? 'is-yes' : 'is-no'}`}>
									{mark(!!cell.value)}
									<span className='screen-reader-text'>{cell.value ? 'Yes' : 'No'}</span>
								</span>
							</td>;
						})}
					</tr>)}
				</tbody>
			</table>
		</div>

		{bubble}
	</>;
};

export default ComparisonTable;
export { wrapperClasses };
