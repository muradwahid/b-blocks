import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	TextareaControl,
	Flex,
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { Label, Device } from '../../../../../../../bpl-tools/Components';
import {
	UNITS,
	MIN_HEIGHT_OPTIONS,
	MIN_HEIGHT_PRESETS,
	VALIGN_OPTIONS,
	ALIGN_OPTIONS,
	HEADING_TAG_OPTIONS,
} from '../../../../utils/options';

const General = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, eyebrow = {}, heading = {}, subHeading = {}, button = {} } = attributes;

	const { minHeight = '60vh', verticalAlign = {}, contentAlign = {}, btnGap = {} } = layout;

	const isCustomHeight = !MIN_HEIGHT_PRESETS.includes(minHeight);

	// Responsive value read/write that tolerates legacy string values.
	const respVal = (v) => (v && typeof v === 'object') ? (v[device] || '') : (device === 'desktop' ? (v || '') : '');
	const setResp = (key, val) => {
		const cur = layout[key];
		const base = (cur && typeof cur === 'object') ? cur : {};
		setAttributes({ layout: { ...layout, [key]: { ...base, [device]: val } } });
	};

	return <>
		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
			<SelectControl
				label={__('Section min-height', 'b-blocks')}
				value={isCustomHeight ? 'custom' : minHeight}
				options={MIN_HEIGHT_OPTIONS}
				onChange={(val) => updateObj('layout', val === 'custom' ? '600px' : val, 'minHeight')}
				__nextHasNoMarginBottom
			/>

			{isCustomHeight && (
				<UnitControl
					className='mt10'
					label={__('Custom min-height', 'b-blocks')}
					value={minHeight}
					units={[
						{ label: 'px', value: 'px' },
						{ label: 'vh', value: 'vh' },
						{ label: '%', value: '%' },
						{ label: 'rem', value: 'rem' },
						{ label: 'em', value: 'em' },
					]}
					onChange={(val) => updateObj('layout', val || '600px', 'minHeight')}
					__next40pxDefaultSize
				/>
			)}

			<Flex align='center' className='mt10'>
				<Label className='flex1'><Flex justify='flex-start' gap={0}>{__('Vertical Align', 'b-blocks')} <Device /></Flex></Label>
				<ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={respVal(verticalAlign)} onChange={(val) => setResp('verticalAlign', val || '')}>
					{VALIGN_OPTIONS.map((o) => <ToggleGroupControlOptionIcon key={o.value} label={o.label} value={o.value} icon={o.value === 'top' ? 'arrow-up-alt2' : o.value === 'bottom' ? 'arrow-down-alt2' : 'minus'} />)}
				</ToggleGroupControl>
			</Flex>

			<Flex align='center' className='mt10'>
				<Label className='flex1'><Flex justify='flex-start' gap={0}>{__('Text Align', 'b-blocks')} <Device /></Flex></Label>
				<ToggleGroupControl className='flex1' size='small' style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={respVal(contentAlign)} onChange={(val) => setResp('contentAlign', val || '')}>
					{ALIGN_OPTIONS.map((o) => <ToggleGroupControlOptionIcon key={o.value} label={o.label} value={o.value} icon={`editor-align${o.value}`} />)}
				</ToggleGroupControl>
			</Flex>
			<Flex className='mt10'>
				<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Gap between buttons', 'b-blocks')} <Device /></Flex></Label>
				<UnitControl className='flex1' value={respVal(btnGap)} units={UNITS} onChange={(val) => setResp('btnGap', val)} __next40pxDefaultSize />
			</Flex>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Eyebrow', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show eyebrow label', 'b-blocks')} checked={!!eyebrow.show} onChange={(val) => updateObj('eyebrow', !!val, 'show')} />

			{!!eyebrow.show && (
				<TextControl
					label={__('Eyebrow text', 'b-blocks')}
					value={eyebrow.text || ''}
					onChange={(val) => updateObj('eyebrow', val, 'text')}
					placeholder={__('NEW — SUMMER 2026', 'b-blocks')}
					help={__('Also editable inline on the block canvas.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Headline', 'b-blocks')} initialOpen={false}>
			<TextControl
				label={__('Headline text', 'b-blocks')}
				value={heading.text || ''}
				onChange={(val) => updateObj('heading', val, 'text')}
				placeholder={__('Build Something Amazing', 'b-blocks')}
				help={__('Also editable inline on the block canvas.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>

			<SelectControl
				className='mt10'
				label={__('Heading HTML tag', 'b-blocks')}
				labelPosition='edge'
				value={heading.tag || 'h1'}
				options={HEADING_TAG_OPTIONS}
				onChange={(val) => updateObj('heading', val, 'tag')}
				help={__('Use H1 only once per page. Other instances should be H2 or H3.', 'b-blocks')}
				__nextHasNoMarginBottom
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Sub-headline', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show sub-headline', 'b-blocks')} checked={!!subHeading.show} onChange={(val) => updateObj('subHeading', !!val, 'show')} />

			{!!subHeading.show && (
				<TextareaControl
					className='mt10'
					label={__('Sub-headline text', 'b-blocks')}
					value={subHeading.text || ''}
					onChange={(val) => updateObj('subHeading', val, 'text')}
					placeholder={__('The easiest way to launch your next big idea…', 'b-blocks')}
					help={__('Also editable inline on the block canvas.', 'b-blocks')}
					rows={3}
					__nextHasNoMarginBottom
				/>
			)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Buttons', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show primary button', 'b-blocks')} checked={!!button.show} onChange={(val) => updateObj('button', !!val, 'show')} />

			{!!button.show && (
				<>
					<TextControl className='mt10' label={__('Primary button label', 'b-blocks')} value={button.text || ''} onChange={(val) => updateObj('button', val, 'text')} placeholder={__('Get Started', 'b-blocks')} __nextHasNoMarginBottom />
					<TextControl className='mt10' label={__('Primary button URL', 'b-blocks')} type='url' value={button.url || ''} onChange={(val) => updateObj('button', val, 'url')} placeholder='https://…' __nextHasNoMarginBottom />
					<ToggleControl className='mt10' label={__('Open primary in new tab', 'b-blocks')} checked={!!button.newTab} onChange={(val) => updateObj('button', !!val, 'newTab')} />
				</>
			)}
		</PanelBody>
	</>;
};
export default General;
