import { RichText } from '@wordpress/block-editor';

const v1 = {
    attributes: {
        cId: { type: 'string' },

        btnAlign: { type: 'string', default: 'center' },
        btnFontSize: { type: 'number', default: 16 },
        btnWidth: { type: 'number', default: 0 },
        btnPTB: { type: 'number', default: 12 },
        btnPLR: { type: 'number', default: 30 },

        btnOne: { type: 'string', source: 'html', selector: 'a.btnOne', default: 'First Button' },
        btnOneLink: { type: 'string', default: '#' },
        btnOneType: { type: 'string', default: 'fill' },
        btnOneColor: { type: 'string', default: '#fff' },
        btnOneBGColor: { type: 'string', default: '#4527a4' },
        btnOneHovColor: { type: 'string', default: '#fff' },
        btnOneHovBGColor: { type: 'string', default: '#8344c5' },

        btnTwo: { type: 'string', source: 'html', selector: 'a.btnTwo', default: 'Second Button' },
        btnTwoLink: { type: 'string', default: '#' },
        btnTwoType: { type: 'string', default: 'fill' },
        btnTwoColor: { type: 'string', default: '#fff' },
        btnTwoBGColor: { type: 'string', default: '#8344c5' },
        btnTwoHovColor: { type: 'string', default: '#fff' },
        btnTwoHovBGColor: { type: 'string', default: '#4527a4' },

        isSep: { type: 'boolean', default: true },
        sepType: { type: 'string', default: 'text' },
        sepText: { type: 'string', default: 'or' },
        sepImg: { type: 'object', default: null },
        sepWidth: { type: 'number', default: 0 },
        sepSize: { type: 'number', default: 30 },
        sepFontSize: { type: 'number', default: 15 },
        sepColor: { type: 'string', default: '#333' },
        sepBGColor: { type: 'string', default: '#fff' },

        borderWidth: { type: 'number', default: 1 },
        borderStyle: { type: 'string', default: 'solid' },
        borderOneColor: { type: 'string', default: '#00000000' },
        borderTwoColor: { type: 'string', default: '#00000000' },
        borderRadius: { type: 'number', default: 50 },
        radiusType: { type: 'string', default: 'px' },
    },

    save: props => {
        const { cId, btnAlign, btnFontSize, btnWidth, btnPTB, btnPLR, btnOne, btnOneLink, btnOneType, btnOneColor, btnOneBGColor, btnOneHovColor, btnOneHovBGColor, btnTwo, btnTwoLink, btnTwoType, btnTwoColor, btnTwoBGColor, btnTwoHovColor, btnTwoHovBGColor, isSep, sepType, sepText, sepImg, sepWidth, sepSize, sepFontSize, sepColor, sepBGColor, borderWidth, borderStyle, borderOneColor, borderTwoColor, borderRadius, radiusType } = props.attributes;

        // Button One
        const btnOneStyles = { width: 0 !== btnWidth ? `${btnWidth}px` : null, color: btnOneColor, backgroundColor: btnOneBGColor, border: `${borderWidth}px ${borderStyle} ${borderOneColor}`, borderRadius: `${borderRadius}${radiusType} 0 0 ${borderRadius}${radiusType}` }

        // Button Two
        const btnTwoStyles = { width: 0 !== btnWidth ? `${btnWidth}px` : null, color: btnTwoColor, backgroundColor: btnTwoBGColor, border: `${borderWidth}px ${borderStyle} ${borderTwoColor}`, borderRadius: `0 ${borderRadius}${radiusType} ${borderRadius}${radiusType} 0` }

        return (
            <div className={`text-${btnAlign}`} data-colors={`{ "btnOneColor": "${btnOneColor}", "btnOneBGColor": "${btnOneBGColor}", "btnOneHovColor": "${btnOneHovColor}", "btnOneHovBGColor": "${btnOneHovBGColor}", "btnTwoColor": "${btnTwoColor}", "btnTwoBGColor": "${btnTwoBGColor}", "btnTwoHovColor": "${btnTwoHovColor}", "btnTwoHovBGColor": "${btnTwoHovBGColor}" }`} id={`bBlocksBtnGroup-${cId}`}>
                <div className='btnHolder'>
                    <div className='firstBtn' style={{ marginRight: `${sepWidth / 2}px`, paddingRight: `${sepWidth / 2}px` }}>
                        {btnOne && <RichText.Content className={`btnG btnOne fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} btn-${btnOneType}`} tagName='a' href={btnOneLink} target='_blank' rel='noopener' value={btnOne} style={btnOneStyles} />}

                        {isSep && <div className='btnSeparator' style={{ color: sepColor, backgroundColor: sepBGColor, width: `${sepSize}px`, height: `${sepSize}px` }}>
                            {'text' === sepType ? <span className={`fontSize-${sepFontSize}`}>{sepText}</span> : 'image' === sepType && sepImg ? <img src={sepImg.url} alt={sepImg.title} /> : ''}
                        </div>}
                    </div>

                    {btnTwo && <RichText.Content className={`btnG btnTwo fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} btn-${btnTwoType}`} tagName='a' href={btnTwoLink} target='_blank' rel='noopener' value={btnTwo} style={btnTwoStyles} />}
                </div>
            </div >
        );
    }
}
const deprecated = [v1];
export default deprecated;