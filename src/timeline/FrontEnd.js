import { __ } from '@wordpress/i18n';
import { buildItemStyle, getLayoutClass, getVariantClass } from './Components/Common/Utilities';

/**
 * Front-end render component for the Timeline block.
 *
 * Hydrated by view.js on the public site. Reads sanitized attributes from
 * the server (see render.php) and outputs the timeline. Item title and
 * description fields are passed through wp_kses_post on the server so
 * dangerouslySetInnerHTML usage here is safe.
 */
const FrontEnd = ( { attributes } ) => {
	const {
		items = [],
		layout = 'alternating',
		variant = 'modern',
		lineColor = '#dee2e6',
		showIcons = true,
	} = attributes || {};

	const wrapperClass = [
		'timeline-block',
		getVariantClass( variant ),
		getLayoutClass( layout ),
	]
		.filter( Boolean )
		.join( ' ' );

	const wrapperStyle = {
		'--bBlocks-timeline-line-color': lineColor,
	};

	if ( ! items.length ) {
		return (
			<div className={ wrapperClass } style={ wrapperStyle }>
				<div className="timeline-empty">
					<p>{ __( 'No timeline items to display.', 'b-blocks' ) }</p>
				</div>
			</div>
		);
	}

	return (
		<div className={ wrapperClass } style={ wrapperStyle }>
			<ol className="timeline-items">
				{ items.map( ( item, index ) => {
					const hasIcon = showIcons && !! item.icon;

					return (
						<li
							key={ index }
							className="timeline-item"
							style={ buildItemStyle( item ) }
						>
							<span
								className={ `timeline-marker${ hasIcon ? ' has-icon' : '' }` }
								aria-hidden="true"
							>
								{ hasIcon ? item.icon : '' }
							</span>
							<div className="timeline-card">
								{ item.date && (
									<div className="timeline-date">
										<time>{ item.date }</time>
									</div>
								) }
								{ item.title && (
									<h3
										className="timeline-title"
										dangerouslySetInnerHTML={ { __html: item.title } }
									/>
								) }
								{ item.description && (
									<div
										className="timeline-description"
										dangerouslySetInnerHTML={ { __html: item.description } }
									/>
								) }
							</div>
						</li>
					);
				} ) }
			</ol>
		</div>
	);
};

export default FrontEnd;
