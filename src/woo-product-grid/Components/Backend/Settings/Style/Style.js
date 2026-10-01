import GridCard from './GridCard';
import ImageOverlay from './ImageOverlay';
import Content from './Content';
import Buttons from './Buttons';
import Navigation from './Navigation';

const Style = ( props ) => <>
	<GridCard { ...props } />
	<ImageOverlay { ...props } />
	<Content { ...props } />
	<Buttons { ...props } />
	<Navigation { ...props } />
</>;

export default Style;
