import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const clamp = ( val, min, max, fallback ) => {
	const n = parseInt( val, 10 );
	if ( isNaN( n ) ) return fallback;
	return Math.max( min, Math.min( max, n ) );
};

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId } = props;
	const {
		audioUrl, trackTitle, artistName, albumArt,
		playerStyle, showDownload, showTimecode, showVolume,
		playerBg, controlColor, accentColor,
		borderRadius, paddingV, paddingH, titleSize, artistSize,
		alignment, maxWidth
	} = attributes;

	const id = `block-${ clientId }`;
	const maxW = clamp( maxWidth, 0, 1200, 0 );

	const css = `
		#${ id }.bb-ap {
			--bb-ap-bg: ${ playerBg || '#1e1e1e' };
			--bb-ap-control: ${ controlColor || '#ffffff' };
			--bb-ap-accent: ${ accentColor || '#146EF5' };
			--bb-ap-radius: ${ clamp( borderRadius, 0, 60, 8 ) }px;
			--bb-ap-pad-y: ${ clamp( paddingV, 0, 80, 16 ) }px;
			--bb-ap-pad-x: ${ clamp( paddingH, 0, 80, 20 ) }px;
			--bb-ap-title-size: ${ clamp( titleSize, 10, 40, 15 ) }px;
			--bb-ap-artist-size: ${ clamp( artistSize, 8, 32, 13 ) }px;
			--bb-ap-max-w: ${ maxW > 0 ? `${ maxW }px` : 'none' };
		}
	`;

	const wrapperClasses = [
		'bb-ap',
		`bb-ap-style-${ playerStyle || 'bar' }`,
		`bb-ap-align-${ alignment || 'left' }`
	].join( ' ' );

	const blockProps = useBlockProps( {
		id,
		className: wrapperClasses
	} );

	const hasMeta = !! trackTitle || !! artistName;
	const hasArt = !! ( albumArt && albumArt.url );

	return <>
		<Settings attributes={ attributes } setAttributes={ setAttributes } />

		<BlockControls>
			<AlignmentToolbar
				value={ alignment }
				onChange={ ( val ) => setAttributes( { alignment: val || 'left' } ) }
			/>
		</BlockControls>

		<div { ...blockProps }>
			<style dangerouslySetInnerHTML={ { __html: css } } />

			{ ! audioUrl ? (
				<div className='bb-ap-editor-hint'>
					{ __( 'Select an audio file from the Audio panel in the block settings to build your player.', 'b-blocks' ) }
				</div>
			) : (
				<div className='bb-ap-player' role='region' aria-label={ __( 'Audio player', 'b-blocks' ) }>
					{ 'card' === playerStyle && (
						<div className='bb-ap-art'>
							{ hasArt ? (
								<img className='bb-ap-art-img' src={ albumArt.url } alt='' />
							) : (
								<span className='bb-ap-art-placeholder' aria-hidden='true'>
									<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path d='M9 18V6l10-2v12' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
										<circle cx='6' cy='18' r='3' stroke='currentColor' strokeWidth='1.6' />
										<circle cx='16' cy='16' r='3' stroke='currentColor' strokeWidth='1.6' />
									</svg>
								</span>
							) }
						</div>
					) }

					<div className='bb-ap-body'>
						{ hasMeta && (
							<div className='bb-ap-meta'>
								{ trackTitle && <p className='bb-ap-title'>{ trackTitle }</p> }
								{ artistName && <p className='bb-ap-artist'>{ artistName }</p> }
							</div>
						) }

						<div className='bb-ap-controls'>
							<button type='button' className='bb-ap-playpause' aria-label={ __( 'Play', 'b-blocks' ) } aria-pressed='false' disabled>
								<span className='bb-ap-icon bb-ap-icon-play' aria-hidden='true'>
									<svg viewBox='0 0 24 24' fill='currentColor'><path d='M8 5v14l11-7z' /></svg>
								</span>
							</button>

							<div className='bb-ap-seek-wrap'>
								<input type='range' className='bb-ap-seek' min='0' max='100' defaultValue='30' aria-label={ __( 'Seek', 'b-blocks' ) } style={ { '--progress': '30%' } } readOnly />
							</div>

							{ showTimecode && (
								<span className='bb-ap-time' aria-hidden='true'>
									<span className='bb-ap-current'>0:00</span> / <span className='bb-ap-duration'>0:00</span>
								</span>
							) }

							{ showVolume && (
								<input type='range' className='bb-ap-volume' min='0' max='1' step='0.01' defaultValue='1' aria-label={ __( 'Volume', 'b-blocks' ) } style={ { '--progress': '100%' } } readOnly />
							) }

							{ showDownload && (
								<span className='bb-ap-download' aria-hidden='true'>
									<svg viewBox='0 0 24 24' fill='none'><path d='M12 3v12m0 0l-4-4m4 4l4-4M5 21h14' stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' strokeLinejoin='round' /></svg>
								</span>
							) }
						</div>
					</div>
				</div>
			) }
		</div>
	</>;
};

export default Edit;
