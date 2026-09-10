import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, TextareaControl } from '@wordpress/components';

import { Label, MediaArea } from '../../../../../../../bpl-tools/Components';

const Defaults = ({ attributes, updateObj }) => {
	const { items = [], defaults = {} } = attributes;

	const itemOptions = items.map((item) => ({ label: item?.buttonLabel || __('(untitled)', 'b-blocks'), value: item?.buttonLabel || '' }));

	return <PanelBody className='bPlPanelBody' title={__('Default Content', 'b-blocks')} initialOpen={false}>
		<SelectControl label={__('Default Item', 'b-blocks')} labelPosition='edge' value={defaults.item} options={itemOptions} onChange={(val) => updateObj('defaults', val, 'item')} help={__('The item shown in the centre before anything is selected.', 'b-blocks')} __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('Default Title', 'b-blocks')} value={defaults.itemTitle} onChange={(val) => updateObj('defaults', val, 'itemTitle')} __nextHasNoMarginBottom />

		<TextareaControl className='mt10' label={__('Default Text', 'b-blocks')} value={defaults.itemText} onChange={(val) => updateObj('defaults', val, 'itemText')} __nextHasNoMarginBottom />

		<Label>{__('Default Image', 'b-blocks')}</Label>
		<MediaArea value={defaults.image} height='90%' width='90%' onChange={(val) => updateObj('defaults', val, 'image')} />

		<small>{__('Each is a fallback: it shows only when the active item leaves that field empty.', 'b-blocks')}</small>
	</PanelBody>;
};

export default Defaults;
