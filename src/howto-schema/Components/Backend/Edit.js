import { __ } from '@wordpress/i18n';
import { createElement } from '@wordpress/element';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

import Settings from './Settings/Settings';

/**
 * Parse an ISO 8601 duration ("PT30M", "PT1H30M", "P2D") into a
 * human-readable string. Mirrors the PHP logic in render.php so the
 * editor preview matches the frontend label.
 */
const ISO_DURATION_RE = /^P(?!$)(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/;

const humanizeIsoDuration = (value) => {
	const v = (value || '').toString().trim();
	if (!v || !ISO_DURATION_RE.test(v)) return '';

	const days = parseInt((v.match(/(\d+)D/) || [])[1], 10) || 0;
	const hours = parseInt((v.match(/T.*?(\d+)H/) || [])[1], 10) || 0;
	const minutes = parseInt((v.match(/T.*?(?:\d+H)?(\d+)M/) || [])[1], 10) || 0;
	const seconds = parseInt((v.match(/T.*?(?:\d+H)?(?:\d+M)?(\d+)S/) || [])[1], 10) || 0;

	const out = [];
	if (days > 0) {
		out.push(`${days} ${days === 1 ? __('day', 'b-blocks') : __('days', 'b-blocks')}`);
	}
	if (hours > 0) {
		out.push(`${hours} ${hours === 1 ? __('hr', 'b-blocks') : __('hrs', 'b-blocks')}`);
	}
	if (minutes > 0) {
		out.push(`${minutes} ${__('min', 'b-blocks')}`);
	}
	if (seconds > 0) {
		out.push(`${seconds} ${__('sec', 'b-blocks')}`);
	}
	return out.join(' ');
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		howtoName,
		description,
		totalTime,
		supply = [],
		tool = [],
		steps = [],
		headingTag,
		showStepNumbers,
		numberStyle,
		showConnector,
		stepSpacing,
		numberBg,
		numberColor,
		numberSize,
		connectorColor,
		stepTitleColor,
		stepTitleFontSize,
		stepTextColor,
		stepTextFontSize,
		stepBg,
		stepBorderRadius,
		stepPadding = {},
		metaColor,
		metaFontSize,
	} = attributes;

	const safeTag = ['h2', 'h3', 'h4'].includes(headingTag) ? headingTag : 'h3';
	const safeNumberStyle = numberStyle === 'square' ? 'square' : 'circle';

	const pad = {
		top: parseInt(stepPadding?.top, 10) || 0,
		right: parseInt(stepPadding?.right, 10) || 0,
		bottom: parseInt(stepPadding?.bottom, 10) || 0,
		left: parseInt(stepPadding?.left, 10) || 0,
	};

	const wrapperStyle = {
		'--bb-howto-step-spacing': `${parseInt(stepSpacing, 10) || 0}px`,
		'--bb-howto-number-bg': numberBg || '#2563eb',
		'--bb-howto-number-color': numberColor || '#ffffff',
		'--bb-howto-number-size': `${parseInt(numberSize, 10) || 36}px`,
		'--bb-howto-connector-color': connectorColor || '#dee2e6',
		'--bb-howto-step-title-color': stepTitleColor || '#212529',
		'--bb-howto-step-title-font-size': `${parseInt(stepTitleFontSize, 10) || 17}px`,
		'--bb-howto-step-text-color': stepTextColor || '#495057',
		'--bb-howto-step-text-font-size': `${parseInt(stepTextFontSize, 10) || 15}px`,
		'--bb-howto-step-bg': stepBg || 'transparent',
		'--bb-howto-step-border-radius': `${parseInt(stepBorderRadius, 10) || 0}px`,
		'--bb-howto-step-padding': `${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px`,
		'--bb-howto-meta-color': metaColor || '#6c757d',
		'--bb-howto-meta-font-size': `${parseInt(metaFontSize, 10) || 14}px`,
	};

	const wrapperClasses = [
		'bb-howto-block',
		`bb-howto-number--${safeNumberStyle}`,
		showStepNumbers ? 'has-numbers' : 'no-numbers',
		showConnector ? 'has-connector' : 'no-connector',
	].join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const totalTimeHuman = humanizeIsoDuration(totalTime);

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
		const _key = `howto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		setAttributes({
			steps: [
				...steps,
				{ _key, name: '', text: '', imageUrl: '', imageAlt: '' },
			],
		});
	};

	const supplyValues = (Array.isArray(supply) ? supply : [])
		.map((row) => ((row && row.text) || '').toString().trim())
		.filter(Boolean);
	const toolValues = (Array.isArray(tool) ? tool : [])
		.map((row) => ((row && row.text) || '').toString().trim())
		.filter(Boolean);

	const showMeta = totalTimeHuman || supplyValues.length > 0 || toolValues.length > 0;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<section className='bb-howto'>
					<RichText
						tagName='h2'
						className='bb-howto__title'
						value={howtoName || ''}
						onChange={(val) => setAttributes({ howtoName: val })}
						placeholder={__('How to do it', 'b-blocks')}
						allowedFormats={[]}
					/>

					<RichText
						tagName='p'
						className='bb-howto__description-edit'
						value={description || ''}
						onChange={(val) => setAttributes({ description: val })}
						placeholder={__('Optional introduction…', 'b-blocks')}
						allowedFormats={['core/bold', 'core/italic']}
					/>

					{showMeta && (
						<div className='bb-howto__meta'>
							{totalTimeHuman && (
								<div className='bb-howto__meta-group bb-howto__meta-group--time'>
									<strong>{__('Total time:', 'b-blocks')}</strong>
									<span>{totalTimeHuman}</span>
								</div>
							)}
							{supplyValues.length > 0 && (
								<div className='bb-howto__meta-group bb-howto__meta-group--supply'>
									<strong>{__('Supplies:', 'b-blocks')}</strong>
									<ul className='bb-howto__meta-list'>
										{supplyValues.map((s, i) => (
											<li key={i}>{s}</li>
										))}
									</ul>
								</div>
							)}
							{toolValues.length > 0 && (
								<div className='bb-howto__meta-group bb-howto__meta-group--tools'>
									<strong>{__('Tools:', 'b-blocks')}</strong>
									<ul className='bb-howto__meta-list'>
										{toolValues.map((t, i) => (
											<li key={i}>{t}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}

					{steps.length === 0 ? (
						<p className='bb-howto__empty'>
							{__('No steps yet. Add the first one below.', 'b-blocks')}
						</p>
					) : (
						<ol className='bb-howto__steps'>
							{steps.map((step, idx) => {
								const stepNumber = idx + 1;
								const titleEl = createElement(
									RichText,
									{
										tagName: safeTag,
										className: 'bb-howto-step__title',
										value: (step && step.name) || '',
										onChange: (val) => updateStep(idx, 'name', val),
										placeholder: __('Step title', 'b-blocks'),
										allowedFormats: [],
									}
								);

								return (
									<li key={(step && step._key) || idx} className='bb-howto-step'>
										{showStepNumbers && (
											<span className='bb-howto-step__number' aria-hidden='true'>
												{stepNumber}
											</span>
										)}
										<div className='bb-howto-step__body'>
											{titleEl}

											{(step && step.imageUrl) && (
												<div className='bb-howto-step__image'>
													<img
														src={step.imageUrl}
														alt={(step && step.imageAlt) || ''}
													/>
												</div>
											)}

											<RichText
												tagName='div'
												className='bb-howto-step__text'
												value={(step && step.text) || ''}
												onChange={(val) => updateStep(idx, 'text', val)}
												placeholder={__('Describe this step…', 'b-blocks')}
												allowedFormats={['core/bold', 'core/italic', 'core/link']}
											/>

											<div className='bb-howto-editor-step-actions'>
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

					<div className='bb-howto-editor-add-step'>
						<Button variant='secondary' onClick={addStep} icon='plus'>
							{__('Add Step', 'b-blocks')}
						</Button>
					</div>
				</section>
			</div>
		</>
	);
};

export default Edit;
