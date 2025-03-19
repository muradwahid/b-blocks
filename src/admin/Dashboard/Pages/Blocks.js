
import { useState, useEffect } from 'react';

import { useWPAjax } from '../../../../../bpl-tools/hooks';

import Layout from '../Layout/Layout';
import { closeIcon, demoIcon, docsIcon, searchIcon } from '../utils/icons';
import blocks from '../utils/blocks';

const dataFetched = new CustomEvent('dataFetched');

const Blocks = () => {
	const [isSaving, setIsSaving] = useState(false);
	const [disableBlockName, setDisableBlockName] = useState({});
	const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
	const { blocksName = [] } = disableBlockName || {};
	const { data, saveData, isLoading } = useWPAjax('bBlocksDisabledBlocks', { nonce: pluginAction?.nonce }, true);

	useEffect(() => {
		if (!isLoading && data) {
			const initialBlocksName = data.blocksName || blocks.map((block) => block.name);
			setDisableBlockName({ ...data, blocksName: initialBlocksName });
			window.dispatchEvent(dataFetched);
		}
	}, [data, isLoading]);

	const handleCheckboxChange = (blockName, isChecked) => {
		const updatedBlocksName = isChecked
			? blocksName.filter((name) => name !== blockName)
			: [...blocksName, blockName];

		setDisableBlockName({ ...disableBlockName, blocksName: updatedBlocksName });
		setIsSaving(true);

		try {
			saveData({ data: JSON.stringify({ ...disableBlockName, blocksName: updatedBlocksName }) })
		} finally {
			setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
		}
	};

	const handleActivateAll = () => {
		const updatedBlocksName = [];
		setDisableBlockName({ ...disableBlockName, blocksName: updatedBlocksName });
		setIsSaving(true);

		saveData({ data: JSON.stringify({ ...disableBlockName, blocksName: updatedBlocksName }) })
			.finally(() => {
				setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
			});
	};

	const handleDeactivateAll = () => {
		const updatedBlocksName = blocks.map((block) => block.name);
		setDisableBlockName({ ...disableBlockName, blocksName: updatedBlocksName });
		setIsSaving(true);

		saveData({ data: JSON.stringify({ ...disableBlockName, blocksName: updatedBlocksName }) })
			.finally(() => {
				setTimeout(() => setIsSaving(false), 1000); // Add a delay for better UX
			});
	};

	// Filter blocks based on the search term
	const searchedBlocks = blocks.filter((block) =>
		block?.title?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Layout>
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

							return <div key={name} className={`block ${blocksName.includes(name) ? 'disabled' : ''}`}>
								<div className='icon'>{icon}</div>

								<div className='name'>{title}</div>

								{demo && <a className='actionBtn' href={demo} target='_blank' rel='noopener noreferrer'>
									{demoIcon}
								</a>}

								{docs && <a className='actionBtn' href={docs} target='_blank' rel='noopener noreferrer'>
									{docsIcon}
								</a>}

								<label className='toggleSwitch'>
									<input type='checkbox' checked={!blocksName.includes(name)} onChange={(e) => handleCheckboxChange(name, e.target.checked)} />
									<span className='slider'></span>
								</label>
							</div>
						})}
					</div>}
			</div>
		</Layout>
	);
};
export default Blocks;