// Import Sass
import './style.scss';

let fImag = document.querySelectorAll('.bBlocksPostArticle .bBlocksPostFImg');
fImag.length && fImag.forEach(im => {
    im ? im.style.minHeight = `${im.clientWidth * .6}px` : null;
});