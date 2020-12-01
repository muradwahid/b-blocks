const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, ToggleControl, RangeControl } = wp.components;

// Variables
import options from '../Const/options';
const { colors } = options;

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
        progressBarAnimation: { type: 'boolean', default: true }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { progressBG, progressHeight, progressBarBG, progressBarWidth, progressBarStriped, progressBarAnimation }, setAttributes } = props;

        // Styles
        const progressStyle = { backgroundColor: progressBG, height: `${progressHeight}px`, marginBottom: '15px' }
        const progressBarStyle = { backgroundColor: progressBarBG, width: `${progressBarWidth}%` }

        return ([
            <InspectorControls>
                {/* Progress Settings */}
                <PanelBody title="Progress Settings" initialOpen={true}>
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    <ColorPalette value={progressBG} onChange={cng => setAttributes({ progressBG: cng })} colors={colors} />

                    {/* Height */}
                    {otherTitle('Height:')}
                    <RangeControl value={progressHeight} onChange={cng => setAttributes({ progressHeight: cng })} min={0} max={150} step={1} />
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

                    {progressBarStriped && <span>
                        {/* Animation */}
                        {otherTitle('Animation')}
                        <ToggleControl label={progressBarAnimation ? 'Disable Animation' : 'Enable Animation'} checked={progressBarAnimation} onChange={cng => setAttributes({ progressBarAnimation: cng })} />
                    </span>}
                </PanelBody>
            </InspectorControls>,


            <div className="progress" style={progressStyle}>
                <div className={`progress-bar ${progressBarStriped ? 'progress-bar-striped' : ''} ${progressBarStriped && progressBarAnimation ? 'progress-bar-animated' : ''}`} role="progressbar" style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        ])
    },

    save: props => {
        const { progressBG, progressHeight, progressBarBG, progressBarWidth, progressBarStriped, progressBarAnimation } = props.attributes;

        // Styles
        const progressStyle = { backgroundColor: progressBG, height: `${progressHeight}px`, marginBottom: '15px', textAlign: 'inherit' }
        const progressBarStyle = { backgroundColor: progressBarBG, width: `${progressBarWidth}%` }

        return (
            <div className="progress" style={progressStyle}>
                <div className={`progress-bar ${progressBarStriped && 'progress-bar-striped'} ${progressBarAnimation && 'progress-bar-animated'}`} role="progressbar" style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});