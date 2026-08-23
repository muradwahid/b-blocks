/**
 * Hero Section — shared frontend markup.
 *
 * Rendered by view.js on the frontend (React hydration). Mirrors the editor
 * output produced by Edit.js so the hero looks identical in both places. All
 * per-instance styling (colors, layout, spacing, typography, background) is
 * emitted as scoped CSS by <Style>; this component only builds the markup and
 * its background/alignment modifier classes.
 */

import { __ } from '@wordpress/i18n';

const NewTabHint = () => <span className='screen-reader-text'>{__('(opens in a new tab)', 'b-blocks')}</span>;

const hasText = (val) => !!(val || '').replace(/<[^>]*>/g, '').trim();

const HeroSection = ({ attributes, id }) => {
	const { eyebrow = {}, heading = {}, subHeading = {}, button = {} } = attributes;

	const HeadingTag = ['h1', 'h2', 'h3'].includes(heading.tag) ? heading.tag : 'h1';
	const headingId = id ? `${id}-heading` : undefined;

	const showPrimary = !!button.show && hasText(button.text);

	return (
		<div className='b-blocks-hero-section' {...(headingId ? { 'aria-labelledby': headingId } : {})}>
			<div className='b-blocks-hero-section-container'>
				{!!eyebrow.show && hasText(eyebrow.text) ? (
					<span className='b-blocks-hero-section-eyebrow' dangerouslySetInnerHTML={{ __html: eyebrow.text }} />
				) : null}

				{hasText(heading.text) ? (
					<HeadingTag
						id={headingId}
						className='b-blocks-hero-section-heading'
						dangerouslySetInnerHTML={{ __html: heading.text }}
					/>
				) : null}

				{!!subHeading.show && hasText(subHeading.text) ? (
					<p className='b-blocks-hero-section-subheading' dangerouslySetInnerHTML={{ __html: subHeading.text }} />
				) : null}

				{showPrimary ? (
					<div className='b-blocks-hero-section-actions'>
						<a
							className='b-blocks-hero-section-cta b-blocks-hero-section-cta--primary'
							href={button.url || '#'}
							{...(button.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
						>
							<span dangerouslySetInnerHTML={{ __html: button.text }} />
							{button.newTab ? <NewTabHint /> : null}
						</a>
					</div>
				) : null}
			</div>
		</div>
	);
};
export default HeroSection;