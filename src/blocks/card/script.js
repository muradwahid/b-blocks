// Import Sass
import './style.scss';

// Codes for deprecated v1
// Card Image Size
const cardImg = document.querySelectorAll('.b_blocks_card .card .vertical_card img');
cardImg.length && cardImg.forEach(im => {
    im.currentSrc ? im.style.height = `${(im.clientWidth / 16) * 9}px` : null;
});