import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const Star = ({ on, size }) => (
	<svg
		className={`bb-tc-star ${on ? 'bb-tc-star--on' : 'bb-tc-star--off'}`}
		viewBox='0 0 24 24'
		width={size}
		height={size}
		aria-hidden='true'
		focusable='false'
	>
		<path
			fill={on ? 'var(--bb-tc-accent)' : '#d1d5db'}
			d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z'
		/>
	</svg>
);

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		reviewText,
		reviewerName,
		reviewerRole,
		reviewerCompany,
		avatarUrl,
		rating,
		layout,
		avatarPosition,
		avatarSize,
		avatarShape,
		showCompany,
		showAvatar,
		showRating,
		quoteIcon,
		quoteIconColor,
		accentColor,
		cardBg,
		textColor,
		nameColor,
		metaColor,
		borderColor,
		borderWidth,
		borderRadius,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		textFontSize,
		textFontWeight,
		nameFontSize,
		nameFontWeight,
		metaFontSize,
		starSize,
		alignment,
		maxWidth,
		bubbleTailPosition,
	} = attributes;

	const safeRating = clamp(parseInt(rating, 10) || 0, 0, 5);
	const safeAvatarSize = clamp(parseInt(avatarSize, 10) || 56, 32, 120);
	const safeStarSize = clamp(parseInt(starSize, 10) || 18, 10, 32);

	const avatarRadius = avatarShape === 'rounded' ? '12px' : avatarShape === 'square' ? '0px' : '50%';

	const wrapperClass = [
		`bb-tc--${layout}`,
		`bb-tc--avatar-${avatarPosition}`,
		`bb-tc--align-${alignment}`,
		layout === 'bubble' ? (bubbleTailPosition === 'bottom-right' ? 'bb-tc--tail-br' : 'bb-tc--tail-bl') : '',
	].filter(Boolean).join(' ');

	const wrapperStyle = {
		'--bb-tc-accent': accentColor || '#0d6efd',
		'--bb-tc-card-bg': cardBg || '#ffffff',
		'--bb-tc-border-width': `${clamp(parseInt(borderWidth, 10) || 0, 0, 8)}px`,
		'--bb-tc-border-radius': `${clamp(parseInt(borderRadius, 10) || 0, 0, 48)}px`,
		'--bb-tc-pt': `${clamp(parseInt(paddingTop, 10) || 0, 0, 96)}px`,
		'--bb-tc-pr': `${clamp(parseInt(paddingRight, 10) || 0, 0, 96)}px`,
		'--bb-tc-pb': `${clamp(parseInt(paddingBottom, 10) || 0, 0, 96)}px`,
		'--bb-tc-pl': `${clamp(parseInt(paddingLeft, 10) || 0, 0, 96)}px`,
		'--bb-tc-text-size': `${clamp(parseInt(textFontSize, 10) || 16, 12, 32)}px`,
		'--bb-tc-text-weight': textFontWeight || '400',
		'--bb-tc-name-size': `${clamp(parseInt(nameFontSize, 10) || 16, 12, 28)}px`,
		'--bb-tc-name-weight': nameFontWeight || '700',
		'--bb-tc-meta-size': `${clamp(parseInt(metaFontSize, 10) || 13, 10, 20)}px`,
		'--bb-tc-star-size': `${safeStarSize}px`,
		'--bb-tc-avatar-size': `${safeAvatarSize}px`,
		'--bb-tc-avatar-radius': avatarRadius,
	};
	if (textColor) wrapperStyle['--bb-tc-text'] = textColor;
	if (nameColor) wrapperStyle['--bb-tc-name-color'] = nameColor;
	if (metaColor) wrapperStyle['--bb-tc-meta-color'] = metaColor;
	if (borderColor) wrapperStyle['--bb-tc-border-color'] = borderColor;
	if (quoteIconColor) wrapperStyle['--bb-tc-quote-color'] = quoteIconColor;
	if (parseInt(maxWidth, 10) > 0) {
		wrapperStyle['--bb-tc-max-width'] = `${clamp(parseInt(maxWidth, 10), 300, 1200)}px`;
	}

	const blockProps = useBlockProps({ className: wrapperClass, style: wrapperStyle });

	const metaItems = [];
	if (reviewerRole) metaItems.push(reviewerRole);
	if (showCompany && reviewerCompany) metaItems.push(reviewerCompany);

	const hasAttribution = reviewerName || metaItems.length > 0;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(val) => setAttributes({ alignment: val || 'left' })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<figure className='bb-tc'>
					{quoteIcon && (
						<svg className='bb-tc-quote-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
							<path fill='currentColor' d='M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6z' />
						</svg>
					)}

					{showRating && safeRating > 0 && (
						<span
							className='bb-tc-stars'
							role='img'
							aria-label={sprintf(
								/* translators: %d: rating value out of 5 */
								__('Rating: %d out of 5 stars', 'b-blocks'),
								safeRating
							)}
						>
							{[1, 2, 3, 4, 5].map((i) => (
								<Star key={i} on={i <= safeRating} size={safeStarSize} />
							))}
						</span>
					)}

					<RichText
						tagName='blockquote'
						className='bb-tc-quote'
						value={reviewText}
						onChange={(val) => setAttributes({ reviewText: val })}
						placeholder={__('Write the testimonial…', 'b-blocks')}
						allowedFormats={['core/bold', 'core/italic', 'core/link']}
					/>

					{(showAvatar && avatarUrl) || hasAttribution ? (
						<figcaption className='bb-tc-caption'>
							{showAvatar && avatarUrl && (
								<img
									className='bb-tc-avatar'
									src={avatarUrl}
									alt={reviewerName
										? sprintf(
											/* translators: %s: reviewer name */
											__('Avatar of %s', 'b-blocks'),
											reviewerName
										)
										: __('Reviewer avatar', 'b-blocks')}
									width={safeAvatarSize}
									height={safeAvatarSize}
								/>
							)}

							{hasAttribution && (
								<cite className='bb-tc-cite'>
									<RichText
										tagName='span'
										className='bb-tc-name'
										value={reviewerName}
										onChange={(val) => setAttributes({ reviewerName: val })}
										placeholder={__('Reviewer name', 'b-blocks')}
										allowedFormats={[]}
									/>
									{metaItems.length > 0 && (
										<span className='bb-tc-meta'>{metaItems.join(', ')}</span>
									)}
								</cite>
							)}
						</figcaption>
					) : null}
				</figure>
			</div>
		</>
	);
};

export default Edit;
