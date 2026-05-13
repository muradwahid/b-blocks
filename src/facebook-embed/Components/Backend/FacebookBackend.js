const FacebookBackend = ({ attributes, facebookKey }) => {
    const { facebook } = attributes;

    const videoSrc = `https://www.facebook.com/plugins/video.php?` +
        `href=${encodeURIComponent(facebook.url?.video || "")}` +
        `&width=${facebook.width || "500"}` +
        `&show_text=${facebook.fullPost}` +
        `&show_captions=${facebook.caption}` +
        `&autoplay=${facebook.autoPlay}` +
        `&appId=${facebookKey}`;
    const postSrc = `https://www.facebook.com/plugins/post.php?` +
        `href=${encodeURIComponent(facebook.url?.post || "")}` +
        `&width=${facebook.width || "500"}` +
        `&show_text=${facebook.fullPost}` +
        `&appId=${facebookKey}`;

    return (
        <div className={`b-blocks-facebookEmbed-wrapper ${facebook.alignment}`}>
            {facebook.type === "video" && (
                <div className="fb-video-container">
                    <iframe
                        src={videoSrc}
                        width={facebook.width || "500"}
                        height="auto"
                        style={{ border: 'none', overflow: 'hidden', width: '100%', minHeight: '315px' }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={facebook.fullScreen}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                </div>
            )}
            {facebook.type === "post" && (
                <div className="fb-post-container">
                    <iframe
                        src={postSrc}
                        width={facebook.width || "500"}
                        height="auto"
                        style={{ border: 'none', overflow: 'hidden', width: '100%', minHeight: '500px' }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                </div>
            )}

        </div>
    );
};

export default FacebookBackend;