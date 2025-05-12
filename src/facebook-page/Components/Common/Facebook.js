import React, { useEffect } from "react";

const Facebook = ({ attributes}) => {
    const { facebook } = attributes;
    useEffect(() => {
        window?.FB?.init({
            xfbml: true,
            version: "v21.0",
            appId: '7318392321575160',
        });
    }, []);
    return <div>
            <div
                className="fb-page"
                data-href={facebook.link}
                data-tabs={facebook.layout.join(",")}
                data-width={facebook.width}
                data-height={facebook.height}
                data-small-header={facebook.smallHeader}
                data-hide-cover={!facebook.coverPhoto}
                data-show-facepile={facebook.profilePhotos}
                data-hide-cta={facebook.ctaButton}
            ></div>
        </div> 
};

export default Facebook;