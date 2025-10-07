import { sanitizeHTML } from '../../../../../bpl-tools/utils/common';

import { prefix } from '../../utils/data';
import Image from '../Common/Image';

const AdvancedImage = ({ attributes, featuredImageURL }) => {
	const { image, caption } = attributes;
	const { sourceType, source, link } = image;
	const { enabled, text } = caption;

	return <div className={prefix}>
		<div className='image'>
			{'custom' === sourceType ? <>
				{source.url && <>
					<Image image={source} link={link} />

					{enabled && <div className='caption'>
						<p dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }} />
					</div>}
				</>}
			</> :
				<Image image={{ url: featuredImageURL, alt: 'Feature Image' }} link={link} />
			}
		</div>
	</div>
}
export default AdvancedImage;