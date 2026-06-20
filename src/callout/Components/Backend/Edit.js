import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InnerBlocks,
	AlignmentToolbar,
	BlockControls
} from '@wordpress/block-editor';

import Settings from './Settings/Settings';

// Type → default palette + icon. Keep in lockstep with render.php's $typePresets.
const TYPE_PRESETS = {
	note: {
		accent: '#0ea5e9',
		bg: '#f0f9ff',
		title: '#075985',
		body: '#0c4a6e',
		icon: 'fa-solid fa-circle-info',
		label: __( 'Note', 'b-blocks' )
	},
	tip: {
		accent: '#10b981',
		bg: '#ecfdf5',
		title: '#065f46',
		body: '#064e3b',
		icon: 'fa-solid fa-lightbulb',
		label: __( 'Tip', 'b-blocks' )
	},
	warning: {
		accent: '#f59e0b',
		bg: '#fffbeb',
		title: '#92400e',
		body: '#78350f',
		icon: 'fa-solid fa-triangle-exclamation',
		label: __( 'Warning', 'b-blocks' )
	},
	danger: {
		accent: '#ef4444',
		bg: '#fef2f2',
		title: '#991b1b',
		body: '#7f1d1d',
		icon: 'fa-solid fa-circle-exclamation',
		label: __( 'Danger', 'b-blocks' )
	},
	success: {
		accent: '#22c55e',
		bg: '#f0fdf4',
		title: '#166534',
		body: '#14532d',
		icon: 'fa-solid fa-circle-check',
		label: __( 'Success', 'b-blocks' )
	}
};

const TYPE_VALUES = Object.keys( TYPE_PRESETS );
const LAYOUT_VALUES = [ 'accent-bar', 'filled', 'outlined' ];
const ALIGN_VALUES = [ 'left', 'center', 'right' ];
const TITLE_TAG_VALUES = [ 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ];

// Default starter content inside the InnerBlocks body. A single paragraph
// keeps the writing flow natural — authors immediately get a place to type.
const INNER_TEMPLATE = [
	[ 'core/paragraph', {
		placeholder: __( 'Write your callout message here…', 'b-blocks' )
	} ]
];

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const {
		calloutType,
		layout,
		title,
		titleTag,
		showTitle,
		showIcon,
		iconClass,
		iconSize,
		alignment,
		accentColor,
		backgroundColor,
		titleColor,
		bodyColor,
		iconColor,
		accentBarWidth,
		borderRadius,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		titleFontSize,
		titleFontWeight,
		bodyFontSize
	} = attributes;

	const safeType = TYPE_VALUES.includes( calloutType ) ? calloutType : 'note';
	const safeLayout = LAYOUT_VALUES.includes( layout ) ? layout : 'accent-bar';
	const safeAlign = ALIGN_VALUES.includes( alignment ) ? alignment : 'left';
	const safeTitleTag = TITLE_TAG_VALUES.includes( titleTag ) ? titleTag : 'h4';

	const preset = TYPE_PRESETS[ safeType ];

	const resolvedAccent = accentColor || preset.accent;
	const resolvedBg = backgroundColor || preset.bg;
	const resolvedTitle = titleColor || preset.title;
	const resolvedBody = bodyColor || preset.body;
	const resolvedIcon = iconColor || resolvedAccent;

	// When the editor changes type, if the icon still matches the OLD type's
	// default we silently swap to the new type's default icon. If the user
	// has manually changed the icon (it doesn't match ANY preset default) we
	// leave it alone.
	const onTypeChange = ( nextType ) => {
		const next = TYPE_VALUES.includes( nextType ) ? nextType : 'note';
		const currentIcon = ( iconClass || '' ).trim();
		const presetIcons = TYPE_VALUES.map( ( t ) => TYPE_PRESETS[ t ].icon );
		const iconIsDefault = presetIcons.includes( currentIcon );

		const patch = { calloutType: next };
		if ( iconIsDefault ) {
			patch.iconClass = TYPE_PRESETS[ next ].icon;
		}
		setAttributes( patch );
	};

	const wrapperClasses = [
		'bb-callout',
		`bb-co-type--${ safeType }`,
		`bb-co-style--${ safeLayout }`,
		`bb-co-align--${ safeAlign }`,
		showIcon ? 'has-icon' : 'no-icon'
	].join( ' ' );

	const wrapperStyle = {
		'--bb-co-accent': resolvedAccent,
		'--bb-co-bg': resolvedBg,
		'--bb-co-title-color': resolvedTitle,
		'--bb-co-body-color': resolvedBody,
		'--bb-co-icon-color': resolvedIcon,
		'--bb-co-accent-width': `${ accentBarWidth ?? 4 }px`,
		'--bb-co-radius': `${ borderRadius ?? 6 }px`,
		'--bb-co-pad-top': `${ paddingTop ?? 16 }px`,
		'--bb-co-pad-right': `${ paddingRight ?? 20 }px`,
		'--bb-co-pad-bottom': `${ paddingBottom ?? 16 }px`,
		'--bb-co-pad-left': `${ paddingLeft ?? 20 }px`,
		'--bb-co-title-size': `${ titleFontSize ?? 15 }px`,
		'--bb-co-title-weight': titleFontWeight || '600',
		'--bb-co-body-size': `${ bodyFontSize ?? 15 }px`,
		'--bb-co-icon-size': `${ iconSize ?? 20 }px`
	};

	const blockProps = useBlockProps( {
		className: wrapperClasses,
		style: wrapperStyle
	} );

	// Render the title using the configured tag. RichText drives the
	// inline-editable text node, falling back to the type label as a hint
	// when the field is empty (mirrors the placeholder behaviour the spec
	// calls for).
	const titlePlaceholder = sprintf(
		/* translators: %s: callout type label, e.g. "Note" or "Tip" */
		__( '%s title…', 'b-blocks' ),
		preset.label
	);

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ safeAlign }
					onChange={ ( val ) => setAttributes( { alignment: val || 'left' } ) }
				/>
			</BlockControls>

			<Settings
				attributes={ attributes }
				setAttributes={ setAttributes }
				typePresets={ TYPE_PRESETS }
				onTypeChange={ onTypeChange }
			/>

			<div { ...blockProps }>
				<aside
					className='bb-co'
					role='note'
					aria-label={ sprintf(
						/* translators: 1: type label, 2: title */
						__( '%1$s: %2$s', 'b-blocks' ),
						preset.label,
						title || preset.label
					) }
				>
					{ showIcon && (
						<div className='bb-co__icon' aria-hidden='true'>
							<i className={ iconClass || preset.icon } />
						</div>
					) }

					<div className='bb-co__body'>
						{ showTitle && (
							<RichText
								tagName={ safeTitleTag }
								className='bb-co__title'
								value={ title || '' }
								onChange={ ( val ) => setAttributes( { title: val } ) }
								placeholder={ titlePlaceholder }
								allowedFormats={ [] }
							/>
						) }

						<div className='bb-co__content'>
							<InnerBlocks
								template={ INNER_TEMPLATE }
								templateLock={ false }
							/>
						</div>
					</div>
				</aside>
			</div>
		</>
	);
};

export default Edit;
