export const loadingIcon = <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px'
	width='24px' height='30px' viewBox='0 0 24 30' style={{ enableBackground: 'new 0 0 50 50' }}>
	<rect x='0' y='0' width='4' height='10' fill='#333'>
		<animateTransform attributeType='xml'
			attributeName='transform' type='translate'
			values='0 0; 0 20; 0 0'
			begin='0' dur='0.6s' repeatCount='indefinite' />
	</rect>
	<rect x='10' y='0' width='4' height='10' fill='#333'>
		<animateTransform attributeType='xml'
			attributeName='transform' type='translate'
			values='0 0; 0 20; 0 0'
			begin='0.2s' dur='0.6s' repeatCount='indefinite' />
	</rect>
	<rect x='20' y='0' width='4' height='10' fill='#333'>
		<animateTransform attributeType='xml'
			attributeName='transform' type='translate'
			values='0 0; 0 20; 0 0'
			begin='0.4s' dur='0.6s' repeatCount='indefinite' />
	</rect>
</svg>;

export const closeIcon = <svg xmlns='http://www.w3.org/2000/svg' width='18px' height='18px' viewBox='0 0 24 24' fill='none'>
	<path d='M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414z' fill='#146ef5' />
</svg>;

export const searchIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18px' height='18px'
>
	<path d='M10 2a8 8 0 105.29 13.71l5 5a1 1 0 001.42-1.42l-5-5A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z' fill='#146ef5' />
</svg>

export const demoIcon = <svg width={25} height={25} viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M4.66667 12.25H11.9C11.9928 12.25 12.0818 12.2131 12.1475 12.1475C12.2131 12.0818 12.25 11.9928 12.25 11.9V2.1C12.25 2.00717 12.2131 1.91815 12.1475 1.85251C12.0818 1.78687 11.9928 1.75 11.9 1.75H2.1C2.00717 1.75 1.91815 1.78687 1.85251 1.85251C1.78687 1.91815 1.75 2.00717 1.75 2.1V9.33333M5.83333 3.5H10.5M3.5 3.5H4.08333M2.04167 11.9583L7 7M7 7V9.33333M7 7H4.66667' stroke='#6A72A5' strokeLinecap='round' strokeLinejoin='round'></path></svg>;

export const docsIcon = <svg width={25} height={25} viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
	<path d='M11.6667 6.99999V3.35357C11.6667 3.30753 11.6577 3.26193 11.6401 3.21939C11.6225 3.17684 11.5966 3.1382 11.564 3.10566L9.72771 1.26932C9.66213 1.20367 9.57317 1.16674 9.48037 1.16666H2.68337C2.59055 1.16666 2.50152 1.20353 2.43589 1.26917C2.37025 1.33481 2.33337 1.42383 2.33337 1.51666V12.4833C2.33337 12.5761 2.37025 12.6652 2.43589 12.7308C2.50152 12.7964 2.59055 12.8333 2.68337 12.8333H6.41671M4.66671 5.83332H9.33337M4.66671 3.49999H7.00004M4.66671 8.16666H6.41671' stroke='#6A72A5' strokeLinecap='round' strokeLinejoin='round' />
	<path d='M9.33337 3.14999V1.37315C9.33345 1.33237 9.3456 1.29251 9.36829 1.25862C9.39099 1.22473 9.42321 1.19832 9.4609 1.18272C9.49859 1.16712 9.54005 1.16303 9.58006 1.17097C9.62007 1.17891 9.65683 1.19852 9.68571 1.22732L11.606 3.14765C11.6351 3.17642 11.655 3.21321 11.6631 3.25331C11.6712 3.29341 11.6672 3.33502 11.6515 3.37283C11.6359 3.41063 11.6093 3.44291 11.5752 3.46556C11.5412 3.48821 11.5011 3.5002 11.4602 3.49999H9.68337C9.59055 3.49999 9.50152 3.46311 9.43589 3.39748C9.37025 3.33184 9.33337 3.24281 9.33337 3.14999V3.14999Z' fill='#6A72A5' stroke='#6A72A5' strokeLinecap='round' strokeLinejoin='round' />
	<path d='M10.4731 9.88165L11.0565 9.29832C11.1172 9.23754 11.1893 9.18932 11.2687 9.15643C11.3481 9.12353 11.4331 9.1066 11.5191 9.1066C11.605 9.1066 11.6901 9.12353 11.7694 9.15643C11.8488 9.18932 11.9209 9.23754 11.9816 9.29832C12.1042 9.42095 12.1731 9.58723 12.1731 9.76061C12.1731 9.93399 12.1042 10.1003 11.9816 10.2229L11.3983 10.8062M10.4731 9.88107L8.7284 11.6258C8.64116 11.7133 8.58397 11.8263 8.56506 11.9484L8.42273 12.8567L9.33098 12.7149C9.45309 12.696 9.56605 12.6388 9.65356 12.5516L11.3977 10.8062M10.4731 9.88107L11.3983 10.8062' stroke='#6A72A5' strokeLinecap='round' strokeLinejoin='round' />
</svg>;

export const plus = <svg fill='#000000' width={25} height={25} viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg' >
	<path d='M232 280L64 280 64 232 232 232 232 64 280 64 280 232 448 232 448 280 280 280 280 448 232 448 232 280Z' />
</svg>;

export const minus = <svg fill='#000000' width={25} height={25} viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg' >
	<path d='M64 232L448 232 448 280 64 280 64 232Z' />
</svg>;