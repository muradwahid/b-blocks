import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings';

/**
 * Editor live preview.
 *
 * This mirrors the markup, classes and CSS custom properties produced by
 * render.php so the block looks 1:1 with the frontend while you design it.
 * It uses sample adjacent-post data (the real preview depends on the current
 * post's neighbours, which don't exist in the editor) and renders non-clickable
 * <span> tiles instead of <a> so the editor canvas stays interactive.
 */

const ARROW_GLYPHS = {
	chevron: { prev: '‹', next: '›' },
	arrow: { prev: '←', next: '→' },
	angle: { prev: '«', next: '»' },
};

const ALIGN_MAP = { left: 'flex-start', center: 'center', right: 'flex-end' };

const SHADOW_MAP = {
	none: 'none',
	sm: '0 1px 3px rgba(15, 23, 42, 0.10)',
	md: '0 4px 12px rgba(15, 23, 42, 0.10)',
	lg: '0 10px 28px rgba(15, 23, 42, 0.14)',
};

const SAMPLE = {
	prev: { title: __( 'A previous post title goes here', 'b-blocks' ), category: __( 'Category', 'b-blocks' ), date: __( 'Jan 1, 2025', 'b-blocks' ) },
	next: { title: __( 'A next post title goes here', 'b-blocks' ), category: __( 'Category', 'b-blocks' ), date: __( 'Jan 8, 2025', 'b-blocks' ) },
};

// Build the per-instance CSS custom properties — kept in lockstep with render.php.
const buildStyleVars = ( a ) => {
	const maxWidth = a.maxWidth || 0;
	const hoverBg = a.hoverBg || a.cardBg || 'transparent';
	const hoverTitle = a.hoverTitleColor || a.titleColor || 'inherit';

	return {
		'--bb-pn-gap': `${ a.gap }px`,
		'--bb-pn-max-width': maxWidth > 0 ? `${ maxWidth }px` : 'none',
		'--bb-pn-justify': ALIGN_MAP[ a.blockAlign ] || 'center',
		'--bb-pn-thumb-height': `${ a.thumbnailHeight }px`,
		'--bb-pn-card-bg': a.cardBg || 'transparent',
		'--bb-pn-card-border-color': a.cardBorderColor || '#e2e8f0',
		'--bb-pn-card-border-width': `${ a.cardBorderWidth }px`,
		'--bb-pn-card-radius': `${ a.cardRadius }px`,
		'--bb-pn-card-padding-v': `${ a.cardPaddingV }px`,
		'--bb-pn-card-padding-h': `${ a.cardPaddingH }px`,
		'--bb-pn-card-shadow': SHADOW_MAP[ a.cardShadow ] || 'none',
		'--bb-pn-overlay-color': a.overlayColor || 'transparent',
		'--bb-pn-overlay-opacity': ( a.overlayOpacity ?? 30 ) / 100,
		'--bb-pn-label-color': a.labelColor || 'inherit',
		'--bb-pn-label-size': `${ a.labelSize }px`,
		'--bb-pn-label-weight': a.labelWeight,
		'--bb-pn-title-color': a.titleColor || 'inherit',
		'--bb-pn-title-size': `${ a.titleSize }px`,
		'--bb-pn-title-weight': a.titleWeight,
		'--bb-pn-title-lines': a.titleLines > 0 ? a.titleLines : 'none',
		'--bb-pn-meta-color': a.metaColor || 'inherit',
		'--bb-pn-meta-size': `${ a.metaSize }px`,
		'--bb-pn-accent': a.accentColor || '#0073aa',
		'--bb-pn-hover-bg': hoverBg,
		'--bb-pn-hover-title': hoverTitle,
		'--bb-pn-transition': `${ a.transitionDuration }ms`,
	};
};

const Tile = ( { a, direction } ) => {
	const isPrev = 'prev' === direction;
	const isCard = 'card' === a.layout;
	const glyph = ( ARROW_GLYPHS[ a.arrowIcon ] || ARROW_GLYPHS.chevron )[ direction ];
	const sample = SAMPLE[ direction ];
	const TitleTag = a.titleTag || 'p';

	const defaultLabel = isPrev ? __( 'Previous Post', 'b-blocks' ) : __( 'Next Post', 'b-blocks' );
	const rawLabel = isPrev ? a.prevLabel : a.nextLabel;
	const label = rawLabel && rawLabel.trim() ? rawLabel : defaultLabel;

	return (
		<span className={ `bb-pn-tile bb-pn-tile--${ direction }` }>
			{ isCard && a.showThumbnail && (
				<span className='bb-pn-thumb' aria-hidden='true'>
					<span
						className='bb-pn-thumb-img'
						style={ { background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' } }
					/>
					{ a.overlayColor ? <span className='bb-pn-thumb-overlay' /> : null }
				</span>
			) }

			<span className='bb-pn-tile-inner'>
				{ a.showArrowIcon && <span className='bb-pn-arrow' aria-hidden='true'>{ glyph }</span> }

				<span className='bb-pn-body'>
					{ a.showLabel && <span className='bb-pn-label'>{ label }</span> }
					{ a.showCategory && <span className='bb-pn-category'>{ sample.category }</span> }
					<TitleTag className='bb-pn-title'>{ sample.title }</TitleTag>
					{ a.showDate && <time className='bb-pn-date'>{ sample.date }</time> }
				</span>
			</span>
		</span>
	);
};

const Edit = ( props ) => {
	const { attributes } = props;

	const wrapperClasses = [
		'bb-pn',
		`bb-pn--layout-${ attributes.layout }`,
		`bb-pn--align-${ attributes.alignment }`,
		attributes.maxWidth > 0 ? 'bb-pn--has-max-width' : '',
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		className: wrapperClasses,
		style: buildStyleVars( attributes ),
	} );

	return <>
		<Settings { ...props } />

		<nav { ...blockProps } aria-label={ __( 'Post navigation', 'b-blocks' ) }>
			<div className='bb-pn-row'>
				{ attributes.showPrev && <Tile a={ attributes } direction='prev' /> }
				{ attributes.showNext && <Tile a={ attributes } direction='next' /> }
			</div>
		</nav>
	</>;
};

export default Edit;
