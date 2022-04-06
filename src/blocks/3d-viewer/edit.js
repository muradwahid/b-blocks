import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';

import Settings from './settings';

const Edit = props => {
	const { className, attributes: { alignment, sourceType, model, modelLink, width, height, isTouchMove, isZoom, loadingType }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const bBlocks3DViewer = useRef(null);

	const toggleAttr = (selector, condition, attribute, value) => {
		condition && selector?.setAttribute(attribute, value);
		!condition && selector?.removeAttribute(attribute, value);
	}

	useEffect(() => {
		bBlocks3DViewer.current.innerHTML = '';

		const reInitModel = document.createElement('model-viewer');
		toggleAttr(reInitModel, true, 'class', 'bBlocksModel');
		toggleAttr(reInitModel, true, 'src', 'upload' === sourceType ? model?.url : modelLink);
		toggleAttr(reInitModel, true, 'alt', 'upload' === sourceType ? model?.title : '');
		toggleAttr(reInitModel, isTouchMove, 'camera-controls', '');
		toggleAttr(reInitModel, !isZoom, 'disable-zoom', '');
		toggleAttr(reInitModel, true, 'loading', loadingType);
		toggleAttr(reInitModel, true, 'auto-rotate', '');

		bBlocks3DViewer.current.appendChild(reInitModel);
	}, [sourceType, model, modelLink, isTouchMove, isZoom, loadingType]);

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} />

		<div className={className} id={`bBlocks3DViewer-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#bBlocks3DViewer-${clientId} .bBlocks3DViewer{
					text-align: ${alignment};
				}
				#bBlocks3DViewer-${clientId} .bBlocks3DViewer .bBlocksModel{
					width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
					height: ${'0px' === height || '0%' === height || '0em' === height ? '350px' : height};
				}
			`}} />

			{'upload' === sourceType && !model.url ? <p className='noModel'>{__('Please, upload Model or enter Model Link first!', '3d-viewer-block')}</p> : ''}

			<div className='bBlocks3DViewer' ref={bBlocks3DViewer}>
				<model-viewer
					className='bBlocksModel'
					src={'upload' === sourceType ? model?.url : modelLink}
					alt={'upload' === sourceType ? model?.title : ''}
					camera-controls
					loading={loadingType}
					auto-rotate
				></model-viewer>
			</div>
		</div >
	</>;
};
export default Edit;