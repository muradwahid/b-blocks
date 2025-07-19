import { MediaPlaceholder, useBlockProps } from '@wordpress/block-editor';

import { withSelect } from '@wordpress/data';
import { updateData } from '../../../../../bpl-tools/utils/functions';
import ImageScroller from '../Common/ImageScroller';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;

	const { image } = attributes;

	const { isPremium = false } = usePremiumInEditor();

	return <>
		<Settings {...{ attributes, setAttributes, isPremium }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<div>
				<div>
					{
						image.img.url ?
							<ImageScroller attributes={attributes} device={device} /> : <MediaPlaceholder
								allowedTypes={['image']}
								multiple={false}
								labels={{
									title: 'Upload Image',
								}}
								accept='image/*'
								addToGallery={true}
								onSelect={(media) => {
									setAttributes({ image: updateData(image, media, 'img') });
								}}
							/>
					}
				</div>
			</div>
		</div>
	</>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);