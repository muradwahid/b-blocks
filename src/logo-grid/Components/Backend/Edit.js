import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings';
import { buildLogoGridCss } from '../Common/Style';

const Edit = ( props ) => {
	const { attributes, clientId } = props;
	const {
		label, showLabel, items,
		filterDefault, hoverEffect, cellBorderWidth
	} = attributes;

	const id = `block-${ clientId }`;
	const css = buildLogoGridCss( id, attributes );

	const logos = Array.isArray( items ) ? items : [];

	const wrapperClasses = [
		'bb-lg',
		`bb-lg--filter-${ filterDefault || 'grayscale' }`,
		`bb-lg--hover-${ hoverEffect || 'color' }`,
		cellBorderWidth > 0 ? 'bb-lg--has-border' : ''
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	return <>
		<Settings { ...props } />

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			{ showLabel && (
				<p className='bb-lg-label'>
					{ label || __( 'Trusted by leading companies', 'b-blocks' ) }
				</p>
			) }

			{ logos.length === 0 ? (
				<p className='bb-lg-empty'>
					{ __( 'Add logos from the “Logos” panel in the block settings.', 'b-blocks' ) }
				</p>
			) : (
				<div className='bb-lg-grid'>
					{ logos.map( ( logo, idx ) => (
						<div className='bb-lg-item' key={ logo?._key || idx }>
							{ logo && logo.imageUrl ? (
								<img
									className='bb-lg-img'
									src={ logo.imageUrl }
									alt={ logo.imageAlt || '' }
								/>
							) : (
								<span className='bb-lg-placeholder' aria-hidden='true'>
									{ __( 'Logo', 'b-blocks' ) }
								</span>
							) }
						</div>
					) ) }
				</div>
			) }
		</div>
	</>;
};

export default Edit;
