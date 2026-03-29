import {changeLog} from './changeLog'

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
        media: {
            logo: `https://ps.w.org/${slug}/assets/icon-128x128.png?rev=3471261`,
            banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
            thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
            // proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
            video: 'https://www.youtube.com/embed/rdPWz1Ekkro',
            isYoutube: true
        },
        pages: {
            org: `https://wordpress.org/plugins/${slug}/`,
            landing: `https://bblockswp.com/`,
            docs: `https://bblockswp.com/docs/`,
            pricing: `https://bblockswp.com/pricing/`,
        },
        freemius: {
            product_id: 12845,
            plan_id: 21619,
            public_key: 'pk_d6426b344df4918bc066a7a0b4719'
        },
        licenseActiveNonce,
        changelogs: changeLog,
        proFeatures: [
            '4 Premium Blocks.',
            'Pro features of Posts Block.',
            'Pro features of Countdown Block.',
            'Pro features of Slider Block.',
            'Pro features of Lottie Player Block.',
            'Pro features of Button Block.',
            'Pro features of Cards Block.',
            'Pro features of Image Comparison Block.',
            'Premium Templates.'
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
