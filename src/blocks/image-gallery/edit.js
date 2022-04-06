import { __ } from '@wordpress/i18n';
import { useEffect, createContext } from '@wordpress/element';
import { MediaUpload } from '@wordpress/block-editor';
import { withNotices, Button, Placeholder } from '@wordpress/components';

import Settings from './settings';

export const FilterImagesContext = createContext();

const Edit = props => {
	const { className, attributes: { images, columns, imgPadding, imgBorder, imgShadow, isCap, capAlign, capColor, capTitleTypo, capDescTypo }, setAttributes, clientId, isSelected, noticeUI } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	// Get only urls
	let urls = [];
	images.map(image => urls.push(image.url));

	// Filter Image properties
	const filterImages = value => {
		const newValue = [];
		for (let i = 0; i < value.length; i++) {
			const val = value[i];

			newValue.push({ id: val.id, url: val.url, alt: val.alt, name: val.name, title: val.title, sizes: val.sizes, caption: val.caption, description: val.description, link: val.link })
		}
		return newValue;
	}

	return <>
		<FilterImagesContext.Provider value={filterImages}>
			<Settings settings={props} />
		</FilterImagesContext.Provider>

		<div id={`bBlocksImageGallery-${clientId}`} className={className}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${capTitleTypo?.googleFontLink ? `@import url(${capTitleTypo?.googleFontLink})` : ''}
				${capDescTypo?.googleFontLink ? `@import url(${capDescTypo?.googleFontLink})` : ''}

				#bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImg{
					padding: ${imgPadding?.styles || '0 0'};
					${imgBorder?.styles}
					filter: drop-shadow(${imgShadow?.styles})
				}
				#bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption{
					text-align: ${capAlign};
					color: ${capColor};
					margin: ${imgPadding?.styles || '0 0'};
					width: calc((100% - 10px) - (${imgPadding?.horizontal || '0px'} * 2));
					height: calc((100% - 10px) - (${imgPadding?.vertical || '0px'} * 2));
					border-radius: ${imgBorder?.radius || '0px'};
				}
				#bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption h4{
					${capTitleTypo?.styles || 'font-size: 18px;'}
				}
				#bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption p{
					${capDescTypo?.styles || 'font-size: 15px;'}
				}
			`}} />

			{0 === images.length ? <>
				<Placeholder
					className='bBlocksImageGalleryUpload'
					label={__(' Gallery Images', 'b-blocks')}
					instructions={__('Select image files from your library.', 'b-blocks')}
					icon='format-gallery'
					notices={noticeUI}>
					<MediaUpload
						allowedTypes={['image']}
						accept='image/*'
						multiple
						value={Array.isArray(images) ? images.map(({ id }) => id) : images.id}
						onSelect={val => setAttributes({ images: filterImages(val) })}
						render={({ open }) => <Button className='components-button is-primary' label={__('Media Library', 'b-blocks')} onClick={open}>{__('Media Library', 'b-blocks')}</Button>}
					/>
				</Placeholder>
			</> :

				<div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
					{images.map(img => (
						<a key={img.id} className='imgGalleryImgLink'>
							<img src={img.url} alt={img.alt || img.title} className='imgGalleryImg' />

							{(isCap && img.caption) && <div className={`imgGalleryImgCaption`}>
								<div className='captionContent'>
									<h4>{img.caption}</h4>
									<p>{img.description}</p>
								</div>
							</div>}
						</a>
					))}
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