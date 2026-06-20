import { __ } from '@wordpress/i18n';
import { createElement } from '@wordpress/element';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';

/**
 * Allowed step title HTML tag values. Anything else collapses to h3.
 */
const TITLE_TAGS = ['h2', 'h3', 'h4', 'p'];

/**
 * Resolve a responsive font-size object to the effective desktop pixel
 * value used in the editor preview. Falls back through desktop → tablet →
 * mobile → default px, mirroring the cascade in style.scss.
 */
const resolveFont = (responsive, fallback) => {
	const r = responsive || {};
	const desk = (r.desktop || '').toString().trim();
	if (desk) return desk;
	const tab = (r.tablet || '').toString().trim();
	if (tab) return tab;
	const mob = (r.mobile || '').toString().trim();
	if (mob) return mob;
	return fallback;
};

const resolveLength = (value, fallback) => {
	const v = (value == null ? '' : value).toString().trim();
	if (!v) return fallback;
	return v;
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		layout,
		theme,
		alignment,
		steps = [],
		showConnector,
		connectorColor,
		connectorWidth,
		connectorStyle,
		badgeType,
		badgeSize,
		badgeBg,
		badgeColor,
		badgeFontSize,
		badgeBorderRadius,
		titleTag,
		titleColor,
		titleFontSize = {},
		descColor,
		descFontSize = {},
		cardBg,
		cardPadding = {},
		cardBorderRadius,
		gap = {},
		columnCount = {},
	} = attributes;

	const safeTitleTag = TITLE_TAGS.includes(titleTag) ? titleTag : 'h3';
	const safeLayout = layout === 'vertical' ? 'vertical' : 'horizontal';
	const safeTheme = ['classic', 'modern', 'minimal', 'bold'].includes(theme) ? theme : 'classic';
	const safeBadgeType = badgeType === 'icon' ? 'icon' : 'number';
	const safeAlignment = ['left', 'center', 'right'].includes(alignment) ? alignment : 'center';
	const safeConnectorStyle = ['solid', 'dashed', 'dotted'].includes(connectorStyle) ? connectorStyle : 'solid';

	const pad = {
		top: resolveLength(cardPadding?.top, '16px'),
		right: resolveLength(cardPadding?.right, '16px'),
		bottom: resolveLength(cardPadding?.bottom, '16px'),
		left: resolveLength(cardPadding?.left, '16px'),
	};

	const gapDesktop = resolveLength(gap?.desktop, '32px');
	const gapTablet = resolveLength(gap?.tablet, gapDesktop);
	const gapMobile = resolveLength(gap?.mobile, gapTablet);

	const titleFontDesktop = resolveFont(titleFontSize, '18px');
	const descFontDesktop = resolveFont(descFontSize, '15px');

	const cols = {
		desktop: parseInt(columnCount?.desktop, 10) || 3,
		tablet: parseInt(columnCount?.tablet, 10) || 2,
		mobile: parseInt(columnCount?.mobile, 10) || 1,
	};

	const wrapperStyle = {
		'--bb-ps-badge-size': `${parseInt(badgeSize, 10) || 56}px`,
		'--bb-ps-badge-bg': badgeBg || '#2563EB',
		'--bb-ps-badge-color': badgeColor || '#FFFFFF',
		'--bb-ps-badge-font-size': `${parseInt(badgeFontSize, 10) || 20}px`,
		'--bb-ps-badge-radius': `${parseInt(badgeBorderRadius, 10) >= 0 ? parseInt(badgeBorderRadius, 10) : 50}%`,
		'--bb-ps-connector-color': connectorColor || '#CBD5E1',
		'--bb-ps-connector-width': `${parseInt(connectorWidth, 10) || 2}px`,
		'--bb-ps-connector-style': safeConnectorStyle,
		'--bb-ps-title-color': titleColor || 'inherit',
		'--bb-ps-title-font-size': titleFontDesktop,
		'--bb-ps-title-font-size-tablet': titleFontDesktop,
		'--bb-ps-title-font-size-mobile': titleFontDesktop,
		'--bb-ps-desc-color': descColor || 'inherit',
		'--bb-ps-desc-font-size': descFontDesktop,
		'--bb-ps-desc-font-size-tablet': descFontDesktop,
		'--bb-ps-desc-font-size-mobile': descFontDesktop,
		'--bb-ps-card-bg': cardBg || 'transparent',
		'--bb-ps-card-radius': `${parseInt(cardBorderRadius, 10) >= 0 ? parseInt(cardBorderRadius, 10) : 8}px`,
		'--bb-ps-card-padding': `${pad.top} ${pad.right} ${pad.bottom} ${pad.left}`,
		'--bb-ps-gap': gapDesktop,
		'--bb-ps-gap-tablet': gapTablet,
		'--bb-ps-gap-mobile': gapMobile,
		'--bb-ps-cols': cols.desktop,
		'--bb-ps-cols-tablet': cols.tablet,
		'--bb-ps-cols-mobile': cols.mobile,
	};

	const wrapperClasses = [
		'bb-ps-block',
		`bb-ps-layout--${safeLayout}`,
		`bb-ps-theme--${safeTheme}`,
		`bb-ps-align--${safeAlignment}`,
		`bb-ps-badge--${safeBadgeType}`,
		showConnector ? 'has-connector' : 'no-connector',
	].join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const updateStep = (index, key, next) => {
		const copy = steps.map((row, i) => (
			i === index ? { ...(row || {}), [key]: next } : row
		));
		setAttributes({ steps: copy });
	};

	const removeStep = (index) => {
		const copy = steps.filter((_, i) => i !== index);
		setAttributes({ steps: copy });
	};

	const moveStep = (from, to) => {
		if (to < 0 || to >= steps.length) return;
		const copy = steps.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		setAttributes({ steps: copy });
	};

	const addStep = () => {
		if (steps.length >= 12) return;
		const _key = `ps-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		setAttributes({
			steps: [
				...steps,
				{ _key, title: '', description: '', icon: '' },
			],
		});
	};

	return (
		<>
			<Settings
				attributes={attributes}
				setAttributes={setAttributes}
				onAddStep={addStep}
				onRemoveStep={removeStep}
				onMoveStep={moveStep}
				onUpdateStep={updateStep}
			/>

			<div {...blockProps}>
				{steps.length === 0 ? (
					<p className='bb-ps-empty'>
						{__('No steps yet. Add the first one from the sidebar.', 'b-blocks')}
					</p>
				) : (
					<ol className='bb-ps-list' aria-label={__('Process steps', 'b-blocks')}>
						{steps.map((step, idx) => {
							const stepNumber = idx + 1;
							const titleEl = createElement(
								RichText,
								{
									tagName: safeTitleTag,
									className: 'bb-ps-step__title',
									value: (step && step.title) || '',
									onChange: (val) => updateStep(idx, 'title', val),
									placeholder: __('Step title', 'b-blocks'),
									allowedFormats: [],
								}
							);

							return (
								<li key={(step && step._key) || idx} className='bb-ps-step'>
									<div className='bb-ps-step__badge' aria-hidden='true'>
										{safeBadgeType === 'icon' && step && step.icon ? (
											<i className={step.icon} aria-hidden='true' />
										) : (
											<span className='bb-ps-step__number'>{stepNumber}</span>
										)}
									</div>

									<div className='bb-ps-step__body'>
										{titleEl}

										<RichText
											tagName='div'
											className='bb-ps-step__description'
											value={(step && step.description) || ''}
											onChange={(val) => updateStep(idx, 'description', val)}
											placeholder={__('Describe this step…', 'b-blocks')}
											allowedFormats={['core/bold', 'core/italic', 'core/link']}
										/>

										<div
											className='bb-ps-editor-step-actions'
											style={{
												display: 'flex',
												justifyContent: 'center',
												gap: 4,
												marginTop: 8,
											}}
										>
											<Button
												variant='tertiary'
												size='small'
												icon='arrow-up-alt2'
												label={__('Move step up', 'b-blocks')}
												onClick={() => moveStep(idx, idx - 1)}
												disabled={idx === 0}
											/>
											<Button
												variant='tertiary'
												size='small'
												icon='arrow-down-alt2'
												label={__('Move step down', 'b-blocks')}
												onClick={() => moveStep(idx, idx + 1)}
												disabled={idx === steps.length - 1}
											/>
											<Button
												variant='tertiary'
												isDestructive
												size='small'
												icon='trash'
												label={__('Remove step', 'b-blocks')}
												onClick={() => removeStep(idx)}
											/>
										</div>
									</div>
								</li>
							);
						})}
					</ol>
				)}
			</div>
		</>
	);
};

export default Edit;
