import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { SortableControl } from '../../../../../../../bpl-tools/Components';
import { contentElements } from '../../../../utils/data';

/** Labels are translated here so the stored order stays language-independent. */
const labels = () => ( {
	price: __( 'Price', 'b-blocks' ),
	rating: __( 'Rating', 'b-blocks' ),
	title: __( 'Title', 'b-blocks' ),
	category: __( 'Category', 'b-blocks' ),
	soldCount: __( 'Sold Count', 'b-blocks' )
} );

const SortingContent = ( { attributes, setAttributes } ) => {
	const { contentOrder = [] } = attributes;

	const text = labels();

	const known = Object.keys( contentElements );
	const order = [
		...contentOrder.filter( ( key ) => known.includes( key ) ),
		...known.filter( ( key ) => ! contentOrder.includes( key ) )
	];

	const items = order.map( ( key ) => ( { id: key, label: text[ key ] } ) );

	return <PanelBody className='bPlPanelBody' title={ __( 'Sorting Content', 'b-blocks' ) } initialOpen={ false }>
		<SortableControl
			label={ __( 'Drag to reorder the card content:', 'b-blocks' ) }
			value={ items }
			property='label'
			onChange={ ( val ) => setAttributes( {
				contentOrder: val.map( ( item ) => item.id ).filter( Boolean )
			} ) }
		/>
	</PanelBody>;
};

export default SortingContent;
