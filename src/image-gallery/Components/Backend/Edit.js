import { MediaUpload, useBlockProps } from '@wordpress/block-editor';
import { Button, Dashicon, Placeholder, withNotices } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import Settings from './Settings/Settings';

const Edit = props => {
	const { attributes: { images, columns, imgPadding, imgBorder, imgShadow, isCap, capAlign, capColor, capTitleTypo, capDescTypo }, setAttributes, clientId, isSelected, noticeUI } = props;

	// Get only urls
	let urls = [];
	images.map(image => urls.push(image.url));

	// Filter Image properties
	const filterImages = value => {
		if (value || 0 !== value.length) {
			const newValue = value.map(val => {
				return { id: val?.id, url: val?.url, alt: val?.alt, name: val?.name, title: val?.title, sizes: val?.sizes, caption: val?.caption, description: val?.description, link: val?.link }
			});
			return newValue;
		}

		return []
	}

	const id = `block-${clientId}`;

	const mainSl = `#${id}`;
	const imgLinkSl = `${mainSl} .imgGalleryWrapper .imgGalleryImgLink`;
	const imgCaptionSl = `${imgLinkSl} .imgGalleryImgCaption`;

	return <>
		<Settings settings={props} filterImages={filterImages} />

		<div {...useBlockProps()}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS('', capTitleTypo)?.googleFontLink}
				${getTypoCSS('', capDescTypo)?.googleFontLink}
				${getTypoCSS(`${imgCaptionSl} h4`, capTitleTypo)?.styles}
				${getTypoCSS(`${imgCaptionSl} p`, capDescTypo)?.styles}

				${imgLinkSl} .imgGalleryImg{
					padding: ${getSpaceCSS(imgPadding)};
					${getBorderCSS(imgBorder)}
					filter: drop-shadow(${getShadowCSS(imgShadow, 'text')})
				}
				${imgCaptionSl}{
					text-align: ${capAlign};
					color: ${capColor};
					margin: ${getSpaceCSS(imgPadding)};
					width: calc((100% - 10px) - (${imgPadding?.horizontal || '0px'} * 2));
					height: calc((100% - 10px) - (${imgPadding?.vertical || '0px'} * 2));
					border-radius: ${imgBorder?.radius || '0px'};
				}
			`}} />

			{0 === images.length ? <>
				<Placeholder
					className={`${prefix}Upload`}
					label={__(' Gallery Images', 'b-blocks')}
					instructions={__('Select image files from your library.', 'b-blocks')}
					icon='format-gallery'
					notices={noticeUI}>
					<MediaUpload
						allowedTypes={['image']}
						accept='image/*'
						multiple={true}
						value={Array.isArray(images) ? images.map(({ id }) => id) : images.id}
						onSelect={val => setAttributes({ images: filterImages(val) })}
						render={({ open }) => <Button className='components-button is-primary' label={__('Media Library', 'b-blocks')} onClick={open}>{__('Media Library', 'b-blocks')}</Button>}
					/>
				</Placeholder>
			</> :

				<div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
					{images.length > 0 ? images.map((img, index) => (
						<a key={img.id} className='imgGalleryImgLink'>
							<MediaUpload
								allowedTypes={['image']}
								accept='image/*'
								value={img.id}
								onSelect={newImg => {
									const copyImages = structuredClone(images);
									copyImages[index] = newImg;
									setAttributes({ images: filterImages(copyImages) });
								}}
								render={({ open }) => <Dashicon className='imgGalleryEditButton' icon='plus-alt' onClick={open} />}
							/>

							<Dashicon className='imgGalleryImgDeleteButton' onClick={() => {
								const updatedImages = images.filter((_, i) => index !== i);
								setAttributes({ images: filterImages(updatedImages) });
							}} icon='trash' />

							<img src={img.url} alt={img.alt || img.title} className='imgGalleryImg' />

							{(isCap && img.caption) && <div className={`imgGalleryImgCaption`}>
								<div className='captionContent'>
									<h4>{img.caption}</h4>
									<p>{img.description}</p>
								</div>
							</div>}
						</a>
					)) : null}
				</div>
			}

			{isSelected && 0 < images.length && <MediaUpload allowedTypes={['image']} accept='image/*' multiple value={images[images.length - 1].id} onSelect={newImgs => {
				let updatedImages = [...images, ...newImgs];
				setAttributes({ images: filterImages(updatedImages) });
			}} render={({ open }) => <Button className='imgGalleryUploadButton' label={__('Add Images', 'b-blocks')} icon='plus-alt' onClick={open}> Add Images</Button>}
			/>}
		</div>
	</>;
};
export default withNotices(Edit);