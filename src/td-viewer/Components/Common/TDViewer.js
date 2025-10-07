import { forwardRef } from 'react';

import { prefix } from '../../utils/data';

const TDViewer = ({ attributes }, ref) => {
	const { sourceType, model, modelLink, isTouchMove, isZoom, loadingType } = attributes;

	const touchProps = isTouchMove ? { 'camera-controls': '' } : {};
	const zoomProps = isZoom ? {} : { 'disable-zoom': '' };

	return <div className={prefix} ref={ref}>
		<model-viewer
			src={'upload' === sourceType ? model?.url : modelLink}
			alt={'upload' === sourceType ? model?.title : ''}
			loading={loadingType}
			auto-rotate
			{...touchProps}
			{...zoomProps}
		></model-viewer>
	</div>
}
export default forwardRef(TDViewer);