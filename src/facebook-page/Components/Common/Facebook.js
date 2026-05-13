const Facebook = ({ attributes, facebookKey }) => {
    const { facebook } = attributes;

    const encodedLink = encodeURIComponent(facebook.link);

    const tabs = facebook.layout?.join(",") || "timeline";

    const iframeSrc = `https://www.facebook.com/plugins/page.php?` +
        `href=${encodedLink}` +
        `&tabs=${tabs}` +
        `&width=${facebook.width}` +
        `&height=${facebook.height}` +
        `&small_header=${facebook.smallHeader}` +
        `&adapt_container_width=true` +
        `&hide_cover=${!facebook.coverPhoto}` +
        `&show_facepile=${facebook.profilePhotos}` +
        `&hide_cta=${facebook.ctaButton}` +
        `&appId=${facebookKey}`;

    return (
        <div className={`bBlocks-fbPage-wrapper ${facebook.align}`}>
            <div>
                <iframe
                    src={iframeSrc}
                    width={facebook.width}
                    height={facebook.height}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Facebook Page"
                ></iframe>
            </div>
        </div>
    );
};

export default Facebook;