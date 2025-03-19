import { useState } from 'react';
import Layout from '../Layout/Layout';
import { changelogs, helpItems } from '../utils/data';
import { minus, plus } from '../utils/icons';

const Welcome = () => {
	const [isChangeLog, setIsChangeLog] = useState(false);

	const handleCreateNewPage = (e) => {
		e.preventDefault();

		const baseUrl = window.location.origin;
		const adminPath =
			window.location.hostname === 'localhost'
				? '/wordpress/wp-admin/post-new.php?post_type=page'
				: '/wp-admin/post-new.php?post_type=page';
		window.location.href = baseUrl + adminPath;
	};

	return <>
		<Layout>
			<div className='welcomePage'>
				<div className='welcomeLeft'>
					<div className='welcomeLeftBody'>
						<h1>Welcome to bBlocks</h1>

						<p>Power Up Your Gutenberg Editor Website Building Experience With bBlocks.</p>

						<img className='banner' src='https://ps.w.org/b-blocks/assets/banner-772x250.png?rev=3176079' alt='B Blocks Banner' />

						<div className='intro'>
							<img className='logo' src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='B Blocks Logo' />

							<div className='nameAuthor'>
								<h3>B Blocks - The ultimate block collection</h3>
								<span>by</span>
								<a href='https://bplugins.com' target='_blank' rel='noopener noreferrer'>
									bPlugins
								</a>
							</div>
						</div>
					</div>

					<div className='welcomeLeftFooter'>
						<a className='actionBtn' href='#' onClick={handleCreateNewPage}>
							Create New Page
						</a>

						<a className='actionBtn' href='https://bplugins.com' target='_blank' rel='noopener noreferrer'>
							Visit Our Website
						</a>
					</div>
				</div>

				<div className='welcomeRight'>
					{helpItems?.map((item, index) => {
						return (
							<div key={index} className='item'>
								<h2>{item?.title}</h2>
								<p>{item?.description}</p>
								<a className='actionBtn' href={item?.link} target='_blank' rel='noopener noreferrer'>
									{item?.linkText}
								</a>
							</div>
						);
					})}
				</div>
			</div>
		</Layout>

		<div className='bPlDashboardChangelog'>
			<div className='changelogToggleBtn' onClick={() => setIsChangeLog(!isChangeLog)}>
				Get updates on our new blocks and features by checking out the changelog

				{isChangeLog ? minus : plus}
			</div>

			{isChangeLog && changelogs.map((log, index) => {
				const { date, list } = log;

				return <div key={index} className='item'>
					<span className='date'>{date}</span>

					<ul className='list'>
						{list.map((item, token) => { return <li key={token}>{item?.title}</li> })}
					</ul>
				</div>
			})}
		</div >
	</>
};
export default Welcome;