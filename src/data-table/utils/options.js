import { __ } from "@wordpress/i18n";
import { alignCenter, alignLeft, alignRight, banIcon, imageFillIcon, panelStarIcon } from './icons';

export const generalStyleTabs = [
  { name: "general", title: __("General", "b-blocks") },
  { name: "style", title: __("Style", "b-blocks") },
  { name: "advanced", title: __("Advanced", "b-blocks") },
];

export const headerOptions = {
  id: 0,
  clName: "Table Header",
  clSpan: "0",
  enableIcon: false,
  icon: "",
  image: "",
  iconType: "none",
  size: 20,
  toggle: false,
};
export const newColumn = {
  clSpan: 1,
  contentType: "edit",
  rowSpan: 1,
  icon: "",
  text: "",
  link: "",
  toggle: false,
};

export const borderOptions = [
  { label: "Default", value: "default" },
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
  { label: "Double", value: "double" },
  { label: "Groove", value: "groove" },
];
export const headerAlignOptions = [
  { label: "None", icon: banIcon, value: "none" },
  { label: "Icon", icon: panelStarIcon, value: "icon" },
  { label: "Image", icon: imageFillIcon, value: "image" },
];

export const alignmentOptions = [
  { label: "Left", icon: alignLeft, value: "left" },
  { label: "Center", icon: alignCenter, value: "center" },
  { label: "Right", icon: alignRight, value: "right" },
];