import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	Button,
	Placeholder,
	TextControl,
	ToggleControl,
	SelectControl,
	RangeControl,
	ColorPalette,
	BaseControl
} from '@wordpress/components';

const RATIO_OPTIONS = [
	{ label: __( '16:9', 'b-blocks' ), value: '16:9' },
	{ label: __( '4:3', 'b-blocks' ), value: '4:3' },
	{ label: __( '1:1 (Square)', 'b-blocks' ), value: '1:1' },
	{ label: __( '3:2', 'b-blocks' ), value: '3:2' },
	{ label: __( '3:4 (Portrait)', 'b-blocks' ), value: '3:4' },
	{ label: __( 'Auto', 'b-blocks' ), value: 'auto' }
];

const RATIO_CSS = {
	'16:9': '16 / 9',
	'4:3': '4 / 3',
	'1:1': '1 / 1',
	'3:2': '3 / 2',
	'3:4': '3 / 4',
	auto: 'auto'
};

const filterImages = value => {
	if ( ! Array.isArray( value ) ) {
		return [];
	}
	return value.map( val => ( {
		id: val?.id,
		url: val?.url,
		alt: val?.alt || '',
		caption: typeof val?.caption === 'string' ? val.caption : ''
	} ) );
};

const Edit = props => {
	const { attributes, setAttributes } = props;
	const {
		images,
		layout,
		slidesPerView,
		gap,
		aspectRatio,
		imageSize,
		objectFit,
		showCaptions,
		captionColor,
		captionFontSize,
		showArrows,
		arrowColor,
		arrowBgColor,
		arrowSize,
		showDots,
		dotColor,
		dotActiveColor,
		dotSize,
		showThumbnails,
		thumbnailHeight,
		thumbnailGap,
		autoplay,
		autoplayDelay,
		pauseOnHover,
		loop,
		speed,
		effect,
		lightbox,
		borderRadius,
		maxWidth
	} = attributes;

	const blockProps = useBlockProps();

	const updateImageField = ( index, field, value ) => {
		const next = images.map( ( img, i ) =>
			i === index ? { ...img, [ field ]: value } : img
		);
		setAttributes( { images: next } );
	};

	const removeImage = index => {
		setAttributes( { images: images.filter( ( _, i ) => i !== index ) } );
	};

	const moveImage = ( index, dir ) => {
		const target = index + dir;
		if ( target < 0 || target >= images.length ) {
			return;
		}
		const next = [ ...images ];
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		setAttributes( { images: next } );
	};

	const ratioCss = RATIO_CSS[ aspectRatio ] || '16 / 9';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Images', 'b-blocks' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							multiple
							gallery
							value={ images.map( img => img.id ).filter( Boolean ) }
							onSelect={ media => setAttributes( { images: filterImages( media ) } ) }
							render={ ( { open } ) => (
								<Button variant="secondary" onClick={ open } style={ { marginBottom: '12px' } }>
									{ images.length ? __( 'Edit / Add Images', 'b-blocks' ) : __( 'Add Images', 'b-blocks' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					{ images.map( ( img, index ) => (
						<div key={ img.id || index } className="bb-is-editor-fields" style={ { borderTop: '1px solid #e0e0e0', paddingTop: '10px', marginBottom: '6px' } }>
							<PanelRow>
								<strong>{ __( 'Image', 'b-blocks' ) } { index + 1 }</strong>
								<span>
									<Button size="small" icon="arrow-up-alt2" label={ __( 'Move up', 'b-blocks' ) } disabled={ index === 0 } onClick={ () => moveImage( index, -1 ) } />
									<Button size="small" icon="arrow-down-alt2" label={ __( 'Move down', 'b-blocks' ) } disabled={ index === images.length - 1 } onClick={ () => moveImage( index, 1 ) } />
									<Button size="small" icon="trash" isDestructive label={ __( 'Remove', 'b-blocks' ) } onClick={ () => removeImage( index ) } />
								</span>
							</PanelRow>
							<TextControl
								label={ __( 'Alt text', 'b-blocks' ) }
								value={ img.alt || '' }
								onChange={ value => updateImageField( index, 'alt', value ) }
							/>
							<TextControl
								label={ __( 'Caption', 'b-blocks' ) }
								value={ img.caption || '' }
								onChange={ value => updateImageField( index, 'caption', value ) }
							/>
						</div>
					) ) }
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Layout', 'b-blocks' ) }
						value={ layout }
						options={ [
							{ label: __( 'Slide (one at a time)', 'b-blocks' ), value: 'slide' },
							{ label: __( 'Multi-slide', 'b-blocks' ), value: 'multi' }
						] }
						onChange={ value => setAttributes( { layout: value } ) }
					/>

					{ layout === 'multi' && (
						<>
							<RangeControl
								label={ __( 'Slides Per View (Desktop)', 'b-blocks' ) }
								value={ slidesPerView.desktop }
								onChange={ value => setAttributes( { slidesPerView: { ...slidesPerView, desktop: value } } ) }
								min={ 1 } max={ 4 }
							/>
							<RangeControl
								label={ __( 'Slides Per View (Tablet)', 'b-blocks' ) }
								value={ slidesPerView.tablet }
								onChange={ value => setAttributes( { slidesPerView: { ...slidesPerView, tablet: value } } ) }
								min={ 1 } max={ 4 }
							/>
							<RangeControl
								label={ __( 'Slides Per View (Mobile)', 'b-blocks' ) }
								value={ slidesPerView.mobile }
								onChange={ value => setAttributes( { slidesPerView: { ...slidesPerView, mobile: value } } ) }
								min={ 1 } max={ 4 }
							/>
							<RangeControl
								label={ __( 'Gap Between Slides (px)', 'b-blocks' ) }
								value={ gap }
								onChange={ value => setAttributes( { gap: value } ) }
								min={ 0 } max={ 80 }
							/>
						</>
					) }

					<SelectControl
						label={ __( 'Aspect Ratio', 'b-blocks' ) }
						value={ aspectRatio }
						options={ RATIO_OPTIONS }
						onChange={ value => setAttributes( { aspectRatio: value } ) }
					/>
					<SelectControl
						label={ __( 'Object Fit', 'b-blocks' ) }
						value={ objectFit }
						options={ [
							{ label: __( 'Cover', 'b-blocks' ), value: 'cover' },
							{ label: __( 'Contain', 'b-blocks' ), value: 'contain' }
						] }
						onChange={ value => setAttributes( { objectFit: value } ) }
					/>
					<SelectControl
						label={ __( 'Image Size', 'b-blocks' ) }
						value={ imageSize }
						options={ [
							{ label: __( 'Thumbnail', 'b-blocks' ), value: 'thumbnail' },
							{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
							{ label: __( 'Large', 'b-blocks' ), value: 'large' },
							{ label: __( 'Full', 'b-blocks' ), value: 'full' }
						] }
						onChange={ value => setAttributes( { imageSize: value } ) }
					/>
					<RangeControl
						label={ __( 'Border Radius (px)', 'b-blocks' ) }
						value={ borderRadius }
						onChange={ value => setAttributes( { borderRadius: value } ) }
						min={ 0 } max={ 48 }
					/>
					<RangeControl
						label={ __( 'Max Width (px)', 'b-blocks' ) }
						help={ maxWidth === 0 ? __( 'Full width', 'b-blocks' ) : undefined }
						value={ maxWidth }
						onChange={ value => setAttributes( { maxWidth: value } ) }
						min={ 0 } max={ 1600 } step={ 10 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Navigation', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show Arrows', 'b-blocks' ) }
						checked={ showArrows }
						onChange={ value => setAttributes( { showArrows: value } ) }
					/>
					{ showArrows && (
						<>
							<BaseControl label={ __( 'Arrow Color', 'b-blocks' ) }>
								<ColorPalette value={ arrowColor } onChange={ value => setAttributes( { arrowColor: value || '' } ) } />
							</BaseControl>
							<BaseControl label={ __( 'Arrow Background Color', 'b-blocks' ) }>
								<ColorPalette value={ arrowBgColor } onChange={ value => setAttributes( { arrowBgColor: value || '' } ) } />
							</BaseControl>
							<RangeControl
								label={ __( 'Arrow Size (px)', 'b-blocks' ) }
								value={ arrowSize }
								onChange={ value => setAttributes( { arrowSize: value } ) }
								min={ 24 } max={ 80 }
							/>
						</>
					) }

					<ToggleControl
						label={ __( 'Show Dots', 'b-blocks' ) }
						checked={ showDots }
						onChange={ value => setAttributes( { showDots: value } ) }
					/>
					{ showDots && (
						<>
							<BaseControl label={ __( 'Dot Color', 'b-blocks' ) }>
								<ColorPalette value={ dotColor } onChange={ value => setAttributes( { dotColor: value || '' } ) } />
							</BaseControl>
							<BaseControl label={ __( 'Active Dot Color', 'b-blocks' ) }>
								<ColorPalette value={ dotActiveColor } onChange={ value => setAttributes( { dotActiveColor: value || '' } ) } />
							</BaseControl>
							<RangeControl
								label={ __( 'Dot Size (px)', 'b-blocks' ) }
								value={ dotSize }
								onChange={ value => setAttributes( { dotSize: value } ) }
								min={ 4 } max={ 24 }
							/>
						</>
					) }

					<ToggleControl
						label={ __( 'Show Thumbnails', 'b-blocks' ) }
						checked={ showThumbnails }
						onChange={ value => setAttributes( { showThumbnails: value } ) }
					/>
					{ showThumbnails && (
						<>
							<RangeControl
								label={ __( 'Thumbnail Height (px)', 'b-blocks' ) }
								value={ thumbnailHeight }
								onChange={ value => setAttributes( { thumbnailHeight: value } ) }
								min={ 32 } max={ 160 }
							/>
							<RangeControl
								label={ __( 'Thumbnail Gap (px)', 'b-blocks' ) }
								value={ thumbnailGap }
								onChange={ value => setAttributes( { thumbnailGap: value } ) }
								min={ 0 } max={ 24 }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Autoplay & Motion', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Autoplay', 'b-blocks' ) }
						checked={ autoplay }
						onChange={ value => setAttributes( { autoplay: value } ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Delay (ms)', 'b-blocks' ) }
								value={ autoplayDelay }
								onChange={ value => setAttributes( { autoplayDelay: value } ) }
								min={ 500 } max={ 10000 } step={ 100 }
							/>
							<ToggleControl
								label={ __( 'Pause on Hover', 'b-blocks' ) }
								checked={ pauseOnHover }
								onChange={ value => setAttributes( { pauseOnHover: value } ) }
							/>
						</>
					) }
					<ToggleControl
						label={ __( 'Loop', 'b-blocks' ) }
						checked={ loop }
						onChange={ value => setAttributes( { loop: value } ) }
					/>
					<RangeControl
						label={ __( 'Transition Speed (ms)', 'b-blocks' ) }
						value={ speed }
						onChange={ value => setAttributes( { speed: value } ) }
						min={ 100 } max={ 1500 } step={ 10 }
					/>
					<SelectControl
						label={ __( 'Transition Effect', 'b-blocks' ) }
						value={ effect }
						options={ [
							{ label: __( 'Slide', 'b-blocks' ), value: 'slide' },
							{ label: __( 'Fade', 'b-blocks' ), value: 'fade' }
						] }
						onChange={ value => setAttributes( { effect: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Captions', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show Captions', 'b-blocks' ) }
						checked={ showCaptions }
						onChange={ value => setAttributes( { showCaptions: value } ) }
					/>
					{ showCaptions && (
						<>
							<BaseControl label={ __( 'Caption Color', 'b-blocks' ) }>
								<ColorPalette value={ captionColor } onChange={ value => setAttributes( { captionColor: value || '' } ) } />
							</BaseControl>
							<RangeControl
								label={ __( 'Caption Font Size (px)', 'b-blocks' ) }
								value={ captionFontSize }
								onChange={ value => setAttributes( { captionFontSize: value } ) }
								min={ 10 } max={ 24 }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Lightbox', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Enable Lightbox', 'b-blocks' ) }
						help={ __( 'Open full-size images in a fullscreen dialog on click.', 'b-blocks' ) }
						checked={ lightbox }
						onChange={ value => setAttributes( { lightbox: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ images.length === 0 ? (
					<Placeholder
						className="bb-is-editor-empty"
						icon="images-alt2"
						label={ __( 'Image Slider', 'b-blocks' ) }
						instructions={ __( 'Select images from your media library to build the slider.', 'b-blocks' ) }
					>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								multiple
								gallery
								value={ [] }
								onSelect={ media => setAttributes( { images: filterImages( media ) } ) }
								render={ ( { open } ) => (
									<Button variant="primary" onClick={ open }>
										{ __( 'Add Images', 'b-blocks' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					</Placeholder>
				) : (
					<div className="bb-is-editor-grid">
						{ images.map( ( img, index ) => (
							<figure key={ img.id || index } className="bb-is-editor-item">
								<span className="bb-is-editor-index">{ index + 1 }</span>
								<img
									src={ img.url }
									alt={ img.alt || '' }
									style={ {
										aspectRatio: ratioCss,
										objectFit: objectFit === 'contain' ? 'contain' : 'cover',
										borderRadius: `${ borderRadius }px`
									} }
								/>
								{ showCaptions && img.caption && (
									<figcaption
										style={ {
											fontSize: `${ captionFontSize }px`,
											color: captionColor || undefined,
											textAlign: 'center',
											padding: '6px'
										} }
									>
										{ img.caption }
									</figcaption>
								) }
							</figure>
						) ) }
					</div>
				) }
			</div>
		</>
	);
};

export default Edit;
