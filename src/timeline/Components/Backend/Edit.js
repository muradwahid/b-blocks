import { InnerBlocks, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useSelect, withSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import Style from '../Common/Style';
import { attachLine } from '../Common/measureLine';
import { trackProgress } from '../Common/progress';
import Settings from './Settings/Settings';
import { getTimelineClasses, withTimelineDefaults } from '../../utils/functions';
import { allowedBlocks, template } from '../../utils/options';

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;

	const resolved = withTimelineDefaults(attributes);
	const { layout, connector, marker } = resolved;

	const isPremium = bBlocksPremiumChecker;
	const updateObj = updateAttributes(attributes, setAttributes);

	const blockProps = useBlockProps({ className: getTimelineClasses(resolved) });

	const entrySignature = useSelect(
		(select) => {
			const { getBlockOrder, getBlockAttributes } = select('core/block-editor');

			return getBlockOrder(clientId)
				.map((id) => {
					const item = getBlockAttributes(id)?.item;
					return `${item?.side || ''}.${item?.arrowAlign || ''}`;
				})
				.join('|');
		},
		[clientId]
	);

	const itemsRef = useRef(null);

	useEffect(() => {
		if (!itemsRef.current) {
			return undefined;
		}

		return attachLine(itemsRef.current, {
			extent: connector.line.extent
		});
	}, [layout, connector, marker, entrySignature]);


	useEffect(() => {
		if (!connector.line.progress || !itemsRef.current) {
			return undefined;
		}

		return trackProgress(itemsRef.current);
	}, [connector.line.progress, entrySignature]);

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'b-blocks-timeline-items' },
		{
			allowedBlocks,
			template,
			templateLock: false,
			orientation: 'vertical',
			renderAppender: InnerBlocks.ButtonBlockAppender
		}
	);

	return <>
		<Settings {...{ attributes: resolved, setAttributes, updateObj, isPremium, device }} />

		<div {...blockProps}>
			<Style attributes={resolved} id={`block-${clientId}`} isBackend={true} />

			<div {...innerBlocksProps} ref={itemsRef} />
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
})(Edit);