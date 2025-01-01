
import { withSelect } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';

import Style from '../Common/Style';
import Settings from './Settings/Settings';
import AdvancedImage from './AdvancedImage';
import { imageRegularIcon, imageSolidIcon } from '../../utils/icons';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, device, featuredImageURL } = props;
	const { image } = attributes;
	const { sourceType } = image;

	const id = `${prefix}-${clientId}`;

	console.log(featuredImageURL);

	return <>
		<Settings {...{ attributes, setAttributes }} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} device={device} />

			<div>
				{!sourceType ?
					<div className='sourceSelector'>
						<h4>Choose Your Image Source</h4>

						<div className='sourceOptions'>
							{[
								{ label: 'Custom Image', value: 'custom', icon: imageRegularIcon },
								{ label: 'Featured Image', value: 'featured', icon: imageSolidIcon }
							].map(({ label, value, icon }) => <div key={value} onClick={() => setAttributes({ image: { ...image, sourceType: value } })}>
								{icon}

								{label}
							</div>)}
						</div>
					</div> :
					<AdvancedImage attributes={attributes} setAttributes={setAttributes} featuredImageURL={featuredImageURL} />
				}
			</div>
		</div>
	</>;
}
export default withSelect((select, props) => {
	const { layout } = props.attributes;
	const { size } = layout;

	const { getMedia } = select('core');
	const { getDeviceType, getEditedPostAttribute } = select('core/editor');

	const mediaObj = getMedia(getEditedPostAttribute('featured_media'));
	console.log({ id: getEditedPostAttribute('featured_media'), mediaObj });

	return {
		device: getDeviceType()?.toLowerCase(),
		featuredImageURL: mediaObj?.media_details?.sizes[size]?.source_url || mediaObj?.source_url
	}
})(Edit);