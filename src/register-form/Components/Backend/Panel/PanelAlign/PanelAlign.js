import "./panelAlign.css";

/**
 * PanelAlign Component - A customizable alignment control panel
 * @param {Object} props
 * @param {string} props.label - Label text for the alignment control
 * @param {Array<{value: string, icon: ReactNode, label: string}>} props.options - Array of alignment options
 * @param {Function} [props.onChange] - Callback function when alignment changes
 * @param {string} props.value - Currently selected alignment value
 * @param {Object} [props.style] - Custom styles for the container
 * @param {'left'|'right'|'top'|'bottom'} [props.labelPosition='left'] - Position of the label
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.activeBg='#4527a4'] - Background color for active option
 * @param {string} [props.activeColor='#fff'] - Text color for active option
 * @param {string} [props.hoverBg='#774cff'] - Background color on hover
 * @param {string} [props.hoverColor='#fff'] - Text color on hover
 * @param {string} [props.iconHeight='18px'] - Height of the icon
 * @param {string} [props.iconWidth='auto'] - Width of the icon
 */

const PanelAlign = (props) => {
  const {
    label,
    options,
    onChange = () => {},
    value,
    style,
    labelPosition = "left",
    className,
    activeBg = "#4527a4",
    activeColor = "#fff",
    hoverBg = "#774cff",
    hoverColor = "#fff",
    iconHeight = "18px",
    iconWidth = "auto",
  } = props;
  const labelAlign = labelPosition == "left" || labelPosition == "right";
  const id = Math.floor(Math.random() * 99999999);
  return (
    <div style={style} className={className}>
      <style>{`
        .bpl-single-icon-${id}.bpl-alignment-icon.isActive {
          background-color: ${activeBg};
        }
        .bpl-single-icon-${id}.bpl-alignment-icon.hover-color:hover {
          background: ${hoverBg};
        }
        .bpl-single-icon-${id}.bpl-alignment-icon.hover-color:hover .bpl-single-icon{
          color:${hoverColor};
          fill:${hoverColor};
        }
        .bpl-single-icon-${id}.bpl-alignment-icon.isActive .bpl-single-icon{
          color:${activeColor};
          fill:${activeColor};
        }
        .bpl-single-icon-${id}.bpl-alignment-icon .bpl-single-icon>svg{
          height:${iconHeight};
          width:${iconWidth};
        }

        }
      `}</style>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: `${labelAlign ? "center" : "normal"}`,
          flexDirection: `${
            labelPosition === "left"
              ? "row"
              : labelPosition == "right"
              ? "row-reverse"
              : labelPosition === "top"
              ? "column"
              : "column-reverse"
          }`,
        }}
      >
        <p
          style={{
            margin: `${labelAlign ? "0" : "8px 0"}`,
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {label}
        </p>
        <div
          style={{
            display: "flex",
            border: "1px solid #ccc",
          }}
        >
          {options &&
            options.map((icon, i) => (
              <div
                key={i}
                onClick={() => onChange(icon.value)}
                className={`bpl-single-icon-${id} bpl-alignment-icon panelAlign ${
                  value === icon.value ? "isActive" : "hover-color"
                }`}
              >
                <span className="bpl-single-icon">{icon.icon}</span>
                <div className="icon-picker-tooltip-container">
                  <div
                    style={{ padding: "2px 6px" }}
                    className="icon-picker-tooltip"
                  >
                    <span>
                      {icon.label}
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default PanelAlign;
