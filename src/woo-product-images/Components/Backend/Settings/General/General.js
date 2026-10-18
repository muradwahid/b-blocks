import GallerySettings from './GallerySettings';
import StickySettings from './StickySettings';
import ThumbnailsSettings from './ThumbnailsSettings';

const General = ( props ) => {
	return <>
		<GallerySettings { ...props } />
		<ThumbnailsSettings { ...props } />
		<StickySettings { ...props } />
	</>;
};

export default General;