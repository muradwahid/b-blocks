import { __ } from "@wordpress/i18n";
import arrows from "./arrows";
export const generalStyleTabs = [
  { name: "general", title: __("General", "b-blocks") },
  { name: "style", title: __("Style", "b-blocks") },
  { name: "advanced", title: __("Advanced", "b-blocks") },
];

export const arrowStyles = [
  {
    label: __("Style 1", "b-blocks"),
    value: "style1",
    icon: arrows["style1"].right,
  },
  {
    label: __("Style 2", "b-blocks"),
    value: "style2",
    icon: arrows["style2"].right,
  },
  {
    label: __("Style 3", "b-blocks"),
    value: "style3",
    icon: arrows["style3"].right,
  },
  {
    label: __("Style 4", "b-blocks"),
    value: "style4",
    icon: arrows["style4"].right,
  },
  {
    label: __("Style 5", "b-blocks"),
    value: "style5",
    icon: arrows["style5"].right,
  },
  {
    label: __("Style 6", "b-blocks"),
    value: "style6",
    icon: arrows["style6"].right,
  },
];

export const animationEffectOptions = [
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
]

export const slideDirectionOptions = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
]