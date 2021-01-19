const { registerFormatType, toggleFormat } = wp.richText;
const { RichTextToolbarButton } = wp.blockEditor;

// Icon
const underlineIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" fill="#4527a4" />
</svg>

const overLineIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M5 5h14V3H5v2m4.62 11L12 9.67L14.37 16M11 7L5.5 21h2.25l1.12-3h6.25l1.13 3h2.25L13 7h-2z" fill="#4527a4" />
</svg>

const allOptions = [
    { name: 'underline', title: 'Underline', icon: underlineIcon },
    { name: 'overline', title: 'Overline', icon: overLineIcon }
];

allOptions.forEach(({ name, title, icon }) => {
    const type = `b-blocks/text-${name}`;

    registerFormatType(type, {
        title,
        tagName: 'span',
        className: `b_blocks_text_${name}`,

        attributes: {
            style: 'style',
        },

        edit: ({ isActive, value, onChange }) => {
            const onToggle = () => {
                onChange(toggleFormat(value, {
                    type,
                    attributes: {
                        style: `text-decoration: ${name};`,
                    },
                }))
            }

            return [
                <RichTextToolbarButton icon={icon} title={title} onClick={onToggle} isActive={isActive} className="b_blocks_toolbar" />
            ];
        }
    });
});