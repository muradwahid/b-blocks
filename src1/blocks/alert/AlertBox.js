const AlertBox = ({ attributes }) => {
	const { message, icon, isDismiss } = attributes;

	return <div className='bBlocksAlert'>
		<div className='alert'>
			{icon?.class && <i className={`alertIcon ${icon?.class}`}></i>}

			{message && <span className='alertMessage' dangerouslySetInnerHTML={{ __html: message }} />}

			{isDismiss && <i className='alertClose fa fa-times-circle'></i>}
		</div>
	</div>
}
export default AlertBox;