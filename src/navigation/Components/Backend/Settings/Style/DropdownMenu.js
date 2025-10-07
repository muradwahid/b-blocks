import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, RangeControl, TabPanel, } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { PanelRow } from '@wordpress/components';

const DropdownMenu = ({ attributes, updateObj, device }) => {
	const { dropdownStyles } = attributes;
	const { container, menuItems } = dropdownStyles;
	const { width, background, padding, border, borderRadius, shadow } = container || {}
	const { padding: itemsPadding, typo, colors } = menuItems;

	return <PanelBody className='bPlPanelBody' title={__('Dropdown / Sub Menus', 'b-blocks')} initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={[
			{ title: 'Container', name: 'container' },
			{ title: 'Items', name: 'items' },
		]}>{(tab) => <>
			{tab.name === 'container' && <>
				<RangeControl className='mt10'
					label={<PanelRow>
						{__('Min Width (PX)', 'b-blocks')}
						<Device />
					</PanelRow>}
					value={width[device]}
					onChange={(val) => updateObj('dropdownStyles', val, 'container', 'width', device)}
					min={100}
					max={600}
				/>

				<Background className='mt20 mb20'
					isImage={false}
					value={background}
					onChange={(val) => updateObj('dropdownStyles', val, 'container', 'background')}
				/>

				<BoxControl
					label={<Flex justify='space-between'>
						{__('Padding', 'b-blocks')}
						<Device />
					</Flex>}
					values={padding[device]}
					onChange={(val) => updateObj('dropdownStyles', val, 'container', 'padding', device)}
				/>

				<BorderBoxControl className='mt20 mb20'
					label={__('Border', 'b-blocks')}
					value={border}
					onChange={(val) => updateObj('dropdownStyles', val, 'container', 'border')}
				/>

				<BoxControl
					label={__('Border Radius', 'b-blocks')}
					values={borderRadius}
					onChange={(val) => updateObj('dropdownStyles', val, 'container', 'borderRadius')}
				/>

				<ShadowControl className='mt20'
					label={__('Shadow', 'b-blocks')}
					value={shadow}
					onChange={(val) => updateObj('dropdownStyles', val, 'container', 'shadow')}
				/>
			</>}

			{tab.name === 'items' && <>
				<br />
				<BoxControl
					label={<Flex justify='space-between'>
						{__('Padding', 'b-blocks')}
						<Device />
					</Flex>}
					values={itemsPadding[device]}
					onChange={(val) => updateObj('dropdownStyles', val, 'menuItems', 'padding', device)}
				/>

				<Typography className='mt20' value={typo} onChange={(val) => updateObj('dropdownStyles', val, 'menuItems', 'typo')} />

				<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={[
					{ title: 'Normal', name: 'normal' },
					{ title: 'Active', name: 'active' },
				]}>{({ name: active }) => <>
					<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={[
						{ title: 'Normal', name: 'normal' },
						{ title: 'Hover', name: 'hover' },
					]}>{({ name: hover }) => <>
						<ColorControl className='mt10'
							label={__('Text', 'b-blocks')}
							value={colors[active][hover]}
							onChange={(val) => updateObj('dropdownStyles', val, 'menuItems', 'colors', active, hover)}
						/>

						{active === 'normal' && hover === 'hover' && <RangeControl className='mt20' label={__('Transition', 'b-blocks')} min={0} max={5} step={0.1} />}
					</>}</TabPanel>
				</>}</TabPanel>
			</>}</>}
		</TabPanel>
	</PanelBody>
}
export default DropdownMenu;
