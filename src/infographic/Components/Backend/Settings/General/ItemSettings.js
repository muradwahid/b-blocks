import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, TabPanel, TextControl, TextareaControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, ColorControl, IconLibrary, Label, MediaArea } from '../../../../../../../bpl-tools/Components';

import { updateAttributes } from '../../../../../../../bpl-tools/utils/functions';

import { autoSegmentAngle, contentStyleTabs, degUnit, getVisibleItems, iconTypes, imagePositions, stateLabel, stateTabs } from '../../../../utils/options';

const ItemSettings = ({ attributes, setAttributes, index }) => {
	const { items = [], elements = {}, wheel = {} } = attributes;
	const { enable = true, buttonLabel = '', position = '', buttonIcon = {}, title = '', description = '', image = {}, imageHeight = '107px', imagePosition = 'top', link = {}, styles = {} } = items?.[index] || {};

	const updateItem = updateAttributes(attributes, setAttributes);

	const setItem = (key, val, ...props) => updateItem('items', val, index, key, ...props);

	// Where this item would sit if left on auto spacing. It has to be measured
	// exactly as the render measures it — the wheel settings included, and the
	// slot among the enabled items rather than the raw array index — or the
	// placeholder reports a position the segment is not at.
	const visible = getVisibleItems(items);
	const slot = visible.findIndex((one) => one.index === index);
	const autoAngle = Math.round(autoSegmentAngle(-1 === slot ? index : slot, visible.length || items.length, wheel));

	return <TabPanel className='bPlTabPanel small bBlocksSettingInfographicSettings' activeClass='activeTab' tabs={contentStyleTabs}>
		{(tab) => <>
			{'content' === tab.name && <>
				<ToggleControl className='mt10' label={__('Enable Item', 'b-blocks')} checked={false !== enable} onChange={(val) => setItem('enable', val)} help={__('Switched off, the item leaves the ring and the rest re-space themselves.', 'b-blocks')} __nextHasNoMarginBottom />

				<TextControl className='mt10' label={__('Button Label', 'b-blocks')} value={buttonLabel} onChange={(val) => setItem('buttonLabel', val)} __nextHasNoMarginBottom />

				<Flex className='mt10'>
					<Label className='mb0 flex2'>{__('Position', 'b-blocks')}</Label>

					<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={position || ''} onChange={(val) => setItem('position', val)} units={[degUnit()]} placeholder={`${autoAngle}`} />
				</Flex>

				<small>{__('Clockwise from the top. Leave empty to keep this item evenly spaced with the rest.', 'b-blocks')}</small>

				<Flex className='mt10'>
					<Label className='mb0 flex1'>{__('Button Icon', 'b-blocks')}</Label>

					<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={buttonIcon?.type || 'icon'} onChange={(val) => setItem('buttonIcon', val, 'type')}>
						{iconTypes.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
					</ToggleGroupControl>
				</Flex>

				{'image' === buttonIcon?.type ?
					<MediaArea className='mt10' value={{ url: buttonIcon?.url }} height='90%' width='90%' onChange={(val) => setItem('buttonIcon', val?.url || '', 'url')} /> :
					<IconLibrary className='mt10' value={buttonIcon?.icon} onChange={(val) => setItem('buttonIcon', val, 'icon')} />}

				<TextControl className='mt10' label={__('Title', 'b-blocks')} value={title} onChange={(val) => setItem('title', val)} __nextHasNoMarginBottom />

				<TextareaControl className='mt10' label={__('Description', 'b-blocks')} value={description} onChange={(val) => setItem('description', val)} __nextHasNoMarginBottom />

				<Label>{__('Image', 'b-blocks')}</Label>
				<MediaArea height='90%' width='90%' value={image} onChange={(val) => setItem('image', val)} />

				{/* The centre image is gated behind the Elements toggle, which is off by
				    default, so an image set here would otherwise just do nothing. */}
				{!elements.image && <small>{__('Nothing will show until Enable Image is switched on in the Elements panel.', 'b-blocks')}</small>}

				<Flex className='mt10'>
					<Label className='mb0 flex2'>{__('Image Height', 'b-blocks')}</Label>

					<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={imageHeight || ''} onChange={(val) => setItem('imageHeight', val)} />
				</Flex>

				<Flex className='mt10'>
					<Label className='mb0 flex1'>{__('Image Position', 'b-blocks')}</Label>

					<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={imagePosition} onChange={(val) => setItem('imagePosition', val)}>
						{imagePositions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
					</ToggleGroupControl>
				</Flex>

				<TextControl className='mt10' label={__('Link', 'b-blocks')} value={link?.url || ''} onChange={(val) => setItem('link', val, 'url')} placeholder={__('https://example.com', 'b-blocks')} __nextHasNoMarginBottom />

				<TextControl className='mt10' label={__('Link Title', 'b-blocks')} value={link?.title || ''} onChange={(val) => setItem('link', val, 'title')} help={__('Accessible name for the link.', 'b-blocks')} __nextHasNoMarginBottom />

				<ToggleControl className='mt10' label={__('Open In New Tab', 'b-blocks')} checked={!!link?.target} onChange={(val) => setItem('link', val, 'target')} __nextHasNoMarginBottom />

				<ToggleControl className='mt10' label={__('Add Nofollow', 'b-blocks')} checked={!!link?.nofollow} onChange={(val) => setItem('link', val, 'nofollow')} __nextHasNoMarginBottom />

			</>}

			{'style' === tab.name && <>
				{/* Every one of these is optional — left empty, the item follows
				    the global colours from the Style tab. */}
				<TabPanel className='bPlTabPanel small mt10 infographicItemsPanelTabPanel' activeClass='activeTab' tabs={stateTabs}>
					{(state) => <>
						<ColorControl label={stateLabel(state.name, __('Button label color', 'b-blocks'))} value={styles?.[state.name]?.color?.label} onChange={(val) => setItem('styles', val, state.name, 'color', 'label')} />

						<ColorControl className='mt10' label={stateLabel(state.name, __('Button Icon color', 'b-blocks'))} value={styles?.[state.name]?.color?.icon} onChange={(val) => setItem('styles', val, state.name, 'color', 'icon')} />

						<Background className='mt10' label={stateLabel(state.name, __('Button BG Color', 'b-blocks'))} value={styles?.[state.name]?.background} onChange={(val) => setItem('styles', val, state.name, 'background')} />

						<BorderBoxControl label={stateLabel(state.name, __('Border', 'b-blocks'))} value={styles?.[state.name]?.border} onChange={(val) => setItem('styles', val, state.name, 'border')} />

						<ColorControl className='mt10' label={stateLabel(state.name, __('Title color', 'b-blocks'))} value={styles?.[state.name]?.color?.title} onChange={(val) => setItem('styles', val, state.name, 'color', 'title')} />

						<ColorControl className='mt10' label={stateLabel(state.name, __('Divider color', 'b-blocks'))} value={styles?.[state.name]?.color?.divider} onChange={(val) => setItem('styles', val, state.name, 'color', 'divider')} />

						<ColorControl className='mt10' label={stateLabel(state.name, __('Description color', 'b-blocks'))} value={styles?.[state.name]?.color?.desc} onChange={(val) => setItem('styles', val, state.name, 'color', 'desc')} />
					</>}
				</TabPanel>

				<small>{__('Button colours follow the segment. Title, Divider and Description colours apply to the centre while this item is the one showing there — hover and active track the centre disc being hovered and pressed.', 'b-blocks')}</small>
			</>}
		</>}
	</TabPanel>;
};

export default ItemSettings;
