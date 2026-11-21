import { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const P = 'b-blocks-off-canvas';

const FOCUSABLE = [
	'a[href]', 'area[href]', 'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
	'textarea:not([disabled])', 'iframe', 'object', 'embed',
	'[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])',
].join(',');

const OffCanvas = ({ attributes, templateContent }) => {
	const { trigger = {}, drawer = {}, overlay = {}, options = {}, transition = {} } = attributes;
	const side = drawer.side === 'right' ? 'right' : 'left';
	const showOverlay = overlay.show !== false;
	const label = (trigger.label || '').trim();
	const closeLabel = (options.closeLabel || '').trim() || 'Close';
	const accessibleLabel = label || 'Open drawer';
	const transitionType = transition.type || 'default';
	const triggerEvent = options.triggerEvent || 'click';
	const parsedDuration = parseInt(transition.duration, 10);
	const duration = Number.isNaN(parsedDuration) ? 300 : parsedDuration;

	const [open, setOpen] = useState(false);
	const [render, setRender] = useState(false);
	const [active, setActive] = useState(false);

	const triggerRef = useRef(null);
	const panelRef = useRef(null);
	const contentRef = useRef(null);

	useEffect(() => {
		if (!contentRef.current || !templateContent) return;
		if (templateContent.dataset.moved === '1') return;
		contentRef.current.append(...Array.from(templateContent.children));
		templateContent.dataset.moved = '1';
	}, [templateContent]);


	// Auto-open on page load when the trigger event is "load".
	useEffect(() => {
		if (triggerEvent === 'load') setOpen(true);
	}, [triggerEvent]);

	useEffect(() => {
		if (open) {
			setRender(true);
			const raf = requestAnimationFrame(() => requestAnimationFrame(() => setActive(true)));
			return () => cancelAnimationFrame(raf);
		}
		setActive(false);
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const timer = setTimeout(() => setRender(false), reduced ? 0 : duration + 20);
		return () => clearTimeout(timer);
	}, [open, duration]);

	useEffect(() => {
		if (!open) return undefined;
		document.body.classList.add(`${P}-open`);
		const panel = panelRef.current;

		const focusTimer = setTimeout(() => {
			const items = panel ? Array.from(panel.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null) : [];
			(items[0] || panel)?.focus();
		}, 10);

		const onKeyDown = (e) => {
			if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
			if (e.key !== 'Tab' || !panel) return;
			const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
			if (!items.length) { e.preventDefault(); panel.focus(); return; }
			const first = items[0];
			const last = items[items.length - 1];
			const activeEl = document.activeElement;
			if (e.shiftKey && (activeEl === first || !panel.contains(activeEl))) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && activeEl === last) { e.preventDefault(); first.focus(); }
		};
		document.addEventListener('keydown', onKeyDown);

		return () => {
			clearTimeout(focusTimer);
			document.removeEventListener('keydown', onKeyDown);
			document.body.classList.remove(`${P}-open`);
			try { triggerRef.current?.focus(); } catch (e) { /* detached */ }
		};
	}, [open]);

	return (
		<>
			<button
				type='button'
				ref={triggerRef}
				className={`${P}-trigger`}
				aria-haspopup='dialog'
				aria-expanded={open ? 'true' : 'false'}
				aria-label={label ? undefined : accessibleLabel}
				onClick={() => setOpen((o) => !o)}
				onMouseEnter={() => { if (triggerEvent === 'hover') setOpen(true); }}
			>
				{trigger.showIcon !== false && trigger.icon && trigger.iconPosition !== 'right' ? <span className={`${P}-icon`} aria-hidden='true' dangerouslySetInnerHTML={{ __html: sanitizeHtml( trigger.icon ) }} /> : null}
				{label ? <span className={`${P}-trigger-label`}>{label}</span> : null}
				{trigger.showIcon !== false && trigger.icon && trigger.iconPosition === 'right' ? <span className={`${P}-icon`} aria-hidden='true' dangerouslySetInnerHTML={{ __html: sanitizeHtml( trigger.icon ) }} /> : null}
			</button>

			{showOverlay ? (
				<div
					className={`${P}-overlay ${P}-overlay--${transitionType} ${P}-overlay-${side}${active ? ' is-open' : ''}`}
					onClick={() => setOpen(false)}
					hidden={!render}
				/>
			) : null}

			<aside
				ref={panelRef}
				className={`${P}-panel ${P}-side-${side} ${P}-panel--${transitionType}${active ? ' is-open' : ''}`}
				role='dialog'
				aria-modal='true'
				aria-label={accessibleLabel}
				tabIndex={-1}
				hidden={!render}
			>
				<button type='button' className={`${P}-close`} aria-label={closeLabel} onClick={() => setOpen(false)}>
					<span aria-hidden='true'>&times;</span>
				</button>
				<div className={`${P}-content`} ref={contentRef} />
			</aside>
		</>
	);
};

export default OffCanvas;