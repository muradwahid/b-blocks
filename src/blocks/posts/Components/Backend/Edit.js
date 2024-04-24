import { useEffect } from 'react';
import { withSelect } from '@wordpress/data';
const { dateI18n } = wp.date;

import { tabController } from '../../../../../../Components/utils/functions';

import Settings from './Settings/Settings';
import Loading from './Loading';
import NoPosts from './NoPosts';
import { filterNaN, filterObject, filterPassword, wordCount } from '../../utils/functions';
import Posts from './Posts';
import usePremiumInEditor from '../../../../hooks/usePremiumInEditor';

const Edit = props => {
	const { attributes, setAttributes, className, clientId, isSelected, totalPosts, posts, taxOfPostType } = props;

	const { isPremium } = usePremiumInEditor();

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} posts={posts} taxOfPostType={taxOfPostType} />

		{!posts ?
			<Loading /> :

			posts?.length ?
				<div className={className} id={`bBlocksPosts-${clientId}`}>
					<Posts posts={posts} totalPosts={totalPosts} attributes={attributes} setAttributes={setAttributes} clientId={clientId} />
				</div> :

				<NoPosts />}
	</>
}
export default withSelect((select, { attributes, setAttributes }) => {
	const { getUsers, getEntityRecords, getTaxonomies, getMedia, getComments } = select('core');

	const { postType, selectedTaxonomies = {}, selectedCategories = [], selectedTags = [], isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder, postsOffset = 0, postsInclude = [], postsExclude = [], isExcludeCurrent, isPagination, paginationCurrentPage, fImgSize = 'full', metaDateFormat = 'M j, Y' } = attributes;

	// Query Filter
	const catsFilter = 'post' === postType ? { categories: selectedCategories } : {};
	const tagsFilter = 'post' === postType ? { tags: selectedTags } : {};

	const filterTaxonomies = Object.assign({},
		selectedTaxonomies?.category ? { categories: selectedTaxonomies['category'] } : {},
		selectedTaxonomies?.post_tag ? { tags: selectedTaxonomies['post_tag'] } : {},
		filterObject(selectedTaxonomies, key => key !== 'category' && key !== 'post_tag')
	);

	const includes = filterNaN(postsInclude)?.length ? { include: filterNaN(postsInclude) } : {};

	// Post Query
	const query = {
		...filterTaxonomies,
		...catsFilter,
		...tagsFilter,
		per_page: isPostsPerPageAll ? -1 : postsPerPage, // -1 to display all
		orderby: postsOrderBy,
		order: postsOrder,
		offset: isPostsPerPageAll ? 0 : postsOffset,
		...includes,
		exclude: isExcludeCurrent ? [select('core/editor').getCurrentPostId(), ...filterNaN(postsExclude)] : filterNaN(postsExclude)
	}

	const allPosts = filterPassword(getEntityRecords('postType', postType, { ...query, per_page: -1 }), 'false');

	// Pagination Scripts
	useEffect(() => setAttributes({ paginationCurrentPage: 1 }), []);
	const paginationShowStart = postsPerPage * (paginationCurrentPage - 1);
	const paginationShowEnd = paginationShowStart + postsPerPage;
	const paginationPosts = allPosts?.slice(paginationShowStart, paginationShowEnd);

	// Arranged Posts
	const getTaxonomy = slug => getEntityRecords('taxonomy', slug, { per_page: -1 });

	const imageBySize = (id, size) => {
		const media = getMedia(id);
		const mediaUrl = media?.media_details?.sizes?.[size]?.source_url || media?.source_url;
		return { url: mediaUrl?.replace(/<[^>]+>/g, ''), alt: media?.alt_text }
	};
	const commentsById = id => getComments({ per_page: -1 })?.filter(({ post }) => id === post);

	const taxOfPostType = getTaxonomies({ per_page: -1 })?.filter(tax => tax.types.includes(postType) && tax.slug !== 'category')?.map(({ name, slug, rest_base }) => ({ name, slug, rest_base }));

	const arrangedPosts = (posts) => {
		return posts?.map(post => {
			const { id, link, slug: name, featured_media, title, excerpt, author, categories, content, date, date_gmt, modified, modified_gmt, comment_status, status } = post;
			const thumbnail = imageBySize(featured_media, fImgSize);

			const taxonomies = {};
			taxOfPostType?.map(t => {
				const links = getTaxonomy(t.slug)
					?.filter(tf => post[t.rest_base]
						?.includes(tf.id))
					?.map(td => `<a href='${td.link}' rel='${t.slug}'>${td.name}</a>`);

				taxonomies[t.slug] = links?.join('')
			});

			const plainContent = content?.raw?.replace(/(<([^>]+)>)/gi, '');
			const categoriesLink = categories?.length ? getTaxonomy('category')?.filter(c => categories?.includes(c.id))?.map(c => `<a href='${c.link}' rel='category tag'>${c.name}</a>`) : [];

			const authorInfo = getUsers({ who: 'authors' })?.map(({ id, name, link }) => ({ id, name, link }))?.find(a => a.id === author);

			return {
				id,
				link,
				name,
				thumbnail,
				title: title?.rendered,
				excerpt: excerpt?.raw?.replace(/(<([^>]+)>)/gi, '')?.trim(),
				content: plainContent,
				author: authorInfo,
				date: dateI18n(metaDateFormat, new Date(date)),
				dateGMT: date_gmt,
				modifiedDate: modified,
				modifiedDateGMT: modified_gmt,
				commentCount: commentsById(id)?.length,
				commentStatus: comment_status,
				categories: {
					coma: categoriesLink?.join(', '),
					space: categoriesLink?.join(' ')
				},
				taxonomies,
				readTime: {
					min: Math.floor(wordCount(plainContent) / 200),
					sec: Math.floor((wordCount(plainContent) % 200) / (200 / 60))
				},
				status
			};
		})
	}

	const posts = (isPagination && !isPostsPerPageAll) ? paginationPosts : filterPassword(getEntityRecords('postType', postType, query), 'false');

	return {
		totalPosts: allPosts?.length,

		posts: arrangedPosts(posts),

		taxOfPostType,

		media: id => getMedia(id)
	};
})(Edit);
