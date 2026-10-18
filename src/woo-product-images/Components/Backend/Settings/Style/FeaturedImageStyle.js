import { __ } from '@wordpress/i18n';
import {
	BorderBoxControl, Flex, PanelBody, SelectControl, TabPanel, ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { justifyCenter, justifyLeft, justifyRight } from '@wordpress/icons';

import { Background, BoxControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';

import { UNITS, fitOptions } from '../../../../utils/options';

import metadata from '../../../../block.json';

// The defaults (block.json), for the resets.
const defaults = metadata.attributes.image.default;

const FeaturedImageStyle = ({ attributes, updateObj, device }) => {
	const { image = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Featured Image', 'b-blocks')}>
		<ToggleControl
			__nextHasNoMarginBottom
			label={__('Enable Adaptive Height', 'b-blocks')}
			help={__('The image area follows each image’s own shape, instead of a fixed height.', 'b-blocks')}
			checked={!!image.adaptiveHeight}
			onChange={(val) => updateObj('image', val, 'adaptiveHeight')}
		/>

		{!image.adaptiveHeight && <UnitControl __next40pxDefaultSize label={<Flex className='mb5 mt10'>{__('Height', 'b-blocks')}<Device /></Flex>} labelPosition='edge' units={UNITS} value={image[device]?.height || ''} onChange={(val) => updateObj('image', val || '', device, 'height')} />}

		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Display Size', 'b-blocks')}
			labelPosition='edge'
			value={image.fit || 'cover'}
			options={fitOptions}
			onChange={(val) => updateObj('image', val, 'fit')}
		/>

		<UnitControl className='mt10' __next40pxDefaultSize label={<Flex className='mb5'><span className='bPlLabel'>{__('Width', 'b-blocks')}</span><Device /></Flex>} labelPosition='edge' units={UNITS} value={image[device]?.width || ''} onChange={(val) => updateObj('image', val || '', device, 'width')} />
		<br />
		<Flex>
			<Label className=''>{__('Alignment', 'b-blocks')}</Label>
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				value={image.alignment || 'center'}
				onChange={(val) => updateObj('image', val || 'center', 'alignment')}
			>
				<ToggleGroupControlOptionIcon value='left' icon={justifyLeft} label={__('Left', 'b-blocks')} />
				<ToggleGroupControlOptionIcon value='center' icon={justifyCenter} label={__('Center', 'b-blocks')} />
				<ToggleGroupControlOptionIcon value='right' icon={justifyRight} label={__('Right', 'b-blocks')} />
			</ToggleGroupControl>
		</Flex>

		<BoxControl className='mb5 mt10' label={<Flex>{__('Margin', 'b-blocks')}<Device /></Flex>} values={image[device]?.margin} onChange={(val) => updateObj('image', val, device, 'margin')} />

		<div className='mt20'>
			<Label className=''>{__('Background & Border', 'b-blocks')}</Label>
			<TabPanel className='bPlTabPanel small mt5' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
				{({ name: state }) => <>
					<Background className='mt10' label={__('Background', 'b-blocks')} value={image[state]?.bg} defaults={defaults[state]?.bg} isImage={true} onChange={(val) => updateObj('image', val, state, 'bg')} />

					<BorderBoxControl
						__next40pxDefaultSize
						className='mt10'
						label={__('Border', 'b-blocks')}
						withSlider
						enableStyle
						value={image[state]?.border}
						onChange={(val) => updateObj('image', val || {}, state, 'border')}
					/>

					<BoxControl className='mt10' label={<Flex >{__('Border Radius', 'b-blocks')}<Device /></Flex>} values={image[state]?.radius?.[device]} onChange={(val) => updateObj('image', val, state, 'radius', device)} />

					<ShadowControl className='mt20' label={__('Box Shadow', 'b-blocks')} value={image[state]?.shadow || []} onChange={(val) => updateObj('image', val, state, 'shadow')} />
				</>}
			</TabPanel>
		</div>
	</PanelBody>;
};

export default FeaturedImageStyle;
