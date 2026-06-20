import { advancedTabsIcon, alertIcon, animationIcon, authorBoxIcon, blockquoteIcon, breadcrumbIcon, businessHoursIcon, buttonGroupIcon, buttonIcon, callToActionIcon, calloutIcon, cardIcon, carouselBlockIcon, chartIcon, clickToShareIcon, codeHighlightIcon, comparisonTableIcon, contactCardIcon, containerIcon, contentFilterIcon, contentTickerIcon, countdownIcon, countersIcon, couponCodeIcon, dividerIcon, dualColorHeadingIcon, emojiStack, expandContentIcon, facebookEmbedIcon, facebookPageIcon, faqBlockIcon, featureBoxIcon, flipBoxIcon, formBuilderIcon, galleryIcon, gifIcon, googleMapIcon, heroSectionIcon, howtoSchemaIcon, htmlIcon, iconBoxIcon, iconListIcon, imageBoxIcon, imageCompareIcon, imageHotspotIcon, imageIcon, imageScrollerIcon, infoBoxIcon, listIcon, logoSliderIcon, lottieIcon, mailIcon, modalPopupIcon, navigationIcon, newsTicker, notificationBarIcon, offCanvasIcon, portfolioGalleryIcon, postsIcon, priceListIcon, pricingTableIcon, processStepsIcon, progressBarIcon, progressCircleIcon, qrCodeIcon, readingProgressIcon, reviewBoxIcon, rowIcon, scrollToTopIcon, sectionHeadingIcon, servicesIcon, shapeDividerIcon, skillBarIcon, sliderIcon, socialShareIcon, stackedCardIcon, starRatingIcon, svgDrawIcon, tableOfContentIcon, tDViewerIcon, teamMembersIcon, telexAccordionIcon, testimonialsIcon, textPathIcon, toggleContentIcon, typingHeadlineIcon, videoIcon, videoPopupIcon, whatsappChatIcon } from '../../../utils/blocksIcon';

import { pricingToggleIcon, newsletterOptinIcon, floatingCtaIcon, mediaTextSectionIcon, testimonialCardIcon, logoGridIcon, postTimelineIcon, keyTakeawaysIcon, imageSliderIcon, promoStripIcon, marqueeIcon, postCarouselIcon, imageMaskIcon, testimonialSliderIcon, featureTabsIcon, cookieConsentBarIcon, postFilterGridIcon, popupOptinIcon, testimonialsGridIcon, statCardsIcon, imageAccordionIcon, anchorNavIcon, urgencyTimerIcon, interactiveChecklistIcon, stickySidebarIcon, milestoneTimelineIcon, postNavigationIcon, socialShareBarIcon, taxonomyGridIcon, articleCardIcon, postMasonryGridIcon, searchBarIcon, iconIcon, eventCardIcon, scrollRevealIcon, audioPlayerIcon, fileDownloadCardIcon, parallaxSectionIcon, pdfEmbedIcon } from '../../../utils/blocksIcon';

import { wooProductGridIcon, wooAddToCartIcon, wooProductCarouselIcon, wooFeaturedProductIcon, wooCategoryGridIcon, wooMiniCartIcon, wooProductFilterIcon, wooBestSellersIcon, wooSingleProductIcon, wooSaleBadgeIcon, wooProductReviewsIcon } from '../../../utils/blocksIcon';

const pluginSlug = 'b-blocks';


const siteURL = 'https://bblockswp.com';
const demoLink = `${siteURL}/demo`;
const docsURL = `${siteURL}/docs`;

