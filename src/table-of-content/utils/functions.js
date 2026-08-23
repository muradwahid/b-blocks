export const headingTree = (headings) => {
    const root = [];
    const stack = [{ level: 0, children: root }];

    headings.forEach((heading) => {
        const level = parseInt(heading.tag.replace('H', ''), 10);

        const node = { ...heading, children: [] };
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }
        stack[stack.length - 1].children.push(node);
        stack.push({ level, children: node.children });
    });

    return root;
};