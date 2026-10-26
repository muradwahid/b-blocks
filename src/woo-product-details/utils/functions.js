export const BOX = 'b-blocks-woo-product-details';

export const TABS = [
	{ key: 'description', option: 'showDescription' },
	{ key: 'additional_information', option: 'showAdditional' },
	{ key: 'reviews', option: 'showReviews' }
];

export const tabFromLocation = ( { hash = '', href = '' } = {}, tabs ) => {
	const target = decodeURIComponent( hash.replace( /^#/, '' ) ).toLowerCase();

	const tabMatch = target.match( /^tab-(description|additional_information|reviews)(-\d+)?$/ );
	if ( tabMatch ) return ! tabs || tabs.some( ( tab ) => tab.panelId === target ) ? tabMatch[ 1 ] : '';

	if ( [ 'reviews', 'comments', 'respond', 'review_form', 'review_form_wrapper' ].includes( target ) || /^comment-\d+$/.test( target ) ) {
		return 'reviews';
	}

	return /[?&](cpage|unapproved)=|\/comment-page-\d+/.test( href ) ? 'reviews' : '';
};
