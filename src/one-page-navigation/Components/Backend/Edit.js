import { useEffect, useRef } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import { useCanvasNavigation, useUnresolvedSections } from '../../utils/hooks';
import { getBlockClasses } from '../../utils/options';
import OnePageNavigation from '../Common/OnePageNavigation';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { blockId, layout = {}, items = [] } = attributes;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;

	const updateObj = updateAttributes(attributes, setAttributes);

	const host = useRef(null);

	const unresolved = useUnresolvedSections(items, host);

	const uniqueId = clientId.slice(0, 12);

	useEffect(() => {
		blockId !== uniqueId && setAttributes({ blockId: uniqueId });
	}, [uniqueId]);

	useCanvasNavigation(host, JSON.stringify([items.map((i) => i.sectionId), layout.preset, layout.desktop, attributes.behavior]));

	const id = `block-${clientId}`;

	const blockProps = useBlockProps({ className: getBlockClasses(attributes) });

	return <>
		<Settings {...{ ...props, updateObj, isPremium, unresolved }} />

		<div {...blockProps}>
			<Style attributes={attributes} id={id} isBackend={true} />

			<OnePageNavigation ref={host} attributes={attributes} isBackend={true} />
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	};
})(Edit);
