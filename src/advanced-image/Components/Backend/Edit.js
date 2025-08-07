import { withSelect } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';

import Style from '../Common/Style';
import Settings from './Settings/Settings';
import AdvancedImage from './AdvancedImage';
import { imageRegularIcon, imageSolidIcon } from '../../utils/icons';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = props => {
	const { attributes, setAttributes, clientId, device, featuredImageURL } = props;
	const { image } = attributes;
	const { sourceType } = image;

	const { isPremium = false } = usePremiumInEditor();

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, isPremium }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} device={device} isBackend={true} />

			<div className='bblocks-advanced-image'>
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

	const featureMediaID = getEditedPostAttribute('featured_media');
	const mediaObj = getMedia(featureMediaID);

	const featuredImageURL = mediaObj?.media_details?.sizes[size]?.source_url || mediaObj?.source_url;

	return {
		device: getDeviceType()?.toLowerCase(),
		featuredImageURL
	}
})(Edit);