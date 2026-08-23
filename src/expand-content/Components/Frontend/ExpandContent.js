import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const ExpandContent = ({ attributes, templateContent }) => {
	const { layout = {}, buttons = {} } = attributes;

	const previewHeight = parseInt(layout.previewHeight, 10) || 200;

	const showMore = buttons.showMore || 'Show More';
	const showLess = buttons.showLess || 'Show Less';
	const isShowCollapse = buttons.isShowCollapse !== false;
	const persistState = buttons.persistState === true;
	const alignment = buttons.alignment || 'center';

	const innerRef = useRef(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const [isShort, setIsShort] = useState(null);

	const [naturalHeight, setNaturalHeight] = useState(0);

	const storageKey = persistState ? `bbEc:${previewHeight}:${showMore}` : null;

	useLayoutEffect(() => {
		const inner = innerRef.current;
		if (!inner || !templateContent) return;

		if (templateContent.dataset.moved !== '1') {
			const nodes = Array.from(templateContent.childNodes);
			inner.append(...nodes);
			templateContent.dataset.moved = '1';
		}

		if (storageKey) {
			try {
				if (window.sessionStorage.getItem(storageKey) === 'open') {
					setIsExpanded(true);
				}
			} catch (e) {
				// sessionStorage may be unavailable (private mode / disabled).
			}
		}
	}, []);

	useEffect(() => {
		const inner = innerRef.current;
		if (!inner) return;

		const measure = () => {
			const natural = inner.scrollHeight;
			setNaturalHeight(natural);
			// +1px tolerance for sub-pixel rounding.
			setIsShort(natural <= previewHeight + 1);
		};

		// Measure after a frame so fonts / images can size first.
		const raf = requestAnimationFrame(measure);

		let ro = null;
		if (typeof window.ResizeObserver === 'function') {
			ro = new window.ResizeObserver(measure);
			ro.observe(inner);
		}

		return () => {
			cancelAnimationFrame(raf);
			if (ro) ro.disconnect();
		};
	}, [previewHeight]);


	useEffect(() => {
		if (!storageKey) return;
		try {
			if (isExpanded) {
				window.sessionStorage.setItem(storageKey, 'open');
			} else {
				window.sessionStorage.removeItem(storageKey);
			}
		} catch (e) {
			// Ignore storage failures.
		}
	}, [isExpanded, storageKey]);

	const toggle = () => setIsExpanded((v) => !v);


	const isClamped = isShort === false && !isExpanded;

	const showButton = isShort === false && !(isExpanded && !isShowCollapse);

	const innerStyle = isExpanded && naturalHeight
		? { maxHeight: `${naturalHeight}px` }
		: undefined;

	return (
		<div className='b-blocks-expand-content-wrapper'>

			<div
				className={`b-blocks-expand-content-innerBlocks${isClamped ? ' is-clamped' : ''}`}
				ref={innerRef}
				style={innerStyle}
			/>

			<div className='b-blocks-expand-content-toggle-button-container' data-align={alignment}>
				{showButton && (
					<button
						type='button'
						className={`b-blocks-expand-content-toggle-button ${isExpanded ? 'is-showLess' : 'is-showMore'}`}
						aria-expanded={isExpanded}
						onClick={toggle}
					>
						{isExpanded ? showLess : showMore}
					</button>
				)}
			</div>

		</div>
	);
};

export default ExpandContent;
