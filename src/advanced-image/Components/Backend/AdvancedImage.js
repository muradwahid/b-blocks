
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import { MediaPlaceholder } from '../../../../../bpl-tools/Components';
import { updateData } from '../../../../../bpl-tools/utils/functions';

import Image from '../Common/Image';
import { prefix } from '../../utils/data';

const AdvancedImage = ({ attributes, setAttributes, featuredImageURL }) => {
	const { image, caption } = attributes;
	const { sourceType, source, link } = image;
	const { enabled, text } = caption;

	return <div className={prefix}>
		<div className='image'>
			{'custom' === sourceType ? <>
				{source.url ? <>
					<Image image={source} link={link} />

					{enabled && <div className='caption'>
						<RichText tagName='p' value={text} onChange={(v) => setAttributes({ caption: updateData(caption, v, 'text') })} placeholder='Add Caption...' />
					</div>}
				</> :
					<MediaPlaceholder label={__('Custom Image', 'b-blocks')} onChange={({ id, url, alt, title }) => setAttributes({ image: { ...image, source: { id, url, alt, title } } })} />
				}
			</> : <>
				<Image image={{ url: featuredImageURL, alt: 'Feature Image' }} link={link} />

				{!featuredImageURL && <div className='featureImageNotFound'>
					<h3>Warning !!!</h3>
					<p>Seems like you have not added a Featured Image for this post. Please make sure to add a Featured Image and try again.</p>
				</div>}
			</>}
		</div>
	</div>
};
export default AdvancedImage;
