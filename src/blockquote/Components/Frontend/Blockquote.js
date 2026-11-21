import { __, sprintf } from '@wordpress/i18n';

import { quoteIconPath } from '../../utils/options';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const LAYOUT_VALUES = ['border', 'quotation'];
const ALIGN_VALUES = ['left', 'center', 'right'];

const Blockquote = ({ attributes }) => {
	const { quote = {}, authorName = {}, authorRole = {}, avatar = {}, layout = {} } = attributes;

	const { text: quoteText } = quote;
	const { text: name } = authorName;
	const { text: role, show: showRole } = authorRole;
	const { show: showAvatar, url: avatarUrl, alt: avatarAlt, size: avatarSize } = avatar;
	const avatarPx = parseInt(avatarSize, 10) || 48;

	const safeLayout = LAYOUT_VALUES.includes(layout.type) ? layout.type : 'border';
	const safeAlign = ALIGN_VALUES.includes(layout.alignment) ? layout.alignment : 'left';

	const figureClasses = [
		'bBlocks-blockquote-wrapper',
		`bBlocks-blockquote-layout-${safeLayout}`,
		`bBlocks-blockquote-align-${safeAlign}`,
	].join(' ');

	const hasAvatar = showAvatar && !!avatarUrl;
	const hasName = !!(name && name.trim());
	const hasRole = showRole && !!(role && role.trim());
	const hasCite = hasAvatar || hasName || hasRole;

	const avatarAltText = avatarAlt
		|| (hasName
			? sprintf( /* translators: %s: author display name */ __('Photo of %s', 'b-blocks'), name)
			: '');

	const figureAriaLabel = hasName
		? sprintf( /* translators: %s: author display name */ __('Quote by %s', 'b-blocks'), name)
		: __('Pull quote', 'b-blocks');

	return (
		<div>
			<figure className={figureClasses} role='figure' aria-label={figureAriaLabel}>
				{'quotation' === safeLayout && (
					<span className='bBlocks-blockquote-icon' aria-hidden='true'>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 435 332" fill='currentColor' focusable='false'>
							<path d={quoteIconPath} />
						</svg>
					</span>
				)}

				<blockquote className='bBlocks-blockquote-quote'>
					<p className='bBlocks-blockquote-quoteText' dangerouslySetInnerHTML={{ __html: sanitizeHtml( quoteText || '' ) }} />
				</blockquote>

				{hasCite && (
					<figcaption className='bBlocks-blockquote-caption'>
						{hasAvatar && (
							<img className='bBlocks-blockquote-avatar' src={avatarUrl} alt={avatarAltText} width={avatarPx} height={avatarPx} loading='lazy' decoding='async' />
						)}
						{(hasName || hasRole) && (
							<cite className='bBlocks-blockquote-cite'>
								{hasName && (
									<span className='bBlocks-blockquote-author'>{name}</span>
								)}
								{hasRole && (
									<span className='bBlocks-blockquote-role'>{role}</span>
								)}
							</cite>
						)}
					</figcaption>
				)}
			</figure>
		</div>
	);
};
export default Blockquote;