export const searchData = (searchText, data) => {
    const srcTxt = searchText.toLowerCase().trim();

    return data.filter(item => {
        const { title = '', type = '', categories = [], keywords = [] } = item;
        const lowerCaseCategories = categories.map(category => category.toLowerCase());
        const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());

        return title.toLowerCase()?.includes(srcTxt) || type.toLowerCase()?.includes(srcTxt) || lowerCaseCategories?.some(category => category.includes(srcTxt)) || lowerCaseKeywords?.some(keyword => keyword.includes(srcTxt));
    });
};