export const allowSvgInUploader = () => {
    const defaults = window?.wp?.Uploader?.defaults || window?._wpPluploadSettings?.defaults;
    const filters = defaults?.filters?.mime_types;

    if (!Array.isArray(filters)) {
        return;
    }

    filters.forEach(filter => {
        const extensions = String(filter?.extensions || '');
        if (!extensions.split(',').includes('svg')) {
            filter.extensions = extensions ? `${extensions},svg` : 'svg';
        }
    });
};