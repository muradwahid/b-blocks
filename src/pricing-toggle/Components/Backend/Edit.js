import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		monthlyLabel, annualLabel, defaultPeriod, showBadge, badgeText,
		badgeBg, badgeText_color, badgeBorderRadius,
		toggleBg, toggleActiveBg, knobColor, labelColor, activeLabelColor,
		fontSize, fontWeight, gap, alignment
	} = attributes;

	const id = `block-${ clientId }`;

	const isAnnual = defaultPeriod === 'annual';

	const safeFont   = Math.max( 10, Math.min( 32, parseInt( fontSize, 10 ) || 16 ) );
	const safeGap    = Math.max( 4, Math.min( 64, parseInt( gap, 10 ) || 12 ) );
	const safeRadius = Math.max( 0, Math.min( 50, parseInt( badgeBorderRadius, 10 ) || 0 ) );

	const css = `
		#${ id }.bb-pt-wrap {
			--bb-pt-track-bg: ${ toggleBg || '#e2e8f0' };
			--bb-pt-track-active-bg: ${ toggleActiveBg || '#2563eb' };
			--bb-pt-knob: ${ knobColor || '#ffffff' };
			--bb-pt-label-color: ${ labelColor || 'inherit' };
			--bb-pt-active-label-color: ${ activeLabelColor || '#2563eb' };
			--bb-pt-font-size: ${ safeFont }px;
			--bb-pt-font-weight: ${ fontWeight || '500' };
			--bb-pt-gap: ${ safeGap }px;
			--bb-pt-badge-bg: ${ badgeBg || '#16a34a' };
			--bb-pt-badge-color: ${ badgeText_color || '#ffffff' };
			--bb-pt-badge-radius: ${ safeRadius }px;
		}
	`;

	const blockProps = useBlockProps( {
		id,
		className: `bb-pt-wrap bb-pt-align-${ alignment || 'center' }${ isAnnual ? ' is-annual' : '' }`
	} );

	return <>
		<BlockControls>
			<AlignmentToolbar
				value={ alignment }
				onChange={ ( val ) => setAttributes( { alignment: val || 'center' } ) }
			/>
		</BlockControls>

		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			<div className='bb-pt-row'>
				<span className={ `bb-pt-label bb-pt-label-monthly${ ! isAnnual ? ' is-active' : '' }` } aria-hidden='true'>
					{ monthlyLabel || __( 'Monthly', 'b-blocks' ) }
				</span>

				<button
					type='button'
					className='bb-pt-switch'
					role='switch'
					aria-checked={ isAnnual }
					aria-label={ isAnnual
						/* translators: %s: annual billing period label */
						? __( 'Billing period: Annually', 'b-blocks' )
						: __( 'Billing period: Monthly', 'b-blocks' )
					}
					tabIndex={ -1 }
					onClick={ () => setAttributes( { defaultPeriod: isAnnual ? 'monthly' : 'annual' } ) }
				>
					<span className='bb-pt-knob' aria-hidden='true'></span>
				</button>

				<span className={ `bb-pt-label bb-pt-label-annual${ isAnnual ? ' is-active' : '' }` } aria-hidden='true'>
					{ annualLabel || __( 'Annually', 'b-blocks' ) }

					{ showBadge && ( badgeText || '' ).trim() !== '' && (
						<span className='bb-pt-badge' aria-hidden='true'>{ badgeText }</span>
					) }
				</span>
			</div>
		</div>
	</>;
};

export default Edit;
