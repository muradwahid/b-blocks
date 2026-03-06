import { createRoot } from 'react-dom/client';
import Carousel from './Components/Frontend/Carousel';
import './style.scss';
import Style from './Components/Common/Style';
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.wp-block-b-blocks-carousel[data-attributes]');
    carousels.forEach((carousel) => {
        let attributes = {};
        try {
            const raw = carousel.dataset.attributes;
            if (raw && raw !== 'undefined' && raw !== '') {
                attributes = JSON.parse(raw);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Carousel: Invalid attributes JSON', e);
        }
        const slidesHost = carousel.querySelector('.crb-carousel-slides');
        if (!slidesHost) return;

        createRoot(carousel).render(<>
            <Style attributes={attributes} id={carousel.id} />
        <Carousel attributes={attributes} slidesHost={slidesHost} />
        </>
        );

        carousel.removeAttribute('data-attributes');
    });
});
