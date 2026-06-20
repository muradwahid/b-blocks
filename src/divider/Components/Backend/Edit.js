import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls
} from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const TYPE_VALUES = [ 'line', 'icon', 'text' ];
const LINE_STYLE_VALUES = [ 'solid', 'dashed', 'dotted', 'double' ];
const ALIGN_VALUES = [ 'left', 'center', 'right' ];
const FONT_WEIGHT_VALUES = [ '400', '500', '600', '700' ];
const TEXT_TRANSFORM_VALUES = [ 'none', 'uppercase', 'capitalize', 'lowercase' ];

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const {
		type,
		lineStyle,
		lineColor,
		lineWidth,
		width,
		alignment,
		marginTop,
		marginBottom,
		iconClass,
		iconSize,
		iconColor,
		iconBgColor,
		iconPadding,
		iconBorderRadius,
		text,
		textColor,
		textBgColor,
		textFontSize,
		textFontWeight,
		textTransform,
		textPadding
	} = attributes;

	const safeType = TYPE_VALUES.includes( type ) ? type : 'line';
	const safeLineStyle = LINE_STYLE_VALUES.includes( lineStyle ) ? lineStyle : 'solid';
	const safeAlign = ALIGN_VALUES.includes( alignment ) ? alignment : 'center';
	const safeWeight = FONT_WEIGHT_VALUES.includes( textFontWeight ) ? textFontWeight : '600';
	const safeTransform = TEXT_TRANSFORM_VALUES.includes( textTransform ) ? textTransform : 'none';

	const resolvedLineColor = lineColor || '#cccccc';
	const resolvedIconColor = iconColor || resolvedLineColor;
	const resolvedTextColor = textColor || resolvedLineColor;
	const resolvedIconBg = iconBgColor || 'transparent';
	const resolvedTextBg = textBgColor || 'transparent';

	const wrapperClasses = [
		'bb-divider',
		`bb-dv--${ safeType }`,
		`bb-dv-style--${ safeLineStyle }`,
		`bb-dv-align--${ safeAlign }`
	].join( ' ' );

	const wrapperStyle = {
		'--bb-dv-line-color': resolvedLineColor,
		'--bb-dv-line-width': `${ lineWidth ?? 2 }px`,
		'--bb-dv-line-style': safeLineStyle,
		'--bb-dv-max-width': `${ width ?? 100 }%`,
		'--bb-dv-margin-top': `${ marginTop ?? 24 }px`,
		'--bb-dv-margin-bottom': `${ marginBottom ?? 24 }px`,
		'--bb-dv-icon-color': resolvedIconColor,
		'--bb-dv-icon-bg': resolvedIconBg,
		'--bb-dv-icon-size': `${ iconSize ?? 16 }px`,
		'--bb-dv-icon-padding': `${ iconPadding ?? 8 }px`,
		'--bb-dv-icon-radius': `${ iconBorderRadius ?? 50 }px`,
		'--bb-dv-text-color': resolvedTextColor,
		'--bb-dv-text-bg': resolvedTextBg,
		'--bb-dv-text-size': `${ textFontSize ?? 14 }px`,
		'--bb-dv-text-weight': safeWeight,
		'--bb-dv-text-transform': safeTransform,
		'--bb-dv-text-padding': `${ textPadding ?? 12 }px`
	};

	const blockProps = useBlockProps( {
		className: wrapperClasses,
		style: wrapperStyle
	} );

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ safeAlign }
					onChange={ ( val ) => setAttributes( { alignment: val || 'center' } ) }
				/>
			</BlockControls>

			<Settings
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<div { ...blockProps }>
				{ 'line' === safeType && (
					<div className='bb-dv' role='separator'>
						<hr className='bb-dv-line' aria-hidden='true' />
					</div>
				) }

				{ 'icon' === safeType && (
					<div className='bb-dv' role='separator'>
						<span className='bb-dv-line' aria-hidden='true'></span>
						<span className='bb-dv-icon' aria-hidden='true'>
							<i className={ iconClass || 'fa-solid fa-star' } />
						</span>
						<span className='bb-dv-line' aria-hidden='true'></span>
					</div>
				) }

				{ 'text' === safeType && (
					<div
						className='bb-dv'
						role='separator'
						aria-label={ text || __( 'Section divider', 'b-blocks' ) }
					>
						<span className='bb-dv-line' aria-hidden='true'></span>
						<RichText
							tagName='span'
							className='bb-dv-text'
							value={ text || '' }
							onChange={ ( val ) => setAttributes( { text: val } ) }
							placeholder={ __( 'OR', 'b-blocks' ) }
							allowedFormats={ [] }
						/>
						<span className='bb-dv-line' aria-hidden='true'></span>
					</div>
				) }
			</div>
		</>
	);
};

export default Edit;
