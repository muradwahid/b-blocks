import { __ } from '@wordpress/i18n';

import { prefix, profileURL } from '../../utils/data';

const FollowBtn = ({ attributes, username = '' }) => {
	const { elements = {} } = attributes;

	if (!elements.followButton) return null;

	return <a className={`${prefix}-follow`} href={profileURL(username)} target='_blank' rel='noreferrer noopener'>
		{elements.followLabel || __('Follow On Instagram', 'b-blocks')}
	</a>;
};

export default FollowBtn;
