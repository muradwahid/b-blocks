# bBlocks — Future Features

প্রতিযোগী প্লাগিনের সাথে তুলনা করে bBlocks-এ কোন নতুন ব্লক আর এক্সটেনশন দরকার, তার তালিকা।

- **তুলনা করা হয়েছে:** Essential Blocks, Spectra, Kadence, Stackable, Otter, aBlocks, GutenKit
- **যাচাইয়ের তারিখ:** ২ নভেম্বর ২০২৬ (প্রতিটা প্রতিযোগীর অফিসিয়াল সাইট বা wordpress.org পেজ থেকে)

**চিহ্ন:** ❌ = bBlocks-এ নেই · ⏸️ = বানানো আছে, কিন্তু `includes/BlocksList.php`-এ কমেন্ট করা (রিলিজ হয়নি)

---

## bBlocks এখন কোথায় আছে

- `src/`-এ প্রায় ১৪৫টা ব্লক ফোল্ডার আছে।
- `includes/BlocksList.php`-এ প্রায় ৯৫টা ব্লক চালু (released)।
- প্রায় ৫৮টা ব্লক কমেন্ট করা, মানে বানানো আছে কিন্তু রিলিজ হয়নি।
- **সবচেয়ে কাছের প্রতিযোগী aBlocks।** ওদেরও QR Code, Text-Path, SVG Draw, Image Scroll, Marquee, Stacked Cards, Code Highlighter আছে।

---

## ১. প্রথমে রিলিজ করার মতো ব্লক (বানানো আছে)

এই ব্লকগুলো প্রতিযোগীদের কাছে আছে, আর bBlocks-এ বানানো থাকলেও রিলিজ হয়নি:

- [ ] Icon
- [ ] Icon List
- [ ] Progress Bar / Progress Circle
- [ ] FAQ (schema সহ)
- [ ] How-To (schema সহ)
- [ ] Post Carousel
- [ ] Testimonial Slider
- [ ] Video Popup
- [ ] Search Bar
- [ ] Business Hours
- [ ] Filterable Gallery (portfolio-gallery, content-filter)
- [ ] Cookie Consent Bar
- [ ] Image Accordion
- [ ] Modal Popup

---

## ২. নতুন ব্লক: নিশ্চিত ঘাটতি

যত বেশি প্রতিযোগীর কাছে আছে, তত আগে রাখা হয়েছে।

| # | ব্লক | কাদের কাছে আছে | bBlocks-এ অবস্থা |
|---|---|---|---|
| ১ | **Loop Builder / Query Loop** | EB, Spectra Pro, Kadence, aBlocks, GutenKit | ❌ নেই |
| ২ | **Mega Menu** | EB, Kadence, aBlocks, GutenKit | ❌ নেই, শুধু navigation আছে |
| ৩ | **Social Icons (প্রোফাইল লিংক)** | EB, Stackable, GutenKit | ❌ নেই, শুধু শেয়ার বাটন আছে |
| ৪ | **Live / Advanced Search** | EB, Otter Pro, Kadence, aBlocks | ⏸️ search-bar আছে, রিলিজ হয়নি |
| ৫ | **Popup Builder** (trigger দিয়ে, পুরো সাইটে) | Spectra, aBlocks, GutenKit, EB, Otter | ⏸️ modal-popup আর popup-optin আছে, পুরো builder নেই |
| ৬ | **Login / Register / Password Reset** | Spectra Pro, aBlocks | ❌ ব্লক নেই, কিন্তু `includes/blocks/LoginForm.php`-এ সার্ভারের দিকের অংশ লেখা আছে |
| ৭ | **Filterable Gallery** | EB, aBlocks | ⏸️ portfolio-gallery আর content-filter আছে, রিলিজ হয়নি |
| ৮ | **Business Hours** | EB, Otter Pro, GutenKit | ⏸️ বানানো আছে, রিলিজ হয়নি |
| ৯ | **Stripe / PayPal Button** | Otter, aBlocks | ❌ নেই |
| ১০ | **Post Meta / Dynamic Text** | EB, aBlocks | ❌ নেই |
| ১১ | **Fluent Forms / WPForms Styler** | EB | ❌ নেই |
| ১২ | **Interactive Promo** | EB | ❌ নেই |
| ১৩ | **Horizontal Scroller** | Stackable | ❌ নেই |
| ১৪ | **Product Review Comparison** | Otter Pro | ⏸️ review-box আছে, রিলিজ হয়নি |
| ১৫ | **Parallax Slider** | EB | ⏸️ parallax-section আছে, রিলিজ হয়নি |

---

## ৩. WooCommerce

