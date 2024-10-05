const ButtonIcon = ({ attributes }) => {
	const { isUpIcon, icon, upIcon } = attributes;

	return <>
		{isUpIcon && upIcon?.url && <img src={upIcon?.url} alt={upIcon?.alt} />}

		{!isUpIcon && icon?.class && <i className={icon?.class}></i>}
	</>
}
export default ButtonIcon;