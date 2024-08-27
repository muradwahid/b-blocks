import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { prefix } from '../../utils/data';

const Loading = () => <h3 className={`${prefix}Loading`}><Spinner /> {__('Loading...', 'b-blocks')}</h3>;
export default Loading;