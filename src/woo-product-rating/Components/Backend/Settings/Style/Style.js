import { __ } from '@wordpress/i18n';
import {
	Flex,
	PanelBody,
	SelectControl,
	TabPanel,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components';
import { justifyCenter, justifyLeft, justifyRight } from '@wordpress/icons';

import { ColorControl, Device, Label, Typography } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';

import { UNITS, displayOptions, starsTabs, starsTypeOptions } from '../../../../utils/options';

const Style = ({ attributes, updateObj, device }) => {
	const { layout = {}, link = {}, stars = {} } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Styles', 'b-blocks')} initialOpen={true}>
			<SelectControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Stars Type', 'b-blocks')}
				labelPosition='edge'
				value={layout.starsType || 'style-1'}
				options={starsTypeOptions}
				onChange={(val) => updateObj('layout', val, 'starsType')}
			/>

			<SelectControl
				className='mt20'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Display Type', 'b-blocks')}
				labelPosition='edge'
				value={layout.display || 'inline'}
				options={displayOptions}
				onChange={(val) => updateObj('layout', val, 'display')}
			/>

			<Flex className='mt20'>
				<Label className=''>{__('Alignment', 'b-blocks')}</Label>
				<ToggleGroupControl
					className='flex1'
					size='small'
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					isBlock
					label={__('Alignment', 'b-blocks')}
					hideLabelFromVision
					value={layout.alignment || 'left'}
					onChange={(val) => updateObj('layout', val || 'left', 'alignment')}
				>
					<ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='left' icon={justifyLeft} />
					<ToggleGroupControlOptionIcon label={__('Center', 'b-blocks')} value='center' icon={justifyCenter} />
					<ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='right' icon={justifyRight} />
				</ToggleGroupControl>
			</Flex>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Reviews Link', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Text Color', 'b-blocks')} value={link.color} onChange={(val) => updateObj('link', val, 'color')} />
			<ColorControl className='mt20' label={__('Hover Color', 'b-blocks')} value={link.hoverColor} defaultColor={link.hoverColor ? '__clear__' : undefined} onChange={(val) => updateObj('link', '__clear__' === val ? '' : val, 'hoverColor')} />
			<Typography className='mt20' label={__('Typography', 'b-blocks')} value={link.typo} device={device} onChange={(val) => updateObj('link', val, 'typo')} />
			<Flex className='mt20'>
				<Label className='flex2'>{__('Count Gap', 'b-blocks')}<Device /></Label>
				<UnitControl
					className='flex1'
					__next40pxDefaultSize
					label={__('Count Gap', 'b-blocks')}
					hideLabelFromVision
					units={UNITS}
					min={0}
					value={layout.countGap?.[device] || ''}
					onChange={(val) => updateObj('layout', val, 'countGap', device)}
				/>
			</Flex>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Stars', 'b-blocks')} initialOpen={false}>
			<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={starsTabs} onSelect={tabController}>
				{(tab) => 'rated' === tab.name ? <>
					<ColorControl className='mt20' label={__('Stars Color', 'b-blocks')} value={stars.ratedColor} onChange={(val) => updateObj('stars', val, 'ratedColor')} />
				</> : <>
					<ColorControl className='mt20' label={__('Stars Color', 'b-blocks')} value={stars.color} onChange={(val) => updateObj('stars', val, 'color')} />
					<Flex className='mt20'>
						<Label className='flex2'>{__('Stars Size', 'b-blocks')}<Device /></Label>
						<UnitControl
							className='flex1'
							__next40pxDefaultSize
							label={__('Stars Size', 'b-blocks')}
							hideLabelFromVision
							units={UNITS}
							min={0}
							value={stars.size?.[device] || ''}
							onChange={(val) => updateObj('stars', val, 'size', device)}
						/>
					</Flex>
					<Flex className='mt20'>
						<Label className='flex2'>{__('Stars Gap', 'b-blocks')}<Device /></Label>
						<UnitControl
							className='flex1'
							__next40pxDefaultSize
							label={__('Stars Gap', 'b-blocks')}
							hideLabelFromVision
							units={UNITS}
							min={0}
							value={stars.gap?.[device] || ''}
							onChange={(val) => updateObj('stars', val, 'gap', device)}
						/>
					</Flex>
				</>}
			</TabPanel>
		</PanelBody>
	</>;
};

export default Style;
