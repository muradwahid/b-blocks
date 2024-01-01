import { createRoot } from 'react-dom/client';

import './admin.scss';

document.addEventListener('DOMContentLoaded', () => {
	const adminEl = document.querySelector('.bplAdminHelpPage');

	const features = [
		{
			title: 'Need any Assistance?',
			description: 'Our Expert Support Team is always ready to help you out promptly.',
			iconClass: 'fa fa-life-ring',
			link: 'https://bplugins.com/support',
			linkText: 'Contact Support'
		},
		{
			title: 'Looking for Documentation?',
			description: 'We have detailed documentation on every aspects of the plugin.',
			iconClass: 'fa fa-file-text',
			link: 'https://bblockswp.com/docs',
			linkText: 'Documentation'
		},
		{
			title: 'Liked This Plugin?',
			description: 'Glad to know that, you can support us by leaving a 5 &#11088; rating.',
			iconClass: 'fa fa-thumbs-up',
			link: 'https://wordpress.org/support/plugin/b-blocks/reviews/#new-post',
			linkText: 'Rate the Plugin'
		}
	];

	if (adminEl) {
		createRoot(adminEl).render(<div className='bplContainer'>
			<div className='header box'>
				<h1 className='heading'>Helpful Links</h1>
			</div>

			<div className='body'>
				<div className='features col-3 col-tab-2 col-mob-1'>
					{features.map((feature, index) => <Feature key={index} feature={feature} />)}
				</div>
			</div>
		</div>);
	}
});

const Feature = ({ feature }) => {
	const { title, description, iconClass, link, linkText } = feature;

	return <div className='feature box'>
		<i className={iconClass}></i>
		<h3 dangerouslySetInnerHTML={{ __html: title }} />
		<p dangerouslySetInnerHTML={{ __html: description }} />
		<a href={link} target='_blank' rel='noreferrer' className='button button-primary' dangerouslySetInnerHTML={{ __html: linkText }} />
	</div>
}