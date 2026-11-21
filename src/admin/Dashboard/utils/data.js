import { changeLog } from './changeLog'
import { gsIcons } from '../../Components/GettingStartedTabs';

const slug = 'b-blocks';

const origin = location.origin;

export const pricingPage = `${origin}/wp-admin/tools.php?page=b-blocks#/pricing`;


export const dashboardInfo = (info) => {
    const { version, isPremium, hasPro, licenseActiveNonce } = info;

    const proSuffix = isPremium ? ' Pro' : '';

    return {
        name: `bBlocks${proSuffix}`,
        displayName: `bBlocks${proSuffix} - Essential Gutenberg Blocks & Patterns Collection`,
        description: 'bBlocks is a Gutenberg addon that powers up your Block editor. It can be used as a WordPress page-building tool, which contains a variety of beautiful blocks. It is optimized for performance and provides you with maximum options to achieve your design goals.',
        slug,
        version,
        isPremium,
        hasPro,
        info,
        displayOurPlugins: true,
        tagline:
            'Power up the block editor with 90+ lightweight, responsive Gutenberg blocks — no code required.',
        layoutsLabel: 'Popular Blocks',
        layouts: ['Container', 'Slider', 'Accordion', 'Tabs', 'Countdown', 'Lottie', 'Image Compare'],
        gettingStartedTabs: [
            {
                key: 'gutenberg',
                label: 'Gutenberg',
                icon: gsIcons.gutenberg,
                steps: [
                    { num: 1, title: 'Open the Block Editor', body: 'Edit any post or page where you want to add a bBlock.' },
                    { num: 2, title: 'Insert a Block', body: 'Click <strong>+</strong> (Add block), search for <code>bBlocks</code> or a block name, and insert it.' },
                    { num: 3, title: 'Customize Inline', body: 'Tune options from the sidebar — every change previews live in the editor.' },
                ],
            },
            {
                key: 'template-library',
                label: 'Template Library',
                icon: gsIcons.shortcode,
                steps: [
                    { num: 1, title: 'Open the Template Library', body: 'In the editor toolbar, click the <strong>bBlocks Library</strong> button to browse ready-made templates.' },
                    { num: 2, title: 'Preview &amp; Insert', body: 'Preview any full-page or section template, then click <strong>Insert</strong> to drop it into your page.' },
                    { num: 3, title: 'Make It Yours', body: 'Swap the placeholder text and images for your own content — every block stays fully editable.' },
                ],
            },
            {
                key: 'patterns',
                label: 'Patterns',
                icon: gsIcons.theme,
                steps: [
                    { num: 1, title: 'Open the Inserter', body: 'In the editor, click <strong>+</strong> and switch to the <strong>Patterns</strong> tab.' },
                    { num: 2, title: 'Pick a bBlocks Pattern', body: 'Browse the bBlocks pattern category and choose a ready-made section.' },
                    { num: 3, title: 'Insert & Edit', body: 'Click to insert the pattern, then replace the content with your own.' },
                ],
            },
        ],
        media: {
            logo: `https://ps.w.org/${slug}/assets/icon-128x128.png?rev=3471261`,
            banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
            thumbnail: `${info?.dirUrl || ''}assets/welcome-banner.svg`,
            // proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
            video: 'https://www.youtube.com/embed/rdPWz1Ekkro',
            isYoutube: true
        },
        pages: {
            org: `https://wordpress.org/plugins/${slug}/`,
            landing: `https://bblockswp.com/`,
            docs: `https://bblockswp.com/docs/`,
            pricing: `https://bblockswp.com/pricing/`,
            // featureRequest: `https://bplugins.com/products/${slug}/roadmap-and-ideas/`
        },
        freemius: {
            product_id: 12845,
            plan_id: 21619,
            public_key: 'pk_d6426b344df4918bc066a7a0b4719'
        },
        licenseActiveNonce,
        changelogs: changeLog,
        proFeatures: [
            '12 Premium Blocks',
            'Pro features of Posts Block',
            'Pro features of Countdown Block',
            'Pro features of Slider Block',
            'Pro features of Lottie Player Block',
            'Pro features of Button Block',
            'Pro features of Cards Block',
            'Pro Document Embed Block',
            'Pro features of Image Comparison Block',
            'Premium Templates.',
            'Priority Email Support.',
            'Regular New Pro Blocks & Updates.'
        ],
        startButton: {
            label: 'Start Now',
            url: `wp-admin/post-new.php?post_type=page&title=bBlocks&content=<!-- wp:b-blocks/container /-->`
        }
    }
}

export const demoInfo = {
    title: 'Live Overview',
    description: 'Click on any section to view it live',
    layout: 'list',
    allInOneLink: 'https://apb.bplugins.com/all-demos-in-one-place/',
    demos: [
        {
            icon: '',
            title: 'Default',
            description: '',
            category: '',
            type: 'iframe',
            url: 'https://bblockswp.com/demo/image-compare-default-theme/'
        },
        {
            icon: '',
            title: 'Slider',
            description: '',
            category: '',
            type: 'iframe',
            url: 'https://bblockswp.com/demo/image-compare-slider/'
        },
        {
            icon: '',
            title: 'Auto Slider',
            description: '',
            category: '',
            type: 'iframe',
            url: 'https://bblockswp.com/demo/image-compare-auto-slide/'
        },
        {
            icon: '',
            title: 'Move Slide on Mouse Over',
            description: '',
            category: '',
            type: 'iframe',
            url: 'https://bblockswp.com/demo/image-compare-move-slider-on-mouse-over/'
        },
        {
            icon: '',
            title: 'Image Compare Handler',
            description: '',
            category: '',
            type: 'iframe',
            url: 'https://bblockswp.com/demo/image-compare-slider-handler/'
        },
    ]
}

export const pricingInfo = {
    logo: `https://ps.w.org/${slug}/assets/icon-128x128.png?rev=3471261`, // Optional
    pluginId: 12845,
    planId: 21619,
    licenses: [
        1,
        3,
        null
    ],
    button: {
        label: 'Buy Now ➜'
    },
    featured: {
        selected: 3, // choose from licenses item
    }
}
