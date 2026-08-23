import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

import { HelpPanel, ItemsPanel } from '../../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../../utils/data';
import { DEFAULT_ITEM_ICON, HEADING_TAG_OPTIONS, LIST_STYLE_OPTIONS } from '../../../../utils/options';
import ItemSettings from './ItemSettings';

const General = ({ attributes, setAttributes, updateObj }) => {
	const { heading = {}, list = {} } = attributes;

	const listStyle = list.style || 'check';
	const showIcon = list.showIcon !== false;

	const newItem = { text: __('New takeaway', 'b-blocks'), icon: DEFAULT_ITEM_ICON };

	return <>
		<HelpPanel slug={pluginSlug} />

		<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
			<TextControl label={__('Heading text', 'b-blocks')} value={heading.text || ''} onChange={(val) => updateObj('heading', val, 'text')} placeholder={__('Key Takeaways', 'b-blocks')} __nextHasNoMarginBottom />

			<SelectControl className='mt10' label={__('Heading tag', 'b-blocks')} value={heading.tag || 'h3'} labelPosition='edge' options={HEADING_TAG_OPTIONS} onChange={(val) => updateObj('heading', val, 'tag')} help={__('Pick a level that fits the surrounding document outline.', 'b-blocks')} __nextHasNoMarginBottom />

			<SelectControl className='mt10' labelPosition='edge' label={__('List style', 'b-blocks')} value={listStyle} options={LIST_STYLE_OPTIONS} onChange={(val) => updateObj('list', val, 'style')} help={__('Checkmark and bullet render a <ul>; numbered renders a semantic <ol>.', 'b-blocks')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Show icon / number prefix', 'b-blocks')} checked={showIcon} onChange={(val) => updateObj('list', val, 'showIcon')} />

		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Takeaway items', 'b-blocks')} initialOpen={false}>
			<ItemsPanel
				{...{ attributes, setAttributes, updateObj }}
				newItem={newItem}
				design='sortable'
				itemLabel='Takeaway'
				arrKey='items'
				title='text'
				ItemSettings={ItemSettings}
			/>
		</PanelBody>
	</>;
};
export default General;
