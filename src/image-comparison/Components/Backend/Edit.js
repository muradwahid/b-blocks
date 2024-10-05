import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import { ImagePlaceholder } from '../../../../../Components';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import ImageCompare from '../Common/ImageCompare';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { beforeImg, afterImg, isLabel, beforeLabel, afterLabel, isCap, cap } = attributes;
	const { url: bImgURL, alt: bImgAlt, title: bImgTitle } = beforeImg || {};
	const { url: aImgURL, alt: aImgAlt, title: aImgTitle } = afterImg || {};

	const beforeLabelEl = isLabel && <RichText className='overlay beforeLabel' tagName='div' value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'b-blocks')} inlineToolbar />
	const afterLabelEl = isLabel && <RichText className='overlay afterLabel' tagName='div' value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'b-blocks')} inlineToolbar />
	const captionEl = isCap && <RichText className='caption' tagName='div' value={cap} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'b-blocks')} inlineToolbar />

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			{bImgURL && aImgURL ? <ImageCompare attributes={attributes} beforeLabelEl={beforeLabelEl} afterLabelEl={afterLabelEl} captionEl={captionEl} /> :
				<div className='imgPlaceholder'>
					<div className='beforeImg'>
						{bImgURL ?
							<img src={bImgURL} alt={bImgAlt || bImgTitle} /> :
							<ImagePlaceholder label={__(' Before Image:', 'b-blocks')} value={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
						}
					</div>

					<div className='afterImg'>
						{aImgURL ?
							<img src={aImgURL} alt={aImgAlt || aImgTitle} /> :
							<ImagePlaceholder label={__(' After Image:', 'b-blocks')} value={afterImg} onChange={val => setAttributes({ afterImg: val })} />
						}
					</div>
				</div>}
		</div >
	</>;
};
export default Edit;