/**
 * Article Card — shared frontend markup.
 *
 * Rendered by view.js on the frontend. Mirrors the editor output produced by
 * Edit.js so the card looks identical in both places. All per-instance styling
 * (colors, layout, spacing, typography) is emitted as scoped CSS by <Style>;
 * this component only builds the markup and its alignment/CTA modifier classes.
 */

import { __ } from '@wordpress/i18n';

const NewTabHint = () => <span className='screen-reader-text'>{__('(opens in a new tab)', 'b-blocks')}</span>;

const CtaArrow = () => (
	<svg className='b-blocks-article-card-cta-arrow' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
		<path
			d='M5 12h14M13 6l6 6-6 6'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

const ArticleCard = ({ attributes }) => {
	const { image = {}, content = {}, link = {} } = attributes;
	const { url: imageUrl = {}, alt: imageAlt = '' } = image;
	const { badge, heading, headingTag, excerpt, meta, metaIcon } = content;
	const { url: linkUrl, target: linkTarget, ctaLabel, ctaStyle, cardLinkMode } = link;

	const HeadingTag = headingTag || 'h3';
	const headingPlain = (heading || '').replace(/<[^>]*>/g, '').trim();

	// Responsive image: desktop is the base <img>; tablet/mobile override via <source>.
	const pick = (o) => o?.desktop || o?.tablet || o?.mobile || '';
	const imgSrc = pick(imageUrl);
	const imgAltText = imageAlt || headingPlain;

	// Card-link mode needs a destination; without one it degrades to standard.
	const isCardLink = !!cardLinkMode && !!linkUrl;
	const hasCta = !isCardLink && !!ctaLabel;

	// Layout direction / image position are applied as responsive CSS by <Style>.
	const wrapperClass = [
		'b-blocks-article-card',
		`b-blocks-article-card--cta-${ctaStyle}`,
	]
		.filter(Boolean)
		.join(' ');

	const Media = imgSrc ? (
		<div className='b-blocks-article-card-media'>
			<picture className='b-blocks-article-card-picture'>
				{imageUrl.mobile ? <source media='(max-width: 640px)' srcSet={imageUrl.mobile} /> : null}
				{imageUrl.tablet ? <source media='(max-width: 1024px)' srcSet={imageUrl.tablet} /> : null}
				<img
					className='b-blocks-article-card-img'
					src={imgSrc}
					alt={imgAltText}
					loading='lazy'
					decoding='async'
				/>
			</picture>
		</div>
	) : null;

	const Body = (
		<div className='b-blocks-article-card-body'>
			{badge ? <span className='b-blocks-article-card-badge'>{badge}</span> : null}

			{heading ? (
				<HeadingTag
					className='b-blocks-article-card-heading'
					dangerouslySetInnerHTML={{ __html: heading }}
				/>
			) : null}

			{excerpt ? (
				<p
					className='b-blocks-article-card-excerpt'
					dangerouslySetInnerHTML={{ __html: excerpt }}
				/>
			) : null}

			{meta ? (
				<span className='b-blocks-article-card-meta'>
					{metaIcon ? <span className='b-blocks-article-card-meta-icon' aria-hidden='true' dangerouslySetInnerHTML={{ __html: metaIcon }} /> : null}
					<span className='b-blocks-article-card-meta-text'>{meta}</span>
				</span>
			) : null}

			{hasCta ? (
				linkUrl ? (
					<a
						className='b-blocks-article-card-cta'
						href={linkUrl}
						{...(linkTarget ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
					>
						<span className='b-blocks-article-card-cta-label'>{ctaLabel}</span>
						{ctaStyle === 'link' ? <CtaArrow /> : null}
						{linkTarget ? <NewTabHint /> : null}
					</a>
				) : (
					<span className='b-blocks-article-card-cta'>
						<span className='b-blocks-article-card-cta-label'>{ctaLabel}</span>
						{ctaStyle === 'link' ? <CtaArrow /> : null}
					</span>
				)
			) : null}
		</div>
	);

	return (
		<div className={wrapperClass}>
			<article className='b-blocks-article-card-card'>
				{isCardLink ? (
					<a
						className='b-blocks-article-card-link'
						href={linkUrl}
						aria-label={headingPlain || __('Read article', 'b-blocks')}
						{...(linkTarget ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
					>
						{Media}
						{Body}
						{linkTarget ? <NewTabHint /> : null}
					</a>
				) : (
					<>
						{Media}
						{Body}
					</>
				)}
			</article>
		</div>
	);
};
export default ArticleCard;
