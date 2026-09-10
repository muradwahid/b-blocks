import { useEffect, useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import Infographic from '../Common/Infographic';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { blockId } = attributes;

	const [activeIndex, setActiveIndex] = useState(0);

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;

	const updateObj = updateAttributes(attributes, setAttributes);

	// Derived from clientId, so a duplicated block gets a fresh id instead of
	// sharing the original's scoped CSS. render.php builds the frontend id from it.
	const uniqueId = clientId.slice(0, 12);

	useEffect(() => {
		blockId !== uniqueId && setAttributes({ blockId: uniqueId });
	}, [uniqueId]);

	// The editor id is not ours to choose: useBlockProps applies its own after
	// spreading, dropping anything passed in. This is the only selector that
	// matches on the canvas.
	const id = `block-${clientId}`;

	// Top level, so a future early return cannot break the hook order.
	const blockProps = useBlockProps();

	return <>
		<Settings {...{ ...props, updateObj, isPremium, activeIndex, setActiveIndex }} />

		<div {...blockProps}>
			<Style attributes={attributes} id={id} isBackend={true} />

			<div>
				<Infographic attributes={attributes} isBackend={true} custom={{ activeIndex, setActiveIndex }} />
			</div>
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	};
})(Edit);