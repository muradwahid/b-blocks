import metadata from '../block.json';

const box = ( top, right = top, bottom = top, left = right ) => ( { top, right, bottom, left } );
const empty = () => box( '', '', '', '' );
const solid = ( color ) => ( { type: 'solid', color } );

const slots = ( padding, radius, withMargin ) => Object.fromEntries( [ 'desktop', 'tablet', 'mobile' ].map( ( device ) => {
	const isDesktop = 'desktop' === device;
	const slot = { padding: isDesktop ? padding : empty() };
	if ( withMargin ) slot.margin = empty();
	slot.radius = isDesktop ? radius : empty();
	return [ device, slot ];
} ) );

const state = ( { color, bg, padding, radius, border = { width: '', style: 'solid', color: '' }, shadow = [], withMargin = false } ) => ( {
	...( undefined === color ? {} : { color } ),
	bg: solid( bg ),
	border,
	shadow,
	...slots( padding, radius, withMargin )
} );

const button = ( props ) => state( { ...props, withMargin: true } );

const shadow = ( vOffset, blur, color ) => ( [
	{ hOffset: '0px', vOffset, blur, spreed: '0px', color, isInset: false }
] );

const STYLE_KEYS = {
	layout: [ 'actionPosition', 'actionAlign', 'actionFull', 'actionIconOnly', 'actionOrder' ],
	elements: null,
	contentOrder: null,
	card: [ 'transition', 'bodyBg', 'divider', 'normal', 'hover' ],
	media: [ 'ratio', 'fit', 'bg', 'overlay' ],
	title: [ 'transition', 'typo', 'normal', 'hover' ],
	price: [ 'typo', 'color', 'regularColor' ],
	rating: [ 'style', 'color', 'emptyColor', 'countColor', 'size' ],
	category: [ 'transition', 'typo', 'normal', 'hover' ],
	sold: [ 'typo', 'color', 'bg', 'progress' ],
	cart: [ 'transition', 'showIcon', 'typo', 'normal', 'hover' ],
	viewButton: [ 'transition', 'showIcon', 'typo', 'normal', 'hover' ],
	badge: [ 'align', 'content', 'bg', 'color', 'typo' ]
};

const DEVICES = [ 'desktop', 'tablet', 'mobile' ];
const DEVICE_KEYS = {
	layout: [ 'contentAlign', 'columnGap', 'rowGap' ],
	card: [ 'bodyMargin' ],
	media: [ 'radius', 'margin' ],
	badge: [ 'radius', 'padding', 'offset' ]
};

const clone = ( value ) => JSON.parse( JSON.stringify( value ) );

const merge = ( target, source ) => {
	const out = { ...target };

	for ( const [ key, value ] of Object.entries( source || {} ) ) {
		const isObject = value && 'object' === typeof value && ! Array.isArray( value );
		out[ key ] = isObject && target?.[ key ] && 'object' === typeof target[ key ] ? merge( target[ key ], value ) : value;
	}

	return out;
};
const pick = ( value, keys ) => Object.fromEntries( keys.filter( ( k ) => k in ( value || {} ) ).map( ( k ) => [ k, clone( value[ k ] ) ] ) );

const shipped = () => Object.fromEntries(
	Object.entries( STYLE_KEYS ).map( ( [ group, keys ] ) => {
		const value = metadata.attributes[ group ]?.default;
		if ( keys === null ) return [ group, clone( value ) ];

		const fresh = pick( value, keys );
		for ( const device of DEVICE_KEYS[ group ] ? DEVICES : [] ) {
			fresh[ device ] = pick( value?.[ device ], DEVICE_KEYS[ group ] );
		}

		return [ group, fresh ];
	} )
);

