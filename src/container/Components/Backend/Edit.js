import { useRef } from 'react';
import { withSelect } from '@wordpress/data';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import useAnimation from '../../../../../bpl-tools/hooks/useAnimation';

import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import Settings from './Settings/Settings';
import Style from '../Common/Style';
import SVGShape from '../Common/SVGShape';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, innerBlocks, device } = props;
	const { shape, advanced } = attributes;
	const { top, bottom } = shape;

	const { isPremium = false } = usePremiumInEditor();
	const ref = useRef();
	useAnimation(ref.current, advanced?.animation);

	const id = `${prefix}-${clientId}`;


	return <div {...useBlockProps()}>
		<div className='wp-block-b-blocks-container' id={id} ref={ref}>
			<Settings attributes={attributes} setAttributes={setAttributes} device={device} id={id} isPremium={isPremium} />

			<Style attributes={attributes} id={id} />

			<div className={prefix}>
				{top?.uploadSvg?.url || 'none' !== top?.type && <div className='shaped topShaped'>
					<SVGShape data={top} />
				</div>}

				<div className={`${prefix}Content`}>
					<InnerBlocks renderAppender={() => !innerBlocks?.length ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender />} />
				</div>

				{bottom?.uploadSvg?.url || 'none' !== bottom?.type && <div className='shaped bottomShaped'>
					<SVGShape data={bottom} />
				</div>}
			</div>
		</div>
	</div>
}
export default withSelect((select, { clientId }) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks } = select('core/block-editor');

	return {
		innerBlocks: getBlocks(clientId),
		device: getDeviceType()?.toLowerCase()
	}
})(Edit);