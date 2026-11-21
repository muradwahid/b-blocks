import { __ } from '@wordpress/i18n';
import { ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

const Platform = ({ platform, set }) => {
	return (
		<div className='bBlocksPerformance__rows'>
			<h3 className='bBlocksPerformance__section isFirst'>{__('Platform Optimizations', 'b-blocks')}</h3>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Disable Emojis', 'b-blocks')}
				help={__('Remove the WordPress emoji detection script and styles from front-end pages. The admin area keeps them, so emojis still render there.', 'b-blocks')}
				checked={platform.disableEmojis}
				onChange={(v) => set('platform', 'disableEmojis', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Disable Embeds (wp-embed)', 'b-blocks')}
				help={__('Remove the oEmbed discovery links (which let other sites embed your posts) and the wp-embed script (which sizes posts from other WordPress sites embedded on your pages).', 'b-blocks')}
				checked={platform.disableEmbeds}
				onChange={(v) => set('platform', 'disableEmbeds', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Disable Dashicons on frontend', 'b-blocks')}
				help={__('Remove the Dashicons stylesheet for logged-out visitors (kept for logged-in users so the admin bar still renders).', 'b-blocks')}
				checked={platform.disableDashicons}
				onChange={(v) => set('platform', 'disableDashicons', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Remove jQuery Migrate', 'b-blocks')}
				help={__('Drop the legacy jquery-migrate script on the frontend. Disable if an old theme/plugin needs it.', 'b-blocks')}
				checked={platform.removeJqueryMigrate}
				onChange={(v) => set('platform', 'removeJqueryMigrate', v)}
			/>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Control Heartbeat API', 'b-blocks')}
				help={__('Throttle the WordPress Heartbeat API to reduce background admin-ajax requests. On post edit screens and post lists WordPress itself checks every 10 seconds, so post locks stay accurate.', 'b-blocks')}
				checked={platform.heartbeat}
				onChange={(v) => set('platform', 'heartbeat', v)}
			/>
			{platform.heartbeat && (
				<div className='bBlocksPerformance__row bBlocksPerformance__child'>
					<div className='bBlocksPerformance__rowText'>
						<label htmlFor='bBlocksPerformance-heartbeatInterval' className='bBlocksPerformance__label'>{__('Heartbeat interval (seconds)', 'b-blocks')}</label>
					</div>
					<div className='bBlocksPerformance__rowControl isSmall'>
						<NumberControl id='bBlocksPerformance-heartbeatInterval' __next40pxDefaultSize min={15} max={300} value={platform.heartbeatInterval} onChange={(v) => set('platform', 'heartbeatInterval', v)} />
					</div>
				</div>
			)}

			<h3 className='bBlocksPerformance__section'>{__('Mobile', 'b-blocks')}</h3>

			<ToggleControl
				__nextHasNoMarginBottom
				label={__('Larger touch targets on mobile', 'b-blocks')}
				help={__('Give buttons and linked icons a minimum tap size on small screens so they are easier to tap. Text links keep their size. Slightly changes sizing on mobile.', 'b-blocks')}
				checked={platform.touchTargets}
				onChange={(v) => set('platform', 'touchTargets', v)}
			/>
		</div>
	);
};

export default Platform;
