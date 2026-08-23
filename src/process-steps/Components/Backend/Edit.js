import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import { TITLE_TAGS, getWrapperClasses } from '../../utils/options';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;
	const { steps = [], badge = {}, content = {} } = attributes;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	const safeTitleTag = TITLE_TAGS.includes(content.titleTag) ? content.titleTag : 'h3';
	const safeBadgeType = badge.type === 'icon' ? 'icon' : 'number';

	const updateStep = (index, key, next) => {
		setAttributes({
			steps: steps.map((row, i) => (i === index ? { ...(row || {}), [key]: next } : row)),
		});
	};

	const removeStep = (index) => {
		setAttributes({ steps: steps.filter((_, i) => i !== index) });
	};

	const moveStep = (from, to) => {
		if (to < 0 || to >= steps.length) return;
		const copy = steps.slice();
		const [moved] = copy.splice(from, 1);
		copy.splice(to, 0, moved);
		setAttributes({ steps: copy });
	};

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, isPremium, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

			<div className={getWrapperClasses(attributes)}>
				{steps.length === 0 ? (
					<p className='bBlocksProcessStepsEmpty'>
						{__('No steps yet. Add the first one from the sidebar.', 'b-blocks')}
					</p>
				) : (
					<ol className='bBlocksProcessStepsList' aria-label={__('Process steps', 'b-blocks')}>
						{steps.map((step, idx) => {
							const TitleTag = safeTitleTag;

							return <li key={(step && step._key) || idx} className='bBlocksProcessStepsItem'>
								<div className='bBlocksProcessStepsBadge' aria-hidden='true'>
									{safeBadgeType === 'icon' && step && step.icon ? (
										<span className='bBlocksProcessStepsIcon' dangerouslySetInnerHTML={{ __html: step.icon }} />
									) : (
										<span className='bBlocksProcessStepsNumber'>{idx + 1}</span>
									)}
								</div>

								<div className='bBlocksProcessStepsBody'>
									<RichText
										tagName={TitleTag}
										className='bBlocksProcessStepsTitle'
										value={(step && step.title) || ''}
										onChange={(val) => updateStep(idx, 'title', val)}
										placeholder={__('Step title', 'b-blocks')}
										allowedFormats={[]}
									/>

									<RichText
										tagName='div'
										className='bBlocksProcessStepsDescription'
										value={(step && step.description) || ''}
										onChange={(val) => updateStep(idx, 'description', val)}
										placeholder={__('Describe this step…', 'b-blocks')}
										allowedFormats={['core/bold', 'core/italic', 'core/link']}
									/>

									<div
										className='bBlocksProcessStepsEditorActions'
										style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}
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
							</li>;
						})}
					</ol>
				)}
			</div>
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);
