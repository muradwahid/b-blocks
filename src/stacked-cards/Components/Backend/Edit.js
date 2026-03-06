import { useState } from 'react';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { template } from '../../utils/template';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;

	const [activeIndex, setActiveIndex] = useState(0);

	const updateObj = updateAttributes(attributes, setAttributes);
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'b-blocksStackedCards' },
		{
			template,
			templateLock: false,
			renderAppender: false,
		}
	);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, activeIndex, setActiveIndex,clientId,device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<div>
				<div className="b-blocks-stackedCardsMainWrapper">
					<div className='b-blocksStackedCardsWrapper' {...innerBlocksProps} />
				</div>
			</div>
		</div>
	</>;
}
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);