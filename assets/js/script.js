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

// Posts Image Size
const postFImage = document.querySelectorAll('.b_blocks_grid_posts .b_blocks_article .feature_img img');
postFImage.length && postFImage.forEach(im => {
    im ? im.style.height = `${(im.clientWidth / 16) * 9}px` : null;
});

// Card Image Size
const cardImg = document.querySelectorAll('.b_blocks_card .card .vertical_card img');
cardImg.length && cardImg.forEach(im => {
    im.currentSrc ? im.style.height = `${(im.clientWidth / 16) * 9}px` : null;
});