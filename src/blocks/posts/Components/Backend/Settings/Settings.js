import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { TabPanel } from '@wordpress/components';
import { produce } from 'immer';

import { tabController } from '../../../../../../../Components/utils/functions';

import General from './General';
import Elements from './Elements';
import Style from './Style';
import { generalStyleTabs } from '../../../utils/options';
import ProModal from '../../../../../ProModal/ProModal';

const Settings = ({ attributes, setAttributes, isPremium, posts, taxOfPostType }) => {
	const { contentAlign } = attributes;

	const [isProModal, setIsProModal] = useState(false);

	const isPosts = posts?.length;

	const updateObj = (obj, key, val, childKey) => {
		const newObj = produce(attributes[obj], draft => {
			if (childKey) {
				draft[key][childKey] = val;
			} else {
				draft[key] = val;
			}
		});

		setAttributes({ [obj]: newObj });
	}

	const premiumProps = {
		isPremium,
		setOpen: setIsProModal
	};

	const props = {
		attributes,
		setAttributes,
		premiumProps
	}

	return <>
		<InspectorControls>
			<TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs} onSelect={() => tabController()}>{tab => <>
				{'general' === tab.name && <General {...props} />}

				{'elements' === tab.name && <Elements {...props} taxOfPostType={taxOfPostType} updateObj={updateObj} />}

				{'style' === tab.name && isPosts && <Style {...props} />}
			</>}</TabPanel>
		</InspectorControls>


		<ProModal isProModal={isProModal} setIsProModal={setIsProModal} block='Posts'>
			<li>&emsp;<strong>{__('Layouts: ', 'b-blocks')}</strong>{__('Checkout more layouts and sub layouts.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Display Pages: ', 'b-blocks')}</strong>{__('Effortlessly showcase pages, just like you do with posts.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Tag Filter: ', 'b-blocks')}</strong>{__('Post filter by tags (only for default post).', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Custom Taxonomy Filter: ', 'b-blocks')}</strong>{__('Custom Taxonomy filter for post and custom posts.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Post Offset: ', 'b-blocks')}</strong>{__('Offset to exclude first N posts.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Include or Exclude Posts: ', 'b-blocks')}</strong>{__('Include or Exclude the posts by ids.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Exclude Current Post: ', 'b-blocks')}</strong>{__('If you use this block in a post and that post type is selected post then you can exclude the post.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Pagination: ', 'b-blocks')}</strong>{__('Add custom pagination bottom of the posts.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Sort Elements: ', 'b-blocks')}</strong>{__('Sort the title and meta elements.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Meta Data Icon: ', 'b-blocks')}</strong>{__('Custom icon for meta data.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Meta Author Link Toggle: ', 'b-blocks')}</strong>{__('Show meta author with or without link.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Taxonomies in Meta: ', 'b-blocks')}</strong>{__('Display taxonomies within the meta data, including tags.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Reading Time: ', 'b-blocks')}</strong>{__('Show post reading time in meta area.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Excerpt from Content: ', 'b-blocks')}</strong>{__('Show excerpt from main content.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Ticker Layout Options: ', 'b-blocks')}</strong>{__('Options for ticker post layout.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Feature Image Size: ', 'b-blocks')}</strong>{__('Options to set feature image size.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Read More Position: ', 'b-blocks')}</strong>{__('Options to set the position fo Read More button.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Shortcode: ', 'b-blocks')}</strong>{__('Shortcode option to use anywhere.', 'b-blocks')}</li>

			<li>&emsp;<strong>{__('Update Post Query: ', 'b-blocks')}</strong>{__('Update Post Query using b_blocks_posts_query filter.', 'b-blocks')}</li>
		</ProModal>


		<BlockControls>
			<AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;