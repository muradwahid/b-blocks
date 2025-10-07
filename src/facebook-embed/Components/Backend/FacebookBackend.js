import { useEffect } from "react";
const FacebookBackend = ({ attributes }) => {
    const { facebook } = attributes;
    // Event Key
    useEffect(() => {
        window.FB.init({
            xfbml: true,
            version: "v21.0",
            appId: "7318392321575160",
        });
    }, [facebook.type, facebook]);
    return <div className={`b-blocks-facebookEmbed-wrapper ${facebook.alignment}`}>
            {facebook.type === "video" && <div className="fb-video" data-href={facebook.url.video} data-width={facebook.width} data-show-text={facebook.fullPost} data-show-captions={facebook.caption} data-autoplay={facebook.autoPlay} data-allowfullscreen={facebook.fullScreen}></div>}
            {facebook.type === "post" && <div className="fb-post" data-href={facebook.url.post} data-width={facebook.width} data-show-text={facebook.fullPost}></div>}
        </div>
};

export default FacebookBackend;
