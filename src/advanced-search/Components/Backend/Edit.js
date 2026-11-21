import { __, _n } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Settings from './Settings/Settings';
import Style from '../Common/Style';
import AdvancedSearch from '../Frontend/AdvancedSearch';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId, device = 'desktop', home = '' } = props;

	const updateObj = updateAttributes( attributes, setAttributes );
	const labels = {
		search: __( 'Search', 'b-blocks' ),
		clear: __( 'Clear search', 'b-blocks' ),
		loading: __( 'Searching…', 'b-blocks' ),
		results: __( 'Search results', 'b-blocks' ),
		error: __( 'Search is not available right now. Please try again.', 'b-blocks' ),
		resultsFound: { one: _n( '%d result found', '%d results found', 1, 'b-blocks' ), other: _n( '%d result found', '%d results found', 2, 'b-blocks' ) }
	};
	// The same search address the page gets from render.php. "?rest_route=" works without pretty permalinks too.
	const apiRoot = window.wpApiSettings?.root || '';
	const context = {
		api: apiRoot ? `${ apiRoot }b-blocks/v1/search` : ( home && `${ home }/?rest_route=/b-blocks/v1/search` ),
		home: home ? `${ home }/` : '/'
	};

	return <>
		<Settings { ...props } updateObj={ updateObj } device={ device } />

		<div { ...useBlockProps() }>
			<div>
				<Style attributes={ attributes } id={ `block-${ clientId }` } isBackend={ true } />

				<AdvancedSearch attributes={ attributes } context={ context } isBackend={ true } labels={ labels } />
			</div>
		</div>
	</>;
};

export default withSelect( ( select ) => ( {
	device: select( 'core/editor' )?.getDeviceType?.()?.toLowerCase() || 'desktop',
	home: select( 'core' ).getEntityRecord( 'root', '__unstableBase' )?.home
} ) )( Edit );