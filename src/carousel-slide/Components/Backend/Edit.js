import Style from '../Common/Style';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { withDispatch, withSelect } from '@wordpress/data';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'
import 'swiper/css/scrollbar';
import { Dashicon } from '@wordpress/components';
import { compose } from '@wordpress/compose';

const Edit = props => {
	const { attributes, clientId, innerBlocks, removeBlock } = props;

	return <>
		{/* <Settings {...{ attributes, setAttributes, updateObj }} /> */}

		<div {...useBlockProps({ className: 'swiper-slide'})}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<div className='bBlocksRemoveSlideWrapper' onClick={() => removeBlock(clientId)}>
				<Dashicon icon='no-alt' />
			</div>
			<InnerBlocks
				renderAppender={() => !innerBlocks?.length ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender />}
			/>
		</div>
	</>;
}
export default compose(withSelect((select, { clientId }) => {
	const { getBlocks } = select('core/block-editor');

	return {
		innerBlocks: getBlocks(clientId)
	}
}),
	withDispatch((dispatch) => {
		const { removeBlock } = dispatch("core/block-editor");
		return {removeBlock };
	})
)(Edit);