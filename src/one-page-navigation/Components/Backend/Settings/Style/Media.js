import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';

import { hidesIcon, objectFits, resolveBox, resolveDevice, showsIcon, usesImage } from '../../../../utils/options';

const Media = ({ attributes, updateObj, device = 'desktop' }) => {
	const { media = {}, layout = {}, items = [] } = attributes;

	const optional = hidesIcon(layout.preset || 'glassBullseye');

	const icons = showsIcon(attributes);
	const images = usesImage(items);

	const length = (label, key, { help } = {}) => <Flex className='mt10'>
		<Label className='flex2'>{label} <Device /></Label>

		<UnitControl
			className='flex1'
			value={resolveDevice(media, device, key, '')}
			onChange={(val) => updateObj('media', undefined === val ? '' : val, device, key)}
			help={help}
			__next40pxDefaultSize
		/>
	</Flex>;

	return <PanelBody className='bPlPanelBody' title={__('Icon / Image', 'b-blocks')} initialOpen={false}>
		{optional && <ToggleControl
			label={__('Show Icon', 'b-blocks')}
			checked={!!media.showIcon}
			onChange={(val) => updateObj('media', val, 'showIcon')}
		/>}

		{icons && <>
			<Label className='mb0'>{__('Icon', 'b-blocks')}</Label>

			{length(__('Size', 'b-blocks'), 'size')}

			<ColorControl className='mt10' label={__('Color', 'b-blocks')} value={media.color} onChange={(val) => updateObj('media', val, 'color')} />

			<ColorControl label={__('Hover Color', 'b-blocks')} value={media.hoverColor} onChange={(val) => updateObj('media', val, 'hoverColor')} />

			<ColorControl label={__('Active Color', 'b-blocks')} value={media.activeColor} onChange={(val) => updateObj('media', val, 'activeColor')} />
		</>}

		{images && <>
		<Label className='mb0 mt20'>{__('Image', 'b-blocks')}</Label>

		{length(__('Width', 'b-blocks'), 'width')}

		{length(__('Height', 'b-blocks'), 'height')}

		<Label className='mb0 mt10'>{__('Border Radius', 'b-blocks')} <Device /></Label>

		<BoxControl
			values={resolveBox(media, device, 'radius')}
			onChange={(val) => updateObj('media', val, device, 'radius')}
		/>

		<Flex className='mt10'>
			<Label className='flex2'>{__('Object Fit', 'b-blocks')} <Device /></Label>

			<SelectControl
				className='flex1'
				value={resolveDevice(media, device, 'objectFit', 'contain')}
				options={objectFits}
				onChange={(val) => updateObj('media', val, device, 'objectFit')}
				__nextHasNoMarginBottom
			/>
		</Flex>
		</>}

	</PanelBody>;
};

export default Media;