import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    btnAlign: { type: 'string', default: 'center' },
    btnPTB: { type: 'number', default: 12 },
    btnPLR: { type: 'number', default: 20 },

    borderWidth: { type: 'number', default: 1 },
    borderStyle: { type: 'string', default: 'solid' },
    borderColor: { type: 'string', default: '#00000000' },
    borderRadius: { type: 'number', default: 0 },
    radiusType: { type: 'string', default: '%' },

    btnOne: { type: 'string', source: 'html', selector: 'a.btnOne' },
    btnOneLink: { type: 'string', default: '#' },
    btnOneStyle: { type: 'string', default: 'fill' },
    btnOneColor: { type: 'string', default: '#fff' },
    btnOneBGColor: { type: 'string', default: '#4527a4' },
    btnOneHovColor: { type: 'string', default: '#fff' },
    btnOneHovBGColor: { type: 'string', default: '#8344c5' },

    btnTwo: { type: 'string', source: 'html', selector: 'a.btnTwo' },
    btnTwoLink: { type: 'string', default: '#' },
    btnTwoStyle: { type: 'string', default: 'fill' },
    btnTwoColor: { type: 'string', default: '#fff' },
    btnTwoBGColor: { type: 'string', default: '#8344c5' },
    btnTwoHovColor: { type: 'string', default: '#fff' },
    btnTwoHovBGColor: { type: 'string', default: '#4527a4' },
}

registerBlockType('b-blocks/button-group', {
    // Build In attributes
    title: __('Button Group', 'b-blocks'),
    description: __('Display Dual Button', 'b-blocks'),
    icon: icons.buttonGroup,
    category: 'bBlocks',
    keywords: [__('button', 'b-blocks'), __('multiple buttons', 'b-blocks'), __('group of buttons', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { btnOne, btnTwo } = props.attributes;

        return (
            <div>
                {btnOne && <RichText.Content className='btn btnOne' tagName='a' value={btnOne} href='https://bplugins.com' target='_blank' rel='noopener' />}
                {btnTwo && <RichText.Content className='btn btnTwo' tagName='a' value={btnTwo} />}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});