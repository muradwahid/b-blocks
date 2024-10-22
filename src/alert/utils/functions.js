export const themeValues = (val) => {
	const values = {
		general: {
			color: '#333',
			icon: 'fa-solid fa-bell'
		},
		success: {
			color: '#12b878',
			icon: 'fa-regular fa-circle-check'
		},
		info: {
			color: '#2cacff',
			icon: 'fa-solid fa-circle-info'
		},
		warning: {
			color: '#f1ae2a',
			icon: 'fa-solid fa-gear'
		},
		error: {
			color: '#db4b68',
			icon: 'fa-solid fa-circle-exclamation'
		},
	}
	return values[val];
}
export const typeValues = (val, border, shadow) => {
	return 'minimal' === val ? {
		width: '0px',
		icon: { class: themeValues('info').icon },
		isDismiss: 'minimal' !== val,
		colors: { color: '#00AB6D', bg: '#fff' },
		padding: { vertical: '10px', horizontal: '13px' },
		border: { ...border, color: '#00AB6D', radius: '50px' },
		shadow: { ...shadow, blur: '10px', color: '#00AB6D' },
	} : {
		width: '100%',
		icon: { class: themeValues(val).icon },
		isDismiss: 'minimal' !== val,
		colors: { color: themeValues(val).color, bg: `${themeValues(val).color}1a` },
		padding: { vertical: '15px', horizontal: '30px' },
		border: { ...border, color: themeValues(val).color, radius: '8px' },
		shadow: {}
	}
}