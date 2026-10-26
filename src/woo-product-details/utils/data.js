import { __, _n, sprintf } from '@wordpress/i18n';

import { BOX } from './functions';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#039;' }[char]));

const tabTitles = (reviewCount = 0) => ({
	description: __('Description', 'b-blocks'),
	additional_information: __('Additional information', 'b-blocks'),
	/* translators: %d: Number of reviews. */
	reviews: sprintf(__('Reviews (%d)', 'b-blocks'), reviewCount)
});

const attributesTable = (rows) => `<table class="woocommerce-product-attributes shop_attributes">${rows.map(([label, value]) => `<tr class="woocommerce-product-attributes-item">
	<th class="woocommerce-product-attributes-item__label" scope="row">${escapeHtml(label)}</th>
	<td class="woocommerce-product-attributes-item__value"><p>${escapeHtml(value)}</p></td>
</tr>` ).join('')}</table>`;

const stars = (rating) => {
	const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
	/* translators: %d: Rating out of 5. */
	return `<span class="${BOX}-stars" role="img" aria-label="${escapeHtml(sprintf(__('Rated %d out of 5', 'b-blocks'), value))}">${'★'.repeat(value)}${'☆'.repeat(5 - value)}</span>`;
};

const reviewItem = ({ author, date, rating, text, avatar }) => `<li class="review">
	<div class="comment_container">
		${avatar ? `<img class="avatar" src="${escapeHtml(avatar)}" alt="" width="60" height="60" />` : `<span class="avatar ${BOX}-avatar" aria-hidden="true"></span>`}
		<div class="comment-text">
			${rating ? stars(rating) : ''}
			<p class="meta"><strong class="woocommerce-review__author">${escapeHtml(author)}</strong> <span class="woocommerce-review__dash">&ndash;</span> <time class="woocommerce-review__published-date">${escapeHtml(date)}</time></p>
			<div class="description">${text}</div>
		</div>
	</div>
</li>`;

const sampleForm = (productName) => `<div class="review_form_wrapper">
	<div class="comment-respond">
		<span class="comment-reply-title">${escapeHtml(productName
	? sprintf(
		/* translators: %s: Product name. */
		__('Be the first to review “%s”', 'b-blocks'), productName)
	: __('Add a review', 'b-blocks'))}</span>
		<form class="comment-form" aria-disabled="true">
			<div class="comment-form-rating">
				<label>${escapeHtml(__('Your rating', 'b-blocks'))}&nbsp;<span class="required">*</span></label>
				<p class="stars">${stars(0)}</p>
			</div>
			<p class="comment-form-comment">
				<label>${escapeHtml(__('Your review', 'b-blocks'))}&nbsp;<span class="required">*</span></label>
				<textarea cols="45" rows="4" disabled></textarea>
			</p>
			<p class="form-submit"><input type="submit" class="submit" value="${escapeHtml(__('Submit', 'b-blocks'))}" disabled /></p>
		</form>
	</div>
</div>`;

const reviewsPanel = ({ title, items, productName }) => `<div class="woocommerce-Reviews">
	<div class="comments">
		<h2 class="woocommerce-Reviews-title">${title}</h2>
		${items.length
		? `<ol class="commentlist">${items.map(reviewItem).join('')}</ol>`
		: `<p class="woocommerce-noreviews">${escapeHtml(__('There are no reviews yet.', 'b-blocks'))}</p>`}
	</div>
	${sampleForm(items.length ? '' : productName)}
</div>`;

export const samplePanels = () => ({
	titles: tabTitles(1),
	html: {
		description: `<p>${escapeHtml(__('This block lists description, attributes and reviews for a single product.', 'b-blocks'))}</p>`,
		additional_information: attributesTable([
			[__('Color', 'b-blocks'), __('Blue, Green, Red', 'b-blocks')],
			[__('Size', 'b-blocks'), __('Small, Medium, Large', 'b-blocks')]
		]),
		reviews: reviewsPanel({
			title: escapeHtml(__('1 review for Sample Product', 'b-blocks')),
			items: [{
				author: __('Jane Doe', 'b-blocks'),
				date: __('March 4, 2026', 'b-blocks'),
				rating: 5,
				text: `<p>${escapeHtml(__('Great quality and fast delivery. Would buy again.', 'b-blocks'))}</p>`
			}]
		})
	},
	hidden: {}
});

export const productPanels = ({ product, reviews, admin }) => {
	const name = product?.name || '';
	const reviewCount = parseInt(product?.review_count, 10) || 0;

	const attributes = Array.isArray(admin?.attributes)
		? admin.attributes.filter((attribute) => attribute.visible).map((attribute) => [attribute.name, (attribute.options || []).join(', ')])
		: (product?.attributes || []).map((attribute) => [attribute.name, (attribute.terms || []).map((term) => term.name).join(', ')]);
	const rows = [
		...attributes.filter(([label, value]) => label && value),
		...(product?.formatted_weight && parseFloat(product?.weight) ? [[__('Weight', 'b-blocks'), product.formatted_weight]] : []),
		...(product?.formatted_dimensions && Object.values(product?.dimensions || {}).some((value) => parseFloat(value)) ? [[__('Dimensions', 'b-blocks'), product.formatted_dimensions]] : [])
	];

	const description = String(product?.description || '').trim();

	const title = reviewCount
		? sprintf(
			/* translators: 1: Number of reviews. 2: Product name. */
			_n('%1$s review for %2$s', '%1$s reviews for %2$s', reviewCount, 'b-blocks'), reviewCount, `<span>${escapeHtml(name)}</span>`)
		: escapeHtml(__('Reviews', 'b-blocks'));

	return {
		titles: tabTitles(reviewCount),
		html: {
			description,
			additional_information: rows.length ? attributesTable(rows) : '',
			reviews: reviewsPanel({
				title,
				productName: name,
				items: (reviews || []).map((review) => ({
					author: review.reviewer,
					date: review.formatted_date_created,
					rating: review.rating,
					text: review.review,
					avatar: review.reviewer_avatar_urls?.[96] || review.reviewer_avatar_urls?.[48] || ''
				}))
			})
		},
		hidden: {
			description: !description,
			additional_information: !rows.length,
			reviews: false === admin?.reviews_allowed
		}
	};
};
