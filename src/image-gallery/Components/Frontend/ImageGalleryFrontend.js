// import React from 'react';

// const ImageGallery = ({attributes,isBackend=false}) => {
//     const { images, columns, imgPadding, imgBorder, imgShadow, isCap, capAlign, capColor, capTitleTypo, capDescTypo,isPreview } = attributes;
//     return <div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
// 					{images.map(img => (
// 						<a key={img.id} className='imgGalleryImgLink'>
// 							<img src={img.url} alt={img.alt || img.title} className='imgGalleryImg' />

// 							{(isCap && img.caption) && <div className={`imgGalleryImgCaption`}>
// 								<div className='captionContent'>
// 									<h4>{img.caption}</h4>
// 									<p>{img.description}</p>

//                                 {
//                                     isPreview && <button class='imgGalleryPreviewBtn'
// 									data-fancybox='imgGalleryPreviewBtn'
// 									data-src='<?php echo esc_url( $imgUrl ); ?>'
// 									data-srcset='<?php echo esc_url( $imgUrlLarge ); ?> 576w, <?php echo esc_url( $imgUrl ); ?> 1024w'
// 									data-sizes='( max-width: 640px ) 640px, 1024px'
// 									data-caption='<?php echo wp_kses_post( $image['caption'] ); ?>'>
// 									<i class='fa fa-eye'></i> Preview
// 								</button>
//                                 }
// 								</div>
// 							</div>}
// 						</a>
// 					))}
// 				</div>
// };

// export default ImageGallery;