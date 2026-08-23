import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { BtnGroup, Device, HelpPanel, Label } from '../../../../../../bpl-tools/Components';
import { imgAlignOptions } from '../../../../utils/options';
import { Flex } from '@wordpress/components';
import { RangeControl } from '@wordpress/components';


const General = (props) => {
	const { attributes, updateObj, device } = props;
	const {settings, styles } = attributes;

	return <>
		<HelpPanel slug='b-blocks' docsLink='https://bplugins.com/docs/content-slider-block/guides/general' />


		<PanelBody className='bPlPanelBody' title={__('Table Cell', 'b-blocks')}>
			<Flex align='center' justify='space-between'>
				<Label className="">Alignment</Label>
				<Device />
			</Flex>
			<BtnGroup className="mt10" value={styles.alignment[device]} onChange={val => updateObj('styles', val, 'alignment', device)} options={imgAlignOptions} isIcon={true} size='default' />
			
			<RangeControl
				className='mt10'
				label={<Flex>{__('Row Span', 'b-blocks')} <Device/></Flex>}
				value={settings.rowSpan}
				onChange={val => updateObj('settings', val, 'rowSpan')}
			/>

			<RangeControl
				label={<Flex>{__('Column Span', 'b-blocks')} <Device/></Flex>}
				value={settings.colSpan}
				onChange={val => updateObj('settings', val, 'colSpan')}
			/>

		</PanelBody>
	</>
}
export default General;
