import { prefix } from '../../../utils/data';

const FeatureImage = ({ post, attributes }) => {
	const { link, thumbnail: { url: thumbUrl, alt: thumbAlt }, categories } = post;
	const { isFImg, isFImgLink, isMeta, isMetaCategory, metaCategoryIn, isLinkNewTab } = attributes;

	return (isFImg && thumbUrl) ? <figure className={`${prefix}ElThumb`}>
		{isFImgLink ? <a href={link} target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer' aria-label={thumbAlt}>
			<img src={thumbUrl} alt={thumbAlt} />
		</a> : <img src={thumbUrl} alt={thumbAlt} />}

		{(isMeta && isMetaCategory && 'image' === metaCategoryIn && categories.space) && <div className={`${prefix}ElThumbCats`} dangerouslySetInnerHTML={{ __html: categories.space }} />}
	</figure> : null;
};
export default FeatureImage;