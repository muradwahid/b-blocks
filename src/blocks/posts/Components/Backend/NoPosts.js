import { __ } from '@wordpress/i18n';

const NoPosts = () => <h3 className='bBlocksNoPosts'>{__('No posts found!! Please update the query or add some posts', 'b-blocks')}</h3>;
export default NoPosts;