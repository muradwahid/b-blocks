import { renderHTML } from '../../../utils/functions';

const MetaCategory = ({ post, attributes }) => {
	const { categories } = post;
	const { isMetaCategory, metaCategoryIn, metaCategoryIcon } = attributes;

	return (isMetaCategory && 'content' === metaCategoryIn && categories.coma) ? <span>
		{metaCategoryIcon ?
			<img src={metaCategoryIcon} alt='Author' /> :
			<span className='dashicons dashicons-category' />}

		{renderHTML(categories.coma)}
	</span> : null;
};
export default MetaCategory;