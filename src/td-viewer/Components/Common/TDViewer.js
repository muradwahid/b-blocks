import { forwardRef } from 'react';

import { prefix } from '../../utils/data';

const TDViewer = ({ attributes }, ref) => {
	const { sourceType, model, modelLink, loadingType } = attributes;

	return <div className={prefix} ref={ref}>
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