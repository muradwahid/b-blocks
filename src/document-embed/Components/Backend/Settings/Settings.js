import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';

import Advanced from '../../../../../../bpl-tools/Advanced';
import { HelpPanel } from '../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../bpl-tools/utils/functions';

import ProModal from '../../../../backend/ProModal/ProModal';
import { pluginSlug } from '../../../../utils/data';
import { generalStyleTabs } from '../../../utils/options';
import General from './General/General';
import Style from './Style/Style';

const Settings = (props) => {
	const { attributes, setAttributes, isPremium } = props;
	const { advanced } = attributes;

	const [isProModalOpen, setIsProModalOpen] = useState(false);
	const premiumProps = { isPremium, setIsProModalOpen };

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={tabController}>
				{(tab) => <>
					{'general' === tab.name && <General {...props} premiumProps={premiumProps} />}

					{'style' === tab.name && <Style {...props} />}

					{'advanced' === tab.name && <Advanced advanced={advanced} onChange={(advanced) => setAttributes({ advanced })} isPremium={isPremium} />}
				</>}
			</TabPanel>
		</InspectorControls>

		<ProModal isProModalOpen={isProModalOpen} setIsProModalOpen={setIsProModalOpen} block={__('Document Embed', 'b-blocks')}>
			<li>&emsp;<strong>{__('Viewer Controls: ', 'b-blocks')}</strong>{__('Reader mode, thumbnails and sidebar, horizontal scroll, bypass cache, full screen, on-demand rendering, initial page and zoom.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Custom Toolbar Theme: ', 'b-blocks')}</strong>{__('Your own toolbar background and text colors.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Download Management: ', 'b-blocks')}</strong>{__('Download count, a per-IP download limit, and downloads only for logged-in users or chosen roles.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Lightbox: ', 'b-blocks')}</strong>{__('Open the document in a popup from a button, an image or any element on the page.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Access & Security: ', 'b-blocks')}</strong>{__('Show the document only to logged-in users or chosen roles; the file URL never reaches other visitors. Hide the Google viewer pop-out, custom loader.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Flipbook: ', 'b-blocks')}</strong>{__('Single or double pages, hard cover, page-turn sound and speed, auto play, 3D page edge color.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Interactive Overlays: ', 'b-blocks')}</strong>{__('Notes, highlights, links and buttons on pages of the PDF.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Secure Viewing: ', 'b-blocks')}</strong>{__('The viewer loads the PDF through a short-lived link tied to the visitor; the file address stays out of the page.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Performance: ', 'b-blocks')}</strong>{__('Lazy load the viewer and fall back automatically when the Google viewer fails.', 'b-blocks')}</li>
		</ProModal>
	</>;
};
export default Settings;
