import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

// What happens when a tile is clicked, and what the lightbox shows once it opens.
const Interaction = ({ attributes, updateObj }) => {
	const { elements = {}, lightbox = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Interaction', 'b-blocks')} initialOpen={false}>
		<ToggleControl label={__('Open In Lightbox', 'b-blocks')} checked={elements.lightbox} onChange={(val) => updateObj('elements', val, 'lightbox')} help={__('Off, a tile links straight to the post on Instagram.', 'b-blocks')} />

		{elements.lightbox ? <>
			<ToggleControl className='mt10' label={__('Show Profile In Lightbox', 'b-blocks')} checked={lightbox.showProfile} onChange={(val) => updateObj('lightbox', val, 'showProfile')} />

			<ToggleControl label={__('Show Caption In Lightbox', 'b-blocks')} checked={lightbox.showCaption} onChange={(val) => updateObj('lightbox', val, 'showCaption')} />

			<ToggleControl label={__('Show Instagram Link', 'b-blocks')} checked={lightbox.showLink} onChange={(val) => updateObj('lightbox', val, 'showLink')} />
		</> : <>
			<ToggleControl className='mt10' label={__('Link To Instagram', 'b-blocks')} checked={elements.linkPosts} onChange={(val) => updateObj('elements', val, 'linkPosts')} />

			{elements.linkPosts && <ToggleControl label={__('Open In New Tab', 'b-blocks')} checked={elements.openInNewTab} onChange={(val) => updateObj('elements', val, 'openInNewTab')} />}
		</>}

		<ToggleControl className='mt20' label={__('Show Video & Album Icon', 'b-blocks')} checked={elements.mediaIcon} onChange={(val) => updateObj('elements', val, 'mediaIcon')} help={__('Marks which tiles are reels or multi-photo posts.', 'b-blocks')} />
	</PanelBody>;
};

export default Interaction;
