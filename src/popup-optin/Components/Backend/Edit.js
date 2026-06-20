import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const clamp = ( val, min, max, fallback ) => {
	const n = parseInt( val, 10 );
	if ( isNaN( n ) ) {
		return fallback;
	}
	return Math.max( min, Math.min( max, n ) );
};

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		headline, headlineTag, subtext,
		showNameField, namePlaceholder, emailPlaceholder,
		ctaLabel, dismissLabel, showCloseButton,
		maxWidth, bgColor, textColor, accentColor, accentTextColor,
		inputBorderColor, borderRadius, padding,
		headlineFontSize, headlineFontWeight, subtextFontSize, inputBorderRadius,
		openAnimation
	} = attributes;

	const id = `block-${ clientId }`;
	const HeadingTag = [ 'h2', 'h3', 'h4' ].indexOf( headlineTag ) !== -1 ? headlineTag : 'h2';

	const css = `
		#${ id }.bb-po {
			--bb-po-bg: ${ bgColor || '#ffffff' };
			--bb-po-text: ${ textColor || '#1a1a1a' };
			--bb-po-accent: ${ accentColor || '#146EF5' };
			--bb-po-accent-text: ${ accentTextColor || '#ffffff' };
			--bb-po-input-border: ${ inputBorderColor || '#dddddd' };
			--bb-po-max-w: ${ clamp( maxWidth, 320, 800, 480 ) }px;
			--bb-po-radius: ${ clamp( borderRadius, 0, 32, 12 ) }px;
			--bb-po-pad: ${ clamp( padding, 12, 80, 32 ) }px;
			--bb-po-headline-size: ${ clamp( headlineFontSize, 14, 48, 24 ) }px;
			--bb-po-headline-weight: ${ headlineFontWeight || '700' };
			--bb-po-subtext-size: ${ clamp( subtextFontSize, 12, 24, 15 ) }px;
			--bb-po-input-radius: ${ clamp( inputBorderRadius, 0, 24, 6 ) }px;
			--bb-po-anim: 0ms;
		}
	`;

	const blockProps = useBlockProps( {
		id,
		className: `bb-po bb-po-editor bb-po-anim-${ openAnimation || 'fade-scale' }`
	} );

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<p className='bb-po-editor-hint'>
				{ __( 'Preview only. On the frontend this popup is hidden until the configured trigger (time / scroll / exit intent) fires, then shown as a centered overlay. Dismissal is remembered per browser.', 'b-blocks' ) }
			</p>

			<div className='bb-po-card'>
				{ showCloseButton && (
					<button type='button' className='bb-po-close' aria-hidden='true' tabIndex={ -1 }>
						<span aria-hidden='true'>×</span>
					</button>
				) }

				<RichText
					tagName={ HeadingTag }
					className='bb-po-headline'
					value={ headline }
					onChange={ ( val ) => setAttributes( { headline: val } ) }
					placeholder={ __( 'Add a headline…', 'b-blocks' ) }
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>

				<RichText
					tagName='p'
					className='bb-po-subtext'
					value={ subtext }
					onChange={ ( val ) => setAttributes( { subtext: val } ) }
					placeholder={ __( 'Add supporting text…', 'b-blocks' ) }
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
				/>

				<div className='bb-po-form'>
					{ showNameField && (
						<input
							type='text'
							className='bb-po-input bb-po-input--name'
							placeholder={ namePlaceholder || __( 'Your name', 'b-blocks' ) }
							disabled
						/>
					) }

					<input
						type='email'
						className='bb-po-input bb-po-input--email'
						placeholder={ emailPlaceholder || __( 'Your email address', 'b-blocks' ) }
						disabled
					/>

					<button type='button' className='bb-po-submit' disabled>
						{ ctaLabel || __( 'Subscribe', 'b-blocks' ) }
					</button>

					{ '' !== ( dismissLabel || '' ).trim() && (
						<button type='button' className='bb-po-dismiss' disabled>
							{ dismissLabel }
						</button>
					) }
				</div>
			</div>
		</div>
	</>;
};

export default Edit;
