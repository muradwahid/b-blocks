
import { useState, useEffect } from 'react';

import { useWPAjax, useWPOptionQuery } from '../../../../../bpl-tools/hooks';

import Layout from '../Layout/Layout';
import { closeIcon, demoIcon, docsIcon, searchIcon } from '../utils/icons';
import allBlocks from '../utils/blocks';

const blocks = allBlocks.filter(b => 'published' === b.status);

const dataFetched = new CustomEvent('dataFetched');

const Blocks = ({ info }) => {
	const { isPremium } = info;
	const [isSaving, setIsSaving] = useState(false);
	const [disableBlockName, setDisableBlockName] = useState([]);
	const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
	// const { blocksName = [] } = disableBlockName || {};
	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { data = null, refetch, saveData, isLoading, error } = useWPAjax('bBlocksDisabledBlocks', { _wpnonce: bBlocksUtils?.nonce }, true);

	useEffect(() => {
		refetch()
	}, [bBlocksUtils]);

	useEffect(() => {
		if (!isLoading && data) {
			setDisableBlockName(data || []);
			window.dispatchEvent(dataFetched);
		}
	}, [data, isLoading, error]);

	const handleCheckboxChange = (blockName, isChecked) => {
		const updatedBlocksName = isChecked ?
			disableBlockName.filter((name) => name !== blockName) :
			[...disableBlockName, blockName];

		setDisableBlockName(updatedBlocksName);
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify(updatedBlocksName) });
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	const handleActivateAll = () => {
		setDisableBlockName([]);
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify([]) });
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	const handleDeactivateAll = () => {
		const updatedBlocksName = blocks.map((block) => block.name);
		setDisableBlockName(updatedBlocksName);
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify(updatedBlocksName) });
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	// Filter blocks based on the search term
	const searchedBlocks = blocks.filter((block) =>
		block?.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return <Layout info={info}>
		{isSaving && <div className='bBlocksSavingNotice'>Saving changes...</div>}

		<div className='blocksPage'>
			<div className='blocksTop'>
				<h2>All Blocks</h2>

				<div className='bBlocksDashboardSearch'>
					{searchIcon}

					<input type='text' placeholder='Search blocks...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='search-input' />

					{searchTerm && <span onClick={() => setSearchTerm('')}>{closeIcon}</span>}
				</div>

				<button className='bBlocksDashboardBtn actionBtn activeAllBtn' onClick={handleActivateAll}>
					Activate All
				</button>

				<button className='bBlocksDashboardBtn actionBtn secondary' onClick={handleDeactivateAll}>
					Deactivate All
				</button>
			</div>

			{searchedBlocks.length === 0 ?
				<h3 className='noBlocksFound'>
					No blocks found matching your search...
				</h3> :
				<div className='blocks'>
					{searchedBlocks.map(block => {
						const { name, title, icon, demo, docs } = block;
						const isBlockPremium = !isPremium && block.isPremium;
						const disabledBlock = isBlockPremium ? false : !disableBlockName.includes(name)

						return <div key={name} className={`block ${!disabledBlock ? 'disabled' : ''}`}>
							<div className='icon'>{icon}</div>

							<div className='name'>{title}</div>

							{demo && <a className='actionBtn' href={demo} target='_blank' rel='noopener noreferrer'>
								{demoIcon}
							</a>}

							{docs && <a className='actionBtn' href={docs} target='_blank' rel='noopener noreferrer'>
								{docsIcon}
							</a>}
							{isBlockPremium && <p className='bBlocksProBadge'>Pro</p>}

							<label className='toggleSwitch'>
								<input type='checkbox' checked={disabledBlock} {...(isBlockPremium ? {} : { onChange: (e) => handleCheckboxChange(name, e.target.checked) })} disabled={isSaving} />
								<span className='slider'></span>
							</label>
						</div>
					})}
				</div>}
		</div>
	</Layout>
};
export default Blocks;