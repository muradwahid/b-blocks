import { RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState } from "react";

import { MediaPlaceholder } from '../../../../../bpl-tools/Components';

import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { usePremiumInEditor } from '../../../../../bpl-tools/hooks';
import { ImageCompare } from '../Common/ImageCompare';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const { beforeImg, afterImg, isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation, theme } = attributes;
	const { url: bImgURL, alt: bImgAlt, title: bImgTitle } = beforeImg || {};
	const { url: aImgURL, alt: aImgAlt, title: aImgTitle } = afterImg || {};
	const { hAlign, vAlign } = label;

	const { isPremium = false } = usePremiumInEditor();

	const [activeIndex, setActiveIndex] = useState(0);

	const beforeLabelEl = isLabel && <RichText className={`icb-label icb-before-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} tagName='div' value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'image-compare')} inlineToolbar />

	const afterLabelEl = isLabel && <RichText className={`icb-label icb-after-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} tagName='div' value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'image-compare')} inlineToolbar />

	const captionEl = isCap && <RichText className='icb-caption' tagName='div' value={cap} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'image-compare')} inlineToolbar />

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} {...{ attributes, setAttributes, isPremium, activeIndex, setActiveIndex }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			{(() => {
				switch (theme) {
					case "default":
						return (bImgURL && aImgURL) ?
							// <ImageCompareTwo key={key} {...{ afterLabelEl, beforeLabelEl, captionEl, device }} attributes={attributes} isBackend={true} />
							<ImageCompare {...{ afterLabelEl, beforeLabelEl, captionEl, activeIndex, setActiveIndex }} attributes={attributes} isBackend={true} backDevice={device} />
							:
							<div className='imgPlaceholder'>
								<div className='beforeImg'>
									{bImgURL ? <img src={bImgURL} alt={bImgAlt || bImgTitle} /> :
										<MediaPlaceholder label={__('Before Image:', 'image-compare')} value={beforeImg} onChange={({ id, url, alt, title, caption }) => setAttributes({ beforeImg: { id, url, alt, title, caption } })} />
									}
								</div>

								<div className='afterImg'>
									{aImgURL ?
										<img src={aImgURL} alt={aImgAlt || aImgTitle} /> :
										<MediaPlaceholder label={__('After Image:', 'image-compare')} value={afterImg} onChange={({ id, url, alt, title, caption }) => setAttributes({ afterImg: { id, url, alt, title, caption } })} />
									}
								</div>
							</div>;

					case "slider":
						return <ImageCompare {...{ afterLabelEl, beforeLabelEl, captionEl, activeIndex, setActiveIndex }} attributes={attributes} isBackend={true} backDevice={device} />;
				}
			})()}
		</div>
	</>;
};

export default compose(
	withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase(),
		};
	})
)(Edit);