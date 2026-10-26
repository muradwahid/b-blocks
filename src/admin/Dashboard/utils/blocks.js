import {
    advancedTabsIcon, alertIcon, animationIcon,
    // authorBoxIcon,
    blockquoteIcon, breadcrumbIcon,
    // businessHoursIcon,
    buttonGroupIcon, buttonIcon,
    // callToActionIcon, calloutIcon,
    cardIcon, carouselBlockIcon, chartIcon,
    // clickToShareIcon, 
    codeHighlightIcon,
    comparisonTableIcon,
    // contactCardIcon,
    containerIcon,
    // contentFilterIcon,
    contentTickerIcon, countdownIcon, countersIcon,
    // couponCodeIcon,
    dividerIcon, dualColorHeadingIcon, emojiStack, expandContentIcon, facebookEmbedIcon, facebookPageIcon,
    // faqBlockIcon,
    featureBoxIcon, flipBoxIcon, formBuilderIcon, galleryIcon, gifIcon,
    googleMapIcon,
    heroSectionIcon,
    // howtoSchemaIcon,
    htmlIcon, iconBoxIcon,
    // iconListIcon, imageBoxIcon,
    imageCompareIcon, imageHotspotIcon, imageIcon, imageScrollerIcon, infoBoxIcon, infographicIcon, instagramIcon, listIcon, logoSliderIcon, lottieIcon, mailIcon,
    // modalPopupIcon,
    navigationIcon, newsTicker, onePageNavigationIcon,
    // notificationBarIcon, offCanvasIcon, portfolioGalleryIcon,
    postsIcon, priceListIcon, pricingTableIcon, processStepsIcon,
    // progressBarIcon, progressCircleIcon,
    qrCodeIcon,
    // readingProgressIcon, reviewBoxIcon,
    rowIcon, scrollToTopIcon, sectionHeadingIcon, servicesIcon, shapeDividerIcon, skillBarIcon, sliderIcon, socialShareIcon, stackedCardIcon, starRatingIcon, svgDrawIcon, tableOfContentIcon, tDViewerIcon, teamMembersIcon, telexAccordionIcon, testimonialsIcon, textPathIcon, timelineIcon, toggleContentIcon,
    // typingHeadlineIcon,
    videoIcon,
    // videoPopupIcon,
    whatsappChatIcon, tableIcon,
    wooProductPriceIcon,
    wooProductDetailsIcon
} from '../../../utils/blocksIcon';

import {
    // pricingToggleIcon, newsletterOptinIcon, floatingCtaIcon,
    mediaTextSectionIcon,
    // testimonialCardIcon, logoGridIcon, postTimelineIcon,
    keyTakeawaysIcon,
    // imageSliderIcon, promoStripIcon, marqueeIcon, postCarouselIcon, imageMaskIcon, testimonialSliderIcon, featureTabsIcon, cookieConsentBarIcon, postFilterGridIcon, popupOptinIcon, testimonialsGridIcon,
    statCardsIcon,
    // imageAccordionIcon, anchorNavIcon, urgencyTimerIcon,
    interactiveChecklistIcon,
    // stickySidebarIcon, milestoneTimelineIcon, postNavigationIcon, socialShareBarIcon, taxonomyGridIcon,
    articleCardIcon,
    // postMasonryGridIcon, searchBarIcon, iconIcon,
    eventCardIcon,
    fileDownloadCardIcon,
    // scrollRevealIcon,
    audioPlayerIcon,
    wooProductGridIcon,
    //  parallaxSectionIcon, pdfEmbedIcon
    wooAddToCartIcon,
    wooProductImagesIcon
} from '../../../utils/blocksIcon';

// import { wooProductGridIcon, wooAddToCartIcon, wooProductCarouselIcon, wooFeaturedProductIcon, wooCategoryGridIcon, wooMiniCartIcon, wooProductFilterIcon, wooBestSellersIcon, wooSingleProductIcon, wooSaleBadgeIcon, wooProductReviewsIcon } from '../../../utils/blocksIcon';

const pluginSlug = 'b-blocks';

const siteURL = 'https://bblockswp.com';
const demoLink = `${siteURL}/blocks`;
const docsURL = `${siteURL}/docs`;

