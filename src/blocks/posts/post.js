// const { registerBlockType } = wp.blocks;

// registerBlockType('b-blocks/posts', {
//     // Build In attributes
//     title: 'Show Posts',
//     description: 'Show Posts in your pages or posts',
//     icon: 'embed-post',
//     category: 'bBlocks',

//     // Custom Attributes
//     attributes: {
//         posts: { type: 'object' }
//     },

//     // Build In Functions
//     edit: props => {
//         const { attributes: { posts }, setAttributes } = props;

//         !posts && wp.apiFetch({
//             url: cgbGlobal.siteUrl + '/wp-json/wp/v2/posts'
//         }).then(allPosts => {
//             setAttributes({ posts: allPosts })
//         })

//         if (!posts) {
//             return 'Loading...';
//         }
//         if (posts && posts.length === 0) {
//             return 'No posts found. Please add some!';
//         }

//         const allPostsStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '30px 20px' }
//         const singlePostStyle = { backgroundColor: '#f4f4f4' }

//         return (
//             <div className="b_blocks_all_posts" style={allPostsStyle}>
//                 {posts.map(post => {
//                     return (
//                         <div key={post.id} className="b_blocks_single_post" style={singlePostStyle}>
//                             {console.log(post)}
//                             <h3><a href={post.link} target="_blank">{post.title.rendered}</a></h3>
//                             <p>{post.excerpt.rendered}</p>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     },

//     save: props => {
//         return null;
//     },
// });


const { registerBlockType } = wp.blocks;
const { withSelect } = wp.data;

registerBlockType('b-blocks/posts', {
    title: 'Latest Post',
    icon: 'megaphone',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        postCategory: { type: 'string', default: 'Hello' },
        postsPerPage: { type: 'number', default: 10 },
        postsOrderBy: { type: 'string', default: 'date' },
        postsOrder: { type: 'string', default: 'desc' },

        column: { type: 'number', default: 3 },
        columnGap: { type: 'number', default: 20 },
        rowGap: { type: 'number', default: 30 },
        articleColor: { type: 'string', default: '#f4f4f4' },
    },

    edit: withSelect((select, props) => {
        const { postsPerPage, postsOrderBy, postsOrder } = props.attributes;

        const query = {
            per_page: postsPerPage, // set -1 to display ALL
            orderby: postsOrderBy,
            order: postsOrder,
        }

        return {
            select,
            posts: select('core').getEntityRecords('postType', 'post', query),
            categories: select('core').getEntityRecords('taxonomy', 'category'),
            media: id => select('core').getMedia(id),
        };

    })(({ select, posts, categories, media, attributes, setAttributes }) => {
        const { postsPerPage, postsOrderBy, postsOrder, column, columnGap, rowGap, articleColor } = attributes;

        console.log(media(181));


        const allPostsStyle = { display: 'grid', gridTemplateColumns: `repeat(${column}, 1fr)`, gridGap: `${rowGap}px ${columnGap}px` }
        const singlePostStyle = { backgroundColor: articleColor }

        return (
            posts && posts.length !== 0 ? <div className="b_blocks_all_posts" style={allPostsStyle}>
                {posts.map(post => {
                    const { id, date, featured_media, title, excerpt, link, _links } = post;

                    return (
                        <article div key={id} className="b_blocks_single_post" style={singlePostStyle} >
                            <h3 className="title"><a href={link} target="_blank">{title.rendered}</a></h3>

                            {featured_media > 0 && <div div className="feature_image">
                                {media(featured_media) && <a href={link} target="_blank"><img src={media(featured_media).source_url} alt={media(featured_media).caption.rendered} /></a>}
                            </div>}

                            <p className="meta">{date}</p>

                            <p>{excerpt.rendered}</p>
                        </article>
                    );
                })}
            </div> : <h3>No posts found!! Please add some posts</h3>
        );
    }),

    save: () => null
});