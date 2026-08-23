import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl, Flex } from '@wordpress/components';

import { HelpPanel, ItemsPanel, Label } from '../../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../../utils/data';
import { HEADING_TAG_OPTIONS, newItem } from '../../../../utils/options';
import ItemSettings from './ItemSettings';

const General = ({ attributes, setAttributes, updateObj }) => {
	const { heading = {}, progress = {}, reset = {}, item = {} } = attributes;

	return <>
		<HelpPanel slug={pluginSlug} />

		<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
			<TextControl
				label={__('Heading text', 'b-blocks')}
				value={heading.text || ''}
				onChange={(val) => updateObj('heading', val, 'text')}
				placeholder={__('Your Checklist', 'b-blocks')}
				help={__('Leave empty to hide the heading.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>
			<Flex className='mt10'>
				<Label className='flex2'>{__('Heading tag', 'b-blocks')}</Label>
				<SelectControl className='flex1' value={heading.tag || 'h3'} options={HEADING_TAG_OPTIONS} onChange={(val) => updateObj('heading', val, 'tag')} __nextHasNoMarginBottom />
			</Flex>

			<ToggleControl
				className='mt10'
				label={__('Show progress line', 'b-blocks')}
				checked={progress.show !== false}
				onChange={(val) => updateObj('progress', val, 'show')}
				help={__('Live "N of M complete" indicator and progress bar.', 'b-blocks')}
			/>

			<ToggleControl
				className='mt10'
				label={__('Show reset button', 'b-blocks')}
				checked={reset.show !== false}
				onChange={(val) => updateObj('reset', val, 'show')}
				help={__('Lets visitors clear their saved progress.', 'b-blocks')}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Checklist items', 'b-blocks')} initialOpen={false}>
			<ToggleControl
				className='mb10'
				label={__('Strike checked items', 'b-blocks')}
				checked={!!item.strike}
				onChange={(val) => updateObj('item', val, 'strike')}
				help={__('Line-through and dim items once checked.', 'b-blocks')}
			/>

			<ItemsPanel {...{ attributes, setAttributes, updateObj }} newItem={newItem()} design='sortable' itemLabel='Item' arrKey='items' title='label' ItemSettings={ItemSettings} />

		</PanelBody>
	</>;
};
export default General;