export default [
    {
        title: 'Layout Blocks',
        children: [
            {
                name: `${pluginSlug}/container`,
                title: 'Container',
                icon: containerIcon,
                demo: `${demoLink}/container`,
                docs: ``,
                status: 'published',
                required: true
            },
            {
                name: `${pluginSlug}/row`,
                title: 'Row',
                icon: rowIcon,
                demo: `${demoLink}/row-columns/`,
                docs: `${docsURL}/row-block/`,
                status: 'published',
                required: true
            },
            {
                name: `${pluginSlug}/hero-section`,
                title: 'Hero Section',
                icon: heroSectionIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/media-text-section`,
                title: 'Media & Text Section',
                icon: mediaTextSectionIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/sticky-sidebar`,
            //     title: 'Sticky Sidebar',
            //     icon: stickySidebarIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/parallax-section`,
            //     title: 'Parallax Section',
            //     icon: parallaxSectionIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
        ]
    },
    {
        title: 'Content Blocks',
        children: [
            {
                name: `${pluginSlug}/accordion-block`,
                title: 'Accordion Block',
                icon: telexAccordionIcon,
                demo: `${demoLink}/accordion-block/`,
                // docs: `${docsURL}/animated-text-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/section-heading`,
                title: 'Section Heading',
                icon: sectionHeadingIcon,
                demo: `${demoLink}/section-heading/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/dual-color-heading`,
                title: 'Dual Color Heading',
                icon: dualColorHeadingIcon,
                demo: `${demoLink}/dual-color-heading/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/animated-text`,
                title: 'Animated Text',
                icon: animationIcon,
                demo: `${demoLink}/animated-text/`,
                docs: `${docsURL}/animated-text-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/button`,
                title: 'Button',
                icon: buttonIcon,
                demo: `${demoLink}/button/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/button-group`,
                title: 'Button Group',
                icon: buttonGroupIcon,
                demo: `${demoLink}/button-group/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/text-path`,
                title: 'Text Path',
                icon: textPathIcon,
                demo: `${demoLink}/text-path/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/feature-boxes`,
                title: 'Feature Boxes',
                icon: featureBoxIcon,
                demo: `${demoLink}/feature-boxes/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/advanced-tabs`,
                title: 'Advanced Tabs',
                icon: advancedTabsIcon,
                demo: `${demoLink}/advanced-tabs/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/flip-boxes`,
                title: 'Flip Boxes',
                icon: flipBoxIcon,
                demo: `${demoLink}/flip-box/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/qr-code`,
                title: 'Qr Code',
                icon: qrCodeIcon,
                demo: `${demoLink}/qr-code/`,
                docs: `${docsURL}/qr-code-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/cards`,
                title: 'Cards',
                icon: cardIcon,
                demo: `${demoLink}/cards/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/carousel`,
                title: 'Carousel',
                icon: carouselBlockIcon,
                demo: `${demoLink}/carousel/`,
                // docs: `${docsURL}/counters-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/logo-slider`,
                title: 'Logo Slider',
                icon: logoSliderIcon,
                demo: `${demoLink}/logo-slider/`,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/slider`,
                title: 'Slider',
                icon: sliderIcon,
                demo: `${demoLink}/slider/`,
                docs: `${docsURL}/slider-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/testimonials`,
                title: 'Testimonials',
                icon: testimonialsIcon,
                demo: `${demoLink}/testimonial/`,
                // docs: `${docsURL}/testimonials-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/toggle-content`,
                title: 'Toggle Content',
                icon: toggleContentIcon,
                demo: `${demoLink}/toggle-content/`,
                // docs: `${docsURL}/testimonials-block/`,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/faq-block`,
            //     title: 'FAQ',
            //     icon: faqBlockIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/expand-content`,
                title: 'Expand Content',
                icon: expandContentIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/howto-schema`,
            //     title: 'HowTo Schema',
            //     icon: howtoSchemaIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/process-steps`,
                title: 'Process Steps',
                icon: processStepsIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/infographic`,
                title: 'Infographic',
                icon: infographicIcon,
                demo: `https://bblockswp.com/blocks/infographic-block`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/code-highlight`,
                title: 'Code Highlight',
                icon: codeHighlightIcon,
                demo: `https://bblockswp.com/blocks/code-highlight/`,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/team-members`,
                title: 'Team Members',
                icon: teamMembersIcon,
                demo: `${demoLink}/team-member/`,
                docs: `${docsURL}/team-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/table-of-content`,
                title: 'Table Of Content',
                icon: tableOfContentIcon,
                demo: `${demoLink}/table-of-content/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/timeline`,
                title: 'Timeline',
                icon: timelineIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/list`,
                title: 'List',
                icon: listIcon,
                demo: `${demoLink}/list/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/alert`,
                title: 'Alert',
                icon: alertIcon,
                demo: `${demoLink}/alert/`,
                docs: `${docsURL}/alert-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/blockquote`,
                title: 'Blockquote',
                icon: blockquoteIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/callout`,
            //     title: 'Callout',
            //     icon: calloutIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/divider`,
                title: 'Divider',
                icon: dividerIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/icon-list`,
            //     title: 'Icon List',
            //     icon: iconListIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/typing-headline`,
            //     title: 'Typing Headline',
            //     icon: typingHeadlineIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/key-takeaways`,
                title: 'Key Takeaways',
                icon: keyTakeawaysIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            // {
            //     name: `${pluginSlug}/feature-tabs`,
            //     title: 'Feature Tabs',
            //     icon: featureTabsIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/stat-cards`,
                title: 'Stat Cards',
                icon: statCardsIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            // {
            //     name: `${pluginSlug}/anchor-nav`,
            //     title: 'Anchor Navigation',
            //     icon: anchorNavIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/interactive-checklist`,
                title: 'Interactive Checklist',
                icon: interactiveChecklistIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/milestone-timeline`,
            //     title: 'Milestone Timeline',
            //     icon: milestoneTimelineIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/article-card`,
                title: 'Article Card',
                icon: articleCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/event-card`,
                title: 'Event Card',
                icon: eventCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/file-download-card`,
                title: 'File Download Card',
                icon: fileDownloadCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
        ]
    },
    {
        title: 'Creative Blocks',
        children: [
            {
                name: `${pluginSlug}/advanced-image`,
                title: 'Advanced Image',
                icon: imageIcon,
                demo: `${demoLink}/advanced-image`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/pdf-embed`,
            //     title: 'PDF Embed',
            //     icon: pdfEmbedIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/td-viewer`,
                title: '3D Viewer',
                icon: tDViewerIcon,
                demo: `${demoLink}/3d-viewer/`,
                docs: `${docsURL}/3d-viewer-block/`,
                status: 'published',
            },
            {
                name: `${pluginSlug}/image-gallery`,
                title: 'Image Gallery',
                icon: galleryIcon,
                demo: `${demoLink}/image-gallery/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/navigation`,
                title: 'bBlocks Navigation',
                icon: navigationIcon,
                demo: `${demoLink}/bblocks-navigation/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/one-page-navigation`,
                title: 'One Page Navigation',
                icon: onePageNavigationIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/scroll-to-top`,
                title: 'Scroll To Top',
                icon: scrollToTopIcon,
                demo: `${demoLink}/scroll-to-top/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/video`,
                title: 'Video',
                icon: videoIcon,
                demo: `${demoLink}/video/`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/video-popup`,
            //     title: 'Video Popup',
            //     icon: videoPopupIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/image-comparison`,
                title: 'Image Comparison',
                icon: imageCompareIcon,
                demo: `${demoLink}/image-comparison/`,
                docs: `${docsURL}/image-comparison-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/image-hotspot`,
                title: 'Image Hotspot',
                icon: imageHotspotIcon,
                demo: `${demoLink}/image-hotspot/`,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            // {
            //     name: `${pluginSlug}/image-box`,
            //     title: 'Image Box',
            //     icon: imageBoxIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/portfolio-gallery`,
            //     title: 'Portfolio Gallery',
            //     icon: portfolioGalleryIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/gif`,
                title: 'Gif Image',
                icon: gifIcon,
                demo: `${demoLink}/gift-image/`,
                docs: `${docsURL}/gif-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/svg-draw`,
                title: 'Svg Draw',
                icon: svgDrawIcon,
                demo: `${demoLink}/svg-draw/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/image-scroller`,
                title: 'Image Scroller',
                icon: imageScrollerIcon,
                demo: `${demoLink}/image-scroller/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/lottie-player`,
                title: 'Lottie Player',
                icon: lottieIcon,
                demo: `${demoLink}/lottie-player/`,
                docs: `${docsURL}/lottie-player-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/info-box`,
                title: 'Info Box',
                icon: infoBoxIcon,
                demo: `${demoLink}/info-box/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/countdown`,
                title: 'Countdown Timer',
                icon: countdownIcon,
                demo: `${demoLink}/countdown/`,
                docs: `${docsURL}/countdown-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/counters`,
                title: 'Counters',
                icon: countersIcon,
                demo: `${demoLink}/counters/`,
                docs: `${docsURL}/counters-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/emoji-stack-separator`,
                title: 'Emoji Stack Separator',
                icon: emojiStack,
                demo: `${demoLink}/emoji-stack-separator/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/icon-box`,
                title: 'Icon Box',
                icon: iconBoxIcon,
                demo: `${demoLink}/icon-box/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/skill-bar`,
                title: 'Skill Bar',
                icon: skillBarIcon,
                demo: `${demoLink}/skill-bar/`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/progress-bar`,
            //     title: 'Progress Bar',
            //     icon: progressBarIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/progress-circle`,
            //     title: 'Progress Circle',
            //     icon: progressCircleIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/stacked-cards`,
                title: 'Stacked Cards',
                icon: stackedCardIcon,
                demo: `${demoLink}/stacked-cards/`,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/shape-divider`,
                title: 'Shape Divider',
                icon: shapeDividerIcon,
                demo: `${demoLink}/shape-divider/`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/modal-popup`,
            //     title: 'Modal Popup',
            //     icon: modalPopupIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/off-canvas`,
            //     title: 'Off-Canvas Drawer',
            //     icon: offCanvasIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/logo-grid`,
            //     title: 'Logo Grid',
            //     icon: logoGridIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/image-slider`,
            //     title: 'Image Slider',
            //     icon: imageSliderIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/marquee`,
            //     title: 'Marquee',
            //     icon: marqueeIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/image-mask`,
            //     title: 'Image Mask',
            //     icon: imageMaskIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/image-accordion`,
            //     title: 'Image Accordion',
            //     icon: imageAccordionIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/icon`,
            //     title: 'Icon',
            //     icon: iconIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/scroll-reveal`,
            //     title: 'Scroll Reveal',
            //     icon: scrollRevealIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/audio-player`,
                title: 'Audio Player',
                icon: audioPlayerIcon,
                demo: `https://bblockswp.com/blocks/audio-player/`,
                docs: ``,
                status: 'published'
            },
        ]
    },
    {
        title: 'Dynamic Blocks',
        children: [
            {
                name: `${pluginSlug}/breadcrumb`,
                title: 'Breadcrumb',
                icon: breadcrumbIcon,
                demo: `${demoLink}/breadcrumb/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/table`,
                title: 'Table',
                icon: tableIcon,
                // demo: `${demoLink}/breadcrumb/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/chart`,
                title: 'Chart',
                icon: chartIcon,
                demo: `${demoLink}/chart/`,
                docs: `${docsURL}/chart-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/content-ticker`,
                title: 'Content Ticker',
                icon: contentTickerIcon,
                demo: `${demoLink}/content-ticker`,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/news-ticker`,
                title: 'News Ticker',
                icon: newsTicker,
                demo: `${demoLink}/news-ticker`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/posts`,
                title: 'Posts',
                icon: postsIcon,
                demo: `${demoLink}/posts`,
                docs: `${docsURL}/posts-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/google-map`,
                title: 'Google Map',
                icon: googleMapIcon,
                demo: `https://bblockswp.com/blocks/google-map`,
                docs: ``,
                status: 'published',
                badge: 'NEW',
                isPremium: true
            },
            // {
            //     name: `${pluginSlug}/business-hours`,
            //     title: 'Business Hours',
            //     icon: businessHoursIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/author-box`,
            //     title: 'Author Box',
            //     icon: authorBoxIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/contact-card`,
            //     title: 'Contact Card',
            //     icon: contactCardIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/html`,
                title: 'HTML',
                icon: htmlIcon,
                demo: `${demoLink}/html`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/content-filter`,
            //     title: 'Content Filter',
            //     icon: contentFilterIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/reading-progress`,
            //     title: 'Reading Progress',
            //     icon: readingProgressIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/post-timeline`,
            //     title: 'Post Timeline',
            //     icon: postTimelineIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/post-carousel`,
            //     title: 'Post Carousel',
            //     icon: postCarouselIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/post-filter-grid`,
            //     title: 'Post Filter Grid',
            //     icon: postFilterGridIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/post-masonry-grid`,
            //     title: 'Post Masonry Grid',
            //     icon: postMasonryGridIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/post-navigation`,
            //     title: 'Post Navigation',
            //     icon: postNavigationIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/taxonomy-grid`,
            //     title: 'Taxonomy Grid',
            //     icon: taxonomyGridIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/search-bar`,
            //     title: 'Search Bar',
            //     icon: searchBarIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
        ]
    },
    {
        title: 'Form Blocks',
        children: [
            {
                name: `${pluginSlug}/form-builder`,
                title: 'Form',
                icon: formBuilderIcon,
                demo: `${demoLink}/form`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/newsletter-optin`,
            //     title: 'Newsletter Optin',
            //     icon: newsletterOptinIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
        ]
    },
    {
        title: 'Marketing Blocks',
        children: [
            // {
            //     name: `${pluginSlug}/call-to-action`,
            //     title: 'Call to Action',
            //     icon: callToActionIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/pricing-table`,
                title: 'Pricing Table',
                icon: pricingTableIcon,
                demo: `${demoLink}/pricing-table/`,
                docs: `${docsURL}/pricing-table-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/price-lists`,
                title: 'Price Lists',
                icon: priceListIcon,
                demo: `${demoLink}/price-lists/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/services`,
                title: 'Services',
                icon: servicesIcon,
                demo: `${demoLink}/services/`,
                docs: `${docsURL}/services-section-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/mailto`,
                title: 'Mail To',
                icon: mailIcon,
                demo: `${demoLink}/mail-to/`,
                docs: `${docsURL}/mail-to-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/star-rating`,
                title: 'Star Rating',
                icon: starRatingIcon,
                demo: `${demoLink}/star-rating`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/review-box`,
            //     title: 'Review Box',
            //     icon: reviewBoxIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/notification-bar`,
            //     title: 'Notification Bar',
            //     icon: notificationBarIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/coupon-code`,
            //     title: 'Coupon Code',
            //     icon: couponCodeIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            {
                name: `${pluginSlug}/comparison-table`,
                title: 'Comparison Table',
                icon: comparisonTableIcon,
                demo: `https://bblockswp.com/blocks/comparison-table/`,
                docs: ``,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/pricing-toggle`,
            //     title: 'Pricing Toggle',
            //     icon: pricingToggleIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/floating-cta`,
            //     title: 'Floating CTA',
            //     icon: floatingCtaIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/testimonial-card`,
            //     title: 'Testimonial Card',
            //     icon: testimonialCardIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/testimonial-slider`,
            //     title: 'Testimonial Slider',
            //     icon: testimonialSliderIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/testimonials-grid`,
            //     title: 'Testimonials Grid',
            //     icon: testimonialsGridIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/promo-strip`,
            //     title: 'Promo Strip',
            //     icon: promoStripIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/urgency-timer`,
            //     title: 'Urgency Timer',
            //     icon: urgencyTimerIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/popup-optin`,
            //     title: 'Popup Optin',
            //     icon: popupOptinIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/cookie-consent-bar`,
            //     title: 'Cookie Consent Bar',
            //     icon: cookieConsentBarIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
        ]
    },
    {
        title: 'Social Blocks',
        children: [
            {
                name: `${pluginSlug}/whatsapp-chat`,
                title: 'WhatsApp Chat',
                icon: whatsappChatIcon,
                demo: ``,
                docs: ``,
                status: 'published',
            },
            {
                name: `${pluginSlug}/instagram`,
                title: 'Instagram Feed',
                icon: instagramIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/facebook-embed`,
                title: 'Facebook Embed',
                icon: facebookEmbedIcon,
                demo: `${demoLink}/facebook-embed`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/facebook-page`,
                title: 'Facebook Page',
                icon: facebookPageIcon,
                demo: `${demoLink}/facebook-page`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/social-share`,
                title: 'Social Share',
                icon: socialShareIcon,
                demo: `${demoLink}/social-share/`,
                docs: `${docsURL}/social-share-block/`,
                status: 'published'
            },
            // {
            //     name: `${pluginSlug}/click-to-share`,
            //     title: 'Click to Share',
            //     icon: clickToShareIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/social-share-bar`,
            //     title: 'Social Share Bar',
            //     icon: socialShareBarIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
        ]
    },
    {
        title: 'WooCommerce Blocks',
        children: [
            {
                name: `${pluginSlug}/woo-product-grid`,
                title: 'Woo Product Grid',
                icon: wooProductGridIcon,
                demo: `https://bblockswp.com/blocks/woo-product-grid/`,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-add-to-cart`,
                title: 'Add to Cart Button',
                icon: wooAddToCartIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-product-images`,
                title: 'Woo Product Images',
                icon: wooProductImagesIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-product-price`,
                title: 'Woo Product Price',
                icon: wooProductPriceIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-product-details`,
                title: 'Woo Product Details',
                icon: wooProductDetailsIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            // {
            //     name: `${pluginSlug}/woo-product-carousel`,
            //     title: 'Product Carousel',
            //     icon: wooProductCarouselIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-best-sellers`,
            //     title: 'Best Selling Products',
            //     icon: wooBestSellersIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-featured-product`,
            //     title: 'Featured Product',
            //     icon: wooFeaturedProductIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-single-product`,
            //     title: 'Single Product',
            //     icon: wooSingleProductIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-category-grid`,
            //     title: 'Product Categories',
            //     icon: wooCategoryGridIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-product-filter`,
            //     title: 'Product Filter',
            //     icon: wooProductFilterIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-mini-cart`,
            //     title: 'Mini Cart',
            //     icon: wooMiniCartIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-sale-badge`,
            //     title: 'Sale / Price Badge',
            //     icon: wooSaleBadgeIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
            // {
            //     name: `${pluginSlug}/woo-product-reviews`,
            //     title: 'Product Reviews',
            //     icon: wooProductReviewsIcon,
            //     demo: ``,
            //     docs: ``,
            //     status: 'published',
            //     badge: 'NEW'
            // },
        ]
    }
];

export const overviewBlocks = [
    {
        name: `${pluginSlug}/container`,
        title: 'Container',
        icon: containerIcon,
        demo: `${demoLink}/container`,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/row`,
        title: 'Row',
        icon: rowIcon,
        demo: `${demoLink}/row-columns/`,
        docs: `${docsURL}/row-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/td-viewer`,
        title: '3D Viewer',
        icon: tDViewerIcon,
        demo: `${demoLink}/3d-viewer/`,
        docs: `${docsURL}/3d-viewer-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/advanced-image`,
        title: 'Advanced Image',
        icon: imageIcon,
        demo: `${demoLink}/advanced-image`,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/alert`,
        title: 'Alert',
        icon: alertIcon,
        demo: `${demoLink}/alert/`,
        docs: `${docsURL}/alert-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/animated-text`,
        title: 'Animated Text',
        icon: animationIcon,
        demo: `${demoLink}/animated-text/`,
        docs: `${docsURL}/animated-text-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/accordion-block`,
        title: 'Accordion Block',
        icon: telexAccordionIcon,
        demo: `${demoLink}/accordion-block/`,
        // docs: `${docsURL}/animated-text-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/advanced-tabs`,
        title: 'Advanced Tabs',
        icon: advancedTabsIcon,
        demo: `${demoLink}/advanced-tabs/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/breadcrumb`,
        title: 'Breadcrumb',
        icon: breadcrumbIcon,
        demo: `${demoLink}/breadcrumb/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/button`,
        title: 'Button',
        icon: buttonIcon,
        demo: `${demoLink}/button/`,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/button-group`,
        title: 'Button Group',
        icon: buttonGroupIcon,
        demo: `${demoLink}/button-group/`,
        docs: ``,
        status: 'published'
    },
]