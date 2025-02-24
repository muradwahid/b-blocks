import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';
import ImageCompareTwo from '../Common/ImageCompareTwo';
import { MediaPlaceholder } from '../../../../../bpl-tools/Components';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const { beforeImg, afterImg, isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation, styles, align, options } = attributes;
	const { url: bImgURL, alt: bImgAlt, title: bImgTitle } = beforeImg || {};
	const { url: aImgURL, alt: aImgAlt, title: aImgTitle } = afterImg || {};
	const { hAlign, vAlign } = label;
	const { autoSlide } = options;

	const beforeLabelEl = isLabel && <RichText className={`bBlocks-label bBlocks-before-label bBlocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} tagName='div' value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'image-compare')} inlineToolbar />

	const afterLabelEl = isLabel && <RichText className={`bBlocks-label bBlocks-after-label bBlocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} tagName='div' value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'image-compare')} inlineToolbar />

	const captionEl = isCap && <RichText className='bBlocks-caption' tagName='div' value={cap} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'image-compare')} inlineToolbar />

	const id = `${prefix}-${clientId}`;
	const isPremium = true;
	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />
			{(bImgURL && aImgURL) ? <ImageCompareTwo key={`${beforeImg?.url}-${afterImg?.url}-${styles.height}-${align}-${autoSlide.isMouseOver}`} {...{ afterLabelEl, beforeLabelEl, captionEl }} attributes={attributes} /> :
				<div className='imgPlaceholder'>
					<div className='beforeImg'>
						{bImgURL ?
							<img src={bImgURL} alt={bImgAlt || bImgTitle} /> :
							<MediaPlaceholder label={__(' Before Image:', 'image-compare')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
						}
					</div>

					<div className='afterImg'>
						{aImgURL ?
							<img src={aImgURL} alt={aImgAlt || aImgTitle} /> :
							<MediaPlaceholder label={__(' After Image:', 'image-compare')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />
						}
					</div>
				</div>
			}

		</div>
	</>;
};
export default Edit;