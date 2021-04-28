// import Sass
import './style.scss';

// Import Blocks
import './blocks/price-list/script';
import './blocks/feature-box/script';
import './blocks/info-box/script';


// ; (function ($) {
//     $(document).ready(function () {
//         const scrollbarWidth = window.innerWidth - document.body.clientWidth;

//         $('.alignfull').css({
//             'width': `calc(100vw - ${scrollbarWidth}px)`,
//             'max-width': `calc(100vw - ${scrollbarWidth}px)`,
//             'margin': `0 calc(-50vw + 50% + ${scrollbarWidth / 2}px)`
//         });
//     });
// })(jQuery);

// Card Image Size
const cardImg = document.querySelectorAll('.b_blocks_card .card .vertical_card img');
cardImg.length && cardImg.forEach(im => {
    im.currentSrc ? im.style.height = `${(im.clientWidth / 16) * 9}px` : null;
});