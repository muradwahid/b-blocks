import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl, Flex } from '@wordpress/components';

import { ColorControl, Label } from '../../../../../../../bpl-tools/Components';

import { CONNECTOR_STYLE_OPTIONS } from '../../../../utils/options';

const Connector = ({ attributes, updateObj }) => {
	const { connector = {} } = attributes;
	const { show, color, width, style } = connector;

	return <PanelBody className='bPlPanelBody' title={__('Connector', 'b-blocks')} initialOpen={false}>
		<ToggleControl
			label={__('Show connector line', 'b-blocks')}
			checked={!!show}
			onChange={(val) => updateObj('connector', val, 'show')}
		/>

		{show && <>
			<ColorControl label={__('Connector color', 'b-blocks')} value={color} onChange={(val) => updateObj('connector', val, 'color')} defaultColor='#CBD5E1'/>




			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Connector width', 'b-blocks')}</Label>

				<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={width} onChange={(val) => updateObj('connector', val, 'width')} min={1} max={8} />
			</Flex>

			<SelectControl className='mt10' label={__('Connector style', 'b-blocks')} labelPosition='edge' value={style} options={CONNECTOR_STYLE_OPTIONS} onChange={(val) => updateObj('connector', val, 'style')} __nextHasNoMarginBottom />
		</>}
	</PanelBody>;
};

export default Connector;