export const presets = {

	default: {
		label: 'Default',
		attributes: shipped()
	},

	editorial: {
		label: 'Editorial',
		attributes: {
			layout: {
				actionPosition: 'below', actionAlign: 'center',
				actionFull: true, actionIconOnly: false, actionOrder: 'view',
				desktop: { contentAlign: 'center', columnGap: '28px', rowGap: '40px' }
			},
			elements: { image: true, category: false, rating: false, price: true, saleBadge: false, soldCount: false, progressBar: false, viewButton: true, title: true, cart: true },
			contentOrder: [ 'title', 'price', 'rating', 'category', 'soldCount' ],
			card: {
				transition: 0.3,
				bodyBg: solid( '#ffffff' ),
				desktop: { bodyMargin: box( '-56px', '18px', '0px', '18px' ) },
				normal: state( { bg: '#f7efe9', padding: box( '28px', '22px' ), radius: empty() } ),
				hover: state( { bg: '#f7efe9', padding: empty(), radius: empty() } )
			},
			media: { ratio: '1/1', fit: 'cover', bg: solid( '#f7efe9' ), desktop: { radius: empty() } },
			title: { transition: 0.2, typo: { fontSize: { desktop: '20px', tablet: '', mobile: '' }, fontWeight: 400 }, normal: { color: '#1a1a1a' }, hover: { color: '#8a6a52' } },
			price: { typo: { fontSize: { desktop: '17px' }, fontWeight: 600 }, color: '#1a1a1a', regularColor: '#9a9a9a' },
			cart: {
				transition: 0.2,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 500 },
				normal: button( { color: '#1a1a1a', bg: '#ffffff', padding: box( '13px' ), radius: box( '2px' ), border: { width: '1px', style: 'solid', color: '#d8d2cc' } } ),
				hover: button( { color: '#ffffff', bg: '#1a1a1a', padding: empty(), radius: empty(), border: { width: '1px', style: 'solid', color: '#1a1a1a' } } )
			},
			viewButton: {
				transition: 0.2,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 500 },
				normal: button( { color: '#ffffff', bg: '#111111', padding: box( '13px' ), radius: box( '2px' ) } ),
				hover: button( { color: '#ffffff', bg: '#3a3a3a', padding: empty(), radius: empty() } )
			}
		},
		list: {
			card: {
				desktop: { bodyMargin: box( '18px', '18px', '18px', '-40px' ) },
				mobile: { bodyMargin: box( '-56px', '18px', '0px', '18px' ) },
				normal: { desktop: { padding: box( '24px' ) }, mobile: { padding: box( '28px', '22px' ) } }
			}
		}
	},

	catalogue: {
		label: 'Catalogue',
		attributes: {
			layout: {
				actionPosition: 'overlay', actionAlign: 'right',
				actionFull: false, actionIconOnly: true, actionOrder: 'view',
				desktop: { contentAlign: 'left', columnGap: '24px', rowGap: '32px' }
			},
			elements: { image: true, category: true, rating: true, price: true, saleBadge: true, soldCount: false, progressBar: false, viewButton: true, title: true, cart: true },
			contentOrder: [ 'category', 'title', 'rating', 'price', 'soldCount' ],
			card: {
				transition: 0.2,
				bodyBg: solid( '' ),
				desktop: { bodyMargin: empty() },
				normal: state( { bg: '#ffffff', padding: box( '14px', '4px', '4px', '4px' ), radius: empty() } ),
				hover: state( { bg: '#ffffff', padding: empty(), radius: empty() } )
			},
			media: { ratio: '1/1', fit: 'contain', bg: solid( '#f4f5f7' ), desktop: { radius: empty() } },
			title: { transition: 0.2, typo: { fontSize: { desktop: '15px' }, fontWeight: 400 }, normal: { color: '#2b2b2b' }, hover: { color: '#12a5a5' } },
			category: { transition: 0.2, typo: { fontSize: { desktop: '12px' }, fontWeight: 400 }, normal: { color: '#9aa0a6' }, hover: { color: '#12a5a5' } },
			price: { typo: { fontSize: { desktop: '15px' }, fontWeight: 700 }, color: '#12a5a5', regularColor: '#b6bcc2' },
			rating: { style: 'star', color: '#f5a623', emptyColor: '#d6dade', countColor: '#9aa0a6', size: 13 },
			cart: {
				transition: 0.2,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 500 },
				normal: button( { color: '#3c4043', bg: '#ffffff', padding: box( '9px' ), radius: box( '2px' ) } ),
				hover: button( { color: '#ffffff', bg: '#12a5a5', padding: empty(), radius: empty() } )
			},
			viewButton: {
				transition: 0.2,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 500 },
				normal: button( { color: '#3c4043', bg: '#ffffff', padding: box( '9px' ), radius: box( '2px' ) } ),
				hover: button( { color: '#ffffff', bg: '#12a5a5', padding: empty(), radius: empty() } )
			},
			badge: { align: 'left', bg: solid( '#12a5a5' ), color: '#ffffff', typo: { fontSize: { desktop: '11px' }, fontWeight: 600 }, desktop: { padding: box( '3px', '9px' ), radius: box( '2px' ), offset: '8px' } }
		},
		list: {
			card: { normal: { desktop: { padding: box( '12px', '16px' ) }, mobile: { padding: box( '14px', '4px', '4px', '4px' ) } } }
		}
	},

	bold: {
		label: 'Bold',
		attributes: {
			layout: {
				actionPosition: 'overlay', actionAlign: 'bottom',
				actionFull: true, actionIconOnly: false, actionOrder: 'cart',
				desktop: { contentAlign: 'left' }
			},
			elements: { image: true, category: false, rating: true, price: true, saleBadge: true, soldCount: false, progressBar: false, viewButton: false, title: true, cart: true },
			card: {
				transition: 0.3,
				bodyBg: solid( '' ),
				desktop: { bodyMargin: empty() },
				normal: state( { bg: '#15161a', padding: box( '18px' ), radius: box( '4px' ) } ),
				hover: state( { bg: '#1f2127', padding: empty(), radius: empty(), shadow: shadow( '10px', '28px', 'rgba(0, 0, 0, 0.45)' ) } )
			},
			media: { ratio: '4/3', fit: 'cover', bg: solid( '#0f1013' ), desktop: { radius: empty() } },
			title: { transition: 0.2, typo: { fontSize: { desktop: '17px' }, fontWeight: 600 }, normal: { color: '#f5f6f8' }, hover: { color: '#ffb547' } },
			price: { typo: { fontSize: { desktop: '16px' }, fontWeight: 700 }, color: '#ffb547', regularColor: '#6b6f78' },
			rating: { style: 'star', color: '#ffb547', emptyColor: '#3a3d45', countColor: '#8b9098', size: 14 },
			cart: {
				transition: 0.2,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 600 },
				normal: button( { color: '#15161a', bg: '#ffb547', padding: box( '12px' ), radius: box( '2px' ) } ),
				hover: button( { color: '#15161a', bg: '#ffffff', padding: empty(), radius: empty() } )
			}
		}
	},

	soft: {
		label: 'Soft',
		attributes: {
			layout: {
				actionPosition: 'below', actionAlign: 'center',
				actionFull: false, actionIconOnly: false, actionOrder: 'cart',
				desktop: { contentAlign: 'center', columnGap: '24px', rowGap: '30px' }
			},
			elements: { image: true, category: false, rating: true, price: true, saleBadge: true, soldCount: false, progressBar: false, viewButton: false, title: true, cart: true },
			card: {
				transition: 0.35,
				bodyBg: solid( '' ),
				desktop: { bodyMargin: empty() },
				normal: state( { bg: '#ffffff', padding: box( '20px' ), radius: box( '18px' ), shadow: shadow( '2px', '10px', 'rgba(17, 24, 39, 0.06)' ) } ),
				hover: state( { bg: '#ffffff', padding: empty(), radius: empty(), shadow: shadow( '14px', '30px', 'rgba(17, 24, 39, 0.14)' ) } )
			},
			media: { ratio: '1/1', fit: 'cover', bg: solid( '#f6f7fb' ), desktop: { radius: box( '14px' ) } },
			title: { transition: 0.2, typo: { fontSize: { desktop: '16px' }, fontWeight: 500 }, normal: { color: '#1f2937' }, hover: { color: '#6366f1' } },
			price: { typo: { fontSize: { desktop: '16px' }, fontWeight: 700 }, color: '#6366f1', regularColor: '#b6bcc8' },
			cart: {
				transition: 0.25,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 600 },
				normal: button( { color: '#ffffff', bg: '#6366f1', padding: box( '11px', '20px' ), radius: box( '999px' ) } ),
				hover: button( { color: '#ffffff', bg: '#4f46e5', padding: empty(), radius: empty() } )
			}
		}
	},
	storefront: {
		label: 'Storefront',
		attributes: {
			layout: {
				actionPosition: 'split', actionAlign: 'center',
				actionFull: false, actionIconOnly: false, actionOrder: 'cart',
				desktop: { contentAlign: 'left', columnGap: '24px', rowGap: '24px' }
			},
			elements: { image: true, category: true, rating: true, price: true, saleBadge: true, soldCount: false, progressBar: false, viewButton: true, title: true, cart: true },
			contentOrder: [ 'category', 'title', 'rating', 'price', 'soldCount' ],
			card: {
				transition: 0.25,
				bodyBg: solid( '' ),
				divider: '#f1f5f9',
				desktop: { bodyMargin: empty() },
				normal: state( { bg: '#ffffff', padding: box( '14px', '16px', '16px', '16px' ), radius: box( '16px' ), border: { width: '1px', style: 'solid', color: '#e2e8f0' }, shadow: shadow( '4px', '14px', 'rgba(15, 23, 42, 0.06)' ) } ),
				hover: state( { bg: '#ffffff', padding: empty(), radius: empty(), border: { width: '1px', style: 'solid', color: '#e2e8f0' }, shadow: shadow( '12px', '28px', 'rgba(15, 23, 42, 0.10)' ) } )
			},
			media: { ratio: '1/1', fit: 'cover', bg: solid( '#f1f5f9' ), desktop: { radius: box( '10px' ), margin: box( '16px', '16px', '0px', '16px' ) } },
			title: { transition: 0.2, typo: { fontSize: { desktop: '16px' }, fontWeight: 600, lineHeight: '1.4' }, normal: { color: '#0f172a' }, hover: { color: '#146ef5' } },
			category: { transition: 0.2, typo: { fontSize: { desktop: '13px' }, fontWeight: 500 }, normal: { color: '#94a3b8' }, hover: { color: '#146ef5' } },
			price: { typo: { fontSize: { desktop: '18px' }, fontWeight: 700 }, color: '#0f172a', regularColor: '#94a3b8' },
			rating: { style: 'star-count', color: '#fbbf24', emptyColor: '#e2e8f0', countColor: '#64748b', size: 14 },
			cart: {
				transition: 0.2,
				showIcon: true,
				typo: { fontSize: { desktop: '14px' }, fontWeight: 600 },
				normal: button( { color: '#ffffff', bg: '#146ef5', padding: box( '8px', '14px' ), radius: box( '8px' ) } ),
				hover: button( { color: '#ffffff', bg: '#0f58d0', padding: empty(), radius: empty() } )
			},
			viewButton: {
				transition: 0.2,
				showIcon: false,
				typo: { fontSize: { desktop: '13px' }, fontWeight: 500 },
				normal: button( { color: '#334155', bg: 'rgba(255, 255, 255, 0.92)', padding: box( '6px', '12px' ), radius: box( '6px' ) } ),
				hover: button( { color: '#0f172a', bg: '#ffffff', padding: empty(), radius: empty() } )
			},
			badge: {
				align: 'left', content: 'amount',
				bg: solid( '#2a9669' ), color: '#ffffff',
				typo: { fontSize: { desktop: '12px' }, fontWeight: 700, textTransform: 'none' },
				desktop: { padding: box( '4px', '10px' ), radius: box( '999px' ), offset: '10px' }
			}
		},
		list: {
			card: { normal: { desktop: { padding: box( '16px', '16px', '16px', '0px' ) }, mobile: { padding: box( '14px', '16px', '16px', '16px' ) } } },
			media: { desktop: { margin: box( '16px' ) }, mobile: { margin: box( '16px', '16px', '0px', '16px' ) } }
		}
	}
};

