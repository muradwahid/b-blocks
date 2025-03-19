
import { useState, useEffect } from 'react';

import Layout from '../Layout/Layout';
import { loadingIcon } from '../utils/icons';

const PopularPlugin = () => {
	const [installedPlugins, setInstalledPlugins] = useState([]);
	const [pluginSlug, setPluginSlug] = useState(null);
	const [popularPlugins, setPopularPlugins] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchPopularPlugins = async () => {
			try {
				setLoading(true);
				const res = await fetch(`${pluginAction.ajaxUrl}?action=get_popular_plugins&nonce=${pluginAction.nonce}`);
				const response = await res.json();

				const allowedPlugins = ['html5-audio-player', 'html5-video-player', 'pdf-poster', '3d-viewer'];
				const filteredPlugins = response?.data?.filter(plugin => allowedPlugins?.includes(plugin?.slug));
				setPopularPlugins(filteredPlugins);
				setLoading(false);

			} catch (error) {
				// eslint-disable-next-line no-console
				console.log('No data', error);
				setLoading(false);
			}
		}
		fetchPopularPlugins();

	}, []);

	useEffect(() => {
		const fetchActivePlugins = async () => {
			try {
				const res = await fetch(
					`${pluginAction.ajaxUrl}?action=get_active_plugins&nonce=${pluginAction.nonce}`
				);
				const response = await res.json();
				if (response.success) {
					setInstalledPlugins(response.data); // Set the list of installed plugins
				} else {
					// eslint-disable-next-line no-console
					console.error('Error fetching installed plugins:', response.message);
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Error fetching installed plugins:', error);
			}
		};
		fetchActivePlugins();


	}, []);

	const actionHooks = async (pluginName) => {
		setPluginSlug(pluginName); // Set the loading state to the plugin name

		try {
			const res = await fetch(`${pluginAction.ajaxUrl}?action=activated_block&plugin_name=${pluginName}&nonce=${pluginAction.nonce}`);
			const responseText = await res.text();

			const jsonStart = responseText.indexOf('{');
			if (jsonStart !== -1) {
				const jsonString = responseText.slice(jsonStart);
				const response = JSON.parse(jsonString);

				window.location.href = response.data.redirectUrl;
			} else {
				// eslint-disable-next-line no-console
				console.error('No JSON found in the response.');
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error:', error);
		} finally {
			setPluginSlug(null); // Reset the loading state
		}
	};

	return <Layout>
		<div className='popularPluginsPage'>
			<div className='popularPluginsTop'>
				<h2>Most Popular Plugin</h2>

				<a className='actionBtn' href='https://profiles.wordpress.org/bplugins/#content-plugins' target='_blank' rel='noopener noreferrer' >Our All Plugins</a>
			</div>

			{!loading ?
				<div className='plugins'>
					{popularPlugins?.map((plugin, index) => {
						const { slug, name, icons, short_description, download_link } = plugin;

						const isInstalled = installedPlugins.some(plugSlug => plugSlug === `${slug}/${slug}.php`);

						return <div className='plugin' key={index}>
							<img src={icons['1x']} alt={slug} />

							<h3 dangerouslySetInnerHTML={{ __html: name }} />

							<p dangerouslySetInnerHTML={{ __html: short_description }} />

							<div className='btn_area'>
								<button className={`bBlocksDashboardBtn ${isInstalled ? 'installedSuccess' : 'actionBtn'} ${pluginSlug === slug ? 'installing...' : ''}`}
									onClick={(e) => {
										e.preventDefault();
										if (!isInstalled)
											actionHooks(slug);
									}}
									disabled={isInstalled || pluginSlug === slug}
								>
									{pluginSlug === slug ?
										'Installing...' :
										isInstalled ?
											'Installed' :
											'Install'}
								</button>

								<a className='bBlocksDashboardBtn secondary' href={download_link}>Download </a>
							</div>
						</div>
					})}
				</div> :
				<div className='loading'>
					{loadingIcon}
				</div>
			}
		</div>
	</Layout>
};
export default PopularPlugin;