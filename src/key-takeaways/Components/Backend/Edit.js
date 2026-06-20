import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		headingText,
		headingTag,
		listStyle,
		items = [],
		iconClass,
		iconColor,
		accentColor,
		cardBg,
		textColor,
		headingColor,
		borderRadius,
		borderColor,
		borderWidth,
		itemFontSize,
		itemFontWeight,
		headingFontSize,
		headingFontWeight,
		iconSize,
		paddingVertical,
		paddingHorizontal,
		itemGap,
		alignment,
		maxWidth,
		showIcon,
	} = attributes;

	const safeAlignment = alignment === 'center' ? 'center' : 'left';
	const safeListStyle = ['check', 'numbered', 'bullet'].includes(listStyle) ? listStyle : 'check';
	const safeHeadingTag = ['h2', 'h3', 'h4'].includes(headingTag) ? headingTag : 'h3';
	const safeItemWeight = ['400', '500', '600', '700'].includes(itemFontWeight) ? itemFontWeight : '400';
	const safeHeadingWeight = ['400', '500', '600', '700'].includes(headingFontWeight) ? headingFontWeight : '700';
	const showPrefix = showIcon !== false;
	const resolvedIcon = (iconClass || '').toString().trim() || 'fas fa-check-circle';
	const mw = parseInt(maxWidth, 10) >= 0 ? parseInt(maxWidth, 10) : 0;

	const num = (val, fb) => (Number.isFinite(parseInt(val, 10)) ? parseInt(val, 10) : fb);

	const wrapperStyle = {
		'--bb-kt-accent': accentColor || '#0d6efd',
		'--bb-kt-card-bg': cardBg || '#f0f6ff',
		'--bb-kt-text-color': textColor || '#1e293b',
		'--bb-kt-heading-color': headingColor || '#ffffff',
		'--bb-kt-icon-color': iconColor || '#ffffff',
		'--bb-kt-radius': `${num(borderRadius, 8)}px`,
		'--bb-kt-border-width': `${num(borderWidth, 0)}px`,
		'--bb-kt-border-color': (borderColor || '').toString().trim() || 'transparent',
		'--bb-kt-item-size': `${num(itemFontSize, 16)}px`,
		'--bb-kt-item-weight': safeItemWeight,
		'--bb-kt-heading-size': `${num(headingFontSize, 18)}px`,
		'--bb-kt-heading-weight': safeHeadingWeight,
		'--bb-kt-icon-size': `${num(iconSize, 18)}px`,
		'--bb-kt-pad-v': `${num(paddingVertical, 20)}px`,
		'--bb-kt-pad-h': `${num(paddingHorizontal, 24)}px`,
		'--bb-kt-item-gap': `${num(itemGap, 10)}px`,
		'--bb-kt-max-width': mw > 0 ? `${mw}px` : 'none',
	};

	const wrapperClasses = [
		'bb-kt-block',
		`bb-kt-align--${safeAlignment}`,
		`bb-kt-style--${safeListStyle}`,
		num(borderWidth, 0) > 0 ? 'has-border' : '',
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

	const ListTag = safeListStyle === 'numbered' ? 'ol' : 'ul';
	const HeadingTag = safeHeadingTag;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<RichText
					tagName={HeadingTag}
					className='bb-kt-heading'
					value={headingText || ''}
					onChange={(val) => setAttributes({ headingText: val })}
					placeholder={__('Key Takeaways', 'b-blocks')}
					allowedFormats={['core/bold', 'core/italic']}
				/>

				<div className='bb-kt-body'>
					{items.length === 0 ? (
						<p className='bb-kt-empty'>
							{__('No takeaways yet. Add the first one from the sidebar.', 'b-blocks')}
						</p>
					) : (
						<ListTag className='bb-kt-list' role='list'>
							{items.map((item, idx) => (
								<li key={(item && item._key) || idx} className='bb-kt-item'>
									{showPrefix && safeListStyle === 'check' && (
										<span className='bb-kt-icon' aria-hidden='true'>
											<i className={resolvedIcon} />
										</span>
									)}
									{showPrefix && safeListStyle === 'numbered' && (
										<span className='bb-kt-num' aria-hidden='true' />
									)}
									{showPrefix && safeListStyle === 'bullet' && (
										<span className='bb-kt-bullet' aria-hidden='true' />
									)}

									<RichText
										tagName='span'
										className='bb-kt-text'
										value={(item && item.text) || ''}
										onChange={(val) => updateItem(idx, 'text', val)}
										placeholder={__('Takeaway text', 'b-blocks')}
										allowedFormats={['core/bold', 'core/italic', 'core/link']}
									/>

									<div className='bb-kt-editor-item-actions'>
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
								</li>
							))}
						</ListTag>
					)}
				</div>
			</div>
		</>
	);
};

export default Edit;
