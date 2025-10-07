export const isSVGFile=(file)=> {
  // Handles File/Blob or string (filename)
  const mimeType = file && (file.type || (
    typeof file === 'string' && file.split('.').pop().toLowerCase() === 'svg'
      ? 'image/svg+xml'
      : null
  ));
  return mimeType === 'image/svg+xml';
}