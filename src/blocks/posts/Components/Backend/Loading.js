import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

const Loading = () => <h3 className='bBlocksLoading'><Spinner /> {__('Loading...', 'b-blocks')}</h3>;
export default Loading;