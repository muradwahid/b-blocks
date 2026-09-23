import { __ } from '@wordpress/i18n';

import { prefix, profileURL } from '../../utils/data';

const FollowBtn = ({ attributes, username = '', isBackend = false }) => {
	const { elements = {} } = attributes;

	if (!elements.followButton) return null;

	return <a
		className={`${prefix}-follow`}
		href={isBackend ? '#' : profileURL(username)}
		target={isBackend ? '_self' : '_blank'}
		rel='noreferrer noopener'
		onClick={(e) => {
			if (isBackend) {
				e.preventDefault();
			}
		}}
	>
		{elements.followLabel || __('Follow On Instagram', 'b-blocks')}
	</a>;
};

export default FollowBtn;
