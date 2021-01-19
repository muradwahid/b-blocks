const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;
const { InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, ToggleControl, RangeControl, PanelRow } = wp.components;

// Variables
import options from '../Const/options';
const { colors } = options;

// Components
import BColor from '../GutenComp/BColor';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/progress-bar', {
    // Build In attributes
    title: 'Progress Bar',
    description: 'Progress Bar',
    icon: icons.progress,
    category: 'bBlocks',
    keywords: ['Progress', 'Progress Bar', 'Progress Width'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        progressBG: { type: 'string', default: '#e9ecef' },
        progressHeight: { type: 'number', default: 15 },

        progressBarBG: { type: 'string', default: '#8344c5' },
        progressBarWidth: { type: 'number', default: 75 },
        progressBarStriped: { type: 'boolean', default: true },
        progressBarStripedColor: { type: 'string', default: '#ffffff26' },
        progressBarAnimation: { type: 'boolean', default: true }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { progressBG, progressHeight, progressBarBG, progressBarWidth, progressBarStriped, progressBarStripedColor, progressBarAnimation }, setAttributes } = props;

        // Styles
        const progressStyle = { backgroundColor: progressBG, height: `${progressHeight}px`, marginBottom: '15px' }
        const progressBarStyle = { backgroundColor: progressBarBG, width: `${progressBarWidth}%`, backgroundImage: progressBarStriped ? `linear-gradient(45deg, ${progressBarStripedColor} 25%, transparent 25%, transparent 50%, ${progressBarStripedColor} 50%, ${progressBarStripedColor} 75%, transparent 75%, transparent)` : null }

        return ([
            <InspectorControls>
                {/* Progress Settings */}
                <PanelBody title="Progress Settings" initialOpen={true}>
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    <ColorPalette value={progressBG} onChange={cng => setAttributes({ progressBG: cng })} colors={colors} />

                    {/* Height */}
                    {otherTitle('Height:')}
                    <RangeControl value={progressHeight} onChange={cng => setAttributes({ progressHeight: cng })} min={0} max={200} step={1} />
                </PanelBody>


                {/* Progress Bar Settings */}
                <PanelBody title="Progress Bar Settings" initialOpen={false}>
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    <ColorPalette value={progressBarBG} onChange={cng => setAttributes({ progressBarBG: cng })} colors={colors} />

                    {/* Width */}
                    {otherTitle('Width:')}
                    <RangeControl value={progressBarWidth} onChange={cng => setAttributes({ progressBarWidth: cng })} min={0} max={100} step={1} />


                    {/* Striped */}
                    {otherTitle('Striped')}
                    <ToggleControl label={progressBarStriped ? 'Disable Striped' : 'Enable Striped'} checked={progressBarStriped} onChange={cng => setAttributes({ progressBarStriped: cng })} />

                    <div style={{ marginTop: '10px' }}></div>
                    <PanelRow>
                        <p className="panel_single-title" style={{ marginTop: '15px' }}>Striped Color:</p>
                        <BColor value={progressBarStripedColor} onChange={cng => setAttributes({ progressBarStripedColor: cng })} defaultColor="#ffffff26" />
                    </PanelRow>

                    {progressBarStriped && <Fragment>
                        {/* Animation */}
                        {otherTitle('Animation')}
                        <ToggleControl label={progressBarAnimation ? 'Disable Animation' : 'Enable Animation'} checked={progressBarAnimation} onChange={cng => setAttributes({ progressBarAnimation: cng })} />
                    </Fragment>}
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_progress_bar">
                <div className="progress" style={progressStyle}>
                    <div className={`progress-bar ${progressBarStriped ? 'progress-bar-striped' : ''} ${progressBarStriped && progressBarAnimation ? 'progress-bar-animated' : ''}`} role="progressbar" style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        ])
    },

    save: props => {
        const { progressBG, progressHeight, progressBarBG, progressBarWidth, progressBarStriped, progressBarStripedColor, progressBarAnimation } = props.attributes;

        // Styles
        const progressStyle = { backgroundColor: progressBG, height: `${progressHeight}px`, marginBottom: '15px', textAlign: 'inherit' }
        const progressBarStyle = { backgroundColor: progressBarBG, width: `${progressBarWidth}%`, backgroundImage: progressBarStriped ? `linear-gradient(45deg, ${progressBarStripedColor} 25%, transparent 25%, transparent 50%, ${progressBarStripedColor} 50%, ${progressBarStripedColor} 75%, transparent 75%, transparent)` : null }

        return (
            <div className="b_blocks_progress_bar">
                <div className="progress" style={progressStyle}>
                    <div className={`progress-bar ${progressBarStriped && 'progress-bar-striped'} ${progressBarAnimation && 'progress-bar-animated'}`} role="progressbar" style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});