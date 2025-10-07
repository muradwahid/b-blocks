import { AngleDown, AnglesDown, CaretDown, ChevronDown, CircleChevronDown, SquareCaretDown, SquareCaretStrokeDown } from "./icons";

export const bullets = [
    {
        label: "Circle",
        value: "fa-solid fa-circle",
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" /></svg>
    },
    {
        label: "Dot Circle",
        value: "fa-solid fa-circle-dot",
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-352a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
    },
    {
        label: "Squire",
        value: "fa-solid fa-square-full",
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0H512V512H0V0z" /></svg>
    },
    {
        label: "Circle",
        value: "fa-regular fa-circle",
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" /></svg>
    },
    {
        label: "Dot Circle",
        value: "fa-regular fa-circle-dot",
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" /></svg>
    },
];

export const expandIcons = [
    {
        label: "Chevron Down",
        value: "fa-solid fa-chevron-down",
        icon: <ChevronDown />
    },
    {
        label: "Circle Chevron Down",
        value: "fa-solid fa-circle-chevron-down",
        icon: <CircleChevronDown />
    },
    {
        label: "Angel Down",
        value: "fa-solid fa-angle-down",
        icon: <AngleDown />
    },
    {
        label: "Angel Double Down",
        value: "fa-solid fa-angles-down",
        icon: <AnglesDown />
    },
    {
        label: "Caret Down",
        value: "fa-solid fa-caret-down",
        icon: <CaretDown />
    },
    {
        label: "Squire Caret Down",
        value: "fa-solid fa-square-caret-down",
        icon: <SquareCaretDown />
    },
    {
        label: "Squire Caret Down",
        value: "fa-regular fa-square-caret-down",
        icon: <SquareCaretStrokeDown />
    },
]

export const collapseIcons = [
    {
        label: "Chevron Up",
        value: "fa-solid fa-chevron-up",
        icon: <ChevronDown className="tbcnb-rotate180deg" />
    },
    {
        label: "Circle Chevron Up",
        value: "fa-solid fa-circle-chevron-up",
        icon: <CircleChevronDown className="tbcnb-rotate180deg" />
    },
    {
        label: "Angel Up",
        value: "fa-solid fa-angle-up",
        icon: <AngleDown className="tbcnb-rotate180deg" />
    },
    {
        label: "Angel Double Up",
        value: "fa-solid fa-angles-up",
        icon: <AnglesDown className="tbcnb-rotate180deg" />
    },
    {
        label: "Caret Up",
        value: "fa-solid fa-caret-up",
        icon: <CaretDown className="tbcnb-rotate180deg" />
    },
    {
        label: "Squire Caret Up",
        value: "fa-solid fa-square-caret-up",
        icon: <SquareCaretDown className="tbcnb-rotate180deg" />
    },
    {
        label: "Squire Caret Up",
        value: "fa-regular fa-square-caret-up",
        icon: <SquareCaretStrokeDown className="tbcnb-rotate180deg" />
    },
];