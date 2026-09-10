import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Label } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { dividerStyles } from '../../../../utils/options';

const Divider = ({ attributes, updateObj }) => {
	const { divider = {} } = attributes.content || {};

	return <PanelBody className='bPlPanelBody' title={__('Divider', 'b-blocks')} initialOpen={false}>
		<SelectControl label={__('Style', 'b-blocks')} labelPosition='edge' value={divider.style || 'solid'} options={dividerStyles} onChange={(val) => updateObj('content', val, 'divider', 'style')} __nextHasNoMarginBottom />

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Weight', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={divider.height || ''} onChange={(val) => updateObj('content', val, 'divider', 'height')} units={[pxUnit(), emUnit()]} />
		</Flex>

		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Width', 'b-blocks')}</Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={divider.width || ''} onChange={(val) => updateObj('content', val, 'divider', 'width')} units={[pxUnit(), perUnit(), emUnit()]} />
		</Flex>

		<ColorControl className='mt10' label={__('Color', 'b-blocks')} value={divider.color} onChange={(val) => updateObj('content', val, 'divider', 'color')} defaultColor='#BFA83B' />
	</PanelBody>;
};

export default Divider;
