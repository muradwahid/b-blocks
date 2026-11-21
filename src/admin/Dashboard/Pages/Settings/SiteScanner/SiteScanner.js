import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { __, sprintf } from '@wordpress/i18n';
import { Button, Notice } from '@wordpress/components';
import { useWPAjax } from '../../../../../../../bpl-tools/hooks';

import './style.scss';

const SiteScanner = ({ nonce }) => {
	// Checks, scores and the ignored list all come from includes/SiteScanner.php.
	const { data, saveData, isLoading, isError, error } = useWPAjax('bblocks_site_scan', { _wpnonce: nonce, do: 'get' }, true);

	const [result, setResult] = useState(null);
	const [filter, setFilter] = useState('toFix');
	const [request, setRequest] = useState({ do: 'get' });
	const [fixed, setFixed] = useState('');
	const [announce, setAnnounce] = useState('');

	const fixedTimer = useRef(null);
	useEffect(() => () => clearTimeout(fixedTimer.current), []);

	useEffect(() => {
		if (!data) return;
		setResult(data);
		if ('scan' === request.do || 'fix' === request.do) {
			/* translators: 1: site score out of 100, 2: letter grade. */
			setAnnounce(sprintf(__('Scan complete: %1$d, grade %2$s', 'b-blocks'), data.score, data.grade));
		}
		if ('fix' === request.do) {
			/* translators: %s: name of the setting that was switched on, e.g. "Full-page cache". */
			setFixed(sprintf(__('%s is on.', 'b-blocks'), data.checks.find((c) => c.id === request.id)?.title));
			clearTimeout(fixedTimer.current);
			fixedTimer.current = setTimeout(() => setFixed(''), 4000);
		}
	}, [data]);

	if (!result && isError) {
		return (
			<div className='bBlocksSiteScanner'>
				<Notice status='error' isDismissible={false}>{error?.message || __('Could not load the site scan.', 'b-blocks')}</Notice>
			</div>
		);
	}

	// Skeleton: the real layout with placeholder bars, so nothing jumps when the first scan arrives.
	if (!result) {
		return (
			<div className='bBlocksSiteScanner bBlocksSiteScanner__skeleton' role='status' aria-busy='true'>
				<span className='screen-reader-text'>{__('Scanning the site…', 'b-blocks')}</span>
				<div className='bBlocksSiteScanner__summary' aria-hidden='true'>
					<span className='bBlocksSiteScanner__bone isRing' />
					<div className='bBlocksSiteScanner__summaryText'>
						<span className='bBlocksSiteScanner__bone isTitle' />
						<span className='bBlocksSiteScanner__bone isLine' />
						<span className='bBlocksSiteScanner__bone isLine isShort' />
						<span className='bBlocksSiteScanner__bone isButton' />
					</div>
				</div>
				<div className='bBlocksSiteScanner__tiles' aria-hidden='true'>
					{[0, 1, 2, 3, 4].map((n) => <span key={n} className='bBlocksSiteScanner__bone isTile' />)}
				</div>
				<div className='bBlocksSiteScanner__pills' aria-hidden='true'>
					{[0, 1, 2, 3].map((n) => <span key={n} className='bBlocksSiteScanner__bone isPill' />)}
				</div>
				{[0, 1, 2].map((n) => <span key={n} className='bBlocksSiteScanner__bone isCard' aria-hidden='true' />)}
			</div>
		);
	}

	const { score, grade, counts, categories, checks } = result;
	const scanning = isLoading && 'scan' === request.do;
	const open = checks.filter((c) => !c.passed && !c.ignored);
	const pills = [
		/* translators: %d: number of findings to fix. */
		{ id: 'toFix', label: sprintf(__('To fix (%d)', 'b-blocks'), counts.toFix) },
		...[...new Set(open.map((c) => c.category))].map((id) => ({ id, label: categories.find((cat) => cat.id === id)?.label || id })),
		/* translators: %d: number of passing checks. */
		{ id: 'passing', label: sprintf(__('Passing (%d)', 'b-blocks'), counts.passing) },
		/* translators: %d: number of ignored findings. */
		...(counts.ignored ? [{ id: 'ignored', label: sprintf(__('Ignored (%d)', 'b-blocks'), counts.ignored) }] : []),
	];
	// A category pill disappears once its last finding is fixed: fall back to "To fix".
	const active = pills.some((p) => p.id === filter) ? filter : 'toFix';
	// One sender for Scan Again, Turn This On, Ignore and Restore, so every request records what it was. The pill on
	// screen becomes the filter, so a pill that had disappeared does not come back as the active view.
	const send = (payload) => { setFilter(active); setRequest(payload); saveData(payload); };

	const shown = checks.filter((c) => ('passing' === active ? c.passed && !c.ignored : 'ignored' === active ? c.ignored : !c.passed && !c.ignored && ('toFix' === active || c.category === active)));
	
	const ring = 2 * Math.PI * 56;

	return (
		<div className='bBlocksSiteScanner'>
			<section className='bBlocksSiteScanner__summary'>
				<svg
					className={`bBlocksSiteScanner__ring ${score >= 80 ? 'isGood' : score >= 50 ? 'isFair' : 'isPoor'}`}
					viewBox='0 0 130 130'
					width='130'
					height='130'
					role='img'
					/* translators: 1: site score out of 100, 2: letter grade. */
					aria-label={sprintf(__('Site score %1$d out of 100, grade %2$s', 'b-blocks'), score, grade)}
				>
					<circle className='bBlocksSiteScanner__ringTrack' cx='65' cy='65' r='56' />
					<circle className='bBlocksSiteScanner__ringArc' cx='65' cy='65' r='56' strokeDasharray={`${(ring * score) / 100} ${ring}`} transform='rotate(-90 65 65)' />
					<text className='bBlocksSiteScanner__ringScore' x='65' y='68' textAnchor='middle' aria-hidden='true'>{score}</text>
					<text className='bBlocksSiteScanner__ringGrade' x='65' y='90' textAnchor='middle' aria-hidden='true'>{grade}</text>
				</svg>

				<div className='bBlocksSiteScanner__summaryText'>
					<h2 className='bBlocksSiteScanner__title'>{__('Site Scanner', 'b-blocks')}</h2>
					<p className='bBlocksSiteScanner__intro'>{__('Checks the things that most often make a WordPress site slow, invisible to search engines, or inconsistent — and explains what each one means and how to fix it.', 'b-blocks')}</p>
					<p className='bBlocksSiteScanner__counts'>
						{/* translators: 1: findings to look at, 2: passing checks. */}
						{sprintf(__('%1$d to look at · %2$d passing', 'b-blocks'), counts.toFix, counts.passing)}
						<span className='bBlocksSiteScanner__ago'>
							{/* translators: %s: time since the last scan, e.g. "3 mins ago". */}
							{sprintf(__('Last scanned %s', 'b-blocks'), result.scannedAgo)}
						</span>
					</p>
					<Button variant='primary' className='bBlocksSiteScanner__darkBtn' isBusy={scanning} disabled={isLoading} onClick={() => send({ do: 'scan' })}>
						{scanning ? __('Scanning…', 'b-blocks') : __('Scan Again', 'b-blocks')}
					</Button>
				</div>
			</section>

			{fixed && <Notice status='success' className='bBlocksSiteScanner__fixed' onRemove={() => setFixed('')}>{fixed}</Notice>}
			{isError && !isLoading && 'fix' !== request.do && (
				<Notice status='error' isDismissible={false}>{error?.message || __('Something went wrong — try again.', 'b-blocks')}</Notice>
			)}

			<div className='bBlocksSiteScanner__tiles'>
				{categories.map((cat) => (
					<div key={cat.id} className={`bBlocksSiteScanner__tile ${cat.score >= 80 ? 'isGood' : cat.score >= 50 ? 'isFair' : 'isPoor'}`}>
						<span className='bBlocksSiteScanner__tileLabel'>{cat.label}</span>
						<span className='bBlocksSiteScanner__bar' aria-hidden='true'><span style={{ inlineSize: `${cat.score}%` }} /></span>
						<span className='bBlocksSiteScanner__tileScore'>{cat.score}</span>
					</div>
				))}
			</div>

			<div className='bBlocksSiteScanner__pills' role='group' aria-label={__('Show findings', 'b-blocks')}>
				{pills.map((p) => (
					<button key={p.id} type='button' className={`bBlocksSiteScanner__pill${active === p.id ? ' isActive' : ''}`} aria-pressed={active === p.id} onClick={() => setFilter(p.id)}>
						{p.label}
					</button>
				))}
			</div>

			<div className={`bBlocksSiteScanner__results${scanning ? ' isDimmed' : ''}`} aria-busy={scanning}>
				<p className='screen-reader-text' aria-live='polite'>{announce}</p>

				{!shown.length && (
					<p className='bBlocksSiteScanner__empty'>
						{'toFix' === active ? __('Nothing to fix — nice work.', 'b-blocks') : __('Nothing here yet.', 'b-blocks')}
					</p>
				)}

				{shown.map((check) => (
					<article key={check.id} className={`bBlocksSiteScanner__card is-${check.passed ? 'passed' : check.severity}`}>
						<div className='bBlocksSiteScanner__cardHead'>
							<span className='bBlocksSiteScanner__badge'>
								{check.passed ? __('Passing', 'b-blocks') : { critical: __('Needs attention', 'b-blocks'), warning: __('Could be better', 'b-blocks'), info: __('Worth knowing', 'b-blocks') }[check.severity]}
							</span>
							<h3 className='bBlocksSiteScanner__cardTitle'>{check.title}</h3>
							<span className='bBlocksSiteScanner__cardCategory'>{categories.find((cat) => cat.id === check.category)?.label}</span>
						</div>

						<p className='bBlocksSiteScanner__state'>{check.state}</p>
						<p className='bBlocksSiteScanner__why'>{check.why}</p>
						{!check.passed && check.fix && (
							<p className='bBlocksSiteScanner__fix'><strong>{__('How to fix:', 'b-blocks')}</strong> {check.fix}</p>
						)}

						{isError && !isLoading && 'fix' === request.do && request.id === check.id && (
							<p className='bBlocksSiteScanner__cardError' role='alert'>{error?.message || __('Could not turn it on — try again.', 'b-blocks')}</p>
						)}

						{(!check.passed || check.ignored) && (
							<div className='bBlocksSiteScanner__cardFoot'>
								<div>
									{!check.ignored && 'enable' === check.action?.type && (
										<Button variant='primary' className='bBlocksSiteScanner__darkBtn' isBusy={isLoading && 'fix' === request.do && request.id === check.id} disabled={isLoading} onClick={() => send({ do: 'fix', id: check.id })}>
											{check.action.label}
										</Button>
									)}
									{!check.ignored && 'link' === check.action?.type && (
										<a className='bBlocksSiteScanner__link' href={check.action.url}>{check.action.label}</a>
									)}
									{!check.ignored && 'performance' === check.action?.type && (
										<Link className='bBlocksSiteScanner__link' to={`/settings/performance/${check.action.tab}`}>
											{check.action.label || __('Open the setting', 'b-blocks')}
										</Link>
									)}
								</div>
								<Button variant='tertiary' className='bBlocksSiteScanner__ignore' disabled={isLoading} onClick={() => send({ do: check.ignored ? 'restore' : 'ignore', id: check.id })}>
									{check.ignored ? __('Restore', 'b-blocks') : __('Ignore this', 'b-blocks')}
								</Button>
							</div>
						)}
					</article>
				))}
			</div>
		</div>
	);
};

export default SiteScanner;