import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ItemsPanel } from '../../../../../../../bpl-tools/Components';

import ItemSettings from '../Panel/ItemSettings';

const Steps = ({ attributes, setAttributes }) => {
	const newItem = {
		_key: `ps-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
		title: '',
		description: '',
		icon: '',
	};

	return <PanelBody className='bPlPanelBody' title={__('Steps', 'b-blocks')} initialOpen={false}>
		<ItemsPanel {...{ attributes, setAttributes }} newItem={newItem} design='sortable' itemLabel='Step' arrKey='steps' title='title' ItemSettings={ItemSettings} minItem={0} />
	</PanelBody>;
};

export default Steps;
