import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import ImageCompareTwo from '../Common/ImageCompareTwo';
import { MediaPlaceholder } from '../../../../../bpl-tools/Components';
import usePremiumInEditor from '../../../hooks/usePremiumInEditor';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const { beforeImg, afterImg, isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation, styles, align, options } = attributes;
	const { url: bImgURL, alt: bImgAlt, title: bImgTitle } = beforeImg || {};
	const { url: aImgURL, alt: aImgAlt, title: aImgTitle } = afterImg || {};
	const { hAlign, vAlign } = label;
	const { autoSlide } = options;
	const { isPremium = false } = usePremiumInEditor();

	const beforeLabelEl = isLabel && <RichText className={`icb-label icb-before-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} tagName='div' value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'b-blocks')} inlineToolbar />

	const afterLabelEl = isLabel && <RichText className={`icb-label icb-after-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} tagName='div' value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'b-blocks')} inlineToolbar />

	const captionEl = isCap && <RichText className='icb-caption' tagName='div' value={cap} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'b-blocks')} inlineToolbar />

	const key = `${beforeImg?.url}-${afterImg?.url}-${JSON.stringify(styles.container.height)}-${align}-${autoSlide.isMouseOver}-${device}`;
	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			{(bImgURL && aImgURL) ? <ImageCompareTwo key={key} {...{ afterLabelEl, beforeLabelEl, captionEl, device }} attributes={attributes} isBackend={true} /> :
				<div className='imgPlaceholder'>
					<div className='beforeImg'>
						{bImgURL ?
							<img src={bImgURL} alt={bImgAlt || bImgTitle} /> :
							<MediaPlaceholder label={__(' Before Image:', 'b-blocks')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
						}
					</div>

					<div className='afterImg'>
						{aImgURL ?
							<img src={aImgURL} alt={aImgAlt || aImgTitle} /> :
							<MediaPlaceholder label={__(' After Image:', 'b-blocks')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />
						}
					</div>
				</div>
			}
		</div >
	</>;
};
export default Edit;