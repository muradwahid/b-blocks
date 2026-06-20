import { useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';

const num = (val, fb) => (Number.isFinite(parseInt(val, 10)) ? parseInt(val, 10) : fb);

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		headingText,
		headingTag,
		items = [],
		showProgress,
		showReset,
		persistKey,
		checkboxStyle,
		accentColor,
		cardBg,
		textColor,
		strikeChecked,
		headingFontSize,
		headingFontWeight,
		itemFontSize,
		itemFontWeight,
		progressFontSize,
		checkboxSize,
		itemGap,
		paddingVertical,
		paddingHorizontal,
		borderRadius,
		borderColor,
		borderWidth,
		maxWidth,
		alignment,
	} = attributes;

	// Generate a stable per-instance localStorage key on first insert so
	// multiple checklists on the same page persist independently.
	useEffect(() => {
		if (!persistKey) {
			setAttributes({ persistKey: `cl-${clientId.slice(0, 8)}` });
		}
	}, [persistKey, clientId, setAttributes]);

	const safeAlignment = ['left', 'center', 'right'].includes(alignment) ? alignment : 'left';
	const safeCheckboxStyle = checkboxStyle === 'round' ? 'round' : 'square';
	const safeHeadingTag = ['h2', 'h3', 'h4'].includes(headingTag) ? headingTag : 'h3';
	const safeItemWeight = ['400', '500', '600', '700'].includes(itemFontWeight) ? itemFontWeight : '400';
	const safeHeadingWeight = ['400', '500', '600', '700'].includes(headingFontWeight) ? headingFontWeight : '700';
	const mw = num(maxWidth, 0) >= 0 ? num(maxWidth, 0) : 0;

	const total = items.length;

	const wrapperStyle = {
		'--bb-cl-accent': accentColor || '#4f46e5',
		'--bb-cl-card-bg': cardBg || '#ffffff',
		'--bb-cl-text-color': textColor || '#1a1a1a',
		'--bb-cl-border-width': `${num(borderWidth, 1)}px`,
		'--bb-cl-border-color': (borderColor || '').toString().trim() || 'transparent',
		'--bb-cl-radius': `${num(borderRadius, 12)}px`,
		'--bb-cl-heading-size': `${num(headingFontSize, 20)}px`,
		'--bb-cl-heading-weight': safeHeadingWeight,
		'--bb-cl-item-size': `${num(itemFontSize, 16)}px`,
		'--bb-cl-item-weight': safeItemWeight,
		'--bb-cl-progress-size': `${num(progressFontSize, 13)}px`,
		'--bb-cl-checkbox-size': `${num(checkboxSize, 20)}px`,
		'--bb-cl-item-gap': `${num(itemGap, 12)}px`,
		'--bb-cl-pad-v': `${num(paddingVertical, 24)}px`,
		'--bb-cl-pad-h': `${num(paddingHorizontal, 28)}px`,
		'--bb-cl-max-width': mw > 0 ? `${mw}px` : 'none',
		'--bb-cl-progress-pct': '0%',
	};

	const wrapperClasses = [
		'bb-cl',
		`bb-cl-align--${safeAlignment}`,
		`bb-cl-checkbox--${safeCheckboxStyle}`,
		num(borderWidth, 1) > 0 ? 'has-border' : '',
		strikeChecked !== false ? 'has-strike' : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const updateItem = (index, key, next) => {
		const copy = items.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		setAttributes({ items: copy });
	};

	const removeItem = (index) => {
		setAttributes({ items: items.filter((_, i) => i !== index) });
	};

	const moveItem = (from, to) => {
		if (to < 0 || to >= items.length) return;
		const copy = items.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		setAttributes({ items: copy });
	};

	const HeadingTag = safeHeadingTag;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<RichText
					tagName={HeadingTag}
					className='bb-cl-heading'
					value={headingText || ''}
					onChange={(val) => setAttributes({ headingText: val })}
					placeholder={__('Your Checklist', 'b-blocks')}
					allowedFormats={['core/bold', 'core/italic']}
				/>

				{showProgress !== false && total > 0 && (
					<div className='bb-cl-progress'>
						<p className='bb-cl-progress-text'>
							{sprintf(
								/* translators: 1: completed count, 2: total count. */
								__('%1$s of %2$s complete', 'b-blocks'),
								0,
								total,
							)}
						</p>
						<div className='bb-cl-progress-track' aria-hidden='true'>
							<span className='bb-cl-progress-fill' />
						</div>
					</div>
				)}

				{total === 0 ? (
					<p className='bb-cl-empty'>
						{__('No checklist items yet. Add the first one from the sidebar.', 'b-blocks')}
					</p>
				) : (
					<ul className='bb-cl-list'>
						{items.map((item, idx) => (
							<li key={(item && item.id) || idx} className='bb-cl-item'>
								<div className='bb-cl-label'>
									<input
										type='checkbox'
										className='bb-cl-checkbox'
										tabIndex={-1}
										readOnly
									/>
									<span className='bb-cl-box' aria-hidden='true' />
									<RichText
										tagName='span'
										className='bb-cl-text'
										value={(item && item.label) || ''}
										onChange={(val) => updateItem(idx, 'label', val)}
										placeholder={__('Checklist item', 'b-blocks')}
										allowedFormats={[]}
									/>
									<div className='bb-cl-editor-item-actions'>
										<Button
											variant='tertiary'
											size='small'
											icon='arrow-up-alt2'
											label={__('Move item up', 'b-blocks')}
											onClick={() => moveItem(idx, idx - 1)}
											disabled={idx === 0}
										/>
										<Button
											variant='tertiary'
											size='small'
											icon='arrow-down-alt2'
											label={__('Move item down', 'b-blocks')}
											onClick={() => moveItem(idx, idx + 1)}
											disabled={idx === items.length - 1}
										/>
										<Button
											variant='tertiary'
											isDestructive
											size='small'
											icon='trash'
											label={__('Remove item', 'b-blocks')}
											onClick={() => removeItem(idx)}
										/>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}

				{showReset !== false && total > 0 && (
					<button type='button' className='bb-cl-reset' disabled>
						{__('Reset progress', 'b-blocks')}
					</button>
				)}
			</div>
		</>
	);
};

export default Edit;
