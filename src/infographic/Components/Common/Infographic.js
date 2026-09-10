import { useEffect, useMemo, useRef, useState } from 'react';

import { TITLE_TAGS, getActiveAnimation, getActiveItem, getDefaultItemId, getSegmentAngle, getSegmentWedges, getStaggerOrder, getVisibleItems, getWrapperClasses, isScrollTriggered, toMs, withUnit } from '../../utils/options';

const SegmentIcon = ({ buttonIcon = {}, label }) => {
	const { type = 'icon', icon = '', url = '' } = buttonIcon;

	if ('image' === type) {
		return url ? <span className='b-blocks-infographic-segment-icon'><img src={url} alt={label || ''} /></span> : null;
	}

	return icon ? <span className='b-blocks-infographic-segment-icon' dangerouslySetInnerHTML={{ __html: icon }} /> : null;
};

// A per-item height overrides the global one; left empty it falls through.
const CenterImage = ({ image = {}, height }) => image?.url ? <div className='b-blocks-infographic-center-image'>
	<img src={image.url} alt={image.alt || ''} style={height ? { height: withUnit(height) } : undefined} />
</div> : null;

/**
 * The one source of the markup: Edit renders it, view.js hydrates it. The
 * preview and the published output cannot drift apart.
 */
const Infographic = ({ attributes, isBackend = false, custom = {} }) => {
	const { general = {}, defaults = {}, button = {}, wheel = {}, animation = {}, elements = {}, content = {} } = attributes;
	const items = Array.isArray(attributes?.items) ? attributes.items : [];

	// Only enabled items can be active.
	const visibleSource = useMemo(() => getVisibleItems(items).map(({ item }) => item), [items]);

	const { item: defaultItem, itemTitle: defaultItemTitle, itemText: defaultItemText, image: defaultImage = {} } = defaults;
	const { showIcon: showIconInButton, showText: showTextInButton } = button;
	const { itemTriggerType } = general;

	const animationType = getActiveAnimation(animation, wheel);

	// Left empty, the stagger tracks the speed, so one control still paces the
	// whole entrance without the segments bunching up.
	const stagger = animation.enable
		? (animation.stagger ? toMs(animation.stagger, 0) : Math.round(toMs(animation.speed) * 0.25))
		: 0;

	// One delay in front of the sequence, so a hero above can finish first.
	const startDelay = animation.enable ? toMs(animation.delay, 0) : 0;

	// Rotation is a second animation behind the entrance, so the delay is a pair.
	// The ring turns once the last segment lands, and every segment shares that
	// moment or the formation breaks.
	const rotating = animation.enable && !wheel.enableSegmentsType && animation.rotate;
	const rotateStart = rotating ? startDelay + Math.max(0, visibleSource.length - 1) * stagger + toMs(animation.speed) : 0;
	const { title: enableTitle, divider: enableDivider, text: enableText, image: enableImage } = elements;

	const defaultId = getDefaultItemId(visibleSource, defaultItem);

	const [activeId, setActiveId] = useState(defaultId);

	// The default and the item list both shift during editing, so the centre
	// follows them rather than whatever was active at mount.
	useEffect(() => setActiveId(defaultId), [defaultId]);

	// The reverse of clicking a segment: expanding an item previews it.
	const editingIndex = isBackend ? custom?.activeIndex : undefined;

	useEffect(() => {
		const editing = items[editingIndex];

		editing?.id && setActiveId(editing.id);
	}, [editingIndex]);

	// Labels stay upright by counter-rotating, or turn with the wheel. Turning
	// ones flip through the lower half, where facing out would read upside down.
	const labelCounter = (deg) => {
		if (!wheel.rotateLabels) return -deg;

		const heading = ((deg % 360) + 360) % 360;

		return 90 < heading && 270 > heading ? 180 : 0;
	};

	// An entrance runs once and holds, so editing it would change nothing on
	// screen. Re-keying on these replays it in the editor.
	const replayKey = isBackend && animation.enable ? `${animationType}-${animation.easing}-${animation.speed}-${animation.order}-${animation.stagger}-${animation.delay}-${animation.rotate}` : '';

	// Holds until the block reaches the viewport. The editor has nothing to
	// scroll into, so it counts as seen.
	const wrapperRef = useRef(null);
	const [inView, setInView] = useState(isBackend || !isScrollTriggered(animation.trigger));

	useEffect(() => {
		if (isBackend || !isScrollTriggered(animation.trigger)) {
			setInView(true);

			return undefined;
		}

		const node = wrapperRef.current;

		// Without the API there is nothing to wait for, so play rather than
		// leave the block invisible.
		if (!node || 'undefined' === typeof IntersectionObserver) {
			setInView(true);

			return undefined;
		}

		setInView(false);

		const repeats = 'scrollRepeat' === animation.trigger;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setInView(true);

				// Repeating parks again on the way out, so keep watching.
				!repeats && observer.disconnect();
			} else if (repeats) {
				setInView(false);
			}
		}, { threshold: 0.2 });

		observer.observe(node);

		return () => observer.disconnect();
	}, [isBackend, animation.trigger, animation.enable]);

	// Restarts keyframes already finished and held by fill-mode; without it a
	// repeat would change nothing.
	const viewKey = 'scrollRepeat' === animation.trigger && inView ? 'in' : 'out';

	// The order they arrive in. Only the multiplier changes.
	const staggerOrder = useMemo(() => getStaggerOrder(visibleSource.length, animation.order), [visibleSource.length, animation.order]);

	const wedges = useMemo(() => wheel.enableSegmentsType ? getSegmentWedges(items, wheel) : [], [wheel, items]);

	// Disabled items drop out rather than leave a gap. The original index rides
	// along, because the per-item CSS keys on it.
	const visible = useMemo(() => getVisibleItems(items), [items]);

	// activeId outlives the item it points at when that item is deleted. Falling
	// back keeps a segment selected instead of blanking the centre.
	const activeItem = getActiveItem(items, activeId) || getActiveItem(items, defaultId);

	const title = activeItem?.title || defaultItemTitle;
	const description = activeItem?.description || defaultItemText;
	const image = activeItem?.image?.url ? activeItem.image : defaultImage;
	// Stamping whose content is showing lets the per-item colours live in CSS
	// rather than inline, which is the only way they can carry a hover state.
	const activeIndex = items.findIndex((one) => one?.id === activeItem?.id);
	const imageHeight = activeItem?.image?.url ? activeItem?.imageHeight : '';
	// Each item places its own image.
	const imagePosition = activeItem?.imagePosition || 'top';

	const segmentDelay = (position) => {
		const own = startDelay + (staggerOrder[position] ?? position) * stagger;

		if (rotating) return `${own}ms, ${rotateStart}ms`;

		return own ? `${own}ms` : '';
	};

	const activate = (item, index) => {
		setActiveId(item?.id);

		isBackend && custom?.setActiveIndex && custom.setActiveIndex(index);
	};

	// A heading level is document structure, not styling, so it cannot be fixed.
	const TitleTag = TITLE_TAGS.includes(content?.title?.tag) ? content.title.tag : 'h3';

	// React patches the centre in place, so no keyframe restarts on its own.
	// Keying the wrapper forces the remount that replays the transition, and the
	// settings ride along so edits preview at once.
	const contentKey = `${animation.contentType || 'none'}-${animation.contentSpeed || ''}`;

	const centerContent = <>
		{enableTitle && title && <TitleTag className='b-blocks-infographic-center-title'>{title}</TitleTag>}

		{enableDivider && <span className='b-blocks-infographic-center-divider' />}

		{enableText && description && <p className='b-blocks-infographic-center-text'>{description}</p>}
	</>;

	return <div className={getWrapperClasses(attributes, { inView })} ref={wrapperRef}>
		<div className='b-blocks-infographic-circle'>
			<div className='b-blocks-infographic-center-disc' data-item-index={-1 < activeIndex ? activeIndex : undefined}>
				<div className='b-blocks-infographic-center-content' key={`${activeItem?.id || 'none'}-${contentKey}`}>
					{enableImage && 'top' === imagePosition && <CenterImage image={image} height={imageHeight} />}

					{centerContent}

					{enableImage && 'bottom' === imagePosition && <CenterImage image={image} height={imageHeight} />}
				</div>
			</div>

			{visible.map(({ item, index }, position) => {
				const isActive = !!activeItem && item?.id === activeItem.id;
				const { url = '', target = false, nofollow = false, title: linkTitle = '' } = item?.link || {};

				const wedge = wedges[index] || { start: 0, span: 0, mid: 0 };
				const angle = getSegmentAngle(item, position, visible.length, wheel);
				const counter = labelCounter(angle);

				const segmentProps = {
					className: ['b-blocks-infographic-segment', isActive ? 'active' : '', isBackend && index === custom?.activeIndex ? 'bPlNowEditing' : ''].filter(Boolean).join(' '),
					// Indexed, not given an id: two blocks on a page would
					// share ids, and the per-wedge CSS keys off this.
					'data-index': index,
					'data-item-id': item?.id,
					'aria-pressed': isActive,
					style: {
						'--bbInfographicAngle': `${angle}deg`,
						// Upright by default; turning means skipping the
						// counter-rotation.
						'--bbInfographicCounter': `${counter}deg`,
						// The rotation end frame. Upright labels unwind the extra
						// turn; turning ones must not, or they sit frozen while
						// the ring goes round.
						'--bbInfographicCounterEnd': `${wheel.rotateLabels ? counter : counter - 360}deg`,
						'--bbInfographicMid': `${wedge.mid}deg`,
						// Wedge labels sit on the bisector, so the same treatment
						// measured from that angle.
						'--bbInfographicMidCounter': `${labelCounter(wedge.mid)}deg`,
						...(segmentDelay(position) ? { animationDelay: segmentDelay(position) } : {})
					},
					onMouseEnter: 'hover' === itemTriggerType ? () => activate(item, index) : undefined,
					onFocus: 'hover' === itemTriggerType ? () => activate(item, index) : undefined,
					// A linked segment still navigates; the swap runs alongside.
					onClick: () => activate(item, index)
				};

				// Wrapped so segments mode can push the icon and label along the
				// bisector while the wedge stays put.
				const segmentInner = <span className='b-blocks-infographic-segment-inner'>
					{showIconInButton && <SegmentIcon buttonIcon={item?.buttonIcon} label={item?.buttonLabel} />}

					{showTextInButton && item?.buttonLabel && <span className='b-blocks-infographic-segment-label'>{item.buttonLabel}</span>}
				</span>;

				return url && !isBackend ?
					<a key={`${item?.id || index}${replayKey}${viewKey}`} href={url} title={linkTitle || undefined} aria-label={linkTitle || undefined} target={target ? '_blank' : '_self'} rel={`noreferrer noopener${nofollow ? ' nofollow' : ''}`} {...segmentProps}>{segmentInner}</a> :
					<button key={`${item?.id || index}${replayKey}${viewKey}`} type='button' {...segmentProps}>{segmentInner}</button>;
			})}
		</div>
	</div>;
};
export default Infographic;
