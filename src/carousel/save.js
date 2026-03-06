import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Style from './Components/Common/Style';

const Save = ({ attributes }) => {
  const { navigation, pagination, autoplay, layout, options, clientId } = attributes;
  const config = {
    pagination, autoplay, layout, options
  }
  // const encodedConfig = encodeURIComponent(JSON.stringify(config));
  const encodedConfig = encodeURIComponent(JSON.stringify(config));

  return (
    <div {...useBlockProps.save()} id={`bBlocksCarousel-${clientId}`}>
      <Style attributes={attributes} id={`bBlocksCarousel-${clientId}`} />
      <div className="bBlocks-carousel-wrapper" data-swiperconfig={encodedConfig}>
        <div className="swiper">
          <div className="swiper-wrapper">
            <InnerBlocks.Content />
          </div>
        </div>

        {navigation?.navigation && (
          <>
            <div
              className="swiper-button-prev"
              dangerouslySetInnerHTML={{ __html: navigation?.prevIcon?.library || '' }}
            />
            <div
              className="swiper-button-next"
              dangerouslySetInnerHTML={{ __html: navigation?.nextIcon?.library || '' }}
            />
          </>
        )}
        {pagination?.pagination && (
          <div className="swiper-pagination swiper-pagination-horizontal" />
        )}
      </div>
    </div>
  );
};

export default Save;