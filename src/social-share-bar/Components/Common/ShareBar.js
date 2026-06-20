import { __, sprintf } from '@wordpress/i18n';

import { PLATFORMS } from './platforms';

/**
 * Editor preview of the share bar. The real frontend markup is produced by
 * render.php; this component mirrors it closely so authors get an accurate
 * preview while styling. No live share links are emitted in the editor.
 *
 * @param {Object} props
 * @param {Object} props.attributes Block attributes.
 */
const ShareBar = ( { attributes } ) => {
	const { platforms, showLabels, copyLabel } = attributes;

	const enabled = ( platforms || [] ).filter( ( key ) => PLATFORMS[ key ] );

	return (
		<div className="bb-ssb-inner" role="region" aria-label={ __( 'Share this page', 'b-blocks' ) }>
			<ul className="bb-ssb-list">
				{ enabled.map( ( key ) => {
					const meta = PLATFORMS[ key ];
					const isCopy = key === 'copy';
					const label = isCopy
						? ( copyLabel || __( 'Copy', 'b-blocks' ) )
						: meta.label;
					const ariaLabel = isCopy
						? __( 'Copy link', 'b-blocks' )
						: sprintf(
							/* translators: %s: social platform name. */
							__( 'Share on %s', 'b-blocks' ),
							meta.label
						);

					const inner = (
						<>
							<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
								<path d={ meta.path } />
							</svg>
							{ showLabels && (
								<span className="bb-ssb-label" aria-hidden="true">
									{ label }
								</span>
							) }
						</>
					);

					return (
						<li key={ key } className="bb-ssb-item">
							{ isCopy ? (
								<button
									type="button"
									className="bb-ssb-btn"
									data-bb-ssb-platform={ key }
									aria-label={ ariaLabel }
								>
									{ inner }
								</button>
							) : (
								<span
									className="bb-ssb-btn"
									data-bb-ssb-platform={ key }
									aria-label={ ariaLabel }
									role="link"
								>
									{ inner }
								</span>
							) }
						</li>
					);
				} ) }
			</ul>
		</div>
	);
};

export default ShareBar;
