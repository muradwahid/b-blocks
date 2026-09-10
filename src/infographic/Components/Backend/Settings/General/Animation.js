import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { animationTriggers, contentAnimations, directions, easings, getAnimationTypes, hoverMotions, msUnit, sUnit, staggerOrders, toMs } from '../../../../utils/options';

/**
 * Every animation setting in one panel, under one switch. Rotation is a layer
 * rather than an entrance, so a turning ring combines with any arrival type.
 */
const Animation = ({ attributes, updateObj }) => {
	const { animation = {}, wheel = {} } = attributes;

	const set = (val, key) => updateObj('animation', val, key);
	// A clip-path holds wedges in place: they can fade, never travel.
	const isWedge = wheel.enableSegmentsType;

	return <PanelBody className='bPlPanelBody' title={__('Animation', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Enable Animation', 'b-blocks')} checked={animation.enable} onChange={(val) => set(val, 'enable')} __nextHasNoMarginBottom />

		{animation.enable && <>
			<SelectControl className='mt10' label={__('Trigger', 'b-blocks')} labelPosition='edge' value={animation.trigger || 'load'} options={animationTriggers} onChange={(val) => set(val, 'trigger')} help={__('Waiting for the scroll keeps a block below the fold from finishing before anyone reaches it.', 'b-blocks')} __nextHasNoMarginBottom />

			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Delay', 'b-blocks')}</Label>

				<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={animation.delay || ''} onChange={(val) => set(val, 'delay')} units={[msUnit(), sUnit()]} />
			</Flex>

			<SelectControl className='mt10' label={__('Type', 'b-blocks')} labelPosition='edge' value={animation.type || 'spread'} options={getAnimationTypes(isWedge)} onChange={(val) => set(val, 'type')} __nextHasNoMarginBottom />

			{isWedge && <small>{__('Segments are placed by a clip-path, which the moving entrances cannot work around — so only the two that fade rather than travel are offered here.', 'b-blocks')}</small>}

			<SelectControl className='mt10' label={__('Easing', 'b-blocks')} labelPosition='edge' value={animation.easing || 'ease'} options={easings} onChange={(val) => set(val, 'easing')} __nextHasNoMarginBottom />

			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Speed', 'b-blocks')}</Label>

				<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={animation.speed || ''} onChange={(val) => set(val, 'speed')} units={[msUnit(), sUnit()]} />
			</Flex>

			<Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Stagger', 'b-blocks')}</Label>

				<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={animation.stagger || ''} onChange={(val) => set(val, 'stagger')} units={[msUnit(), sUnit()]} placeholder={`${Math.round(toMs(animation.speed) * 0.25)}`} />
			</Flex>

			<small>{__('The gap between one segment arriving and the next. Zero brings them in together; left empty it scales with the speed.', 'b-blocks')}</small>

			<SelectControl className='mt10' label={__('Order', 'b-blocks')} labelPosition='edge' value={animation.order || 'clockwise'} options={staggerOrders} onChange={(val) => set(val, 'order')} __nextHasNoMarginBottom />

			<SelectControl className='mt10' label={__('Content Transition', 'b-blocks')} labelPosition='edge' value={animation.contentType || 'none'} options={contentAnimations} onChange={(val) => set(val, 'contentType')} help={__('How the centre swaps its title, text and image when a new segment is selected.', 'b-blocks')} __nextHasNoMarginBottom />

			{'none' !== animation.contentType && <Flex className='mt10'>
				<Label className='mb0 flex2'>{__('Transition Speed', 'b-blocks')}</Label>

				<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={animation.contentSpeed || ''} onChange={(val) => set(val, 'contentSpeed')} units={[msUnit(), sUnit()]} />
			</Flex>}

			<SelectControl className='mt10' label={__('Hover Motion', 'b-blocks')} labelPosition='edge' value={animation.hoverMotion || 'none'} options={hoverMotions} onChange={(val) => set(val, 'hoverMotion')} help={__('Movement on hover, separate from the hover colours in the Style tab.', 'b-blocks')} __nextHasNoMarginBottom />

			<ToggleControl className='mt10' label={__('Pulse Active Segment', 'b-blocks')} checked={animation.activePulse} onChange={(val) => set(val, 'activePulse')} help={__('A soft, continuous pulse on whichever segment is driving the centre.', 'b-blocks')} __nextHasNoMarginBottom />

			{!isWedge && <>
				<ToggleControl className='mt10' label={__('Rotate Ring', 'b-blocks')} checked={animation.rotate} onChange={(val) => set(val, 'rotate')} help={__('Keeps the ring turning once the entrance has finished. Combines with any type above.', 'b-blocks')} __nextHasNoMarginBottom />

				{animation.rotate && <>
					<Flex className='mt10'>
						<Label className='mb0 flex2'>{__('Rotation Speed', 'b-blocks')}</Label>

						<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={animation.rotateSpeed || ''} onChange={(val) => set(val, 'rotateSpeed')} units={[sUnit(), msUnit()]} />
					</Flex>

					<small>{__('One full turn. Seconds rather than milliseconds — anything quick reads as a spin.', 'b-blocks')}</small>

					<Label className='mb0 mt10 flex1'>{__('Direction', 'b-blocks')}</Label>

					<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={animation.rotateDirection || 'clockwise'} onChange={(val) => set(val, 'rotateDirection')}>
						{directions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
					</ToggleGroupControl>


					<ToggleControl className='mt10' label={__('Pause On Hover', 'b-blocks')} checked={animation.pauseOnHover} onChange={(val) => set(val, 'pauseOnHover')} help={__('A turning segment travels away from the pointer, which makes it hard to click.', 'b-blocks')} __nextHasNoMarginBottom />
				</>}
			</>}
		</>}
	</PanelBody>;
};

export default Animation;
