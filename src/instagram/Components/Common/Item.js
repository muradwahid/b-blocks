import { prefix } from '../../utils/data';
import { carouselIcon, playIcon } from '../../utils/icons';
import { captionNodes, mediaThumb, trimCaption } from '../../utils/options';

/**
 * One tile. The lightbox takes precedence over the permalink: when it is on the
 * tile is a button, otherwise a link out to Instagram, and failing both a plain
 * figure so the markup never carries an interactive element that does nothing.
 */
const Item = ({ attributes, feed = {}, index, onOpen }) => {
	const { elements = {}, caption = {} } = attributes;
	const { media_type: type = 'IMAGE', caption: text = '' } = feed;

	const style = caption.style || 'overlay-center';
	const body = elements.caption ? trimCaption(text, elements) : '';

	const Caption = () => body
		? <div className={`${prefix}-caption`}><p>{captionNodes(body, elements.linkHashtags)}</p></div>
		: null;

	const inner = <>
		<figure className={`${prefix}-figure`}>
			<img className={`${prefix}-image`} src={mediaThumb(feed)} alt={trimCaption(text, { stripHashtags: true, captionLength: 120 })} loading='lazy' />

			<span className={`${prefix}-overlay`} />

			{elements.mediaIcon && 'IMAGE' !== type && <span className={`${prefix}-type`}>
				{'VIDEO' === type ? playIcon : carouselIcon}
			</span>}

			{style.startsWith('overlay') && <Caption />}
		</figure>

		{'below' === style && <Caption />}
	</>;

	if (elements.lightbox) {
		return <div className={`${prefix}-item`}>
			<button type='button' className={`${prefix}-open`} onClick={() => onOpen(index)}>{inner}</button>
		</div>;
	}

	if (elements.linkPosts && feed.permalink) {
		return <div className={`${prefix}-item`}>
			<a className={`${prefix}-open`} href={feed.permalink} target={elements.openInNewTab ? '_blank' : '_self'} rel='noreferrer noopener'>{inner}</a>
		</div>;
	}

	return <div className={`${prefix}-item`}>{inner}</div>;
};

export default Item;
