import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from '../../../../utils/icons';
import { themeOptions } from '../../../../utils/options';
import { applyTheme } from '../../../../utils/themes';

const Layout = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { table = {} } = attributes;

	return <PanelBody
		className='bPlPanelBody'
		title={__('Layout', 'b-blocks')}
		initialOpen={true}
	>
		<SelectControl
			label={__('Visual theme', 'b-blocks')}
			value={table.theme || 'default'}
			options={themeOptions}
			onChange={(val) => setAttributes(applyTheme(val, attributes))}
			__nextHasNoMarginBottom
		/>

		<Flex align='center' className='mt10'>
			<Label className='flex1 mb0'>{__('Table alignment', 'b-blocks')}</Label>

			<ToggleGroupControl
				className='flex1'
				size='small'
				style={{ padding: '2px' }}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				isBlock
				value={table.alignment || 'center'}
				onChange={(val) => updateObj('table', val || 'center', 'alignment')}
			>
				<ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='left' icon={<AlignStartIcon style={{ rotate: '-90deg' }} />} />
				<ToggleGroupControlOptionIcon label={__('Center', 'b-blocks')} value='center' icon={<AlignCenterIcon style={{ rotate: '-90deg' }} />} />
				<ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='right' icon={<AlignEndIcon style={{ rotate: '-90deg' }} />} />
			</ToggleGroupControl>
		</Flex>

		<Label className='mt10 mb5'><Flex justify='flex-start' gap={0}>{__('Header icon position', 'b-blocks')} <Device /></Flex></Label>
		<ToggleGroupControl
			className='flex1'
			size='small'
			style={{ padding: '2px' }}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			isDeselectable
			value={table?.[device]?.iconPosition}
			onChange={(val) => updateObj('table', val, device, 'iconPosition')}
		>
			<ToggleGroupControlOption label={__('Top', 'b-blocks')} value='top' />
			<ToggleGroupControlOption label={__('Bottom', 'b-blocks')} value='bottom' />
			<ToggleGroupControlOption label={__('Left', 'b-blocks')} value='left' />
			<ToggleGroupControlOption label={__('Right', 'b-blocks')} value='right' />
			<ToggleGroupControlOption label={__('Hide', 'b-blocks')} value='hidden' />
		</ToggleGroupControl>

		<small className='mb10' style={{ display: 'block', opacity: 0.7 }}>
			{__('Set each column’s icon under Columns (Plans). Leave tablet and mobile unset to inherit.', 'b-blocks')}
		</small>

		<ToggleControl
			className='mt10'
			label={__('Row stripes', 'b-blocks')}
			checked={!!table.showRowStripes}
			onChange={(val) => updateObj('table', val, 'showRowStripes')}
		/>

		<ToggleControl
			className='mt10'
			label={__('Sticky header row', 'b-blocks')}
			checked={!!table.stickyHeader}
			onChange={(val) => updateObj('table', val, 'stickyHeader')}
			help={__('Pin the header row while the user scrolls vertically.', 'b-blocks')}
		/>

		<ToggleControl
			className='mt10'
			label={__('Sticky first column', 'b-blocks')}
			checked={false !== table.stickyFirstColumn}
			onChange={(val) => updateObj('table', val, 'stickyFirstColumn')}
			help={__('Pin the feature-name column while the user scrolls horizontally.', 'b-blocks')}
		/>

		<ToggleControl
			className='mt10'
			label={__('Stack columns on mobile', 'b-blocks')}
			checked={!!table.stackOnMobile}
			onChange={(val) => updateObj('table', val, 'stackOnMobile')}
			help={__('Below 640px each row becomes a card and every value is labelled with its plan name, instead of scrolling sideways.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};
export default Layout;
