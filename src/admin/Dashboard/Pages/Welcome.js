import { useState } from 'react';

import Layout from '../Layout/Layout';
import { changelogs, helpItems } from '../utils/data2';
import { minus, plus } from '../utils/icons';
import VideoPlayer from '../Parts/VideoPlayer';

const Welcome = ({ info }) => {
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
		<Layout info={info}>
			<div className='welcomePage'>
				<div className='welcomeLeft'>
					<div className='welcomeLeftBody'>
						<h1>Welcome to bBlocks</h1>

						<p>Power Up Your Gutenberg Editor Website Building Experience With bBlocks.</p>

						<VideoPlayer src='https://www.youtube.com/watch?v=rdPWz1Ekkro' height='550px' />

						<div className='intro'>
							{/* ?rev=3385620 */}
							<img className='logo' src='https://ps.w.org/b-blocks/assets/icon-128x128.png' alt='bBlocks Logo' />

							<div className='nameAuthor'>
								<h3>bBlocks - The ultimate block collection</h3>
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
				const { version, list } = log;

				return <div key={index} className='item'>
					<span className='version'>{version}</span>

					<ul className='list'>
						{list.map((item, index) => <li key={index}>
							{item}
						</li>)}
					</ul>
				</div>
			})}
		</div >
	</>
};
export default Welcome;