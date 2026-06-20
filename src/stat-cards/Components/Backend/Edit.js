import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings';
import { buildStatCardsCss } from '../Common/Style';

const TrendIcon = ( { direction } ) => {
	let path = 'M18 15l-6-6-6 6';
	if ( direction === 'down' ) path = 'M6 9l6 6 6-6';
	else if ( direction === 'neutral' ) path = 'M5 12h14';
	return (
		<svg className='bb-sc-trend-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
			<path d={ path } fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	);
};

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		items, cardStyle, alignment, showIcon, showDescription, showTrend, borderWidth
	} = attributes;

	const id = `block-${ clientId }`;
	const css = buildStatCardsCss( id, attributes );

	const list = Array.isArray( items ) ? items : [];

	const wrapperClasses = [
		'bb-sc',
		`bb-sc--${ cardStyle || 'flat' }`,
		`bb-sc--align-${ alignment || 'center' }`,
		`bb-sc--block-${ attributes.blockAlign || 'center' }`,
		( borderWidth > 0 ) ? 'bb-sc--has-border' : ''
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( { id, className: wrapperClasses } );

	return <>
		<Settings { ...props } />

		<BlockControls>
			<AlignmentToolbar
				value={ alignment }
				onChange={ ( val ) => setAttributes( { alignment: val || 'center' } ) }
				alignmentControls={ [
					{ icon: 'editor-alignleft', title: __( 'Align left', 'b-blocks' ), align: 'left' },
					{ icon: 'editor-aligncenter', title: __( 'Align center', 'b-blocks' ), align: 'center' },
					{ icon: 'editor-alignright', title: __( 'Align right', 'b-blocks' ), align: 'right' }
				] }
			/>
		</BlockControls>

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			{ list.length === 0 ? (
				<p className='bb-sc-empty'>
					{ __( 'Add stat cards from the “Content” panel in the block settings.', 'b-blocks' ) }
				</p>
			) : (
				<dl className='bb-sc-grid'>
					{ list.map( ( item, idx ) => {
						const safe = item || {};
						const valueText = `${ safe.prefix || '' }${ safe.number || '' }${ safe.suffix || '' }`;
						const hasTrend = showTrend && safe.trendValue;
						const trendDir = safe.trendDirection || 'up';
						const trendStyle = safe.trendColor
							? { backgroundColor: safe.trendColor, color: '#ffffff' }
							: undefined;

						return (
							<div className='bb-sc-item' key={ safe._key || idx }>
								{ showIcon && safe.icon && (
									<span className='bb-sc-icon' aria-hidden='true'>
										<i className={ safe.icon }></i>
									</span>
								) }

								{ valueText !== '' && (
									safe.linkUrl
										? <span className='bb-sc-number'>
											{ safe.prefix && <span className='bb-sc-prefix'>{ safe.prefix }</span> }
											<span className='bb-sc-value'>{ safe.number }</span>
											{ safe.suffix && <span className='bb-sc-suffix'>{ safe.suffix }</span> }
										</span>
										: <dd className='bb-sc-number'>
											{ safe.prefix && <span className='bb-sc-prefix'>{ safe.prefix }</span> }
											<span className='bb-sc-value'>{ safe.number }</span>
											{ safe.suffix && <span className='bb-sc-suffix'>{ safe.suffix }</span> }
										</dd>
								) }

								{ safe.label && (
									safe.linkUrl
										? <span className='bb-sc-label'>{ safe.label }</span>
										: <dt className='bb-sc-label'>{ safe.label }</dt>
								) }

								{ hasTrend && (
									<span
										className={ `bb-sc-trend bb-sc-trend--${ trendDir }` }
										style={ trendStyle }
										aria-label={ sprintf(
											/* translators: 1: trend direction, 2: trend value */
											__( 'Trend: %1$s %2$s', 'b-blocks' ),
											trendDir,
											safe.trendValue
										) }
									>
										<TrendIcon direction={ trendDir } />
										<span className='bb-sc-trend-text'>{ safe.trendValue }</span>
									</span>
								) }

								{ showDescription && safe.description && (
									<p className='bb-sc-desc'>{ safe.description }</p>
								) }
							</div>
						);
					} ) }
				</dl>
			) }
		</div>
	</>;
};

export default Edit;
