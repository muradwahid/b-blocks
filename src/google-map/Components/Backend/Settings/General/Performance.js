import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

import { Notice } from '../../../../../../../bpl-tools/Components';

import { lazyLoadModes } from '../../../../utils/options';

const Performance = ({ performance = {}, updateObj }) => <PanelBody className='bPlPanelBody' title={__('Performance', 'b-blocks')} initialOpen={false}>
	<SelectControl
		label={__('Load the map', 'b-blocks')}
		value={performance.lazyLoad || 'onView'}
		options={lazyLoadModes}
		onChange={(val) => updateObj('performance', val, 'lazyLoad')}
		help={__('Deferring the load keeps Google’s scripts off the page until the visitor actually needs them.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	<Notice status='info' isIcon={true}>
		{__('The editor always loads the map immediately so you can see your changes.', 'b-blocks')}
	</Notice>
</PanelBody>;
export default Performance;
