import { isValidCSS } from "../../../../../../bpl-tools/utils/getCSS";
const ListStyle = ({ attributes, id }) => {
  const { sticky, slideTitle, slideList, boxList } = attributes;
  const blockWrapper = `#${id}`;
  const listBlWrapper = `${blockWrapper} .tbcn-list-container`;
  const titleWrapper = `${listBlWrapper} .tbcn-list-title`;
  const title = `${titleWrapper} .tbcn-list-title-heading`;
  const listItems = `${listBlWrapper} .tbcn-list-items`;
  const list = `${listItems} .tbcn-list-item`;

  return (
    <style>
      {`
${title}{
  padding-top:${slideTitle.space.desktop};
  padding-bottom:${slideTitle.spaceBottom.desktop};
}
${list}{
  margin-bottom:${slideList.space.desktop};
}
${list}>a::before{
  background-color:${boxList.nBarColor ? boxList.nBarColor : "#ccc"} !important;
}
${list} a.item-active::before{
  background-color:${boxList.hBarColor} !important;
}
${list}>a:hover::before{
  background: ${boxList.hBarColor} !important;
}
${list}>a{
  color:${boxList.nTxtColor};
  font-size:${slideList.fontSize.desktop}
}
${list}>a:hover {
  color: ${boxList.hTxtColor} !important;
}
${list} a.item-active{
  color: ${boxList.hTxtColor} !important;
}
${listBlWrapper}.sticky {
  ${isValidCSS("width", sticky.width.desktop)}
  z-index: ${sticky.zIndex.desktop} !important;
  position:fixed;
}

${["left", "right"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
  ${val}:${sticky[val].desktop};
}`
          )
          .join("")}

${["top", "bottom"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].desktop}
}`
          )
          .join("")}
${sticky.verticalAlign === "center" ? `${listBlWrapper}.sticky.center{top:50%;  transform: translateY(-50%)}` : null}

@media screen and (min-width: 1024px) {
${title}{
  padding-top:${slideTitle.space.desktop};
  padding-bottom:${slideTitle.spaceBottom.desktop}
}
${list}{
  margin-bottom:${slideList.space.desktop};
}
${list}>a{
  font-size:${slideList.fontSize.desktop}
}

${listBlWrapper}.sticky {
  z-index: ${sticky.zIndex.desktop} !important;
  position:${sticky?.device.includes("Desktop") ? "fixed" : "initial"};
}

${["left", "right"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].desktop};
}`
          )
          .join("")}

${["top", "bottom"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].desktop}
}`
          )
          .join("")}

${sticky.verticalAlign === "center" ? `${listBlWrapper}.sticky.center{top:50%;  transform: translateY(-50%)}` : null}

}
@media only screen and (min-width:641px) and (max-width: 1024px) {

${title}{
  padding-top:${slideTitle.space.tablet};
  padding-bottom:${slideTitle.spaceBottom.tablet}
}
${list}{
  margin-bottom:${slideList.space.tablet};
}
${list}>a{
  font-size:${slideList.fontSize.tablet}
}
${listBlWrapper}.sticky {
  ${isValidCSS("width", sticky.width.tablet)}
  z-index: ${sticky.zIndex.tablet} !important;
  position:${sticky?.device.includes("Tablet") ? "fixed" : "initial"};
}
${["left", "right"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].tablet};
}`
          )
          .join("")}
${["top", "bottom"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].tablet}
}`
          )
          .join("")}

${sticky.verticalAlign === "center" ? `${listBlWrapper}.sticky.center{top:50%;  transform: translateY(-50%)}` : null}

}
@media only screen and (max-width: 640px) {
${title}{
  padding-top:${slideTitle.space.mobile};
  padding-bottom:${slideTitle.spaceBottom.mobile};
}
${list}{
  margin-bottom:${slideList.space.mobile};
}
${list}>a{
  font-size:${slideList.fontSize.mobile}
}
${listBlWrapper}.sticky {
  ${isValidCSS("width", sticky.width.mobile)}
  z-index: ${sticky.zIndex.mobile} !important;
  position:${sticky?.device.includes("Mobile") ? "fixed" : "initial"};
}

${["left", "right"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].mobile};
}`
          )
          .join("")}
${["top", "bottom"]
          .map(
            (val) => `${listBlWrapper}.sticky.${val}{
${val}:${sticky[val].mobile}
}`
          )
          .join("")}

${sticky.verticalAlign === "center" ? `${listBlWrapper}.sticky.center{top:50%;  transform: translateY(-50%)}` : null}
}
`}
    </style>
  );
};

export default ListStyle;
