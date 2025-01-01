import React from 'react'
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
					<img src={source.url} alt={source.alt || source.title} onClick={() => link.url ? window.open(`${link.url}`, link.tab) : {}} />

					{enabled && <div className='caption'>
						<p dangerouslySetInnerHTML={{ __html: text }} />
					</div>}
				</>}
			</> :
				<Image image={{ url: featuredImageURL, alt: 'Feature Image' }} link={link} />
			}
		</div>
	</div>
}
export default AdvancedImage;