import { useEffect } from "react";
const Facebook = ({ attributes, facebookKey }) => {
    const { facebook } = attributes;

    // Event Key
    useEffect(() => {
        window.FB.init({
            xfbml: true,
            version: "v21.0",
            appId: facebookKey,
        });
    }, [facebookKey]);
    return <div className={`b-blocks-facebookEmbed-wrapper ${facebook.alignment}`}>
            {facebook.type === "video" && <div className="fb-video" data-href={facebook.url.video} data-width={facebook.width} data-show-text={facebook.fullPost} data-show-captions={facebook.caption} data-autoplay={facebook.autoPlay} data-allowfullscreen={facebook.fullScreen}></div>}
            {facebook.type === "post" && <div className="fb-post" data-href={facebook.url.post} data-width={facebook.width} data-show-text={facebook.fullPost}></div>}
            {/* <script
        async
        defer
        crossOrigin="anonymous"
        src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0&appId=${facebook.appId}`}
        nonce="CAr8Z5Od"
      ></script> */}
        </div>
};

export default Facebook;
