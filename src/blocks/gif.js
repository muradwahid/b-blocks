const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { PanelBody, RangeControl, TextControl, IconButton } = wp.components;

// Icon
import icons from '../Const/icons';

// Variables
import options from '../Const/options';
const { sizeTypes } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

registerBlockType('b-blocks/gif', {
    // Build In attributes
    title: 'Gif Image',
    description: 'Embed gif image',
    icon: icons.gif,
    category: 'bBlocks',
    keywords: ['Gif', 'Image', 'Animated Image'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        search: { type: 'string', default: '' },
        gifsData: { type: 'array', default: [] },
        selectedData: { type: 'object', default: null },

        contentAlign: { type: 'string', default: 'left' },
        width: { type: 'number' },
        widthType: { type: 'string', default: 'px' }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { search, gifsData, selectedData, contentAlign, width, widthType }, setAttributes, isSelected, clientId } = props;

        const GIFAPI = "dM3iQq13qK0Mls9ygR2zjxxPDQVlw1Ql";

        // First Trending
        search === '' && useEffect(() => {
            let url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIFAPI}&limit=25`;

            fetch(url).then(res => res.json()).then(data => {
                setAttributes({ gifsData: data.data });
            }).catch(err => {
                console.error(err);
            });
        }, [search]);

        // Search
        search && search !== '' && useEffect(() => {
            let url = `https://api.giphy.com/v1/gifs/search?api_key=${GIFAPI}&limit=25&q=${search}`;

            fetch(url).then(res => res.json()).then(data => {
                setAttributes({ gifsData: data.data });
            }).catch(err => {
                console.error(err);
            });
        }, [search]);


        // This Block
        const thisBlock = document.getElementById(`block-${clientId}`);

        // Get the modal
        const modal = document.getElementById(`giphyModal-${clientId}`);

        const setPopup = () => {
            thisBlock.style.minHeight = "800px";
            modal.style.display = "block";
        }

        const remPopup = () => {
            thisBlock.style.minHeight = "auto";
            modal.style.display = "none";
        }

        window.addEventListener('click', e => {
            if (e.target == modal) {
                thisBlock.style.minHeight = "auto";
                modal.style.display = "none";
            }
        });

        return [
            <InspectorControls>
                <PanelBody title="Gif Image Settings" initialOpen={true}>
                    {firstTitle("Width:")}
                    <BtnGroup options={sizeTypes} myValue={widthType} setState={(cng, def) => setAttributes({ widthType: cng, width: def })} classes="b_blocks_size_type" size="small" />

                    <RangeControl value={width} onChange={cng => setAttributes({ width: cng })} min={0} max={("%" == widthType) ? 100 : 1920} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_gif" style={{ textAlign: contentAlign }}>
                <BlockControls>
                    <AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
                </BlockControls>

                <figure className="b_blocks_gif_figure" style={{ width: `${width}${widthType}`, display: `${selectedData && 'inline-block'}` }}>
                    {selectedData && <img src={selectedData.images.original.url} alt={selectedData.title} style={{ width: `100%` }} />}

                    {null == selectedData || isSelected ? <div className="b_blocks_media_upload">
                        <div className="b_blocks_media_control b_blocks_gif_media_control">
                            {selectedData ? <IconButton icon="controls-repeat" style={{ color: '#4527a4', fontWeight: 'bold' }} onClick={setPopup}>Replace Gif</IconButton> : <IconButton icon="upload" style={{ color: '#4527a4', fontWeight: 'bold' }} onClick={setPopup}>Select Gif</IconButton>}
                            {selectedData && <IconButton value={null} onClick={() => setAttributes({ selectedData: null })} icon="exit" style={{ color: 'red', fontWeight: 'bold' }}>Remove Gif</IconButton>}
                        </div>
                    </div> : null}
                </figure>

                <div id={`giphyModal-${clientId}`} className="giphyModal">
                    <div className="giphyModal-content">
                        <span className="close" onClick={remPopup}>&times;</span>

                        <div className="giphyModal-header">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                                <label htmlFor={`gifSrcBox-${clientId}`} style={{ marginRight: '20px', fontWeight: 'bold' }}>Search Gif:</label>

                                <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} value={search} id={`gifSrcBox-${clientId}`} onChange={cng => setAttributes({ search: cng })} placeholder="Search gif image here" />
                            </div>
                        </div>

                        <div className="giphyModal-body">
                            <div id="gifs" style={{ columns: 4, gap: '10px' }}>
                                {gifsData && gifsData.map(d => {
                                    return (
                                        <figure key={d.id} className="figure" style={{ margin: '0 0 10px 0', breakInside: 'avoid' }} onClick={() => setAttributes({ selectedData: d, width: parseInt(d.images.original.width), widthType: 'px', return: (modal.style.display = "none", thisBlock.style.minHeight = "auto") })}>
                                            <img src={d.images.downsized.url} alt={d.title} />
                                            <figcaption>{d.title}</figcaption>
                                        </figure>
                                    );
                                })}
                            </div>
                        </div> {/* Modal Body */}
                    </div> {/* Modal Content */}
                </div> {/* Modal */}
            </div> // Giphy
        ];
    },

    save: props => {
        const { selectedData, contentAlign, width, widthType } = props.attributes;

        return (
            <div className="b_blocks_gif" style={{ textAlign: contentAlign }}>
                {selectedData && <figure style={{ margin: 0 }}>
                    <img src={selectedData.images.original.url} alt={selectedData.title} style={{ width: `${width}${widthType}` }} />
                </figure>}
            </div>
        );
    },
});