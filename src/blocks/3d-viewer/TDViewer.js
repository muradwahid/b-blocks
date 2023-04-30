import { forwardRef } from 'react';

const TDViewer = ({ attributes }, ref) => {
	const { sourceType, model, modelLink, loadingType } = attributes;

	return <div className='bBlocks3DViewer' ref={ref}>
		<model-viewer
			src={'upload' === sourceType ? model?.url : modelLink}
			alt={'upload' === sourceType ? model?.title : ''}
			camera-controls
			loading={loadingType}
			auto-rotate
		></model-viewer>
	</div>
}
export default forwardRef(TDViewer);