const PostTitle = props => {
    const { atts: { contentAlign, isTitle, isTitleLink, titleFontSize, titleColor, titleMB, isLinkNewTab }, post: { link, title } } = props;

    return (
        'true' == isTitle ? <h2 className={`bBlocksPostTitle text-${contentAlign} fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }}>
            {'true' == isTitleLink ? <a href={link} target={'true' == isLinkNewTab ? '_blank' : '_self'} rel='noreferrer noopener' style={{ color: titleColor }}>{title.rendered}</a> : title.rendered}
        </h2> : null
    );
};
export default PostTitle;