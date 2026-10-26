import { __ } from '@wordpress/i18n';
import { BorderBoxControl, BorderControl, Flex, PanelBody, TabPanel } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';

import { UNITS } from '../../../../utils/options';

const TabTitleStyle = ({ attributes, updateObj, device }) => {
	const { tabTitle = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Tab Title', 'b-blocks')} initialOpen={true}>
		<BoxControl
			className='mt20'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')}<Device /></Flex>}
			values={tabTitle[device]?.padding}
			units={UNITS}
			onChange={(val) => updateObj('tabTitle', val, device, 'padding')}
		/>

		<BoxControl
			className='mt20'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')}<Device /></Flex>}
			values={tabTitle[device]?.margin}
			units={UNITS}
			onChange={(val) => updateObj('tabTitle', val, device, 'margin')}
		/>

		<BorderControl
			__next40pxDefaultSize
			className='mt20'
			label={__('Divider', 'b-blocks')}
			withSlider
			enableStyle
			value={tabTitle.divider}
			onChange={(val) => updateObj('tabTitle', val || {}, 'divider')}
		/>

		<Typography
			label={__('Typography', 'b-blocks')}
			value={tabTitle.typo}
			onChange={(val) => updateObj('tabTitle', val, 'typo')}
		/>

		<TabPanel className='bPlTabPanel small mt20' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
			{({ name: state }) => <>
				<ColorControl
					className='mt10'
					label={__('Text', 'b-blocks')}
					value={tabTitle[state]?.color?.text}
					defaultColor={tabTitle[state]?.color?.text ? '__clear__' : undefined}
					onChange={(val) => updateObj('tabTitle', '__clear__' === val ? '' : val, state, 'color', 'text')}
				/>

				<Background
					className='mt10'
					label={__('Background', 'b-blocks')}
					value={tabTitle[state]?.color?.bg}
					isImage={false}
					onChange={(val) => updateObj('tabTitle', val, state, 'color', 'bg')}
				/>

				<ColorControl
					className='mt10'
					label={__('Active Tab Text', 'b-blocks')}
					value={tabTitle[state]?.color?.activeText}
					defaultColor={tabTitle[state]?.color?.activeText ? '__clear__' : undefined}
					onChange={(val) => updateObj('tabTitle', '__clear__' === val ? '' : val, state, 'color', 'activeText')}
				/>

				<Background
					className='mt10'
					label={__('Active Tab Background', 'b-blocks')}
					value={tabTitle[state]?.color?.activeBg}
					isImage={false}
					onChange={(val) => updateObj('tabTitle', val, state, 'color', 'activeBg')}
				/>

				<BorderBoxControl
					__next40pxDefaultSize
					className='mt10'
					label={__('Border', 'b-blocks')}
					withSlider
					enableStyle
					value={tabTitle[state]?.border}
					onChange={(val) => updateObj('tabTitle', val || {}, state, 'border')}
				/>

				<BoxControl
					className='mt10'
					label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')}<Device /></Flex>}
					values={tabTitle[state]?.[device]?.radius}
					units={UNITS}
					onChange={(val) => updateObj('tabTitle', val, state, device, 'radius')}
				/>

				<ShadowControl
					className='mt20'
					label={__('Box Shadow', 'b-blocks')}
					value={tabTitle[state]?.shadow || []}
					onChange={(val) => updateObj('tabTitle', val, state, 'shadow')}
				/>
			</>}
		</TabPanel>


	</PanelBody>;
};

export default TabTitleStyle;