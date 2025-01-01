import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderBoxControl, PanelBody, RangeControl, TabPanel, } from '@wordpress/components';

import { Background, BoxControl, BtnGroup, ColorControl, Device, Typography, } from '../../../../../../../bpl-tools/Components';

import { alignCenterIcon, alignLeftIcon, alignRightIcon, } from '../../../../utils/icons';
import { PanelRow } from '@wordpress/components';

const HamburgerMenu = ({ attributes, updateObj, device }) => {
	const { hamburger } = attributes;
	const { button, container, items, closeButton } = hamburger;

	return <PanelBody className='bPlPanelBody' title={__('Hamburger Menu', 'b-blocks')} initialOpen={false}>
		<TabPanel className='bPlTabPanel mini' activeClass='activeTab' tabs={[
			{ title: 'Button', name: 'button' },
			{ title: 'Container', name: 'container' },
			{ title: 'Items', name: 'items' },
			{ title: 'Close Icon', name: 'close' }
		]}>{({ name }) => <>
			{name === 'button' && <>
				<RangeControl className='mt10 mb20'
					label={<PanelRow>
						{__('Size', 'b-blocks')}
						<Device />
					</PanelRow>}
					value={button.size[device]}
					onChange={(val) => updateObj('hamburger', val, 'button', 'size', device)}
				/>

				<BoxControl
					label={<PanelRow>
						{__('Padding', 'b-blocks')}
						<Device />
					</PanelRow>}
					values={button.padding[device]}
					onChange={(val) => updateObj('hamburger', val, 'button', 'padding', device)}
				/>

				<ColorControl className='mt20'
					label={__('Color', 'b-blocks')}
					value={button.color}
					onChange={(val) => updateObj('hamburger', val, 'button', 'color')}
				/>
			</>}

			{name === 'container' && <>
				<br />
				<BoxControl
					label={<PanelRow>
						{__('Padding', 'b-blocks')}
						<Device />
					</PanelRow>}
					values={container.padding[device]}
					onChange={(val) => updateObj('hamburger', val, 'container', 'padding', device)}
				/>

				<Background className='mt20'
					value={container.background}
					onChange={(val) => updateObj('hamburger', val, 'container', 'background')}
				/>
			</>}

			{name === 'items' && <>
				<br />
				<BoxControl
					label={<PanelRow>
						{__('Padding', 'b-blocks')}
						<Device />
					</PanelRow>}
					values={items.padding[device]}
					onChange={(val) => updateObj('hamburger', val, 'items', 'padding', device)}
				/>

				<BorderBoxControl className='mt20 mb20'
					label={__('Border', 'b-blocks')}
					value={items.border}
					onChange={(val) => updateObj('hamburger', val, 'items', 'border')}
				/>

				<BoxControl
					label={__('Border Radius', 'b-blocks')}
					values={items.borderRadius}
					resetValues={{ left: '0px', right: '0px', top: '0px', bottom: '0px', }}
					onChange={(val) => updateObj('hamburger', val, 'items', 'borderRadius')}
				/>

				<Typography
					className='mt20'
					value={items.typo}
					onChange={(val) => updateObj('hamburger', val, 'items', 'typo')}
				/>

				<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={[
					{ title: 'Normal', name: 'normal' },
					{ title: 'Hover', name: 'hover' },
				]}>{({ name }) => <>
					<ColorControl className='mt10'
						label={__('Text Color', 'b-blocks')}
						value={items.colors[name].text}
						onChange={(val) => updateObj('hamburger', val, 'items', 'colors', name, 'text')}
					/>

					<ColorControl className='mt10'
						label={__('Background Color', 'b-blocks')}
						value={items.colors[name].bg}
						onChange={(val) => updateObj('hamburger', val, 'items', 'colors', name, 'bg')}
					/>
				</>}</TabPanel>
			</>}

			{name === 'close' && <>
				<ColorControl className='mt10'
					label={__('Color', 'b-blocks')}
					value={closeButton.color}
					onChange={(val) => updateObj('hamburger', val, 'closeButton', 'color')}
				/>

				<BtnGroup className='mt20' label={__('Alignment', 'b-blocks')}
					options={[
						{ label: 'Left', value: 'left', icon: alignLeftIcon },
						{ label: 'Center', value: 'center', icon: alignCenterIcon },
						{ label: 'Right', value: 'right', icon: alignRightIcon }
					]}
					value={closeButton.alignment}
					onChange={(val) => updateObj('hamburger', val, 'closeButton', 'alignment')} isIcon={true} />
			</>}
		</>}</TabPanel>
	</PanelBody>
}
export default HamburgerMenu;