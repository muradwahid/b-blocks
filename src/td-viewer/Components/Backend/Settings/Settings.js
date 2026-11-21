import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import { MediaEditControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import { pluginSlug, tdViewerDocs } from '../../../../utils/data';
import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = props => {
	const { attributes, setAttributes } = props;
	const { alignment, model } = attributes;

	// A new model has its own animations and variants, so names saved for the old one are cleared.
	const onModelSelect = ({ id, url, title }) => setAttributes({ model: { ...model, id, url, title }, animationName: '', variantName: '' });

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} docsLink={tdViewerDocs} />

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>{tab => <>
			{'general' === tab.name && <General {...props} />}

			{'style' === tab.name && <Style {...props} />}
			</>}</TabPanel>
		</InspectorControls>

		<BlockControls>
			<MediaEditControl label={__('Edit 3D Model:', 'b-blocks')} icon='edit' types={['model/gltf-binary']} value={model} onChange={onModelSelect} />

			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('3D Model Alignment', 'b-blocks')} alignmentControls={[
				{ title: __('3D Model in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('3D Model in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('3D Model in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;