import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl } from '@wordpress/components';

import { updateData } from '../../../../../../../bpl-tools/utils/functions';
import { IconLibrary } from '../../../../../../../bpl-tools/Components';

const ItemSettings = ({ attributes, setAttributes, index }) => {
	const { steps = [], badge = {} } = attributes;
	const item = steps[index] || {};

	const update = (key, value) => setAttributes({ steps: updateData(steps, value, index, key) });
	return <>
		<TextControl
			label={__('Title', 'b-blocks')}
			value={item.title || ''}
			onChange={(val) => update('title', val)}
			placeholder={__('Short title for this step', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		<TextareaControl
			label={__('Description', 'b-blocks')}
			value={item.description || ''}
			onChange={(val) => update('description', val)}
			placeholder={__('Explain what happens in this step', 'b-blocks')}
			rows={3}
			__nextHasNoMarginBottom
		/>

		{badge?.type === 'icon' && (<>

			<IconLibrary label={__('Icon', 'b-blocks')} className='mt10' icon={item.icon || ''} onChange={(val) => update('icon', val)} />

		</>
		)}
	</>;
};

export default ItemSettings;
