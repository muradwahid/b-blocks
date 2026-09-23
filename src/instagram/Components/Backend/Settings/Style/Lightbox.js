import { __ } from '@wordpress/i18n';
import { PanelBody, TabPanel } from '@wordpress/components';

import { ColorControl, Label } from '../../../../../../../bpl-tools/Components';
import { normalHoverTabs, stateLabel } from '../../../../utils/options';

const Lightbox = ({ attributes, updateObj }) => {
	const { elements = {}, lightbox = {} } = attributes;

	if (!elements.lightbox) return null;

	return <PanelBody className='bPlPanelBody' title={__('Lightbox', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Backdrop', 'b-blocks')} value={lightbox.backdrop} onChange={(val) => updateObj('lightbox', val, 'backdrop')} />

		<small>{__('A translucent colour keeps the page visible behind the post.', 'b-blocks')}</small>

		<Label className='mb0 mt20'>{__('Close Button', 'b-blocks')}</Label>

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <>
				<ColorControl label={stateLabel(tab.name, __('Icon Color', 'b-blocks'))} value={'normal' === tab.name ? lightbox.closeColor : lightbox.closeHoverColor} onChange={(val) => updateObj('lightbox', val, 'normal' === tab.name ? 'closeColor' : 'closeHoverColor')} />

				<ColorControl className='mt10' label={stateLabel(tab.name, __('Background Color', 'b-blocks'))} value={'normal' === tab.name ? lightbox.closeBg : lightbox.closeHoverBg} onChange={(val) => updateObj('lightbox', val, 'normal' === tab.name ? 'closeBg' : 'closeHoverBg')} />
			</>}
		</TabPanel>

		<Label className='mb0 mt20'>{__('Navigation Buttons (Prev / Next)', 'b-blocks')}</Label>

		<TabPanel className='bPlTabPanel small mt10' activeClass='activeTab' tabs={normalHoverTabs}>
			{(tab) => <>
				<ColorControl label={stateLabel(tab.name, __('Icon Color', 'b-blocks'))} value={'normal' === tab.name ? lightbox.navColor : lightbox.navHoverColor} onChange={(val) => updateObj('lightbox', val, 'normal' === tab.name ? 'navColor' : 'navHoverColor')} />

				<ColorControl className='mt10' label={stateLabel(tab.name, __('Background Color', 'b-blocks'))} value={'normal' === tab.name ? lightbox.navBg : lightbox.navHoverBg} onChange={(val) => updateObj('lightbox', val, 'normal' === tab.name ? 'navBg' : 'navHoverBg')} />
			</>}
		</TabPanel>
	</PanelBody>;
};

export default Lightbox;
