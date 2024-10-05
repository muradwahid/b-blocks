import { renderHTML } from '../../../utils/functions';

const MetaTaxonomies = ({ post, attributes }) => {
	const { taxonomies = {} } = post;
	const { metaTaxonomies = {} } = attributes;
	const { selected = [] } = metaTaxonomies;

	return selected.map(s => {
		const tax = taxonomies[s];
		const icon = metaTaxonomies[s]?.icon;
		const iconEl = icon ? <img src={icon} alt={s} /> : <span className={`dashicons ${'post_tag' === s ? 'dashicons-tag' : 'dashicons-category'}`} />

		if (!tax) {
			return null;
		}

		return <span key={s}>
			{iconEl}
			{renderHTML(tax?.split('a><a')?.join('a>, <a'))}
		</span>
	});
};
export default MetaTaxonomies;