export const presetOptions = Object.entries( presets )
	.map( ( [ value, { label } ] ) => ( { value, label } ) );

export const applyPreset = ( name, attributes = {} ) => {
	const preset = presets[ name ];
	if ( ! preset ) return null;

	const base = shipped();
	const next = {};

	const source = 'list' === attributes.layout?.type && preset.list
		? merge( preset.attributes, preset.list )
		: preset.attributes;

	for ( const group of new Set( [ ...Object.keys( base ), ...Object.keys( source ) ] ) ) {
		const fresh = base[ group ];
		const override = source[ group ];

		if ( Array.isArray( fresh ) || Array.isArray( override ) ) {
			next[ group ] = [ ...( Array.isArray( override ) ? override : fresh ) ];
			continue;
		}

		next[ group ] = {
			...( attributes[ group ] || {} ),
			...( fresh || {} ),
			...( override || {} )
		};
		for ( const device of DEVICE_KEYS[ group ] ? DEVICES : [] ) {
			next[ group ][ device ] = {
				...( attributes[ group ]?.[ device ] || {} ),
				...( fresh?.[ device ] || {} ),
				...( override?.[ device ] || {} )
			};
		}
	}

	return next;
};

const same = ( a, b ) => {
	if ( a === b ) return true;
	if ( ! a || ! b || 'object' !== typeof a || 'object' !== typeof b ) return false;
	if ( Array.isArray( a ) !== Array.isArray( b ) ) return false;

	const keys = new Set( [ ...Object.keys( a ), ...Object.keys( b ) ] );
	return [ ...keys ].every( ( key ) => ( undefined === a[ key ] && undefined === b[ key ] ) || same( a[ key ], b[ key ] ) );
};

export const currentPreset = ( attributes = {} ) => Object.keys( presets ).find( ( name ) => {
	const next = applyPreset( name, attributes );
	return Object.keys( next ).every( ( group ) => same( next[ group ], attributes[ group ] ) );
} ) || '';