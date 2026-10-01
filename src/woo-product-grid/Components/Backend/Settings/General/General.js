import { HelpPanel } from '../../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../../utils/data';
import Theme from './Theme';
import Layout from './Layout';
import ProductQuery from './ProductQuery';
import CartButton from './CartButton';
import ViewButton from './ViewButton';
import SaleBadge from './SaleBadge';
import LoadMore from './LoadMore';
import SortingContent from './SortingContent';
import FilterTaxonomy from './FilterTaxonomy';

const General = ( props ) => <>
	<HelpPanel slug={ pluginSlug } />

	<Theme { ...props } />
	<Layout { ...props } />
	<ProductQuery { ...props } />
	<CartButton { ...props } />
	<ViewButton { ...props } />
	<SaleBadge { ...props } />
	<LoadMore { ...props } />
	<SortingContent { ...props } />
	<FilterTaxonomy { ...props } />
</>;

export default General;
