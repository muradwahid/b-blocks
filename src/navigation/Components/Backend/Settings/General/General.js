import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ToggleControl, } from '@wordpress/components';

import { BtnGroup, HelpPanel, Label } from '../../../../../../../bpl-tools/Components';

import { alignCenterIcon, alignJustifyIcon, alignLeftIcon, alignRightIcon } from '../../../../utils/icons';

const General = (props) => {
	const { attributes, updateObj } = props;
	const { layout, hamburger } = attributes;

	return <>
		<HelpPanel slug='b-blocks' />

		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
			<SelectControl label={__('Orientation', 'b-blocks')} labelPosition='left'
				options={[
					{ label: 'Horizontal', value: 'is-horizontal' },
					{ label: 'Vertical', value: 'is-vertical' },
				]}
				value={layout.orientation}
				onChange={(val) => updateObj('layout', val, 'orientation')}
			/>

			{/* <SelectControl
				className='mt20'
				label={__('Preset', 'b-blocks')} labelPosition='left'
				options={[
					{ label: 'Preset 1', value: 'preset-1' },
					{ label: 'Preset 2', value: 'preset-2' },
					{ label: 'Preset 3', value: 'preset-3' },
				]}
				value={layout.preset}
				onChange={(val) => updateObj('layout', val, 'preset')}
			/> */}

			{layout.orientation === 'is-horizontal' && <>
				<ToggleControl className='mt20' label={__('Allow to wrap to multiple lines', 'b-blocks')} checked={layout.isWrapMultipleLine} onChange={(val) => updateObj('layout', val, 'isWrapMultipleLine')} />

				<BtnGroup className='mt20' label={__('Alignment', 'b-blocks')}
					options={[
						{ label: 'Left', value: 'left', icon: alignLeftIcon },
						{ label: 'Center', value: 'center', icon: alignCenterIcon },
						{ label: 'Right', value: 'right', icon: alignRightIcon },
						{ label: 'Justify', value: 'justify', icon: alignJustifyIcon },
					]}
					value={layout.alignment}
					onChange={(val) => updateObj('layout', val, 'alignment')} isIcon={true} size='small' />
			</>}

			{layout.orientation === 'is-horizontal' && <BtnGroup className='mt20' label={__('Alignment', 'b-blocks')}
				options={[
					{ label: 'Left', value: 'left', icon: alignLeftIcon },
					{ label: 'Center', value: 'center', icon: alignCenterIcon },
					{ label: 'Right', value: 'right', icon: alignRightIcon }
				]}
				value={layout.verticalAlignment}
				onChange={(val) => updateObj('layout', val, 'verticalAlignment')} isIcon={true} />}
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Dropdown Menu', 'b-blocks')} initialOpen={false}>
			<ToggleControl
				label={__('Open on Click', 'b-blocks')}
				checked={layout.isOpenOnClick}
				onChange={(val) => updateObj('layout', val, 'isOpenOnClick')}
			/>

			<ToggleControl className='mt20'
				label={__('Show dropdown menu icon?', 'b-blocks')}
				checked={layout.isMenuIcon}
				onChange={(val) => updateObj('layout', val, 'isMenuIcon')}
			/>
		</PanelBody>


		<PanelBody className='bPlPanelBody' title={__('Hamburger Menu', 'b-blocks')} initialOpen={false}>
			<BtnGroup label={__('Button Type', 'b-blocks')}
				options={[
					{ label: 'Text', value: 'text', icon: 'Text' },
					{ label: 'Icon', value: 'icon', icon: 'Icon' }
				]}
				value={hamburger.buttonType}
				onChange={(val) => updateObj('hamburger', val, 'buttonType')} isTextIcon={true} />


			<Label>{__('Display Hamburger Menu', 'b-blocks')}</Label>
			<BtnGroup value={hamburger.displayMenu} onChange={(val) => updateObj('hamburger', val, 'displayMenu')} isTextIcon={true} options={[
				{ value: 'never', label: 'OFF', icon: 'OFF' },
				{ value: 'mobile', label: 'MOBILE', icon: 'MOBILE' },
				{ value: 'always', label: 'ALWAYS', icon: 'ALWAYS' },
			]} />
		</PanelBody>
	</>
};
export default General;