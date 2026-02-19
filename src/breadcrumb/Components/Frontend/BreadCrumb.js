import React, { useEffect, useMemo, useState } from 'react';

const SEPARATOR_MAP = {
	slash: '/',
	chevron: '\u203A',
	arrow: '\u2192',
	dot: '\u00B7',
	dash: '\u2014',
};

function getSeparator(style, customSeparator) {
	if (style === 'custom') return customSeparator || '|';
	return SEPARATOR_MAP[style] || '/';
}

function truncateLabel(label, truncate, maxChars) {
	if (truncate && maxChars && label && label.length > maxChars) {
		return label.substring(0, maxChars) + '\u2026';
	}
	return label || '';
}

async function fetchCrumbs(apiUrl) {
	const res = await fetch(apiUrl, { credentials: 'same-origin' });
	if (!res.ok) throw new Error(`Breadcrumb fetch failed: ${res.status}`);
	return res.json();
}

export default function BreadCrumb({ attributes = {} }) {
	const {
		separatorStyle = 'chevron',
		customSeparator = '|',
		showHome = true,
		homeLabel = 'Home',
		fontSize = 14,
		textColor = '#333333',
		linkColor = '#0073aa',
		activeColor = '#23282d',
		separatorColor = '#999999',
		alignment = 'left',
		enableSchema = true,
		linkUnderline = 'hover',
		itemSpacing = 8,
		truncate = false,
		maxChars = 30,

		crumbsApiUrl = '',
	} = attributes;

	const [crumbs, setCrumbs] = useState([]);
	const [schemaJson, setSchemaJson] = useState(null);

	const separator = useMemo(
		() => getSeparator(separatorStyle, customSeparator),
		[separatorStyle, customSeparator]
	);

	const halfSpacing = Number(itemSpacing || 8) / 2;

	useEffect(() => {
		let cancelled = false;

		async function run() {
			try {
				if (!crumbsApiUrl) {
					setCrumbs([]);
					return;
				}
				const data = await fetchCrumbs(crumbsApiUrl);

				// Expecting: { crumbs: [{label,url}], schema: {...} } OR {crumbs: [...]}
				const nextCrumbs = Array.isArray(data?.crumbs) ? data.crumbs : [];
				if (!cancelled) setCrumbs(nextCrumbs);

				if (!cancelled) {
					if (enableSchema && data?.schema) {
						setSchemaJson(data.schema);
					} else {
						setSchemaJson(null);
					}
				}
			} catch (e) {
				if (!cancelled) {
					setCrumbs([]);
					setSchemaJson(null);
				}
			}
		}

		run();
		return () => {
			cancelled = true;
		};
	}, [crumbsApiUrl, enableSchema]);

	useEffect(() => {
		if (!enableSchema || !schemaJson) return;

		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(schemaJson);

		script.dataset.telexBreadcrumbSchema = '1';
		document.head.appendChild(script);

		return () => {
			if (script?.parentNode) script.parentNode.removeChild(script);
		};
	}, [enableSchema, schemaJson]);

	if (!crumbs || crumbs.length === 0) return null;

	const navStyle = {
		fontSize: `${parseInt(fontSize, 10) || 14}px`,
		textAlign: alignment || 'left',
	};

	return (
		<nav
			style={navStyle}
			data-underline={linkUnderline}
			aria-label="Breadcrumb"
		>
			<ol
				className="telex-breadcrumb-block__list"
				style={{ gap: `${parseInt(itemSpacing, 10) || 8}px` }}
			>
				{crumbs.map((crumb, index) => {
					const isLast = index === crumbs.length - 1;
					const label = truncateLabel(crumb?.label, !!truncate, Number(maxChars || 0));

					return (
						<li key={`${label}-${index}`} className="telex-breadcrumb-block__item">
							{!isLast && crumb?.url ? (
								<a
									className="telex-breadcrumb-block__link"
									href={crumb.url}
									style={{ color: linkColor }}
								>
									{label}
								</a>
							) : (
								<span
									className="telex-breadcrumb-block__current"
									aria-current={isLast ? 'page' : undefined}
									style={{ color: isLast ? activeColor : textColor }}
								>
									{label}
								</span>
							)}

							{!isLast ? (
								<span
									className="telex-breadcrumb-block__separator"
									aria-hidden="true"
									style={{
										color: separatorColor,
										margin: `0 ${halfSpacing}px`,
									}}
								>
									{separator}
								</span>
							) : null}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
