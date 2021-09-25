import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

const func = {
    firstTitle: title => <p className="bBlocksLabel">{__(title, 'b-blocks')}</p>,
    otherTitle: title => <p className="bBlocksLabel" style={{ marginTop: '25px' }}>{__(title, 'b-blocks')}</p>,
    truncate: (str, no_words) => str && str.split(' ').splice(0, no_words).join(' '),
    renderHTML: raw => <span dangerouslySetInnerHTML={{ __html: raw }} />,
    mediaUrl: id => select('core').getMedia(id)?.source_url,
    getImageSizes: (image, imageSizes) => {
        if (!image) return [];
        let options = [];
        const sizes = image.media_details.sizes;

        for (const key in sizes) {
            const imageSize = imageSizes.find(s => s.slug === key);
            if (imageSize) {
                options.push({ label: imageSize.name, value: sizes[key].source_url });
            }
        }
        return options;
    }
}
export default func;