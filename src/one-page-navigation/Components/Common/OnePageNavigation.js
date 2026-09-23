import { forwardRef } from 'react';

import { prefix } from '../../utils/data';
import { cleanSectionId, getWrapperClasses, stepNumber, usesTooltip } from '../../utils/options';

const ItemIcon = ({ icon = {}, label }) => {
	const { type = 'icon', icon: library = '', img = {}, url = '', alt = '', svg = '' } = icon;

	if ('none' === type) return null;

	if ('image' === type) {
		const media = 'string' === typeof img ? { url: img } : img || {};
		const src = media.url || url;

		return src ? <span className={`${prefix}-icon is-image`}><img src={src} alt={media.alt || alt || label || ''} /></span> : null;
	}

	const markup = 'svg' === type ? svg : library;

	return markup ? <span className={`${prefix}-icon is-${'svg' === type ? 'svg' : 'icon'}`} dangerouslySetInnerHTML={{ __html: markup }} /> : null;
};

const ProgressRing = () => <svg className={`${prefix}-ring`} viewBox='0 0 24 24' aria-hidden='true'>
	<circle className={`${prefix}-ring-track`} cx='12' cy='12' r='9' />
	<circle className={`${prefix}-ring-bar`} cx='12' cy='12' r='9' pathLength='100' />
</svg>;

const OnePageNavigation = forwardRef(({ attributes, isBackend = false }, ref = null) => {
	const { items = [], layout = {}, behavior = {}, media = {} } = attributes;
	const preset = layout.preset || 'glassBullseye';
	const showLabel = !usesTooltip(preset);

	const showNumber = 'numberedSteps' === preset && !media.showIcon;

	return <div
		ref={ref}
		className={getWrapperClasses(attributes)}
		role='navigation'
		aria-label={'Page sections'}
		data-preset={preset}
		data-spy={behavior.scrollSpy ? '1' : '0'}
		data-smooth={behavior.smoothScroll ? '1' : '0'}
		data-hide-missing={behavior.hideMissingSections ? '1' : '0'}
		data-speed={parseInt(behavior.scrollSpeed, 10) || 0}
		data-offset={parseInt(behavior?.desktop?.scrollOffset, 10) || 0}
		data-offset-tablet={behavior?.tablet?.scrollOffset ?? ''}
		data-offset-mobile={behavior?.mobile?.scrollOffset ?? ''}
	>
		{'magneticBubble' === preset && <span className={`${prefix}-bubble`} aria-hidden='true' />}

		<ul className={`${prefix}-list`}>
			{items.map((item, index) => {
				const sectionId = cleanSectionId(item.sectionId);
				const href = sectionId ? `#${sectionId}` : undefined;

				const Tag = isBackend ? 'button' : 'a';

				return <li
					className={`${prefix}-item${sectionId ? '' : ' is-unlinked'}`}
					key={item.id || index}
					data-target={sectionId}
				>
					<Tag
						className={`${prefix}-link`}
						{...(isBackend ? { type: 'button' } : { href })}
						aria-label={item.label || undefined}
					>
						<span className={`${prefix}-marker`}>
							{showNumber && <span className={`${prefix}-number`}>{stepNumber(index)}</span>}

							{!showNumber && <ItemIcon icon={item.icon} label={item.label} />}

							{'glassBullseye' === preset && <ProgressRing />}
						</span>

						<span className={showLabel ? `${prefix}-label` : `${prefix}-label ${prefix}-tooltip`}>
							{item.label}
						</span>
					</Tag>

					{isBackend && !sectionId && <span className={`${prefix}-warning`}>
						No section chosen — this item is hidden on the front end.
					</span>}

				</li>;
			})}
		</ul>
	</div>;
});

OnePageNavigation.displayName = 'OnePageNavigation';

export default OnePageNavigation;