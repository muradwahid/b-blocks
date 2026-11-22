// Block icon (inserter) and the icons the search box draws. Plain JSX: the page bundle loads React only.
// Search results: a magnifier over result lines. Filled like the other block icons (bPlBlockIcon: brand blue, white
// when selected); the fill attribute is the colour where that stylesheet is not loaded.
export const advancedSearchIcon = <svg xmlns='http://www.w3.org/2000/svg' className='bPlBlockIcon' viewBox='0 0 24 24' width='24' height='24' fill='#146EF5'><path d='M2 5a1 1 0 0 1 1-1h11a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1z' /><path fillRule='evenodd' d='M15.5 7.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' /><path d='M19.2 18.6l1.4-1.4 2.8 2.8a1 1 0 0 1-1.4 1.4z' /></svg>;

export const searchIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true' focusable='false'><circle cx='11' cy='11' r='7' /><path d='m20 20-3.5-3.5' /></svg>;

export const closeIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' aria-hidden='true' focusable='false'><path d='M18 6 6 18M6 6l12 12' /></svg>;
