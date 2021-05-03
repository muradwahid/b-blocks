// Import Sass
import './style.scss';

const allBtnGroups = document.querySelectorAll('.wp-block-b-blocks-button-group');
Object.values(allBtnGroups).map(btnGroup => {
    const btnGroupId = btnGroup.id;

    const btnGroupData = document.getElementById(`${btnGroupId}`);
    const { btnOneColor, btnOneBGColor, btnOneHovColor, btnOneHovBGColor, btnTwoColor, btnTwoBGColor, btnTwoHovColor, btnTwoHovBGColor } = JSON.parse(btnGroupData.dataset.colors);

    const btnOne = document.querySelector(`#${btnGroupId} .btnOne`);
    btnOne.addEventListener('mouseenter', e => {
        e.target.style.color = btnOneHovColor;
        e.target.style.backgroundColor = btnOneHovBGColor;
    });
    btnOne.addEventListener('mouseleave', e => {
        e.target.style.color = btnOneColor;
        e.target.style.backgroundColor = btnOneBGColor;
    });

    const btnTwo = document.querySelector(`#${btnGroupId} .btnTwo`);
    btnTwo.addEventListener('mouseenter', e => {
        e.target.style.color = btnTwoHovColor;
        e.target.style.backgroundColor = btnTwoHovBGColor;
    });
    btnTwo.addEventListener('mouseleave', e => {
        e.target.style.color = btnTwoColor;
        e.target.style.backgroundColor = btnTwoBGColor;
    });
});