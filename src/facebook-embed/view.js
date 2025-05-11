import { createRoot } from "react-dom/client";

import Style from "./Components/Common/Style";
import Facebook from "./Components/Frontend/Facebook";
import "./style.scss";

document.addEventListener("DOMContentLoaded", () => {
    const fbEmbedEls = document.querySelectorAll(".wp-block-b-blocks-facebook-embed");

    fbEmbedEls.forEach((fbEmbedEl) => {
        const attributes = JSON.parse(fbEmbedEl.dataset.attributes);

        createRoot(fbEmbedEl).render(
            <>
                <Style attributes={attributes} id={fbEmbedEl.id} />

                <Facebook attributes={attributes} />
            </>
        );

        fbEmbedEl?.removeAttribute("data-attributes");
    });
});
