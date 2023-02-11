export const isValidFileName = (fileName: string): boolean => {
  const rg1 = /^[^\\/:*?"<>|]+$/; // forbidden characters \ / : * ? " < > |
  const rg2 = /^\./; // cannot start with dot (.)
  const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
  return rg1.test(fileName) && !rg2.test(fileName) && !rg3.test(fileName);
};

export const fileExtensionToIconMapper: Record<string, string> = {
  xlsx: '<i class="text-success fa fa-light fa-file-excel"></i>',
  xls: '<i class="text-success fa fa-light fa-file-excel"></i>',
  docx: '<i class="text-primary fa fa-light fa-file-word"></i>',
  doc: '<i class="text-primary fa fa-light fa-file-word"></i>',
};

export const defaultFileIcon = '<i class="text-secondary fa fa-light fa-file"></i>';
export const folderIcon = '<i class="fa fa-regular fa-folder-open"></i>';

export const mapFileExtensionToIcon = (fileExtension: string): string => {
  return fileExtensionToIconMapper[fileExtension as keyof Record<string, string>] || defaultFileIcon;
};

export const parseFileExtension = (fileName: string) => {
  const fileSplit = fileName.split('.');
  if (fileSplit.length === 1) return '';
  const fileExtension = fileSplit[fileSplit.length - 1];
  return fileExtension ? fileExtension.toLowerCase() : '';
};
