import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
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
	TextareaControl,
	ToggleControl,
	SelectControl,
	RangeControl,
	ColorPalette,
	BaseControl
} from '@wordpress/components';

const clamp = ( value, min, max ) => Math.max( min, Math.min( max, value ) );

const makeKey = () =>
	`ts-${ Date.now().toString( 36 ) }-${ Math.random().toString( 36 ).slice( 2, 8 ) }`;

const newItem = () => ( {
	_key: makeKey(),
	quote: '',
	authorName: '',
	authorRole: '',
	authorCompany: '',
	authorImageId: 0,
	authorImageUrl: '',
	authorImageAlt: '',
	rating: 5
} );

const FONT_WEIGHTS = [
	{ label: __( 'Light (300)', 'b-blocks' ), value: '300' },
	{ label: __( 'Regular (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semibold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' }
];

const NAME_WEIGHTS = [
	{ label: __( 'Regular (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semibold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' }
];

const Star = ( { on, size, color } ) => (
	<svg
		className={ `bb-ts-star ${ on ? 'bb-ts-star--on' : 'bb-ts-star--off' }` }
		viewBox="0 0 24 24"
		width={ size }
		height={ size }
		aria-hidden="true"
		focusable="false"
	>
		<path
			fill={ on ? color : '#d1d5db' }
			d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
		/>
	</svg>
);

const Edit = ( props ) => {
	const { attributes, setAttributes } = props;
	const {
		items,
		layout,
		slidesVisible,
		autoPlay,
		autoPlaySpeed,
		loop,
		showArrows,
		showDots,
		slideGap,
		quoteIcon,
		showRating,
		avatarSize,
		avatarShape,
		cardBg,
		cardBorderRadius,
		cardPaddingV,
		cardPaddingH,
		cardShadow,
		cardBorderWidth,
		cardBorderColor,
		quoteColor,
		quoteFontSize,
		quoteFontWeight,
		quoteIconColor,
		quoteIconSize,
		authorNameColor,
		authorNameFontSize,
		authorNameFontWeight,
		authorMetaColor,
		authorMetaFontSize,
		starColor,
		starSize,
		arrowBg,
		arrowColor,
		arrowSize,
		arrowBorderRadius,
		dotColor,
		dotActiveColor,
		dotSize,
		transitionSpeed,
		alignment,
		maxWidth
	} = attributes;

	const blockProps = useBlockProps();

	const updateItem = ( index, fields ) => {
		const next = items.map( ( it, i ) =>
			i === index ? { ...it, ...fields } : it
		);
		setAttributes( { items: next } );
	};

	const addItem = () => {
		if ( items.length >= 20 ) {
			return;
		}
		setAttributes( { items: [ ...items, newItem() ] } );
	};

	const removeItem = ( index ) => {
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	};

	const moveItem = ( index, dir ) => {
		const target = index + dir;
		if ( target < 0 || target >= items.length ) {
			return;
		}
		const next = [ ...items ];
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		setAttributes( { items: next } );
	};

	const safeStarSize = clamp( parseInt( starSize, 10 ) || 16, 10, 28 );
	const safeAvatarSize = clamp( parseInt( avatarSize, 10 ) || 56, 32, 120 );

	const avatarRadius =
		avatarShape === 'rounded' ? '12px' : avatarShape === 'square' ? '0px' : '50%';

	const shadowMap = {
		none: 'none',
		small: '0 1px 3px rgba(0,0,0,0.10)',
		medium: '0 4px 16px rgba(0,0,0,0.10)',
		large: '0 10px 30px rgba(0,0,0,0.15)'
	};

	const cardStyle = {
		'--bb-ts-gap': `${ clamp( slideGap, 0, 80 ) }px`,
		backgroundColor: layout === 'minimal' ? 'transparent' : cardBg || '#ffffff',
		borderRadius: `${ clamp( cardBorderRadius, 0, 48 ) }px`,
		padding:
			layout === 'minimal'
				? `${ clamp( cardPaddingV, 8, 80 ) }px 0`
				: `${ clamp( cardPaddingV, 8, 80 ) }px ${ clamp( cardPaddingH, 8, 80 ) }px`,
		boxShadow: layout === 'minimal' ? 'none' : shadowMap[ cardShadow ] || 'none',
		border:
			layout === 'minimal' || cardBorderWidth < 1
				? '0'
				: `${ clamp( cardBorderWidth, 0, 4 ) }px solid ${ cardBorderColor || '#e5e7eb' }`,
		textAlign: alignment,
		display: 'flex',
		flexDirection: 'column',
		gap: '14px',
		alignItems: alignment === 'center' ? 'center' : 'flex-start'
	};

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={ alignment }
					onChange={ ( val ) =>
						setAttributes( { alignment: val === 'left' ? 'left' : 'center' } )
					}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Testimonials', 'b-blocks' ) } initialOpen={ true }>
					<p className="bb-ts-editor-hint">
						{ sprintf(
							/* translators: 1: current count, 2: max count. */
							__( '%1$d of %2$d testimonials.', 'b-blocks' ),
							items.length,
							20
						) }
					</p>

					{ items.map( ( item, index ) => (
						<div key={ item._key || index } className="bb-ts-item-panel">
							<PanelRow>
								<strong>
									{ __( 'Testimonial', 'b-blocks' ) } { index + 1 }
								</strong>
								<span>
									<Button
										size="small"
										icon="arrow-up-alt2"
										label={ __( 'Move up', 'b-blocks' ) }
										disabled={ index === 0 }
										onClick={ () => moveItem( index, -1 ) }
									/>
									<Button
										size="small"
										icon="arrow-down-alt2"
										label={ __( 'Move down', 'b-blocks' ) }
										disabled={ index === items.length - 1 }
										onClick={ () => moveItem( index, 1 ) }
									/>
									<Button
										size="small"
										icon="trash"
										isDestructive
										label={ __( 'Remove', 'b-blocks' ) }
										onClick={ () => removeItem( index ) }
									/>
								</span>
							</PanelRow>

							<TextareaControl
								label={ __( 'Quote', 'b-blocks' ) }
								value={ item.quote || '' }
								onChange={ ( value ) => updateItem( index, { quote: value } ) }
							/>
							<TextControl
								label={ __( 'Author Name', 'b-blocks' ) }
								value={ item.authorName || '' }
								onChange={ ( value ) =>
									updateItem( index, { authorName: value } )
								}
							/>
							<TextControl
								label={ __( 'Author Role', 'b-blocks' ) }
								value={ item.authorRole || '' }
								onChange={ ( value ) =>
									updateItem( index, { authorRole: value } )
								}
							/>
							<TextControl
								label={ __( 'Author Company', 'b-blocks' ) }
								value={ item.authorCompany || '' }
								onChange={ ( value ) =>
									updateItem( index, { authorCompany: value } )
								}
							/>

							<BaseControl label={ __( 'Avatar', 'b-blocks' ) }>
								<div className="bb-ts-item-avatar-row">
									{ item.authorImageUrl && (
										<img
											src={ item.authorImageUrl }
											alt={ item.authorImageAlt || '' }
										/>
									) }
									<MediaUploadCheck>
										<MediaUpload
											allowedTypes={ [ 'image' ] }
											value={ item.authorImageId || 0 }
											onSelect={ ( media ) =>
												updateItem( index, {
													authorImageId: media.id,
													authorImageUrl: media.url,
													authorImageAlt: media.alt || ''
												} )
											}
											render={ ( { open } ) => (
												<Button variant="secondary" onClick={ open }>
													{ item.authorImageUrl
														? __( 'Replace', 'b-blocks' )
														: __( 'Select Avatar', 'b-blocks' ) }
												</Button>
											) }
										/>
									</MediaUploadCheck>
									{ item.authorImageUrl && (
										<Button
											variant="tertiary"
											isDestructive
											onClick={ () =>
												updateItem( index, {
													authorImageId: 0,
													authorImageUrl: '',
													authorImageAlt: ''
												} )
											}
										>
											{ __( 'Remove', 'b-blocks' ) }
										</Button>
									) }
								</div>
							</BaseControl>

							<RangeControl
								label={ __( 'Rating', 'b-blocks' ) }
								value={ item.rating ?? 5 }
								onChange={ ( value ) =>
									updateItem( index, { rating: value } )
								}
								min={ 0 }
								max={ 5 }
								step={ 0.5 }
							/>
						</div>
					) ) }

					<Button
						variant="primary"
						onClick={ addItem }
						disabled={ items.length >= 20 }
						style={ { marginTop: '8px' } }
					>
						{ __( 'Add Testimonial', 'b-blocks' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'b-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Style', 'b-blocks' ) }
						value={ layout }
						options={ [
							{ label: __( 'Card', 'b-blocks' ), value: 'card' },
							{ label: __( 'Minimal', 'b-blocks' ), value: 'minimal' }
						] }
						onChange={ ( value ) => setAttributes( { layout: value } ) }
					/>
					<SelectControl
						label={ __( 'Content Alignment', 'b-blocks' ) }
						value={ alignment }
						options={ [
							{ label: __( 'Left', 'b-blocks' ), value: 'left' },
							{ label: __( 'Center', 'b-blocks' ), value: 'center' }
						] }
						onChange={ ( value ) => setAttributes( { alignment: value } ) }
					/>
					<RangeControl
						label={ __( 'Slides Per Row (Desktop)', 'b-blocks' ) }
						value={ slidesVisible.desktop }
						onChange={ ( value ) =>
							setAttributes( {
								slidesVisible: { ...slidesVisible, desktop: value }
							} )
						}
						min={ 1 }
						max={ 4 }
					/>
					<RangeControl
						label={ __( 'Slides Per Row (Tablet)', 'b-blocks' ) }
						value={ slidesVisible.tablet }
						onChange={ ( value ) =>
							setAttributes( {
								slidesVisible: { ...slidesVisible, tablet: value }
							} )
						}
						min={ 1 }
						max={ 3 }
					/>
					<RangeControl
						label={ __( 'Slides Per Row (Mobile)', 'b-blocks' ) }
						value={ slidesVisible.mobile }
						onChange={ ( value ) =>
							setAttributes( {
								slidesVisible: { ...slidesVisible, mobile: value }
							} )
						}
						min={ 1 }
						max={ 2 }
					/>
					<RangeControl
						label={ __( 'Slide Gap (px)', 'b-blocks' ) }
						value={ slideGap }
						onChange={ ( value ) => setAttributes( { slideGap: value } ) }
						min={ 0 }
						max={ 80 }
					/>
					<RangeControl
						label={ __( 'Max Width (px)', 'b-blocks' ) }
						help={ maxWidth === 0 ? __( 'Full width', 'b-blocks' ) : undefined }
						value={ maxWidth }
						onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
						min={ 0 }
						max={ 1600 }
						step={ 10 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Card Style', 'b-blocks' ) } initialOpen={ false }>
					<BaseControl label={ __( 'Background Color', 'b-blocks' ) }>
						<ColorPalette
							value={ cardBg }
							onChange={ ( value ) => setAttributes( { cardBg: value || '' } ) }
						/>
					</BaseControl>
					<RangeControl
						label={ __( 'Border Radius (px)', 'b-blocks' ) }
						value={ cardBorderRadius }
						onChange={ ( value ) =>
							setAttributes( { cardBorderRadius: value } )
						}
						min={ 0 }
						max={ 48 }
					/>
					<RangeControl
						label={ __( 'Vertical Padding (px)', 'b-blocks' ) }
						value={ cardPaddingV }
						onChange={ ( value ) => setAttributes( { cardPaddingV: value } ) }
						min={ 8 }
						max={ 80 }
					/>
					<RangeControl
						label={ __( 'Horizontal Padding (px)', 'b-blocks' ) }
						value={ cardPaddingH }
						onChange={ ( value ) => setAttributes( { cardPaddingH: value } ) }
						min={ 8 }
						max={ 80 }
					/>
					<SelectControl
						label={ __( 'Shadow', 'b-blocks' ) }
						value={ cardShadow }
						options={ [
							{ label: __( 'None', 'b-blocks' ), value: 'none' },
							{ label: __( 'Small', 'b-blocks' ), value: 'small' },
							{ label: __( 'Medium', 'b-blocks' ), value: 'medium' },
							{ label: __( 'Large', 'b-blocks' ), value: 'large' }
						] }
						onChange={ ( value ) => setAttributes( { cardShadow: value } ) }
					/>
					<RangeControl
						label={ __( 'Border Width (px)', 'b-blocks' ) }
						value={ cardBorderWidth }
						onChange={ ( value ) =>
							setAttributes( { cardBorderWidth: value } )
						}
						min={ 0 }
						max={ 4 }
					/>
					{ cardBorderWidth > 0 && (
						<BaseControl label={ __( 'Border Color', 'b-blocks' ) }>
							<ColorPalette
								value={ cardBorderColor }
								onChange={ ( value ) =>
									setAttributes( { cardBorderColor: value || '' } )
								}
							/>
						</BaseControl>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Content Style', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show Quote Icon', 'b-blocks' ) }
						checked={ quoteIcon }
						onChange={ ( value ) => setAttributes( { quoteIcon: value } ) }
					/>
					{ quoteIcon && (
						<>
							<RangeControl
								label={ __( 'Quote Icon Size (px)', 'b-blocks' ) }
								value={ quoteIconSize }
								onChange={ ( value ) =>
									setAttributes( { quoteIconSize: value } )
								}
								min={ 24 }
								max={ 80 }
							/>
							<BaseControl label={ __( 'Quote Icon Color', 'b-blocks' ) }>
								<ColorPalette
									value={ quoteIconColor }
									onChange={ ( value ) =>
										setAttributes( { quoteIconColor: value || '' } )
									}
								/>
							</BaseControl>
						</>
					) }

					<RangeControl
						label={ __( 'Quote Font Size — Desktop (px)', 'b-blocks' ) }
						value={ quoteFontSize.desktop }
						onChange={ ( value ) =>
							setAttributes( {
								quoteFontSize: { ...quoteFontSize, desktop: value }
							} )
						}
						min={ 12 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Quote Font Size — Tablet (px)', 'b-blocks' ) }
						value={ quoteFontSize.tablet }
						onChange={ ( value ) =>
							setAttributes( {
								quoteFontSize: { ...quoteFontSize, tablet: value }
							} )
						}
						min={ 12 }
						max={ 32 }
					/>
					<RangeControl
						label={ __( 'Quote Font Size — Mobile (px)', 'b-blocks' ) }
						value={ quoteFontSize.mobile }
						onChange={ ( value ) =>
							setAttributes( {
								quoteFontSize: { ...quoteFontSize, mobile: value }
							} )
						}
						min={ 12 }
						max={ 32 }
					/>
					<SelectControl
						label={ __( 'Quote Font Weight', 'b-blocks' ) }
						value={ quoteFontWeight }
						options={ FONT_WEIGHTS }
						onChange={ ( value ) =>
							setAttributes( { quoteFontWeight: value } )
						}
					/>
					<BaseControl label={ __( 'Quote Color', 'b-blocks' ) }>
						<ColorPalette
							value={ quoteColor }
							onChange={ ( value ) =>
								setAttributes( { quoteColor: value || '' } )
							}
						/>
					</BaseControl>

					<ToggleControl
						label={ __( 'Show Star Rating', 'b-blocks' ) }
						checked={ showRating }
						onChange={ ( value ) => setAttributes( { showRating: value } ) }
					/>
					{ showRating && (
						<>
							<BaseControl label={ __( 'Star Color', 'b-blocks' ) }>
								<ColorPalette
									value={ starColor }
									onChange={ ( value ) =>
										setAttributes( { starColor: value || '#F59E0B' } )
									}
								/>
							</BaseControl>
							<RangeControl
								label={ __( 'Star Size (px)', 'b-blocks' ) }
								value={ starSize }
								onChange={ ( value ) => setAttributes( { starSize: value } ) }
								min={ 10 }
								max={ 28 }
							/>
						</>
					) }

					<RangeControl
						label={ __( 'Author Name Font Size (px)', 'b-blocks' ) }
						value={ authorNameFontSize }
						onChange={ ( value ) =>
							setAttributes( { authorNameFontSize: value } )
						}
						min={ 12 }
						max={ 28 }
					/>
					<SelectControl
						label={ __( 'Author Name Font Weight', 'b-blocks' ) }
						value={ authorNameFontWeight }
						options={ NAME_WEIGHTS }
						onChange={ ( value ) =>
							setAttributes( { authorNameFontWeight: value } )
						}
					/>
					<BaseControl label={ __( 'Author Name Color', 'b-blocks' ) }>
						<ColorPalette
							value={ authorNameColor }
							onChange={ ( value ) =>
								setAttributes( { authorNameColor: value || '' } )
							}
						/>
					</BaseControl>
					<RangeControl
						label={ __( 'Author Meta Font Size (px)', 'b-blocks' ) }
						value={ authorMetaFontSize }
						onChange={ ( value ) =>
							setAttributes( { authorMetaFontSize: value } )
						}
						min={ 10 }
						max={ 24 }
					/>
					<BaseControl label={ __( 'Author Meta Color', 'b-blocks' ) }>
						<ColorPalette
							value={ authorMetaColor }
							onChange={ ( value ) =>
								setAttributes( { authorMetaColor: value || '' } )
							}
						/>
					</BaseControl>
					<RangeControl
						label={ __( 'Avatar Size (px)', 'b-blocks' ) }
						value={ avatarSize }
						onChange={ ( value ) => setAttributes( { avatarSize: value } ) }
						min={ 32 }
						max={ 120 }
					/>
					<SelectControl
						label={ __( 'Avatar Shape', 'b-blocks' ) }
						value={ avatarShape }
						options={ [
							{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
							{ label: __( 'Rounded', 'b-blocks' ), value: 'rounded' },
							{ label: __( 'Square', 'b-blocks' ), value: 'square' }
						] }
						onChange={ ( value ) => setAttributes( { avatarShape: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Navigation', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show Arrows', 'b-blocks' ) }
						checked={ showArrows }
						onChange={ ( value ) => setAttributes( { showArrows: value } ) }
					/>
					{ showArrows && (
						<>
							<RangeControl
								label={ __( 'Arrow Size (px)', 'b-blocks' ) }
								value={ arrowSize }
								onChange={ ( value ) =>
									setAttributes( { arrowSize: value } )
								}
								min={ 24 }
								max={ 64 }
							/>
							<BaseControl label={ __( 'Arrow Background Color', 'b-blocks' ) }>
								<ColorPalette
									value={ arrowBg }
									onChange={ ( value ) =>
										setAttributes( { arrowBg: value || '' } )
									}
								/>
							</BaseControl>
							<BaseControl label={ __( 'Arrow Icon Color', 'b-blocks' ) }>
								<ColorPalette
									value={ arrowColor }
									onChange={ ( value ) =>
										setAttributes( { arrowColor: value || '' } )
									}
								/>
							</BaseControl>
							<RangeControl
								label={ __( 'Arrow Border Radius (%)', 'b-blocks' ) }
								value={ arrowBorderRadius }
								onChange={ ( value ) =>
									setAttributes( { arrowBorderRadius: value } )
								}
								min={ 0 }
								max={ 50 }
							/>
						</>
					) }

					<ToggleControl
						label={ __( 'Show Dots', 'b-blocks' ) }
						checked={ showDots }
						onChange={ ( value ) => setAttributes( { showDots: value } ) }
					/>
					{ showDots && (
						<>
							<RangeControl
								label={ __( 'Dot Size (px)', 'b-blocks' ) }
								value={ dotSize }
								onChange={ ( value ) => setAttributes( { dotSize: value } ) }
								min={ 4 }
								max={ 16 }
							/>
							<BaseControl label={ __( 'Dot Color', 'b-blocks' ) }>
								<ColorPalette
									value={ dotColor }
									onChange={ ( value ) =>
										setAttributes( { dotColor: value || '' } )
									}
								/>
							</BaseControl>
							<BaseControl label={ __( 'Active Dot Color', 'b-blocks' ) }>
								<ColorPalette
									value={ dotActiveColor }
									onChange={ ( value ) =>
										setAttributes( { dotActiveColor: value || '' } )
									}
								/>
							</BaseControl>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Behavior', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Auto Play', 'b-blocks' ) }
						checked={ autoPlay }
						onChange={ ( value ) => setAttributes( { autoPlay: value } ) }
					/>
					{ autoPlay && (
						<RangeControl
							label={ __( 'Auto Play Speed (ms)', 'b-blocks' ) }
							value={ autoPlaySpeed }
							onChange={ ( value ) =>
								setAttributes( { autoPlaySpeed: value } )
							}
							min={ 1000 }
							max={ 10000 }
							step={ 250 }
						/>
					) }
					<ToggleControl
						label={ __( 'Loop', 'b-blocks' ) }
						checked={ loop }
						onChange={ ( value ) => setAttributes( { loop: value } ) }
					/>
					<RangeControl
						label={ __( 'Transition Speed (ms)', 'b-blocks' ) }
						value={ transitionSpeed }
						onChange={ ( value ) =>
							setAttributes( { transitionSpeed: value } )
						}
						min={ 100 }
						max={ 800 }
						step={ 10 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ items.length === 0 ? (
					<Placeholder
						className="bb-ts-editor-empty"
						icon="format-quote"
						label={ __( 'Testimonial Slider', 'b-blocks' ) }
						instructions={ __(
							'Add testimonials from the sidebar to build the slider.',
							'b-blocks'
						) }
					>
						<Button variant="primary" onClick={ addItem }>
							{ __( 'Add Testimonial', 'b-blocks' ) }
						</Button>
					</Placeholder>
				) : (
					<div
						className="bb-ts-editor-grid"
						style={ { '--bb-ts-gap': `${ clamp( slideGap, 0, 80 ) }px` } }
					>
						{ items.map( ( item, index ) => {
							const rating = clamp(
								Math.round( parseFloat( item.rating ) || 0 ),
								0,
								5
							);
							const metaItems = [];
							if ( item.authorRole ) {
								metaItems.push( item.authorRole );
							}
							if ( item.authorCompany ) {
								metaItems.push( item.authorCompany );
							}
							return (
								<figure
									key={ item._key || index }
									className="bb-ts-card"
									style={ cardStyle }
								>
									{ quoteIcon && (
										<svg
											className="bb-ts-quote-icon"
											viewBox="0 0 24 24"
											width={ clamp( quoteIconSize, 24, 80 ) }
											height={ clamp( quoteIconSize, 24, 80 ) }
											aria-hidden="true"
											focusable="false"
											style={ {
												color: quoteIconColor || starColor || '#F59E0B'
											} }
										>
											<path
												fill="currentColor"
												d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6z"
											/>
										</svg>
									) }

									{ showRating && rating > 0 && (
										<span
											className="bb-ts-stars"
											role="img"
											aria-label={ sprintf(
												/* translators: %d: rating value out of 5 */
												__( 'Rating: %d out of 5 stars', 'b-blocks' ),
												rating
											) }
											style={ {
												display: 'inline-flex',
												gap: '2px',
												justifyContent:
													alignment === 'center'
														? 'center'
														: 'flex-start'
											} }
										>
											{ [ 1, 2, 3, 4, 5 ].map( ( i ) => (
												<Star
													key={ i }
													on={ i <= rating }
													size={ safeStarSize }
													color={ starColor || '#F59E0B' }
												/>
											) ) }
										</span>
									) }

									<blockquote
										className="bb-ts-quote"
										style={ {
											margin: 0,
											fontSize: `${ clamp(
												quoteFontSize.desktop,
												12,
												32
											) }px`,
											fontWeight: quoteFontWeight,
											lineHeight: 1.6,
											color: quoteColor || undefined
										} }
									>
										{ item.quote ||
											__( 'Write the testimonial…', 'b-blocks' ) }
									</blockquote>

									<figcaption
										className="bb-ts-caption"
										style={ {
											display: 'flex',
											alignItems: 'center',
											gap: '12px',
											marginTop: 'auto',
											justifyContent:
												alignment === 'center'
													? 'center'
													: 'flex-start'
										} }
									>
										{ item.authorImageUrl && (
											<img
												className="bb-ts-avatar"
												src={ item.authorImageUrl }
												alt={ item.authorImageAlt || '' }
												width={ safeAvatarSize }
												height={ safeAvatarSize }
												style={ {
													width: `${ safeAvatarSize }px`,
													height: `${ safeAvatarSize }px`,
													objectFit: 'cover',
													borderRadius: avatarRadius
												} }
											/>
										) }
										{ ( item.authorName || metaItems.length > 0 ) && (
											<cite
												className="bb-ts-cite"
												style={ {
													display: 'flex',
													flexDirection: 'column',
													fontStyle: 'normal',
													textAlign: 'left'
												} }
											>
												{ item.authorName && (
													<span
														className="bb-ts-name"
														style={ {
															fontSize: `${ clamp(
																authorNameFontSize,
																12,
																28
															) }px`,
															fontWeight: authorNameFontWeight,
															color: authorNameColor || undefined
														} }
													>
														{ item.authorName }
													</span>
												) }
												{ metaItems.length > 0 && (
													<span
														className="bb-ts-meta"
														style={ {
															fontSize: `${ clamp(
																authorMetaFontSize,
																10,
																24
															) }px`,
															color: authorMetaColor || '#6b7280'
														} }
													>
														{ metaItems.join( ', ' ) }
													</span>
												) }
											</cite>
										) }
									</figcaption>
								</figure>
							);
						} ) }
					</div>
				) }
			</div>
		</>
	);
};

export default Edit;
