import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, RichText, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { quoteIconPath } from '../../utils/options';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const LAYOUT_VALUES = ['border', 'quotation'];
const ALIGN_VALUES = ['left', 'center', 'right'];

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;
	const { quote = {}, authorName = {}, authorRole = {}, avatar = {}, layout = {} } = attributes;

	const { text: quoteText } = quote;
	const { text: name } = authorName;
	const { text: role, show: showRole } = authorRole;
	const { show: showAvatar, url: avatarUrl, alt: avatarAlt, size: avatarSize } = avatar;
	const avatarPx = parseInt(avatarSize, 10) || 48;

	const isPremium = bBlocksPremiumChecker;
	const updateObj = updateAttributes(attributes, setAttributes);

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
			? sprintf(__('Photo of %s', 'b-blocks'), name)
			: '');

	return <>
		<BlockControls>
			<AlignmentToolbar value={safeAlign} onChange={(val) => updateObj('layout', val || 'left', 'alignment')} />
		</BlockControls>

		<Settings {...{ attributes, setAttributes, updateObj, isPremium, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<div>
				<div>

					<figure className={figureClasses}>
						{'quotation' === safeLayout && (
							<span className='bBlocks-blockquote-icon' aria-hidden='true'>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 435 332" fill='currentColor' focusable='false'><path d={quoteIconPath} /></svg>
							</span>
						)}

						<blockquote className='bBlocks-blockquote-quote'>
							<RichText
								tagName='p'
								className='bBlocks-blockquote-quoteText'
								value={quoteText || ''}
								onChange={(val) => updateObj('quote', val, 'text')}
								placeholder={__('Type the quote…', 'b-blocks')}
								allowedFormats={['core/bold', 'core/italic', 'core/link']}
							/>
						</blockquote>

						{hasCite && (
							<figcaption className='bBlocks-blockquote-caption'>
								{hasAvatar && (
									<img
										className='bBlocks-blockquote-avatar'
										src={avatarUrl}
										alt={avatarAltText}
										width={avatarPx}
										height={avatarPx}
									/>
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
			</div>
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);
