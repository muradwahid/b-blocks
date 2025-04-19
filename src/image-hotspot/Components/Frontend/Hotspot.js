import SVG from "react-inlinesvg";
import { placeholderImg } from '../../utils/icons';

const Hotspot = ({ attributes }) => {
  const { hotspot, image, preset } = attributes;
  return (
    <div>
      <div
        style={{
          background: `url(${image.url || placeholderImg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "local",
        }}
        className="hotspot-image-wrapper"
      >
        {hotspot.map((element) => (
          <>
            {element.spotOption === "text" && (
              <a
                {...(element.spotLink ? { href: element.spotLink } : {})}
                target={`${element.newWindow ? "_blank" : ""}`}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    className={`bphb-hotspot ${preset === "default"
                      ? "circle"
                      : preset === "themetwo"
                        ? "two"
                        : preset === "themethree"
                          ? "three"
                          : preset === "themefour"
                            ? "fourth"
                            : "fifth"
                      }`}
                  >
                    {element.tooltip && (
                      <div
                        className={`tooltip-reader ${preset === "default"
                          ? "one"
                          : preset === "themetwo"
                            ? "two"
                            : preset === "themethree"
                              ? "three"
                              : preset === "themefour"
                                ? "fourth"
                                : "fifth"
                          }  tooltip-${element.tooltipPosition}`}
                      >
                        <div
                          className="bphb-tooltip-content"
                          dangerouslySetInnerHTML={{ __html: element.tooltip }}
                        ></div>
                      </div>
                    )}
                    <span
                      dangerouslySetInnerHTML={{ __html: element.spotText }}
                    ></span>
                  </div>
                </div>
              </a>
            )}
            {element.spotOption === "icon" && (
              <a
                {...(element.spotLink ? { href: element.spotLink } : {})}
                target={`${element.newWindow ? "_blank" : ""}`}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    className={`bphb-hotspot ${preset === "default"
                      ? "circle"
                      : preset === "themetwo"
                        ? "two"
                        : preset === "themethree"
                          ? "three"
                          : preset === "themefour"
                            ? "fourth"
                            : "fifth"
                      }`}
                  >
                    {element.tooltip && (
                      <div
                        className={`tooltip-reader ${preset === "default"
                          ? "one"
                          : preset === "themetwo"
                            ? "two"
                            : preset === "themethree"
                              ? "three"
                              : preset === "themefour"
                                ? "fourth"
                                : "fifth"
                          } tooltip-${element.tooltipPosition}`}
                      >
                        <div
                          className="bphb-tooltip-content"
                          dangerouslySetInnerHTML={{ __html: element.tooltip }}
                        ></div>
                      </div>
                    )}
                    {element.icon.type === "upload" && (
                      <SVG src={element.icon.url.upload} height="auto" />
                    )}
                    {element.icon.type === "library" && (
                      <span
                        className="imghp-library-icon"
                        dangerouslySetInnerHTML={{
                          __html: element.icon.url.library,
                        }}
                      ></span>
                    )}
                    <SVG src={element.icon} height="auto" />
                  </div>
                </div>
              </a>
            )}
            {element.spotOption === "image" && (
              <a
                {...(element.spotLink ? { href: element.spotLink } : {})}
                target={`${element.newWindow ? "_blank" : ""}`}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${element.position.x}%`,
                    top: `${element.position.y}%`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    className={`bphb-hotspot  ${preset === "default"
                      ? "circle"
                      : preset === "themetwo"
                        ? "two"
                        : preset === "themethree"
                          ? "three"
                          : preset === "themefour"
                            ? "fourth"
                            : "fifth"
                      }`}
                  >
                    {element.tooltip && (
                      <div
                        className={`tooltip-reader ${preset === "default"
                          ? "one"
                          : preset === "themetwo"
                            ? "two"
                            : preset === "themethree"
                              ? "three"
                              : preset === "themefour"
                                ? "fourth"
                                : "fifth"
                          } tooltip-${element.tooltipPosition}`}
                      >
                        <div
                          className="bphb-tooltip-content"
                          dangerouslySetInnerHTML={{ __html: element.tooltip }}
                        ></div>
                      </div>
                    )}
                    {element.image && (
                      <img
                        src={element.image}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "inherit",
                          objectFit: "pointer",
                        }}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </a>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
export default Hotspot;
