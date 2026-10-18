import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, RangeControl, SelectControl, TabPanel } from '@wordpress/components';

import { Background, BoxControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';

import metadata from '../../../../block.json';
import { easingOptions } from '../../../../utils/options';

const ThumbnailsStyle = ({ attributes, updateObj, device }) => {
	const { thumbs = {}, activeThumbs = {} } = attributes;
	// The defaults are block.json's: the saved attributes have no `.default`.
	const defaults = { thumbs: metadata.attributes.thumbs.default, activeThumbs: metadata.attributes.activeThumbs.default };
	return <PanelBody className='bPlPanelBody' title={__('Thumbnails', 'b-blocks')} initialOpen={false}>
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Inactive Opacity', 'b-blocks')}
			help={__('The thumbnails not shown; the chosen and the hovered one are at full opacity.', 'b-blocks')}
			min={0}
			max={1}
			step={0.05}
			allowReset
			resetFallbackValue={0.7}
			value={thumbs.opacity}
			onChange={(val) => updateObj('thumbs', val, 'opacity')}
		/>

		<RangeControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Transition Duration (ms)', 'b-blocks')}
			help={__('How long a thumbnail takes to change on hover, focus or when it becomes active.', 'b-blocks')}
			min={0}
			max={2000}
			step={50}
			allowReset
			resetFallbackValue={200}
			value={Number.isFinite(thumbs.transition?.duration) ? thumbs.transition.duration : 200}
			onChange={(val) => updateObj('thumbs', Number.isFinite(val) ? val : 200, 'transition', 'duration')}
		/>

		<SelectControl
			className='mt20'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Transition Easing', 'b-blocks')}
			labelPosition='edge'
			value={thumbs.transition?.easing || 'ease'}
			options={easingOptions}
			onChange={(val) => updateObj('thumbs', val, 'transition', 'easing')}
		/>

		<div className='mt20'>
			<Label className=''>{__('Thumbnails Background & Border', 'b-blocks')}</Label>
			<TabPanel className='bPlTabPanel small mt5' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
				{({ name: state }) => <>
					<Background className='mt10' label={__('Background', 'b-blocks')} value={thumbs[state]?.bg} defaults={defaults.thumbs[state]?.bg} isImage={false} onChange={(val) => updateObj('thumbs', val, state, 'bg')} />

					<BorderBoxControl
						className='mt10'
						__next40pxDefaultSize
						label={__('Border', 'b-blocks')}
						withSlider
						enableStyle
						value={thumbs[state]?.border}
						onChange={(val) => updateObj('thumbs', val || {}, state, 'border')}
					/>

					<BoxControl label={<Flex className='mb5'>{__('Border Radius', 'b-blocks')}<Device /></Flex>} values={thumbs[state]?.radius?.[device]} onChange={(val) => updateObj('thumbs', val, state, 'radius', device)} />

					<BoxControl className='mt20' label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={thumbs[state]?.padding?.[device]} onChange={(val) => updateObj('thumbs', val, state, 'padding', device)} />

					<ShadowControl className='mt20' label={__('Box Shadow', 'b-blocks')} value={thumbs[state]?.shadow || []} onChange={(val) => updateObj('thumbs', val, state, 'shadow')} />

				</>}
			</TabPanel>
		</div>

		<div className='mt20'>
			<Label className=''>{__('Active Thumbnail Background & Border', 'b-blocks')}</Label>
			<TabPanel className='bPlTabPanel small mt5' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
				{({ name: state }) => <>
					<Background className='mt10' label={__('Background', 'b-blocks')} value={activeThumbs[state]?.bg} defaults={defaults.activeThumbs[state]?.bg} isImage={false} onChange={(val) => updateObj('activeThumbs', val, state, 'bg')} />

					<BorderBoxControl
						className='mt10'
						__next40pxDefaultSize
						label={__('Border', 'b-blocks')}
						withSlider
						enableStyle
						value={activeThumbs[state]?.border}
						onChange={(val) => updateObj('activeThumbs', val || {}, state, 'border')}
					/>

					<BoxControl className='mt20' label={<Flex >{__('Border Radius', 'b-blocks')}<Device /></Flex>} values={activeThumbs[state]?.radius?.[device]} onChange={(val) => updateObj('activeThumbs', val, state, 'radius', device)} />

					<BoxControl className='mt20' label={<Flex>{__('Padding', 'b-blocks')}<Device /></Flex>} values={activeThumbs[state]?.padding?.[device]} onChange={(val) => updateObj('activeThumbs', val, state, 'padding', device)} />

					<ShadowControl className='mt20' label={__('Box Shadow', 'b-blocks')} value={activeThumbs[state]?.shadow || []} onChange={(val) => updateObj('activeThumbs', val, state, 'shadow')} />
				</>}
			</TabPanel>
		</div>
	</PanelBody>;
};

export default ThumbnailsStyle;