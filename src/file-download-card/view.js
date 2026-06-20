/**
 * File Download Card — frontend behavior.
 *
 * The card is rendered entirely server-side as static HTML + CSS. The download
 * CTA is a native `<a href download>` element, so there is intentionally no
 * client-side JavaScript: hover states are driven by native CSS `:hover`
 * against scoped custom properties. Importing the stylesheet here is what
 * causes the build to emit the view.css referenced by block.json.
 */
import './style.scss';
