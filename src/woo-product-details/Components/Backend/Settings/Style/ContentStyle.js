import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, TabPanel } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';

import { UNITS } from '../../../../utils/options';

const ContentStyle = ({ attributes, updateObj, device }) => {
	const { content = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={false}>

		<Typography
			label={__('Typography', 'b-blocks')}
			value={content.typo}
			onChange={(val) => updateObj('content', val, 'typo')}
		/>

		<BoxControl
			className='mt20'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')}<Device /></Flex>}
			values={content[device]?.margin}
			units={UNITS}
			onChange={(val) => updateObj('content', val, device, 'margin')}
		/>

		<BoxControl
			className='mt20'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')}<Device /></Flex>}
			values={content[device]?.padding}
			units={UNITS}
			onChange={(val) => updateObj('content', val, device, 'padding')}
		/>

		<TabPanel className='bPlTabPanel small mt5' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
			{({ name: state }) => <>
				<ColorControl
					className='mt10'
					label={__('Text', 'b-blocks')}
					value={content[state]?.color?.text}
					defaultColor={content[state]?.color?.text ? '__clear__' : undefined}
					onChange={(val) => updateObj('content', '__clear__' === val ? '' : val, state, 'color', 'text')}
				/>

				<Background
					className='mt10'
					label={__('Background', 'b-blocks')}
					value={content[state]?.color?.bg}
					isImage={false}
					onChange={(val) => updateObj('content', val, state, 'color', 'bg')}
				/>

				<BorderBoxControl
					__next40pxDefaultSize
					className='mt10'
					label={__('Border', 'b-blocks')}
					withSlider
					enableStyle
					value={content[state]?.border}
					onChange={(val) => updateObj('content', val || {}, state, 'border')}
				/>

				<BoxControl
					className='mt10'
					label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')}<Device /></Flex>}
					values={content[state]?.[device]?.radius}
					units={UNITS}
					onChange={(val) => updateObj('content', val, state, device, 'radius')}
				/>

				<ShadowControl
					className='mt20'
					label={__('Box Shadow', 'b-blocks')}
					value={content[state]?.shadow || []}
					onChange={(val) => updateObj('content', val, state, 'shadow')}
				/>
			</>}
		</TabPanel>

	</PanelBody>;
};

export default ContentStyle;
