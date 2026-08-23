import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, __experimentalUnitControl as UnitControl, Flex, BorderBoxControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Label, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

import { BADGE_TYPE_OPTIONS } from '../../../../utils/options';

const Badge = ({ attributes, updateObj }) => {
	const { badge = {} } = attributes;
	const { type, size, bg, color } = badge;

	return <PanelBody className='bPlPanelBody' title={__('Badge', 'b-blocks')} initialOpen={true}>
		<SelectControl
			label={__('Badge type', 'b-blocks')}
			labelPosition='edge'
			value={type}
			options={BADGE_TYPE_OPTIONS}
			onChange={(val) => updateObj('badge', val, 'type')}
			help={type === 'icon'
				? __('Add a Font Awesome class on each step in the Steps panel.', 'b-blocks')
				: __('Numbers are auto-incremented starting at 1.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		<Flex>
			<Label className='flex2'>
				{__('Badge size', 'b-blocks')}
			</Label>
			<UnitControl className='flex1' isUnitSelectTabbable value={size} onChange={(val) => updateObj('badge', val, 'size')} />
		</Flex>

		<Background label={__('Badge background', 'b-blocks')} value={bg} onChange={(val) => updateObj('badge', val, 'bg')} defaults={{ color: '#2563EB' }} />

		<ColorControl label={__('Badge text/icon color', 'b-blocks')} value={color} onChange={(val) => updateObj('badge', val, 'color')} defaultColor='#FFFFFF' />

		{type !== 'icon' && <Typography className='mt10' label={__('Typography', 'b-blocks')} value={badge.typo} onChange={val => updateObj('badge', val, 'typo')} />}

		<BorderBoxControl label={__('Border', 'b-blocks')} value={badge.border} onChange={val => updateObj('badge', val, 'border')} />

		<BoxControl className='mt10' label={__('Border Radius', 'b-blocks')} values={badge.borderRadius} onChange={val => updateObj('badge', val, 'borderRadius')} />

		<ShadowControl label={__('Shadow', 'b-blocks')} value={badge.shadow} onChange={val=>updateObj('badge',val,'shadow')} />

	</PanelBody>;
};

export default Badge;
