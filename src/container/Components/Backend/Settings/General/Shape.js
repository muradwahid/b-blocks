import { __ } from '@wordpress/i18n';
import { PanelBody, TabPanel } from '@wordpress/components';

import { shapeTabs } from '../../../../utils/options';
import ShapePanel from './ShapePanel';

const Shape = ({ attributes, setAttributes, premiumProps }) => {
	const { shape } = attributes;
	const { top, bottom } = shape;

	return <PanelBody className='bPlPanelBody' title={__('Shape', 'b-blocks')} initialOpen={false}>
		<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={shapeTabs}>{tab => <>
			{'top' === tab.name && <ShapePanel
				{...top}
				labelPrefix='Top'
				shape={shape}
				attributes={attributes}
				setAttributes={setAttributes}
				name='top'
				premiumProps={premiumProps}
			/>}


			{'bottom' === tab.name && <ShapePanel
				{...bottom}
				labelPrefix='Bottom'
				shape={shape}
				attributes={attributes}
				setAttributes={setAttributes}
				name='bottom'
				premiumProps={premiumProps}
			/>}
		</>}
		</TabPanel>
	</PanelBody>
}

export default Shape;