import { __ } from '@wordpress/i18n';
import { useState, useEffect, useId, createElement } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const ChevronSvg = () => (
	<svg
		className='bb-faq-icon bb-faq-icon--chevron'
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width='18'
		height='18'
		focusable='false'
		aria-hidden='true'
	>
		<path
			fill='currentColor'
			d='M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z'
		/>
	</svg>
);

const PlusSvg = () => (
	<svg
		className='bb-faq-icon bb-faq-icon--plus'
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		width='18'
		height='18'
		focusable='false'
		aria-hidden='true'
	>
		<path
			className='bb-faq-icon__plus-v'
			fill='currentColor'
			d='M11 5h2v14h-2z'
		/>
		<path
			fill='currentColor'
			d='M5 11h14v2H5z'
		/>
	</svg>
);

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		items = [],
		openFirst,
		allowMultiple,
		iconStyle,
		headingTag,
		gap,
		itemBorderStyle,
		itemBorderWidth,
		itemBorderRadius,
		itemBorderColor,
		questionBg,
		questionColor,
		questionFontSize,
		answerBg,
		answerColor,
		answerFontSize,
		iconColor,
		questionPadding = {},
		answerPadding = {},
	} = attributes;

	const safeTag = ['h2', 'h3', 'h4'].includes(headingTag) ? headingTag : 'h3';
	const safeIcon = iconStyle === 'plus' ? 'plus' : 'chevron';

	const [openIndices, setOpenIndices] = useState(() => (openFirst && items.length > 0 ? [0] : []));

	// Keep open indices coherent with items array.
	useEffect(() => {
		setOpenIndices((prev) => {
			let next = prev.filter((i) => i < items.length);
			if (openFirst && items.length > 0 && !next.includes(0)) {
				next = allowMultiple ? [0, ...next] : [0];
			}
			if (!allowMultiple && next.length > 1) {
				next = [next[0]];
			}
			return next;
		});
	}, [openFirst, allowMultiple, items.length]);

	const toggle = (idx) => {
		setOpenIndices((prev) => {
			const isOpen = prev.includes(idx);
			if (isOpen) {
				return prev.filter((i) => i !== idx);
			}
			if (!allowMultiple) {
				return [idx];
			}
			return [...prev, idx];
		});
	};

	const editorId = useId();
	const blockProps = useBlockProps({ className: 'bb-faq-block' });

	const qPad = {
		top: parseInt(questionPadding?.top, 10) || 0,
		right: parseInt(questionPadding?.right, 10) || 0,
		bottom: parseInt(questionPadding?.bottom, 10) || 0,
		left: parseInt(questionPadding?.left, 10) || 0,
	};
	const aPad = {
		top: parseInt(answerPadding?.top, 10) || 0,
		right: parseInt(answerPadding?.right, 10) || 0,
		bottom: parseInt(answerPadding?.bottom, 10) || 0,
		left: parseInt(answerPadding?.left, 10) || 0,
	};

	const wrapperStyle = {
		'--bb-faq-gap': `${parseInt(gap, 10) || 0}px`,
		'--bb-faq-item-border-style': itemBorderStyle || 'solid',
		'--bb-faq-item-border-width': `${parseInt(itemBorderWidth, 10) || 0}px`,
		'--bb-faq-item-border-radius': `${parseInt(itemBorderRadius, 10) || 0}px`,
		'--bb-faq-item-border-color': itemBorderColor || '#dee2e6',
		'--bb-faq-question-bg': questionBg || '#f8f9fa',
		'--bb-faq-question-color': questionColor || '#212529',
		'--bb-faq-question-font-size': `${parseInt(questionFontSize, 10) || 17}px`,
		'--bb-faq-answer-bg': answerBg || '#ffffff',
		'--bb-faq-answer-color': answerColor || '#495057',
		'--bb-faq-answer-font-size': `${parseInt(answerFontSize, 10) || 15}px`,
		'--bb-faq-icon-color': iconColor || (questionColor || '#212529'),
		'--bb-faq-question-padding': `${qPad.top}px ${qPad.right}px ${qPad.bottom}px ${qPad.left}px`,
		'--bb-faq-answer-padding': `${aPad.top}px ${aPad.right}px ${aPad.bottom}px ${aPad.left}px`,
	};

	const renderIcon = () => (safeIcon === 'plus' ? <PlusSvg /> : <ChevronSvg />);

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps} style={wrapperStyle}>
				<div className={prefix}>
					{items.length === 0 && (
						<p className='bb-faq-empty'>
							{__('No FAQ items yet. Add one from the Content panel.', 'b-blocks')}
						</p>
					)}

					<div className='bb-faq-list' role='list'>
						{items.map((item, idx) => {
							const isOpen = openIndices.includes(idx);
							const itemClass = `bb-faq-item${isOpen ? ' is-open' : ''}`;
							const question = (item?.question || '').toString();
							const answer = (item?.answer || '').toString();
							const answerId = `${editorId}-answer-${idx}`;
							const headingEl = createElement(
								safeTag,
								{ className: 'bb-faq-question-heading' },
								<button
									type='button'
									className='bb-faq-question'
									aria-expanded={isOpen ? 'true' : 'false'}
									aria-controls={answerId}
									onClick={(e) => {
										e.preventDefault();
										toggle(idx);
									}}
								>
									<span className='bb-faq-question__text'>
										{question || __('(Empty question)', 'b-blocks')}
									</span>
									<span className='bb-faq-question__icon' aria-hidden='true'>
										{renderIcon()}
									</span>
								</button>
							);

							return (
								<div key={item._key || idx} className={itemClass} role='listitem'>
									{headingEl}
									<div
										id={answerId}
										className='bb-faq-answer'
										aria-hidden={isOpen ? 'false' : 'true'}
									>
										<div className='bb-faq-answer__inner'>
											{answer
												? answer.split(/\n+/).map((p, pi) => (
													<p key={pi}>{p}</p>
												))
												: (
													<p className='bb-faq-answer__placeholder'>
														{__('(Empty answer)', 'b-blocks')}
													</p>
												)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
