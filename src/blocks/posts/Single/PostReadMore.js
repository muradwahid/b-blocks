const PostReadMore = props => {
    const { atts: { isReadMore, readMoreLabel, isLinkNewTab, readMoreAlign, readMoreFontSize, readMoreTransform, readMoreColor, readMoreHovColor }, post: { link } } = props;

    const readMoreHov = e => e.target.style.color = readMoreHovColor;
    const readMoreHovLeave = e => e.target.style.color = readMoreColor;

    return (
        'true' == isReadMore ? <div className={`bBlocksPostReadMore text-${readMoreAlign}`}>
            <a href={link} className={`fontSize-${readMoreFontSize} ttr-${readMoreTransform}`} target={'true' == isLinkNewTab ? '_blank' : '_self'} rel='noreferrer noopener' style={{ color: readMoreColor }} onMouseEnter={readMoreHov} onMouseLeave={readMoreHovLeave}>{readMoreLabel}</a>
        </div> : null
    );
};
export default PostReadMore;