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
	const { attributes, setAttributes, innerBlocks, device } = props;
	const { shape, advanced } = attributes;
	const { top, bottom } = shape;

	const blockProps = useBlockProps();

	const { isPremium = false } = usePremiumInEditor();

	const ref = useRef();
	useAnimation(ref.current, advanced?.animation);

	return <div {...blockProps}>
		<Settings attributes={attributes} setAttributes={setAttributes} device={device} id={blockProps.id} isPremium={isPremium} />

		<div ref={ref}>
			<Style attributes={attributes} id={blockProps.id} isBackend={true} />

			<div className={prefix}>
				{!!top?.uploadSvg?.url || 'none' !== top?.type && <div className='shaped topShaped'>
					<SVGShape data={top} />
				</div>}

				<div className={`${prefix}Content`}>
					<InnerBlocks renderAppender={() => !innerBlocks?.length ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender />} />
				</div>

				{!!bottom?.uploadSvg?.url || 'none' !== bottom?.type ? <div className='shaped bottomShaped'>
					<SVGShape data={bottom} />
				</div> : null}
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