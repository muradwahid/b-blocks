import { __ } from '@wordpress/i18n';

import StatePanel from '../../Controls/StatePanel';

const Navigation = ( { attributes, updateObj, device = 'desktop' } ) => {
	const { filter = {}, pager = {} } = attributes;

	return <>
		<StatePanel
			group='filter'
			value={ filter }
			title={ __( 'Filter Buttons', 'b-blocks' ) }
			updateObj={ updateObj }
			device={ device }
			defaultColors={ { normal: '#070127', hover: '#ffffff' } }
			states={ [ [ 'normal', __( 'Normal', 'b-blocks' ) ], [ 'hover', __( 'Active', 'b-blocks' ) ] ] }
		/>

		<StatePanel
			group='pager'
			value={ pager }
			title={ __( 'Load More / Pagination', 'b-blocks' ) }
			updateObj={ updateObj }
			device={ device }
			defaultColors={ { normal: '#ffffff', hover: '#ffffff', active: '#ffffff' } }
			states={ [
				[ 'normal', __( 'Normal', 'b-blocks' ) ],
				[ 'hover', __( 'Hover', 'b-blocks' ) ],
				[ 'active', __( 'Active', 'b-blocks' ) ],
			] }
		/>
	</>;
};

export default Navigation;
