// Import Sass
import './style.scss';

const allFlipBoxes = document.querySelectorAll('.wp-block-b-blocks-flip-box');
Object.values(allFlipBoxes).map(btnGroup => {
    const flipBoxId = btnGroup.id;

    const flipBoxData = document.getElementById(`${flipBoxId}`);
    const { btnColor, btnBGColor, btnHovColor, btnHovBGColor } = JSON.parse(flipBoxData.dataset.colors);

    const btn = document.querySelector(`#${flipBoxId} .flipBtn`);
    btn.addEventListener('mouseenter', e => {
        e.target.style.color = btnHovColor;
        e.target.style.backgroundColor = btnHovBGColor;
    });
    btn.addEventListener('mouseleave', e => {
        e.target.style.color = btnColor;
        e.target.style.backgroundColor = btnBGColor;
    });
});