import FeaturedImageStyle from './FeaturedImageStyle';
import LightboxStyle from './LightboxStyle';
import MainArrowsStyle from './MainArrowsStyle';
import NavigationsStyle from './NavigationsStyle';
import PaginationStyle from './PaginationStyle';
import SaleBadgeStyle from './SaleBadgeStyle';
import ThumbnailsStyle from './ThumbnailsStyle';

const Style = ( props ) => {
	const { options = {}, thumbLayout = {} } = props.attributes;

	return <>
		<FeaturedImageStyle { ...props } />
		<ThumbnailsStyle { ...props } />
		{ ! options.hideArrows && 'grid' !== thumbLayout.view && <NavigationsStyle { ...props } /> }
		{ options.mainArrows && <MainArrowsStyle { ...props } /> }
		{ [ 'dots', 'fraction' ].includes( options.pagination ) && <PaginationStyle { ...props } /> }
		{ options.saleBadge && <SaleBadgeStyle { ...props } /> }
		{ options.lightbox && <LightboxStyle { ...props } /> }
	</>;
};

export default Style;