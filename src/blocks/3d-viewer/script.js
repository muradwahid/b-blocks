// import Sass
import './style.scss';

// 3D Viewer
document.addEventListener('DOMContentLoaded', () => {
    const allTDViewer = document.querySelectorAll('.wp-block-b-blocks-td-viewer');
    Object.values(allTDViewer).map(tDViewer => {
        const currentTDViewer = document.getElementById(`${tDViewer.id}`);
        const { isTouchMove, isZoom } = JSON.parse(currentTDViewer.dataset.model);

        const model = document.querySelector(`#${tDViewer.id} model-viewer`);

        const toggleAttr = (condition, attribute, value) => {
            condition && model?.setAttribute(attribute, value);
            !condition && model?.removeAttribute(attribute, value);
        }

        toggleAttr(isTouchMove, 'camera-controls', '');
        toggleAttr(!isZoom, 'disable-zoom', '');

        currentTDViewer.removeAttribute('data-controls');
    });
});