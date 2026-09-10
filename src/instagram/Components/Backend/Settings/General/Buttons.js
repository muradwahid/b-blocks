import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

// The follow link and the pager: both are optional and both carry their own label.
const Buttons = ({ attributes, updateObj }) => {
	const { elements = {}, source = {} } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Follow Button', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Follow Button', 'b-blocks')} checked={elements.followButton} onChange={(val) => updateObj('elements', val, 'followButton')} />

			{elements.followButton && <>
				<TextControl className='mt10' label={__('Label', 'b-blocks')} value={elements.followLabel || ''} onChange={(val) => updateObj('elements', val, 'followLabel')} />

				<ToggleControl label={__('Place Below The Grid', 'b-blocks')} checked={elements.followInFooter} onChange={(val) => updateObj('elements', val, 'followInFooter')} help={__('Off, it sits beside the profile above the grid.', 'b-blocks')} />
			</>}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Load More', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Load More', 'b-blocks')} checked={elements.loadMore} onChange={(val) => updateObj('elements', val, 'loadMore')} />

			<Label className='mt10'>{__('Posts Per Page', 'b-blocks')}</Label>

			<NumberControl value={source.perPage} onChange={(val) => updateObj('source', parseInt(val, 10) || 1, 'perPage')} min={1} max={100} />

			<small>{__('With Load More off, only this many posts are ever shown.', 'b-blocks')}</small>

			{elements.loadMore && <TextControl className='mt20' label={__('Label', 'b-blocks')} value={elements.loadMoreLabel || ''} onChange={(val) => updateObj('elements', val, 'loadMoreLabel')} />}
		</PanelBody>
	</>;
};

export default Buttons;