Essential Blocks-এর ৭টা Woo ব্লকের সবকটাই bBlocks-এ আছে: Grid, Carousel, Add to Cart, Details, Image, Price, Rating।

aBlocks-এর তুলনায় যা নেই:

- [ ] Cart
- [ ] Checkout
- [ ] Coupon Form
- [ ] Product Filter (⏸️ woo-product-filter বানানো আছে, রিলিজ হয়নি)

---

## ৪. এক্সটেনশন: সবচেয়ে বড় ঘাটতি

এগুলো আলাদা ব্লক না, যেকোনো ব্লকে যোগ হওয়া ফিচার।

| এক্সটেনশন | কাদের কাছে আছে |
|---|---|
| **Display / Visibility Conditions** | EB, Otter, aBlocks Pro, GutenKit |
| **Dynamic Content + ACF** | EB, Spectra, Stackable, aBlocks, GutenKit |
| **Global Colors আর Typography** | EB, Spectra, Stackable, aBlocks, GutenKit |
| **Entrance Animation / Motion Effects** | সবার কাছে |
| **Copy / Paste Styles** | aBlocks, GutenKit |
| **Role Manager** | Stackable, aBlocks |
| **Coming Soon / Maintenance Mode** | Spectra, aBlocks |
| **Protected Content** (পাসওয়ার্ড বা রোল দিয়ে) | EB |
| **Sticky / Floating Effect** | aBlocks Pro, Kadence |
| **Tooltip** | aBlocks Pro |
| **Custom CSS** (প্রতিটা ব্লকে) | Otter |
| **Local Google Fonts** | Spectra, GutenKit |
| **Conditional CSS/JS Loading** (যে ব্লক পেজে আছে শুধু তারই asset লোড) | Kadence, aBlocks |
| **Liquid Glass Effect** | EB (একদম নতুন ট্রেন্ড) |
| **Multi-step Form, Quiz/Survey** | aBlocks (bBlocks-এর form-builder-এ যোগ করা যায়) |

bBlocks-এ আগে থেকে আছে: Template Library, AI Content Generate, Custom Cursor।

---

## ৫. আলাদা পরিচয় (প্রতিযোগীর কাছে নেই)

এগুলো যাচাই করা কোনো প্রতিযোগীর কাছে পাওয়া যায়নি। বানালে bBlocks আলাদা হয়ে দাঁড়াবে:

- [ ] Recipe Card (schema সহ)
- [ ] Dark Mode Toggle
- [ ] Woo Quick View
- [ ] Woo Wishlist
- [ ] Woo Compare
- [ ] Age Verification Gate
- [ ] OpenStreetMap / Leaflet Map (API key ছাড়াই ম্যাপ)

---

## ৬. সুপারিশ করা ক্রম

1. **রিলিজের অপেক্ষায় থাকা ব্লক চালু করা** (অংশ ১)। কম পরিশ্রমে সবচেয়ে বেশি লাভ।
2. **Display Conditions আর Animation extension।** প্রায় সব প্রতিযোগীর আছে, আর এক কাজে সব ব্লকের মান বাড়ে।
3. **Social Icons আর Login/Register Form।** ছোট কাজ, আর Login-এর সার্ভারের অংশ লেখাই আছে।
4. **Loop Builder আর Mega Menu।** ৪–৫টা প্রতিযোগীর আছে। Pro বিক্রির সবচেয়ে বড় কারণ হবে।
5. **Coming Soon mode, Protected Content, Copy/Paste Style।** ছোট কাজ, কিন্তু ফিচার তালিকায় ভালো দেখায়।
6. **আলাদা পরিচয়ের ফিচার** (অংশ ৫)।

---

## সীমাবদ্ধতা

- Spectra-র নিজের সাইট লোড হয়নি, তাই ওদের তালিকা wordpress.org থেকে নেওয়া।
- বেশিরভাগ সাইটে কোন ব্লক free আর কোনটা Pro তা আলাদা করে লেখা নেই। তাই Pro চিহ্ন দেওয়া হয়েছে শুধু যেখানে সাইটে স্পষ্ট লেখা ছিল।

## Sources

- [Essential Blocks](https://essential-blocks.com/)
- [Spectra (wordpress.org)](https://wordpress.org/plugins/ultimate-addons-for-gutenberg/)
- [Kadence Blocks](https://www.liquidweb.com/software/kadence/blocks/)
- [Stackable](https://wpstackable.com/blocks/)
- [Otter Blocks](https://themeisle.com/plugins/otter-blocks/)
- [aBlocks (wordpress.org)](https://wordpress.org/plugins/ablocks/)
- [GutenKit (wordpress.org)](https://wordpress.org/plugins/gutenkit-blocks-addon/)
