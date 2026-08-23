import { __ } from '@wordpress/i18n';
import { PanelBody} from '@wordpress/components';

import { SelectControl } from '@wordpress/components';
import { ToggleControl } from '@wordpress/components';
import DataTablesSettings from './DataTablesSettings';

const General = (props) => {

	const { attributes, setAttributes, updateObj, handleToggleHeader, handleToggleFooter } = props;
	const { content, options } = attributes;

	return <>

		<PanelBody className='bPlPanelBody' title={__('Table', 'b-blocks')}>
			<SelectControl 
				label={__('Cell Border Type', 'b-blocks')}
				labelPosition='edge'
				value={content?.cellBorderType}
				onChange={val=>updateObj('content',val,'cellBorderType')}
				options={[
					{ label: __('Collapse', 'b-blocks'), value: 'collapse' },
					{ label: __('Separate', 'b-blocks'), value: 'separate' },
			]}
			
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Settings', 'b-blocks')} initialOpen={false}>
			<ToggleControl
				label={__('Enable Header', 'b-blocks')}
				checked={options?.isEnableHeader}
				onChange={handleToggleHeader}
			/>
{/* 
			{options.isEnableHeader && <ToggleControl
				className='mt10'
				label={__('Enable Sticky Header', 'b-blocks')}
				checked={options?.isStickyHeader}
				onChange={val => updateObj('options', val, 'isStickyHeader')}
			/>} */}

			<ToggleControl
				className='mt10'
				label={__('Enable Footer', 'b-blocks')}
				checked={options?.isEnableFooter}
				onChange={handleToggleFooter}
			/>
			{/* <ToggleControl
				className='mt10'
				label={__('Enable Caption', 'b-blocks')}
				checked={options?.isEnableCaption}
				onChange={val=>updateObj('options',val,'isEnableCaption')}
			/> */}
		</PanelBody>

		<DataTablesSettings attributes={attributes} setAttributes={setAttributes} />

	</>
}
export default General;