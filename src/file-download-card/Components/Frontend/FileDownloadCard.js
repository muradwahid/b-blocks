import { badgeForMime } from '../../utils/data';

const DownloadIcon = () => (
	<svg className='b-blocks-file-download-card-btn-icon' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
		<path d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
	</svg>
);

const FileDownloadCard = ({ attributes }) => {
	const { file = {}, content = {}, layout = {}, icon = {} } = attributes;
	const { url, type, size, name, buttonLabel, openNewTab, showFileType = true, showFileSize = true } = file;

	if (!url) return null;

	const badge = badgeForMime(type, url);
	const title = content.title || name || 'Download file';
	const hasSize = !!(size && String(size).trim());
	const hasMeta = (showFileType && badge) || (showFileSize && hasSize);

	const srMeta = [
		showFileType && badge ? badge : '',
		showFileSize && hasSize ? String(size).trim() : '',
	].filter(Boolean).join(', ');

	const ariaLabel = [
		/* translators: %s: file or download title. */
		`${'Download:'} ${title}`,
		srMeta,
	].filter(Boolean).join(', ');

	const wrapperClass = [
		'b-blocks-file-download-card',
		`b-blocks-file-download-card--${layout.type || 'horizontal'}`,
		`b-blocks-file-download-card--icon-${icon.style || 'filled'}`,
	].join(' ');

	return (
		<div className={wrapperClass}>
			<article className='b-blocks-file-download-card-card'>
				<span className='b-blocks-file-download-card-badge' aria-hidden='true'>{badge}</span>

				<div className='b-blocks-file-download-card-body'>
					<h3 className='b-blocks-file-download-card-title'>{title}</h3>

					{content.description ? (
						<p className='b-blocks-file-download-card-desc'>{content.description}</p>
					) : null}

					{hasMeta ? (
						<p className='b-blocks-file-download-card-meta'>
							{showFileType && badge ? <span className='b-blocks-file-download-card-meta-type' aria-hidden='true'>{badge}</span> : null}
							{showFileType && badge && showFileSize && hasSize ? <span className='b-blocks-file-download-card-meta-sep' aria-hidden='true'>&middot;</span> : null}
							{showFileSize && hasSize ? <span className='b-blocks-file-download-card-meta-size' aria-hidden='true'>{size}</span> : null}
							{srMeta ? <span className='screen-reader-text'>{srMeta}</span> : null}
						</p>
					) : null}
				</div>

				<div className='b-blocks-file-download-card-action'>
					<a
						className='b-blocks-file-download-card-btn'
						href={url}
						download
						aria-label={ariaLabel}
						{...(openNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : { rel: 'noopener' })}
					>
						<DownloadIcon />
						<span className='b-blocks-file-download-card-btn-label'>{buttonLabel ||'Download'}</span>
						{openNewTab ? <span className='screen-reader-text'>{'(opens in a new tab)'}</span> : null}
					</a>
				</div>
			</article>
		</div>
	);
};
export default FileDownloadCard;
