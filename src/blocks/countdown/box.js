const Box = props => {
    const { is, boxClasses, boxStyles, digitClasses, digitStyles, isLabels, label, labelClasses, labelStyles } = props

    return (
        is && <div className={boxClasses} style={boxStyles}>
            <span className={digitClasses} style={digitStyles}>0</span>
            {isLabels && <span className={labelClasses} style={labelStyles}>{label}</span>}
        </div>
    );
};
export default Box;