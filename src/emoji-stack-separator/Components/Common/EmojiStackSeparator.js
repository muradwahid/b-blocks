import { useEffect, useRef } from 'react';

const EmojiStackSeparator = ({ attributes }) => {
    const { emoji, height, align, emojiSize, density, animationStyle } = attributes;
    const stackRef = useRef(null);

    useEffect(() => {
        if (stackRef.current) {
            const timer = setTimeout(() => {
                generateEmojiStack(stackRef.current, emoji, height, emojiSize, density);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [emoji, height, align, emojiSize, density]);

    const getSizeConfig = (size) => {
        const configs = {
            small: { fontSize: 2.5, overlap: -1.0 },
            medium: { fontSize: 3.75, overlap: -1.4 },
            large: { fontSize: 5, overlap: -1.8 },
            xlarge: { fontSize: 6.5, overlap: -2.3 }
        };
        return configs[size] || configs.medium;
    };

    const getDensityConfig = (densityValue) => {
        const configs = {
            sparse: { overlapFactor: 0.5, rowMargin: -2, emojisExtra: 2 },
            normal: { overlapFactor: 0.65, rowMargin: -3, emojisExtra: 4 },
            dense: { overlapFactor: 0.75, rowMargin: -3.5, emojisExtra: 6 }
        };
        return configs[densityValue] || configs.normal;
    };

    const generateEmojiStack = (container, emojiChar, stackHeight, size, densityValue) => {
        container.innerHTML = '';

        const sizeConfig = getSizeConfig(size);
        const densityConfig = getDensityConfig(densityValue);

        const containerWidth = container.offsetWidth;
        const emojiSize = 60;
        const numRows = 4;

        const emojisPerRow = Math.ceil(containerWidth / (emojiSize * densityConfig.overlapFactor)) + densityConfig.emojisExtra;

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('div');
            row.className = 'b-blocks-emoji-stack-iemoji-row';

            if (i > 0) {
                row.style.marginTop = `${densityConfig.rowMargin}rem`;
            }

            for (let j = 0; j < emojisPerRow; j++) {
                const em = document.createElement('span');
                em.textContent = emojiChar;
                em.className = 'b-blocks-emoji-stack-item';

                const randomRotation = Math.random() * 60 - 30;
                const randomTranslateY = Math.random() * 20 - 10;

                em.style.fontSize = `${sizeConfig.fontSize}rem`;
                em.style.marginRight = `${sizeConfig.overlap}rem`;
                em.style.setProperty('--b-blocks-emoji-stack-separator-rotation', `${randomRotation}deg`);
                em.style.setProperty('--b-blocks-emoji-stack-separator-index', j);
                em.style.transform = `rotate(${randomRotation}deg) translateY(${randomTranslateY}px)`;

                row.appendChild(em);
            }

            container.appendChild(row);
        }
    };


    return <div className={`b-blocks-emoji-stack-separator-container ${animationStyle ? `b-blocks-emoji-stack-separator-animation-${animationStyle}` : ''}`}>
        <div ref={stackRef} className="b-blocks-emoji-stack-container" />
    </div>
}

export default EmojiStackSeparator;