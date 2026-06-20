import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings';
import { buildMilestoneTimelineCss } from '../Common/Style';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		items, nodeShape, labelPosition, alignment, dateTag, titleTag,
		showNodeNumbers, ariaLabel
	} = attributes;

	const id = `block-${ clientId }`;
	const css = buildMilestoneTimelineCss( id, attributes );

	const list = Array.isArray( items ) ? items : [];

	const wrapperClasses = [
		'bb-mt',
		`bb-mt--shape-${ nodeShape || 'circle' }`,
		`bb-mt--labels-${ labelPosition || 'alternating' }`,
		`bb-mt--align-${ alignment || 'center' }`
	].filter( Boolean ).join( ' ' );

	const blockProps = useBlockProps( { id, className: wrapperClasses } );

	const TitleTag = [ 'h2', 'h3', 'h4', 'p' ].includes( titleTag ) ? titleTag : 'h3';
	const DateTag = dateTag === 'time' ? 'time' : 'span';

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
				<p className='bb-mt-empty'>
					{ __( 'Add milestones from the “Content” panel in the block settings.', 'b-blocks' ) }
				</p>
			) : (
				<div className='bb-mt-track'>
					<ol className='bb-mt-list' aria-label={ ariaLabel || __( 'Milestones', 'b-blocks' ) }>
						{ list.map( ( item, idx ) => {
							const safe = item || {};
							const nodeStyle = safe.accentColor
								? { backgroundColor: safe.accentColor }
								: undefined;

							return (
								<li className='bb-mt-item' key={ safe._key || idx }>
									<span className='bb-mt-node' aria-hidden='true' style={ nodeStyle }>
										{ showNodeNumbers
											? <span className='bb-mt-node-num'>{ idx + 1 }</span>
											: ( safe.icon ? <i className={ safe.icon }></i> : null ) }
									</span>

									<div className='bb-mt-card'>
										{ safe.date && (
											<DateTag className='bb-mt-date'>{ safe.date }</DateTag>
										) }
										{ safe.title && (
											<TitleTag className='bb-mt-title'>{ safe.title }</TitleTag>
										) }
										{ safe.description && (
											<p className='bb-mt-desc'>{ safe.description }</p>
										) }
									</div>
								</li>
							);
						} ) }
					</ol>
				</div>
			) }
		</div>
	</>;
};

export default Edit;
