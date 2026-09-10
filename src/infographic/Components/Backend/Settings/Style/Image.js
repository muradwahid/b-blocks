import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, Device, Label } from '../../../../../../../bpl-tools/Components';
import { perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { imageFits } from '../../../../utils/options';

const Image = ({ attributes, updateObj, device = 'desktop' }) => {
	const { image = {} } = attributes.content || {};

	const field = (label, key) => <Flex className='mt10'>
		<Label className='mb0 flex2'>{label} <Device /></Label>

		<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={image?.[device]?.[key] || ''} onChange={(val) => updateObj('content', val, 'image', device, key)} units={[pxUnit(), perUnit()]} />
	</Flex>;

	return <PanelBody className='bPlPanelBody' title={__('Image', 'b-blocks')} initialOpen={false}>
		<BoxControl label={<>{__('Radius', 'b-blocks')} <Device /></>} values={image?.[device]?.radius || {}} onChange={(val) => updateObj('content', val, 'image', device, 'radius')} />

		{field(__('Width', 'b-blocks'), 'width')}

		{field(__('Height', 'b-blocks'), 'height')}

		<SelectControl className='mt10' label={__('Type', 'b-blocks')} labelPosition='edge' value={image.fit || 'cover'} options={imageFits} onChange={(val) => updateObj('content', val, 'image', 'fit')} __nextHasNoMarginBottom />

		<small>{__('Height here is the fallback — an item with its own Image Height wins.', 'b-blocks')}</small>
	</PanelBody>;
};

export default Image;
