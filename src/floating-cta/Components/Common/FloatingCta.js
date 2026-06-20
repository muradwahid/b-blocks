import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Shared render for the Floating CTA button.
 *
 * @param {Object}  props
 * @param {Object}  props.attributes Block attributes.
 * @param {boolean} props.isBackend  True when rendered inside the editor canvas.
 * @param {Window}  props.win        Window reference (frontend only).
 */
const FloatingCta = ( props ) => {
	const { attributes, isBackend = false, win = typeof window !== 'undefined' ? window : null } = props;

	const {
		label,
		url,
		newTab,
		iconClass,
		showDismiss,
		dismissKey,
		scrollTrigger,
		animateIn,
		shadow,
		position,
		cId
	} = attributes;

	const isTop = position === 'top-left' || position === 'top-right';

	// Resolve the localStorage key the same way for editor preview and frontend.
	const resolvedKey = dismissKey || `bb-fc-dismissed-${ cId || 'preview' }`;

	const [ isVisible, setIsVisible ] = useState( isBackend || scrollTrigger <= 0 );

	// Initialize dismissed state synchronously on first render to prevent a
	// flash of the floating button on pages where the visitor already dismissed it.
	const [ isDismissed, setIsDismissed ] = useState( () => {
		if ( isBackend || ! showDismiss ) {
			return false;
		}
		try {
			return win?.localStorage?.getItem( resolvedKey ) === '1';
		} catch ( e ) {
			// localStorage may be unavailable (private browsing); fail open.
			return false;
		}
	} );

	const prefersReducedMotion = ! isBackend && win?.matchMedia
		? win.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
		: false;

	// Scroll trigger visibility.
	useEffect( () => {
		if ( isBackend || ! win ) {
			return undefined;
		}
		if ( scrollTrigger <= 0 ) {
			setIsVisible( true );
			return undefined;
		}

		const onScroll = () => {
			const y = win.scrollY || win.pageYOffset || 0;
			setIsVisible( y >= scrollTrigger );
		};

		win.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();

		return () => win.removeEventListener( 'scroll', onScroll );
	}, [ isBackend, scrollTrigger, win ] );

	const dismiss = () => {
		setIsDismissed( true );
		try {
			win?.localStorage?.setItem( resolvedKey, '1' );
		} catch ( e ) {
			// Ignore storage failures.
		}
	};

	if ( isDismissed ) {
		return null;
	}

	// Computed accessible name: ariaLabel → label → fallback.
	const accessibleName = ( attributes.ariaLabel || label || __( 'Button', 'b-blocks' ) ).trim();

	const showLabel = !! label;
	const showIcon = !! iconClass;

	const inner = (
		<>
			{ showIcon && (
				<i className={ `bb-fc-icon ${ iconClass }` } aria-hidden="true"></i>
			) }
			{ showLabel && <span className="bb-fc-label">{ label }</span> }
		</>
	);

	// Pre-reveal state: hidden to pointers but kept in the DOM.
	const revealedClass = isVisible ? 'is-visible' : 'is-hidden';
	const motionClass = prefersReducedMotion ? 'bb-fc-reduced-motion' : `bb-fc-anim-${ animateIn || 'fade' }`;
	const posClass = isTop ? 'bb-fc-pos-top' : 'bb-fc-pos-bottom';

	const commonProps = {
		className: `bb-fc-btn ${ shadow ? 'has-shadow' : '' }`,
		'aria-label': accessibleName
	};

	return (
		<div
			className={ `bb-fc-wrap ${ revealedClass } ${ motionClass } ${ posClass }` }
			role="region"
			aria-label={ accessibleName }
		>
			{ url ? (
				<a
					{ ...commonProps }
					href={ isBackend ? undefined : url }
					target={ newTab ? '_blank' : undefined }
					rel={ newTab ? 'noopener noreferrer' : undefined }
				>
					{ inner }
				</a>
			) : (
				<button { ...commonProps } type="button">
					{ inner }
				</button>
			) }

			{ showDismiss && (
				<button
					type="button"
					className="bb-fc-dismiss"
					aria-label={ __( 'Dismiss', 'b-blocks' ) }
					onClick={ isBackend ? undefined : dismiss }
				>
					<span aria-hidden="true">&times;</span>
				</button>
			) }
		</div>
	);
};

export default FloatingCta;
