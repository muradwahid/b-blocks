import { __ } from '@wordpress/i18n';
import { Fragment } from 'react';

import { sanitizeHTML } from '../../../../../bpl-tools/utils/common';

import { TITLE_TAGS, getWrapperClasses } from '../../utils/options';

/**
 * Shared, read-only render of the Process Steps list. Used by view.js on the
 * frontend (React-hydrated from the wrapper's `data-attributes`). The editor
 * has its own editable canvas in Edit.js, but both produce the same
 * `.bBlocksProcessSteps > ol.bBlocksProcessStepsList` structure so styling stays identical.
 */
const stripTags = (html) => (html || '').toString().replace(/<[^>]*>/g, '').trim();

const ProcessSteps = ({ attributes }) => {
	const { steps = [], badge = {}, content = {} } = attributes;

	const safeTitleTag = TITLE_TAGS.includes(content.titleTag) ? content.titleTag : 'h3';
	const safeBadgeType = badge.type === 'icon' ? 'icon' : 'number';
	const TitleTag = safeTitleTag;

	const cleanSteps = (Array.isArray(steps) ? steps : []).filter((step) => {
		const title = (step?.title || '').toString().trim();
		const desc = stripTags(step?.description);
		return title !== '' || desc !== '';
	});

	return <div className={getWrapperClasses(attributes)}>
		{cleanSteps.length === 0 ? (
			<p className='bBlocksProcessStepsEmpty'>{__('No steps to display.', 'b-blocks')}</p>
		) : (
			<ol className='bBlocksProcessStepsList' aria-label={__('Process steps', 'b-blocks')}>
				{cleanSteps.map((step, idx) => <Fragment key={idx}>
					<li className='bBlocksProcessStepsItem'>
						<div className='bBlocksProcessStepsBadge' aria-hidden='true'>
							{safeBadgeType === 'icon' && step?.icon ? (
								<span className='bBlocksProcessStepsIcon' dangerouslySetInnerHTML={{ __html: step.icon }} />
							) : (
								<span className='bBlocksProcessStepsNumber'>{idx + 1}</span>
							)}
						</div>

						<div className='bBlocksProcessStepsBody'>
							{(step?.title || '').toString().trim() !== '' && (
								<TitleTag
									className='bBlocksProcessStepsTitle'
									dangerouslySetInnerHTML={{ __html: sanitizeHTML(step.title) }}
								/>
							)}

							{stripTags(step?.description) !== '' && (
								<div
									className='bBlocksProcessStepsDescription'
									dangerouslySetInnerHTML={{ __html: sanitizeHTML(step.description) }}
								/>
							)}
						</div>
					</li>
				</Fragment>)}
			</ol>
		)}
	</div>;
};

export default ProcessSteps;
