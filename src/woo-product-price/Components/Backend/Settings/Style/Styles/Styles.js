import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import Currency from './Currency';
import Layout from './Layout';
import PriceText from './PriceText';

const Styles = ( props ) => <PanelBody className='bPlPanelBody' title={ __( 'Styles', 'b-blocks' ) } initialOpen={ true }>
	<Layout { ...props } />
	<PriceText { ...props } which='regularPrice' />
	<PriceText { ...props } which='salePrice' />
	<Currency { ...props } />
</PanelBody>;

export default Styles;
