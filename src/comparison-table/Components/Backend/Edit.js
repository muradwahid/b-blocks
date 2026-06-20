import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

/**
 * Generate a unique key for new columns / rows. Stable per item so
 * React preserves input focus across reorders (lesson learned from the
 * FAQ block tester run).
 */
export const makeKey = (prefix = 'ct') =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Inline yes / no SVGs used inside the editor preview. Mirror the shapes
 * rendered server-side in render.php so the editor preview matches the
 * frontend exactly.
 */
const CheckSvg = ({ style }) => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' aria-hidden='true' focusable='false' style={style}>
		<path d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z' fill='currentColor' />
	</svg>
);

const TimesSvg = ({ style }) => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 352 512' aria-hidden='true' focusable='false' style={style}>
		<path d='M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z' fill='currentColor' />
	</svg>
);

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		caption,
		columns = [],
		rows = [],
		featuredLabel,
		theme,
		showRowStripes,
		stickyHeader,
		stickyFirstColumn,
		headerBg,
		headerTextColor,
		featuredBg,
		featuredTextColor,
		featuredColBg,
		featuredLabelBg,
		featuredLabelColor,
		rowLabelBg,
		rowLabelColor,
		rowStripeBg,
		bodyBg,
		bodyTextColor,
		checkColor,
		crossColor,
		borderColor,
		borderWidth,
		borderRadius,
		fontSize,
		headerFontSize,
		cellPaddingV,
		cellPaddingH,
		iconSize,
		tableMaxWidth,
		tableAlignment,
	} = attributes;

	const safeTheme = ['default', 'striped', 'bordered', 'dark'].includes(theme) ? theme : 'default';
	const safeAlignment = ['left', 'center', 'right'].includes(tableAlignment) ? tableAlignment : 'center';

	const featuredIndex = columns.findIndex((c) => c && c.isFeatured);

	const wrapperStyle = {
		'--bb-ct-header-bg': headerBg || '#1e293b',
		'--bb-ct-header-text': headerTextColor || '#ffffff',
		'--bb-ct-featured-bg': featuredBg || '#2563eb',
		'--bb-ct-featured-text': featuredTextColor || '#ffffff',
		'--bb-ct-featured-col-bg': featuredColBg || '#eff6ff',
		'--bb-ct-featured-label-bg': featuredLabelBg || '#f59e0b',
		'--bb-ct-featured-label-color': featuredLabelColor || '#ffffff',
		'--bb-ct-row-label-bg': rowLabelBg || 'transparent',
		'--bb-ct-row-label-color': rowLabelColor || 'inherit',
		'--bb-ct-row-stripe-bg': rowStripeBg || '#f8fafc',
		'--bb-ct-body-bg': bodyBg || '#ffffff',
		'--bb-ct-body-text': bodyTextColor || '#1f2937',
		'--bb-ct-check-color': checkColor || '#16a34a',
		'--bb-ct-cross-color': crossColor || '#dc2626',
		'--bb-ct-border-color': borderColor || '#e2e8f0',
		'--bb-ct-border-width': `${parseInt(borderWidth, 10) || 0}px`,
		'--bb-ct-border-radius': `${parseInt(borderRadius, 10) || 0}px`,
		'--bb-ct-font-size': `${parseInt(fontSize, 10) || 15}px`,
		'--bb-ct-header-font-size': `${parseInt(headerFontSize, 10) || 16}px`,
		'--bb-ct-cell-padding-v': `${parseInt(cellPaddingV, 10) || 0}px`,
		'--bb-ct-cell-padding-h': `${parseInt(cellPaddingH, 10) || 0}px`,
		'--bb-ct-icon-size': `${parseInt(iconSize, 10) || 18}px`,
		'--bb-ct-max-width': `${parseInt(tableMaxWidth, 10) || 900}px`,
	};

	const wrapperClasses = [
		'bb-ct-block',
		`bb-ct-theme--${safeTheme}`,
		`bb-ct-align--${safeAlignment}`,
		showRowStripes ? 'has-row-stripes' : '',
		stickyHeader ? 'has-sticky-header' : '',
		stickyFirstColumn ? 'has-sticky-first-col' : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const iconPxStyle = {
		width: `${parseInt(iconSize, 10) || 18}px`,
		height: `${parseInt(iconSize, 10) || 18}px`,
	};

	const hasData = columns.length > 0 && rows.length > 0;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<span className='bb-ct-editor-caption'>
					{__('Comparison Table preview', 'b-blocks')}
				</span>

				{!hasData ? (
					<p className='bb-ct-empty'>
						{__('No comparison data to display. Add columns and rows in the block sidebar.', 'b-blocks')}
					</p>
				) : (
					<div className='bb-ct-scroll'>
						<table className='bb-ct-table'>
							<caption className='bb-ct-caption screen-reader-text'>
								{caption || __('Feature comparison across plans', 'b-blocks')}
							</caption>

							<thead>
								<tr>
									<th scope='col'>
										<span className='screen-reader-text'>{__('Feature', 'b-blocks')}</span>
									</th>
									{columns.map((col, idx) => {
										const isFeatured = !!(col && col.isFeatured);
										const thClasses = `bb-ct-col${isFeatured ? ' is-featured' : ''}`;
										return (
											<th
												key={(col && col._key) || `col-${idx}`}
												scope='col'
												className={thClasses}
											>
												{isFeatured && featuredLabel && (
													<span className='bb-ct-col__featured-badge' aria-hidden='true'>
														{featuredLabel}
													</span>
												)}
												<span className='bb-ct-col__label'>
													{(col && col.label) || __('Untitled', 'b-blocks')}
												</span>
												{col && col.subtitle && (
													<span className='bb-ct-col__subtitle'>{col.subtitle}</span>
												)}
												{col && col.ctaUrl && col.ctaLabel && (
													<span className='bb-ct-col__cta' aria-hidden='true'>
														{col.ctaLabel}
													</span>
												)}
											</th>
										);
									})}
								</tr>
							</thead>

							<tbody>
								{rows.map((row, rIdx) => (
									<tr key={(row && row._key) || `row-${rIdx}`}>
										<th scope='row' className='bb-ct-row-label'>
											{row && row.tooltip ? (
												<abbr className='bb-ct-tooltip' title={row.tooltip}>
													{row.label || __('Feature', 'b-blocks')}
												</abbr>
											) : (
												(row && row.label) || __('Feature', 'b-blocks')
											)}
										</th>
										{columns.map((_, cIdx) => {
											const cell = (row && row.cells && row.cells[cIdx]) || { type: 'icon', value: false, text: '' };
											const isFeatured = cIdx === featuredIndex;
											const tdClass = `bb-ct-cell${isFeatured ? ' is-featured' : ''}`;
											if (cell.type === 'text') {
												return (
													<td key={cIdx} className={tdClass}>
														{cell.text || <span aria-hidden='true'>&mdash;</span>}
													</td>
												);
											}
											return (
												<td key={cIdx} className={tdClass}>
													{cell.value ? (
														<span className='bb-ct-cell-icon is-yes'>
															<CheckSvg style={iconPxStyle} />
															<span className='screen-reader-text'>{__('Yes', 'b-blocks')}</span>
														</span>
													) : (
														<span className='bb-ct-cell-icon is-no'>
															<TimesSvg style={iconPxStyle} />
															<span className='screen-reader-text'>{__('No', 'b-blocks')}</span>
														</span>
													)}
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
};

export default Edit;
