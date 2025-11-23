/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';

import { PanelBody, SelectControl, CheckboxControl, RangeControl, Spinner, Placeholder, ToggleControl, FontSizePicker, TextControl } from '@wordpress/components';

import { useSelect } from '@wordpress/data';

// import { store as coreDataStore } from '@wordpress/core-data';

import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { postType, selectedCategories, selectedPosts, selectAllCategories, speed, enableClick, textColor, backgroundColor, fontSize, fontWeight, fontFamily, headingText } = attributes;
	const [ availablePosts, setAvailablePosts ] = useState( [] );
	const [ isLoadingPosts, setIsLoadingPosts ] = useState( false );

	const postTypes = useSelect( ( select ) => {
		const { getPostTypes } = select(wp.coreData.store );
		const types = getPostTypes( { per_page: -1 } );
		return types?.filter( ( type ) => type.viewable ) || [];
	}, [] );

	const taxonomies = useSelect(
		( select ) => {
			if ( ! postType ) {
				return [];
			}

			const { getTaxonomies } = select(wp.coreData.store );
			const allTaxonomies = getTaxonomies( { per_page: -1 } ) || [];
			return allTaxonomies.filter(
				( taxonomy ) =>
					taxonomy.types.includes( postType ) &&
					taxonomy.visibility.publicly_queryable
			);
		},
		[ postType ]
	);

	const categories = useSelect(
		( select ) => {
			if ( !postType || taxonomies.length === 0 ) {
				return [];
			}

			const { getEntityRecords } = select(wp.coreData.store );
			const primaryTaxonomy = taxonomies[0];
			
			return getEntityRecords( 'taxonomy', primaryTaxonomy.slug, {
				per_page: -1,
			} ) || [];
		},
		[ postType, taxonomies ]
	);

	const { posts, isResolving } = useSelect(
		( select ) => {
			if ( ! postType ) {
				return { posts: [], isResolving: false };
			}

			const { getEntityRecords, isResolving: checkResolving } = select(wp.coreData.store );
			
			const queryArgs = {
				per_page: -1,
				status: 'publish',
				orderby: 'date',
				order: 'desc',
			};

			if ( selectedCategories.length > 0 && taxonomies.length > 0 ) {
				const primaryTaxonomy = taxonomies[0];
				queryArgs[ primaryTaxonomy.rest_base ] = selectedCategories;
			}
			
			return {
				posts: getEntityRecords( 'postType', postType, queryArgs ) || [],
				isResolving: checkResolving( 'getEntityRecords', [ 'postType', postType, queryArgs ] ),
			};
		},
		[ postType, selectedCategories, taxonomies ]
	);

	useEffect( () => {
		if ( ! isResolving ) {
			setAvailablePosts( posts );
			setIsLoadingPosts( false );
		} else {
			setIsLoadingPosts( true );
		}
	}, [ posts, isResolving ] );

	const selectedPostObjects = selectAllCategories && selectedCategories.length > 0 
		? availablePosts 
		: availablePosts.filter( ( post ) => selectedPosts.includes( post.id ) );

	const togglePost = ( postId ) => {
		const newSelection = selectedPosts.includes( postId )
			? selectedPosts.filter( ( id ) => id !== postId )
			: [ ...selectedPosts, postId ];
		setAttributes( { selectedPosts: newSelection } );
	};

	const toggleCategory = ( categoryId ) => {
		const newSelection = selectedCategories.includes( categoryId )
			? selectedCategories.filter( ( id ) => id !== categoryId )
			: [ ...selectedCategories, categoryId ];
		setAttributes( { 
			selectedCategories: newSelection, 
			selectedPosts: selectAllCategories ? [] : selectedPosts 
		} );
	};

	const postTypeOptions = postTypes.map( ( type ) => ( {
		label: type.name,
		value: type.slug,
	} ) );

	const fontSizes = [
		{ name: __( 'Small', 'b-blocks' ), size: 12, slug: 'small' },
		{ name: __( 'Normal', 'b-blocks' ), size: 15, slug: 'normal' },
		{ name: __( 'Medium', 'b-blocks' ), size: 18, slug: 'medium' },
		{ name: __( 'Large', 'b-blocks' ), size: 22, slug: 'large' },
		{ name: __( 'Extra Large', 'b-blocks' ), size: 28, slug: 'extra-large' },
	];

	const tickerStyle = {
		backgroundColor,
		color: textColor,
		fontSize: fontSize + 'px',
		fontWeight,
		fontFamily: fontFamily || undefined,
	};

	const isPagePostType = postType === 'page';
	const showCategoryPanel = categories.length > 0 && !isPagePostType;


	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Ticker Settings', 'b-blocks' ) }>
					<TextControl
						label={ __( 'Ticker Heading Text', 'b-blocks' ) }
						value={ headingText }
						onChange={ ( value ) => setAttributes( { headingText: value } ) }
						help={ __( 'Customize the heading text that appears on the ticker label', 'b-blocks' ) }
						placeholder={ __( 'News:', 'b-blocks' ) }
					/>
					<SelectControl
						label={ __( 'Post Type', 'b-blocks' ) }
						value={ postType }
						options={ postTypeOptions }
						onChange={ ( value ) => {
							setAttributes( { postType: value, selectedCategories: [], selectedPosts: [], selectAllCategories: false } );
						} }
					/>
					<RangeControl
						label={ __( 'Scrolling Speed', 'b-blocks' ) }
						value={ speed }
						onChange={ ( value ) => setAttributes( { speed: value } ) }
						min={ 10 }
						max={ 100 }
						help={ __( 'Lower values are slower, higher values are faster', 'b-blocks' ) }
					/>
					<ToggleControl
						label={ __( 'Enable Click to Post', 'b-blocks' ) }
						checked={ enableClick }
						onChange={ ( value ) => setAttributes( { enableClick: value } ) }
						help={ __( 'Allow users to click on ticker items to visit the post', 'b-blocks' ) }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings', 'b-blocks' ) }
					colorSettings={ [
						{
							value: textColor,
							onChange: ( value ) => setAttributes( { textColor: value || '#ffffff' } ),
							label: __( 'Text Color', 'b-blocks' ),
						},
						{
							value: backgroundColor,
							onChange: ( value ) => setAttributes( { backgroundColor: value || '#667eea' } ),
							label: __( 'Background Color', 'b-blocks' ),
						},
					] }
				/>
				<PanelBody title={ __( 'Typography', 'b-blocks' ) } initialOpen={ false }>
					<FontSizePicker
						fontSizes={ fontSizes }
						value={ fontSize }
						onChange={ ( value ) => setAttributes( { fontSize: value || 15 } ) }
					/>
					<SelectControl
						label={ __( 'Font Weight', 'b-blocks' ) }
						value={ fontWeight }
						options={ [
							{ label: __( 'Thin (100)', 'b-blocks' ), value: '100' },
							{ label: __( 'Extra Light (200)', 'b-blocks' ), value: '200' },
							{ label: __( 'Light (300)', 'b-blocks' ), value: '300' },
							{ label: __( 'Normal (400)', 'b-blocks' ), value: '400' },
							{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
							{ label: __( 'Semi Bold (600)', 'b-blocks' ), value: '600' },
							{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' },
							{ label: __( 'Extra Bold (800)', 'b-blocks' ), value: '800' },
							{ label: __( 'Black (900)', 'b-blocks' ), value: '900' },
						] }
						onChange={ ( value ) => setAttributes( { fontWeight: value } ) }
					/>
					<SelectControl
						label={ __( 'Font Family', 'b-blocks' ) }
						value={ fontFamily }
						options={ [
							{ label: __( 'Default', 'b-blocks' ), value: '' },
							{ label: 'Arial', value: 'Arial, sans-serif' },
							{ label: 'Helvetica', value: 'Helvetica, sans-serif' },
							{ label: 'Georgia', value: 'Georgia, serif' },
							{ label: 'Times New Roman', value: '"Times New Roman", serif' },
							{ label: 'Courier New', value: '"Courier New", monospace' },
							{ label: 'Verdana', value: 'Verdana, sans-serif' },
							{ label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
						] }
						onChange={ ( value ) => setAttributes( { fontFamily: value } ) }
					/>
				</PanelBody>
				{ showCategoryPanel && (
					<PanelBody title={ __( 'Filter by Category', 'b-blocks' ) } initialOpen={ true }>
						<ToggleControl
							label={ __( 'Select all entry of the following Category', 'b-blocks' ) }
							checked={ selectAllCategories }
							onChange={ ( value ) => {
								setAttributes( { 
									selectAllCategories: value,
									selectedPosts: value ? [] : selectedPosts
								} );
							} }
							help={ selectAllCategories ? __( 'All posts from selected categories will be shown. Individual post selection is disabled.', 'b-blocks' ) : __( 'Select categories to filter posts, then choose individual posts below.', 'b-blocks' ) }
						/>
						<div style={ { maxHeight: '200px', overflowY: 'auto', marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #ddd' } }>
							{ categories.map( ( category ) => (
								<CheckboxControl
									key={ category.id }
									label={ category.name }
									checked={ selectedCategories.includes( category.id ) }
									onChange={ () => toggleCategory( category.id ) }
								/>
							) ) }
						</div>
					</PanelBody>
				) }
				{ !selectAllCategories && (
					<PanelBody 
						title={ isPagePostType ? __( 'Select Pages', 'b-blocks' ) : __( 'Select Posts', 'b-blocks' ) } 
						initialOpen={ true }
					>
						{ isLoadingPosts ? (
							<Spinner />
						) : availablePosts.length === 0 ? (
							<p>
								{ isPagePostType 
									? __( 'No pages found.', 'b-blocks' )
									: __( 'No posts found for this post type and category selection.', 'b-blocks' )
								}
							</p>
						) : (
							<div style={ { maxHeight: '400px', overflowY: 'auto' } }>
								{ availablePosts.map( ( post ) => (
									<CheckboxControl
										key={ post.id }
										label={ post.title.rendered || __( '(no title)', 'b-blocks' ) }
										checked={ selectedPosts.includes( post.id ) }
										onChange={ () => togglePost( post.id ) }
									/>
								) ) }
							</div>
						) }
					</PanelBody>
				) }
				{ selectAllCategories && selectedCategories.length > 0 && (
					<PanelBody title={ __( 'Preview', 'b-blocks' ) } initialOpen={ false }>
						<p className="components-base-control__help">
							{ __( 'All posts from the selected categories will be displayed in the ticker.', 'b-blocks' ) }
							{ ' ' }
							{ availablePosts.length > 0 && (
								<strong>
									{ availablePosts.length }
									{ ' ' }
									{ availablePosts.length === 1 
										? __( 'post found', 'b-blocks' )
										: __( 'posts found', 'b-blocks' )
									}
								</strong>
							) }
						</p>
					</PanelBody>
				) }
			</InspectorControls>
			<div { ...useBlockProps( { style: tickerStyle } ) }>
				{ selectedPostObjects.length === 0 ? (
					<Placeholder
						icon="slides"
						label={ __( 'News Ticker', 'b-blocks' ) }
						instructions={ 
							isPagePostType
								? __( 'Select pages from the sidebar to display in the ticker.', 'b-blocks' )
								: selectAllCategories
									? __( 'Select categories from the sidebar to display all posts in the ticker.', 'b-blocks' )
									: __( 'Select posts from the sidebar to display in the ticker.', 'b-blocks' )
						}
					/>
				) : (
					<div className="news-ticker-wrapper">
						<div className="news-ticker-label" style={ { backgroundColor: 'rgba(0, 0, 0, 0.2)', color: textColor } }>
							{ headingText || __( 'News:', 'b-blocks' ) }
						</div>
						<div className="news-ticker-content">
							<div className="news-ticker-items">
								{ selectedPostObjects.map( ( post ) => (
									<span key={ post.id } className="news-ticker-item" style={ { color: textColor, fontSize: fontSize + 'px', fontWeight, fontFamily: fontFamily || undefined } }>
										{ post.title.rendered || __( '(no title)', 'b-blocks' ) }
									</span>
								) ) }
							</div>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