export default [
    {
        title: 'Layout Blocks',
        children: [
            {
                name: `${pluginSlug}/container`,
                title: 'Container',
                icon: containerIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                required: true
            },
            {
                name: `${pluginSlug}/row`,
                title: 'Row',
                icon: rowIcon,
                demo: `${demoLink}/row/`,
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
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/media-text-section`,
                title: 'Media & Text Section',
                icon: mediaTextSectionIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/sticky-sidebar`,
                title: 'Sticky Sidebar',
                icon: stickySidebarIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/parallax-section`,
                title: 'Parallax Section',
                icon: parallaxSectionIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
        ]
    },
    {
        title: 'Content Blocks',
        children: [
            {
                name: `${pluginSlug}/accordion-block`,
                title: 'Accordion Block',
                icon: telexAccordionIcon,
                // demo: `${demoLink}/animated-text/`,
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
                demo: ``,
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
                demo: ``,
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
                status: 'published'
            },
            {
                name: `${pluginSlug}/flip-boxes`,
                title: 'Flip Boxes',
                icon: flipBoxIcon,
                demo: `${demoLink}/flip-boxes/`,
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
                // demo: `${demoLink}/counters/`,
                // docs: `${docsURL}/counters-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/logo-slider`,
                title: 'Logo Slider',
                icon: logoSliderIcon,
                demo: ``,
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
                // demo: `${demoLink}/testimonials/`,
                // docs: `${docsURL}/testimonials-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/toggle-content`,
                title: 'Toggle Content',
                icon: toggleContentIcon,
                // demo: `${demoLink}/testimonials/`,
                // docs: `${docsURL}/testimonials-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/faq-block`,
                title: 'FAQ',
                icon: faqBlockIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/expand-content`,
                title: 'Expand Content',
                icon: expandContentIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/howto-schema`,
                title: 'HowTo Schema',
                icon: howtoSchemaIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/process-steps`,
                title: 'Process Steps',
                icon: processStepsIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/code-highlight`,
                title: 'Code Highlight',
                icon: codeHighlightIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/team-members`,
                title: 'Team Members',
                icon: teamMembersIcon,
                demo: `${demoLink}/team-members/`,
                docs: `${docsURL}/team-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/table-of-content`,
                title: 'Table Of Content',
                icon: tableOfContentIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/list`,
                title: 'List',
                icon: listIcon,
                demo: ``,
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
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/callout`,
                title: 'Callout',
                icon: calloutIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/divider`,
                title: 'Divider',
                icon: dividerIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/icon-list`,
                title: 'Icon List',
                icon: iconListIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/typing-headline`,
                title: 'Typing Headline',
                icon: typingHeadlineIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/key-takeaways`,
                title: 'Key Takeaways',
                icon: keyTakeawaysIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/feature-tabs`,
                title: 'Feature Tabs',
                icon: featureTabsIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/stat-cards`,
                title: 'Stat Cards',
                icon: statCardsIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/anchor-nav`,
                title: 'Anchor Navigation',
                icon: anchorNavIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/interactive-checklist`,
                title: 'Interactive Checklist',
                icon: interactiveChecklistIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/milestone-timeline`,
                title: 'Milestone Timeline',
                icon: milestoneTimelineIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/article-card`,
                title: 'Article Card',
                icon: articleCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/event-card`,
                title: 'Event Card',
                icon: eventCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/file-download-card`,
                title: 'File Download Card',
                icon: fileDownloadCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
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
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/pdf-embed`,
                title: 'PDF Embed',
                icon: pdfEmbedIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
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
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/scroll-to-top`,
                title: 'Scroll To Top',
                icon: scrollToTopIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/video`,
                title: 'Video',
                icon: videoIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/video-popup`,
                title: 'Video Popup',
                icon: videoPopupIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
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
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/image-box`,
                title: 'Image Box',
                icon: imageBoxIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/portfolio-gallery`,
                title: 'Portfolio Gallery',
                icon: portfolioGalleryIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/gif`,
                title: 'Gif Image',
                icon: gifIcon,
                demo: `${demoLink}/gif-image/`,
                docs: `${docsURL}/gif-block/`,
                status: 'published'
            },
            {
                name: `${pluginSlug}/svg-draw`,
                title: 'Svg Draw',
                icon: svgDrawIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/image-scroller`,
                title: 'Image Scroller',
                icon: imageScrollerIcon,
                demo: ``,
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
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/icon-box`,
                title: 'Icon Box',
                icon: iconBoxIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/skill-bar`,
                title: 'Skill Bar',
                icon: skillBarIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/progress-bar`,
                title: 'Progress Bar',
                icon: progressBarIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/progress-circle`,
                title: 'Progress Circle',
                icon: progressCircleIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/stacked-cards`,
                title: 'Stacked Cards',
                icon: stackedCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true,
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/shape-divider`,
                title: 'Shape Divider',
                icon: shapeDividerIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/modal-popup`,
                title: 'Modal Popup',
                icon: modalPopupIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/off-canvas`,
                title: 'Off-Canvas Drawer',
                icon: offCanvasIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/logo-grid`,
                title: 'Logo Grid',
                icon: logoGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/image-slider`,
                title: 'Image Slider',
                icon: imageSliderIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/marquee`,
                title: 'Marquee',
                icon: marqueeIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/image-mask`,
                title: 'Image Mask',
                icon: imageMaskIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/image-accordion`,
                title: 'Image Accordion',
                icon: imageAccordionIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/icon`,
                title: 'Icon',
                icon: iconIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/scroll-reveal`,
                title: 'Scroll Reveal',
                icon: scrollRevealIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/audio-player`,
                title: 'Audio Player',
                icon: audioPlayerIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
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
                demo: ``,
                docs: ``,
                status: 'published',
                isPremium: true
            },
            {
                name: `${pluginSlug}/news-ticker`,
                title: 'News Ticker',
                icon: newsTicker,
                demo: ``,
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
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/business-hours`,
                title: 'Business Hours',
                icon: businessHoursIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/author-box`,
                title: 'Author Box',
                icon: authorBoxIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/contact-card`,
                title: 'Contact Card',
                icon: contactCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/html`,
                title: 'HTML',
                icon: htmlIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/content-filter`,
                title: 'Content Filter',
                icon: contentFilterIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/reading-progress`,
                title: 'Reading Progress',
                icon: readingProgressIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },

            {
                name: `${pluginSlug}/post-timeline`,
                title: 'Post Timeline',
                icon: postTimelineIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/post-carousel`,
                title: 'Post Carousel',
                icon: postCarouselIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/post-filter-grid`,
                title: 'Post Filter Grid',
                icon: postFilterGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/post-masonry-grid`,
                title: 'Post Masonry Grid',
                icon: postMasonryGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/post-navigation`,
                title: 'Post Navigation',
                icon: postNavigationIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/taxonomy-grid`,
                title: 'Taxonomy Grid',
                icon: taxonomyGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/search-bar`,
                title: 'Search Bar',
                icon: searchBarIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
        ]
    },
    {
        title: 'Form Blocks',
        children: [
            {
                name: `${pluginSlug}/form-builder`,
                title: 'Form',
                icon: formBuilderIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/newsletter-optin`,
                title: 'Newsletter Optin',
                icon: newsletterOptinIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
        ]
    },
    {
        title: 'Marketing Blocks',
        children: [
            {
                name: `${pluginSlug}/call-to-action`,
                title: 'Call to Action',
                icon: callToActionIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
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
                demo: `${demoLink}/services-section/`,
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
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/review-box`,
                title: 'Review Box',
                icon: reviewBoxIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/notification-bar`,
                title: 'Notification Bar',
                icon: notificationBarIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/coupon-code`,
                title: 'Coupon Code',
                icon: couponCodeIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/comparison-table`,
                title: 'Comparison Table',
                icon: comparisonTableIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/pricing-toggle`,
                title: 'Pricing Toggle',
                icon: pricingToggleIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/floating-cta`,
                title: 'Floating CTA',
                icon: floatingCtaIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/testimonial-card`,
                title: 'Testimonial Card',
                icon: testimonialCardIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/testimonial-slider`,
                title: 'Testimonial Slider',
                icon: testimonialSliderIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/testimonials-grid`,
                title: 'Testimonials Grid',
                icon: testimonialsGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/promo-strip`,
                title: 'Promo Strip',
                icon: promoStripIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/urgency-timer`,
                title: 'Urgency Timer',
                icon: urgencyTimerIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/popup-optin`,
                title: 'Popup Optin',
                icon: popupOptinIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/cookie-consent-bar`,
                title: 'Cookie Consent Bar',
                icon: cookieConsentBarIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
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
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/facebook-embed`,
                title: 'Facebook Embed',
                icon: facebookEmbedIcon,
                demo: ``,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/facebook-page`,
                title: 'Facebook Page',
                icon: facebookPageIcon,
                demo: ``,
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
            {
                name: `${pluginSlug}/click-to-share`,
                title: 'Click to Share',
                icon: clickToShareIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/social-share-bar`,
                title: 'Social Share Bar',
                icon: socialShareBarIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
        ]
    },
    {
        title: 'WooCommerce Blocks',
        children: [
            {
                name: `${pluginSlug}/woo-product-grid`,
                title: 'Product Grid',
                icon: wooProductGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-product-carousel`,
                title: 'Product Carousel',
                icon: wooProductCarouselIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-best-sellers`,
                title: 'Best Selling Products',
                icon: wooBestSellersIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-featured-product`,
                title: 'Featured Product',
                icon: wooFeaturedProductIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-single-product`,
                title: 'Single Product',
                icon: wooSingleProductIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-category-grid`,
                title: 'Product Categories',
                icon: wooCategoryGridIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-product-filter`,
                title: 'Product Filter',
                icon: wooProductFilterIcon,
                demo: ``,
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
                name: `${pluginSlug}/woo-mini-cart`,
                title: 'Mini Cart',
                icon: wooMiniCartIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-sale-badge`,
                title: 'Sale / Price Badge',
                icon: wooSaleBadgeIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
            {
                name: `${pluginSlug}/woo-product-reviews`,
                title: 'Product Reviews',
                icon: wooProductReviewsIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                badge: 'NEW'
            },
        ]
    },
    // {
    //     name: `${pluginSlug}/data-table`,
    //     title: 'Data Table',
    //     icon: dataTableIcon,
    //     demo: ``,
    //     docs: ``,
    //     status: 'inDev'
    // },
    // {
    //     name: `${pluginSlug}/login-form`,
    //     title: 'Login Form',
    //     icon: loginFormIcon,
    //     demo: ``,
    //     docs: ``,
    //     status: 'inDev'
    // },

    // {
    //     name: `${pluginSlug}/register-form`,
    //     title: 'Register Form',
    //     icon: registerFormIcon,
    //     demo: ``,
    //     docs: ``,
    //     status: 'inDev'
    // },
];


export const overviewBlocks = [
    {
        name: `${pluginSlug}/container`,
        title: 'Container',
        icon: containerIcon,
        demo: ``,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/row`,
        title: 'Row',
        icon: rowIcon,
        demo: `${demoLink}/row/`,
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
        demo: ``,
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
        // demo: `${demoLink}/animated-text/`,
        // docs: `${docsURL}/animated-text-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/advanced-tabs`,
        title: 'Advanced Tabs',
        icon: advancedTabsIcon,
        status: 'published'
    },
    {
        name: `${pluginSlug}/breadcrumb`,
        title: 'Breadcrumb',
        icon: breadcrumbIcon,
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