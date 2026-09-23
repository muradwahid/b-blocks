import { __ } from '@wordpress/i18n';

import Button from './Button';
import Caption from './Caption';
import Item from './Item';
import Lightbox from './Lightbox';
import Profile from './Profile';

const Style = (props) => <>
	<Item {...props} />

	<Caption {...props} />

	<Profile {...props} />

	{props.attributes?.elements?.followButton && <Button {...props} group='followBtn' title={__('Follow Button', 'b-blocks')} size={13} />}

	{props.attributes?.elements?.loadMore && <Button {...props} group='loadMoreBtn' title={__('Load More Button', 'b-blocks')} size={14} />}

	<Lightbox {...props} />
</>;

export default Style;
